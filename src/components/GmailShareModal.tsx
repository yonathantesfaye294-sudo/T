import React, { useState, useEffect } from 'react';
import { DailyResult } from '../types';
import { googleSignIn, getAccessToken, auth } from '../services/firebaseAuth';
import {
  sendGmailMessage,
  createGmailDraft,
  generateDailyChallengeHtml,
  getGmailProfile,
  GmailProfile,
} from '../services/gmailService';
import { getTodayDateString } from '../utils/dailySeed';
import { Mail, Send, FileText, CheckCircle2, AlertCircle, X, Sparkles, Trophy, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GmailShareModalProps {
  result?: DailyResult | null;
  onClose: () => void;
}

export const GmailShareModal: React.FC<GmailShareModalProps> = ({ result, onClose }) => {
  const activeResult: DailyResult = result || {
    date: getTodayDateString(),
    score: 850,
    maxPossible: 1000,
    correctCount: 9,
    totalLogos: 10,
    timeSpentSeconds: 42,
    stageDistribution: [5, 3, 1, 0],
    percentile: 96.5,
    completedAt: Date.now(),
    history: [
      { logoId: '1', logoName: 'Starbucks', stageGuessed: 1, wasCorrect: true, pointsAwarded: 100, timeTakenSeconds: 3 },
      { logoId: '2', logoName: 'Nike', stageGuessed: 1, wasCorrect: true, pointsAwarded: 100, timeTakenSeconds: 2 },
      { logoId: '3', logoName: 'Spotify', stageGuessed: 2, wasCorrect: true, pointsAwarded: 75, timeTakenSeconds: 5 },
    ],
  };

  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>(
    `I just completed today's Daily Logo Challenge and scored in the Top ${(100 - activeResult.percentile).toFixed(1)}%! Can you beat my ${activeResult.score.toLocaleString()} points?`
  );
  const [subject, setSubject] = useState<string>(
    `⚡ Logo Rush Daily Challenge: I scored ${activeResult.score} pts (Top ${(100 - activeResult.percentile).toFixed(1)}%)!`
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirmSend, setShowConfirmSend] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'compose' | 'preview'>('compose');

  useEffect(() => {
    async function checkAuth() {
      const token = await getAccessToken();
      if (token && auth.currentUser) {
        setIsAuthenticated(true);
        setUserEmail(auth.currentUser.email);
        try {
          const profile = await getGmailProfile();
          if (profile?.emailAddress) {
            setUserEmail(profile.emailAddress);
          }
        } catch {
          // Token might be slightly stale or profile fetch optional
        }
      } else {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setIsAuthenticated(true);
        setUserEmail(res.user.email);
        setStatusMessage({ type: 'success', text: `Signed in as ${res.user.email}!` });
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to sign in with Google. Please ensure popups are enabled.',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleExecuteSend = async () => {
    if (!recipientEmail || !validateEmail(recipientEmail)) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid recipient email address.' });
      return;
    }

    setIsSending(true);
    setStatusMessage(null);

    try {
      const htmlBody = generateDailyChallengeHtml(activeResult, customNote);
      await sendGmailMessage({
        to: recipientEmail.trim(),
        subject: subject.trim(),
        bodyHtml: htmlBody,
      });

      setStatusMessage({
        type: 'success',
        text: `Email successfully sent to ${recipientEmail}!`,
      });
      setShowConfirmSend(false);
    } catch (err: any) {
      console.error('Failed to send email:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to send email via Gmail. Please check permissions.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateDraft = async () => {
    if (!recipientEmail) {
      setStatusMessage({ type: 'error', text: 'Please enter a recipient email for the draft.' });
      return;
    }

    setIsSavingDraft(true);
    setStatusMessage(null);

    try {
      const htmlBody = generateDailyChallengeHtml(activeResult, customNote);
      await createGmailDraft({
        to: recipientEmail.trim(),
        subject: subject.trim(),
        bodyHtml: htmlBody,
      });

      setStatusMessage({
        type: 'success',
        text: 'Challenge email draft created in your Gmail account!',
      });
    } catch (err: any) {
      console.error('Failed to save draft:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to save draft in Gmail.',
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const topPercent = (100 - activeResult.percentile).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-black text-white flex items-center gap-2">
                <span>Send Result via Gmail</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  Gmail API
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Share your Daily #{activeResult.date} score & Top {topPercent}% ranking directly from your Gmail account
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Auth State Banner */}
          {!isAuthenticated ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Google Account Required</span>
                  Sign in with Google to authorize sending challenge emails directly from your Gmail.
                </div>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-black uppercase flex items-center gap-2 shadow-md transition-transform hover:scale-102 active:scale-98 cursor-pointer flex-shrink-0"
              >
                {isSigningIn ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400">Sending as:</span>
                <span className="font-bold text-white font-mono">{userEmail}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Connected
              </span>
            </div>
          )}

          {/* Status Message Alerts */}
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('compose')}
              className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'compose'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Email Message
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Scorecard Preview
            </button>
          </div>

          {activeTab === 'compose' ? (
            <div className="space-y-3.5">
              {/* Recipient Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Recipient Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="friend@example.com, colleague@work.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Subject Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Personal Note */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Personal Challenge Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Add a custom note or challenge to your friend..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Score Snapshot Mini Badge */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Included Daily Scorecard:
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-amber-400">
                  {activeResult.score} pts &bull; Top {topPercent}% &bull; {activeResult.correctCount}/10
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Logo Rush Daily Challenge #{activeResult.date}
                </span>
                <div className="text-3xl font-black text-amber-400 font-display">
                  {activeResult.score.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ 1,000</span>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  🏆 Scored in Top {topPercent}% Today!
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  10 Logos Summary
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {activeResult.history.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-800"
                    >
                      <span className="font-bold text-white">#{i + 1} {h.logoName}</span>
                      <span
                        className={`font-bold ${
                          h.wasCorrect ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {h.wasCorrect ? `+${h.pointsAwarded} pts (S${h.stageGuessed})` : 'Missed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Dialog Step before Executing Send (MANDATORY per safety guidelines) */}
        <AnimatePresence>
          {showConfirmSend && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-slate-950 border-t border-amber-500/40 space-y-3"
            >
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">
                    Confirm Sending via Gmail
                  </span>
                  Are you sure you want to send an email to <strong className="text-amber-300">{recipientEmail}</strong> with your Daily Challenge score ({activeResult.score} pts, Top {topPercent}%)?
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmSend(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteSend}
                  disabled={isSending}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  {isSending ? 'Sending...' : 'Yes, Send Email'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Footer Controls */}
        {!showConfirmSend && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCreateDraft}
              disabled={!isAuthenticated || isSavingDraft}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{isSavingDraft ? 'Saving Draft...' : 'Save as Gmail Draft'}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                disabled={!isAuthenticated || !recipientEmail}
                onClick={() => {
                  if (!validateEmail(recipientEmail)) {
                    setStatusMessage({ type: 'error', text: 'Please enter a valid recipient email.' });
                    return;
                  }
                  setShowConfirmSend(true);
                }}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 disabled:opacity-40 text-white font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Review & Send</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
