import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword({ navigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div style={containerStyle} className="dot-grid">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] }}
        style={cardStyle}
        className="glass-panel"
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={logoIconStyle}>
            <Activity size={20} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Reset password
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            We'll send you instructions to reset your password
          </p>
        </div>

        {submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
            <div style={{ backgroundColor: 'var(--green-light)', border: '1px solid var(--green-border)', color: 'var(--green-primary)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500 }}>
              Reset link sent to <strong>{email}</strong>
            </div>
            <button 
              onClick={() => navigate('login')}
              style={{ ...submitButtonStyle, backgroundColor: 'var(--text-primary)' }}
            >
              <ArrowLeft size={16} /> Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && <div style={errorStyle}>{error}</div>}
            
            <div>
              <label style={labelStyle}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="name@company.com"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={submitButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-primary)'}
            >
              {loading ? 'Sending link...' : 'Send Reset Link'} <Send size={14} />
            </button>

            <button 
              type="button"
              onClick={() => navigate('login')}
              style={backButtonStyle}
            >
              <ArrowLeft size={14} /> Cancel
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--bg-primary)',
  padding: '2rem'
};

const cardStyle = {
  width: '100%',
  maxWidth: '420px',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  borderRadius: 'var(--border-radius-lg)',
  padding: '2.5rem',
  boxShadow: 'var(--shadow-xl)'
};

const logoIconStyle = {
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: 'var(--border-radius-sm)',
  backgroundColor: 'var(--blue-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  boxShadow: '0 4px 12px var(--blue-glow)',
  marginBottom: '0.5rem'
};

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  display: 'block',
  marginBottom: '0.4rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.8rem',
  fontSize: '0.85rem',
  border: '1px solid #cbd5e1',
  borderRadius: 'var(--border-radius-sm)',
  outline: 'none',
  fontFamily: 'inherit',
  color: 'var(--text-primary)',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box'
};

const submitButtonStyle = {
  backgroundColor: 'var(--blue-primary)',
  color: '#ffffff',
  border: 'none',
  padding: '0.75rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  borderRadius: 'var(--border-radius-sm)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  boxShadow: '0 4px 12px var(--blue-glow)',
  transition: 'all 0.2s ease'
};

const backButtonStyle = {
  background: 'transparent',
  border: '1px solid #cbd5e1',
  color: 'var(--text-secondary)',
  padding: '0.65rem',
  fontSize: '0.85rem',
  fontWeight: 500,
  borderRadius: 'var(--border-radius-sm)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
  transition: 'all 0.2s ease'
};

const errorStyle = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fca5a5',
  color: '#b91c1c',
  padding: '0.6rem 0.8rem',
  borderRadius: '6px',
  fontSize: '0.75rem',
  marginBottom: '1.25rem',
  fontWeight: 500
};
