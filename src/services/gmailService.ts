import { getAccessToken } from './firebaseAuth';
import { DailyResult } from '../types';

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  bodyText?: string;
  bodyHtml: string;
}

export interface SentChallengeEmail {
  id: string;
  snippet: string;
  date?: string;
}

/**
 * Fetch authenticated user's Gmail profile information
 */
export async function getGmailProfile(): Promise<GmailProfile> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google. Please sign in first.');
  }

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to fetch Gmail profile (${res.status})`);
  }

  return res.json();
}

/**
 * Encodes an email string into Base64URL RFC 2822 format
 */
function createRawEmail(to: string, subject: string, htmlContent: string, plainTextFallback: string): string {
  // UTF-8 encoded subject
  const encodedSubject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  
  const boundary = `__boundary_${Date.now()}__`;
  const emailLines = [
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    plainTextFallback,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    htmlContent,
    '',
    `--${boundary}--`,
  ];

  const fullEmail = emailLines.join('\r\n');
  return btoa(unescape(encodeURIComponent(fullEmail)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Send an email using Gmail REST API v1
 */
export async function sendGmailMessage(payload: SendEmailPayload): Promise<{ id: string; threadId: string }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google. Please sign in first.');
  }

  const plainText = payload.bodyText || payload.bodyHtml.replace(/<[^>]*>?/gm, '');
  const rawBase64 = createRawEmail(payload.to, payload.subject, payload.bodyHtml, plainText);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawBase64 }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to send email via Gmail (${res.status})`);
  }

  return res.json();
}

/**
 * Create a draft email in Gmail
 */
export async function createGmailDraft(payload: SendEmailPayload): Promise<{ id: string; message: any }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google. Please sign in first.');
  }

  const plainText = payload.bodyText || payload.bodyHtml.replace(/<[^>]*>?/gm, '');
  const rawBase64 = createRawEmail(payload.to, payload.subject, payload.bodyHtml, plainText);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: { raw: rawBase64 },
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to create draft in Gmail (${res.status})`);
  }

  return res.json();
}

/**
 * Fetch recently sent Logo Challenge emails from Gmail
 */
export async function listRecentChallengeEmails(): Promise<SentChallengeEmail[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const query = encodeURIComponent('subject:"Logo Rush" OR subject:"Daily Logo Challenge"');
    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    if (!data.messages || !Array.isArray(data.messages)) return [];

    const details = await Promise.all(
      data.messages.slice(0, 5).map(async (msg: { id: string }) => {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=minimal`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!msgRes.ok) return null;
        const msgData = await msgRes.json();
        return {
          id: msg.id,
          snippet: msgData.snippet,
        };
      })
    );

    return details.filter((d): d is SentChallengeEmail => d !== null);
  } catch (err) {
    console.error('Error fetching sent challenge emails:', err);
    return [];
  }
}

/**
 * Generate rich styled HTML email template for daily results
 */
export function generateDailyChallengeHtml(result: DailyResult, customNote?: string): string {
  const topPercent = (100 - result.percentile).toFixed(1);
  const squares = result.history
    .map((h) => {
      if (!h.wasCorrect) return '❌ Missed';
      return `✅ Stage ${h.stageGuessed} (+${h.pointsAwarded}pts)`;
    });

  const historyRows = result.history
    .map(
      (h, i) => `
      <tr style="border-bottom: 1px solid #2d3748;">
        <td style="padding: 8px 12px; font-weight: bold; color: #f7fafc;">#${i + 1} ${h.logoName}</td>
        <td style="padding: 8px 12px; color: ${h.wasCorrect ? '#48bb78' : '#f56565'}; font-weight: bold;">
          ${h.wasCorrect ? `Guessed (Stage ${h.stageGuessed})` : 'Missed'}
        </td>
        <td style="padding: 8px 12px; text-align: right; font-family: monospace; color: #ecc94b; font-weight: bold;">
          +${h.pointsAwarded} pts
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f7fafc; margin: 0; padding: 20px; }
          .card { max-width: 580px; margin: 0 auto; background: #111827; border: 1px solid #374151; border-radius: 16px; overflow: hidden; padding: 24px; }
          .badge { display: inline-block; background: #d97706; color: #000; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; }
          .score-box { background: #1f2937; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0; border: 1px solid #4b5563; }
          .score { font-size: 38px; font-weight: 900; color: #fbbf24; margin: 4px 0; }
          .rank-pill { display: inline-block; background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; color: #fbbf24; padding: 8px 16px; border-radius: 12px; font-weight: bold; margin-top: 8px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px; border-top: 1px solid #374151; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div style="text-align: center;">
            <div class="badge">Logo Rush Daily Challenge</div>
            <h1 style="color: #ffffff; margin: 12px 0 4px; font-size: 24px;">Daily Seed #${result.date}</h1>
            <p style="color: #9ca3af; font-size: 13px; margin: 0;">Global Logo Trivia Results</p>
          </div>

          ${customNote ? `<div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; border-radius: 8px; padding: 12px; margin: 16px 0; font-size: 14px; color: #93c5fd;"><strong>Challenger Note:</strong> "${customNote}"</div>` : ''}

          <div class="score-box">
            <div style="font-size: 11px; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px;">Total Score</div>
            <div class="score">${result.score.toLocaleString()} <span style="font-size: 18px; color: #9ca3af;">/ 1,000</span></div>
            <div class="rank-pill">
              🏆 Scored in the Top ${topPercent}% Today!
            </div>
            <p style="font-size: 12px; color: #9ca3af; margin: 8px 0 0;">
              Accuracy: <strong>${result.correctCount}/10 Logos</strong> &bull; Stage 1 Jackpots: <strong>${result.stageDistribution[0]}</strong>
            </p>
          </div>

          <h3 style="font-size: 14px; color: #e5e7eb; margin: 16px 0 8px;">10 Logo Clue Breakdown:</h3>
          <table class="table">
            <thead>
              <tr style="background: #1f2937; color: #9ca3af; text-align: left; font-size: 11px; text-transform: uppercase;">
                <th style="padding: 6px 12px;">Logo</th>
                <th style="padding: 6px 12px;">Status</th>
                <th style="padding: 6px 12px; text-align: right;">Points</th>
              </tr>
            </thead>
            <tbody>
              ${historyRows}
            </tbody>
          </table>

          <div class="footer">
            <p style="margin: 0 0 6px;">Can you beat this score on today's global seed?</p>
            <p style="margin: 0; font-size: 11px; color: #6b7280;">Sent via Logo Rush Gmail Integration</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
