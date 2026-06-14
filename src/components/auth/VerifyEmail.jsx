import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, ShieldAlert } from 'lucide-react';

export default function VerifyEmail({ navigate }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const tempUser = JSON.parse(localStorage.getItem('reachable_signup_temp') || '{"email":"your email","name":"Demo User","org":"Xeno Retail Group"}');

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const otp = code.join('');
    if (otp.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      // Promote temp user details to logged in user details
      localStorage.setItem('reachable_user', JSON.stringify(tempUser));
      localStorage.removeItem('reachable_signup_temp');
      navigate('dashboard');
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
            Verify your email
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            We've sent a 6-digit code to <br/>
            <strong>{tempUser.email}</strong>
          </p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
            {code.map((num, i) => (
              <input 
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                maxLength={1}
                value={num}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={otpInputStyle}
              />
            ))}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={submitButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-primary)'}
          >
            {loading ? 'Verifying...' : 'Verify Code'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={footNoteStyle}>
          Didn't receive the code?{' '}
          <span onClick={() => alert('Verification code resent to your email.')} style={linkStyle}>
            Resend Code
          </span>
        </div>
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

const otpInputStyle = {
  width: '3rem',
  height: '3.5rem',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  textAlign: 'center',
  fontSize: '1.5rem',
  fontWeight: 700,
  fontFamily: 'var(--font-family-title)',
  color: 'var(--text-primary)',
  outline: 'none',
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

const footNoteStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  textAlign: 'center',
  marginTop: '1.5rem',
  borderTop: '1px solid #f1f5f9',
  paddingTop: '1.25rem'
};

const linkStyle = {
  color: 'var(--blue-primary)',
  fontWeight: 600,
  cursor: 'pointer'
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
