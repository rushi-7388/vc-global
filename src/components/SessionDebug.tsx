import { useState, useEffect } from 'react';
import { checkSessionStatus } from '@/lib/enhancedAuth';
import { supabase } from '@/integrations/supabase/client';

export const SessionDebug = () => {
  const [sessionStatus, setSessionStatus] = useState<any>(null);
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  const [secureSession, setSecureSession] = useState<any>(null);
  const [redirectCount, setRedirectCount] = useState(0);
  const [lastUrl, setLastUrl] = useState(window.location.href);

  useEffect(() => {
    const checkStatus = () => {
      const status = checkSessionStatus();
      setSessionStatus(status);
      
      // Check Supabase session
      supabase.auth.getSession().then(({ data }) => {
        setSupabaseSession(data.session);
      });

      // Check secure session
      const secureSessionData = sessionStorage.getItem('secure_session');
      if (secureSessionData) {
        try {
          setSecureSession(JSON.parse(secureSessionData));
        } catch (error) {
          console.error('Failed to parse secure session:', error);
        }
      } else {
        setSecureSession(null);
      }

      // Check if we're on auth page with timeout
      if (window.location.href.includes('timeout=true')) {
        setRedirectCount(prev => prev + 1);
        console.log('Redirect detected to auth page with timeout');
      }

      // Track URL changes
      if (window.location.href !== lastUrl) {
        console.log('URL changed from', lastUrl, 'to', window.location.href);
        setLastUrl(window.location.href);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [lastUrl]);

  if (!sessionStatus) return null;

  // return (
  //   <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
  //     <h3 className="font-bold mb-2">Session Debug</h3>
  //     <div className="space-y-1">
  //       <div>Secure Session: {sessionStatus.hasSecureSession ? '✅' : '❌'}</div>
  //       <div>Supabase Session: {supabaseSession ? '✅' : '❌'}</div>
  //       {sessionStatus.lastActivity && (
  //         <div>Last Activity: {new Date(sessionStatus.lastActivity).toLocaleTimeString()}</div>
  //       )}
  //       {sessionStatus.timeSinceActivity !== null && (
  //         <div>Time Since Activity: {sessionStatus.timeSinceActivity.toFixed(1)} minutes</div>
  //       )}
  //       {secureSession && (
  //         <div>User: {secureSession.email}</div>
  //       )}
  //       <div>Redirect Count: {redirectCount}</div>
  //       <div>Current URL: {window.location.pathname}</div>
  //       <div className="mt-2 text-yellow-400">
  //         {supabaseSession && !sessionStatus.hasSecureSession && '⚠️ Supabase session exists but no secure session'}
  //         {!supabaseSession && sessionStatus.hasSecureSession && '⚠️ Secure session exists but no Supabase session'}
  //         {!supabaseSession && !sessionStatus.hasSecureSession && '⚠️ No sessions found'}
  //         {window.location.href.includes('timeout=true') && '⚠️ On auth page with timeout'}
  //       </div>
  //     </div>
  //   </div>
  // );
}; 