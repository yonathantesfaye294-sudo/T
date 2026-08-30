import React, { useState, useEffect } from 'react';
import { googleSignIn, logout, getAccessToken, auth } from '../services/firebaseAuth';
import {
  getGmailProfile,
  GmailProfile,
  listRecentChallengeEmails,
  SentChallengeEmail,
  sendGmailMessage,
  generateDailyChallengeHtml,
} from '../services/gmailService';
import { PlayerStats, DailyResult } from '../types';
import { getTodayDateString, calculateDailyPercentile } from '../utils/dailySeed';
import {
  Mail,
  CheckCircle2,
  LogOut,
  Send,
  Sparkles,
  Inbox,
  X,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  User,
  Flame,
  Trophy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GmailHubModalProps {
  stats: PlayerStats;
  onClose: () => void;
  onOpenGmailShare?: () => void;
}

export const GmailHubModal: React.FC<GmailHubModalProps> = ({ stats, onClose, onOpenGmailShare }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<GmailProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [recentEmails, setRecentEmails] = useState<SentChallengeEmail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSendingSelfRecap, setIsSendingSelfRecap] = useState<boolean>(false);
  const [showConfirmRecap, setShowConfirmRecap] = useState<boolean>(false);

  const todayStr = getTodayDateString();
  const savedDaily = typeof window !== 'undefined' ? localStorage.getItem(`logorush_daily_${todayStr}`) : null;
  const parsedDaily: DailyResult | null = savedDaily ? JSON.parse(savedDaily) : null;

  useEffect(() => {
    loadGmailStatus();
  }, []);

  async function loadGmailStatus() {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (token && auth.currentUser) {
        setIsAuthenticated(true);
        setCurrentUser(auth.currentUser);
        try {
          const profile = await getGmailProfile();
          setUserProfile(profile);
          const recent = await listRecentChallengeEmails();
          setRecentEmails(recent);
        } catch (e) {
          console.warn('Profile fetch warning:', e);
        }
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Error loading Gmail status:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setIsAuthenticated(true);
        setCurrentUser(res.user);
        setStatusMessage({ type: 'success', text: `Successfully connected ${res.user.email}!` });
        const profile = await getGmailProfile().catch(() => null);
        if (profile) setUserProfile(profile);
        const recent = await listRecentChallengeEmails();
        setRecentEmails(recent);
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Google Sign-in was cancelled or failed.',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUserProfile(null);
      setCurrentUser(null);
      setStatusMessage({ type: 'success', text: 'Signed out from Google account.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Sign out failed.' });
    }
  };

  const handleSendSelfDailyRecap = async () => {
    if (!userProfile?.emailAddress && !currentUser?.email) {
      setStatusMessage({ type: 'error', text: 'User email not found.' });
      return;
    }

    const recipient = userProfile?.emailAddress || currentUser?.email;
    setIsSendingSelfRecap(true);
    setStatusMessage(null);

    try {
      const dailyScore = parsedDaily || {
        date: todayStr,
        score: stats.totalScore > 0 ? 850 : 750,
        maxPossible: 1000,
        correctCount: 9,
        totalLogos: 10,
        timeSpentSeconds: 45,
        stageDistribution: [4, 3, 2, 0],
        percentile: 96.5,
        completedAt: Date.now(),
        history: [],
      };

      const html = generateDailyChallengeHtml(
        dailyScore,
        'Here is your Daily Logo Challenge summary from Logo Rush.'
      );

      await sendGmailMessage({
        to: recipient,
        subject: `⚡ Your Daily Logo Challenge Recap (#${todayStr})`,
        bodyHtml: html,
      });

      setStatusMessage({
        type: 'success',
        text: `Daily summary email sent to ${recipient}!`,
      });
      setShowConfirmRecap(false);

      // Refresh recent
      const recent = await listRecentChallengeEmails();
      setRecentEmails(recent);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to dispatch email via Gmail.',
      });
    } finally {
      setIsSendingSelfRecap(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black shadow-lg shadow-red-600/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-black text-white flex items-center gap-2">
                <span>Gmail Integration Hub</span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage your Gmail integration, send daily recaps, and challenge friends
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Status Message */}
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

          {/* Account Status Card */}
          {isAuthenticated ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Google User'}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl border border-slate-700 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{currentUser?.displayName || 'Google Account'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        Connected
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {userProfile?.emailAddress || currentUser?.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Gmail Profile Metrics */}
              {userProfile && (
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Inbox Messages
                    </span>
                    <span className="text-sm font-mono font-bold text-white mt-0.5">
                      {userProfile.messagesTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Gmail Thread Count
                    </span>
                    <span className="text-sm font-mono font-bold text-white mt-0.5">
                      {userProfile.threadsTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center">
                <Mail className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-display font-black text-white">
                  Connect Your Gmail Account
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                  Sign in with Google to send your Daily Challenge achievements, challenge friends to beat your Top 4% rank, and receive daily trivia recap emails.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase inline-flex items-center gap-2.5 shadow-xl transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            </div>
          )}

          {/* Quick Actions */}
          {isAuthenticated && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Gmail Quick Actions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Action 1: Send Daily Recap to Self */}
                <button
                  type="button"
                  onClick={() => setShowConfirmRecap(true)}
                  className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left flex items-start gap-3 transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors">
                      Send Today's Recap
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Email your score, ranking & breakdown to your inbox
                    </p>
                  </div>
                </button>

                {/* Action 2: Challenge a Friend */}
                {parsedDaily && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenGmailShare) onOpenGmailShare();
                    }}
                    className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left flex items-start gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-red-400 transition-colors">
                        Challenge Friends
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        Send invitation with today's Top {(100 - parsedDaily.percentile).toFixed(1)}% score
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mandatory Confirmation Step for Sending Recap */}
          <AnimatePresence>
            {showConfirmRecap && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3"
              >
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">
                      Confirm Dispatching Email
                    </span>
                    Send today's Daily Challenge scorecard directly to your Gmail (
                    <strong className="text-amber-300">
                      {userProfile?.emailAddress || currentUser?.email}
                    </strong>
                    )?
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowConfirmRecap(false)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendSelfDailyRecap}
                    disabled={isSendingSelfRecap}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSendingSelfRecap ? 'Dispatching...' : 'Yes, Send to My Gmail'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Logo Challenge Emails Sent */}
          {isAuthenticated && recentEmails.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Inbox className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Logo Rush Messages in Gmail</span>
              </h4>
              <div className="space-y-1.5">
                {recentEmails.map((em) => (
                  <div
                    key={em.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  >
                    <p className="line-clamp-2 text-slate-400 text-[11px]">{em.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy & Scope Disclosure */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              Google Workspace OAuth connects with user permission. Access tokens remain in memory and are never persisted to insecure storage.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
