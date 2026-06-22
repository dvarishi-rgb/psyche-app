import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './Auth';
import PsycheApp from './PsycheApp';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d0b0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#c9a96e', letterSpacing: '0.2em', opacity: 0.6 }}>✦</div>
      </div>
    );
  }

  if (!session) return <Auth />;
  return <PsycheApp session={session} />;
}
