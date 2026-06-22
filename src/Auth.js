import { useState } from 'react';
import { supabase } from './supabase';

const G = {
  bg: "#0d0b0f", surface: "#13101a", border: "#2a2035",
  accent: "#c9a96e", accentDim: "#8a6d3f", accentSoft: "#2a1f0a",
  text: "#e8e0d5", textMid: "#a09080", textDim: "#5a5060",
};

export default function Auth() {
  const [mode, setMode] = useState('login'); // login | register | reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Проверьте почту — отправили письмо с подтверждением.');
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage('Письмо для сброса пароля отправлено.');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', background: G.bg, border: `0.5px solid ${G.border}`,
    borderRadius: 9, padding: '10px 14px', fontSize: 14, color: G.text,
    fontFamily: 'inherit', outline: 'none', marginBottom: 10,
  };

  return (
    <div style={{ minHeight: '100vh', background: G.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: G.accent, letterSpacing: '0.2em', marginBottom: 8 }}>✦ PSYCHE</div>
          <div style={{ fontSize: 13, color: G.textDim, letterSpacing: '0.05em' }}>Психологический анализ персонажей</div>
        </div>

        {/* Card */}
        <div style={{ background: G.surface, border: `0.5px solid ${G.border}`, borderRadius: 14, padding: '28px 24px' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: G.text, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
            {mode === 'login' ? 'Вход' : mode === 'register' ? 'Регистрация' : 'Сброс пароля'}
          </div>

          <form onSubmit={handle}>
            <div style={{ fontSize: 11, color: G.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5, fontWeight: 600 }}>Email</div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" style={inputStyle}
              onFocus={e => e.target.style.borderColor = G.accentDim} onBlur={e => e.target.style.borderColor = G.border} />

            {mode !== 'reset' && (
              <>
                <div style={{ fontSize: 11, color: G.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5, fontWeight: 600 }}>Пароль</div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="········" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = G.accentDim} onBlur={e => e.target.style.borderColor = G.border} />
              </>
            )}

            {error && <div style={{ background: '#2a0a0a', border: '0.5px solid #8a3030', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#c96e6e', marginBottom: 12 }}>{error}</div>}
            {message && <div style={{ background: G.accentSoft, border: `0.5px solid ${G.accentDim}`, borderRadius: 8, padding: '8px 12px', fontSize: 12, color: G.accent, marginBottom: 12 }}>{message}</div>}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: G.accent, border: 'none', borderRadius: 9, fontSize: 14, color: G.bg, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', letterSpacing: '0.03em', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
              {loading ? '...' : mode === 'login' ? 'Войти' : mode === 'register' ? 'Создать аккаунт' : 'Отправить письмо'}
            </button>
          </form>

          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            {mode === 'login' && <>
              <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: G.textMid, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Нет аккаунта? Зарегистрироваться</button>
              <button onClick={() => setMode('reset')} style={{ background: 'none', border: 'none', color: G.textDim, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Забыли пароль?</button>
            </>}
            {mode !== 'login' && <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: G.textMid, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>← Назад к входу</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
