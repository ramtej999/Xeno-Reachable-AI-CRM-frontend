import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Login({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('dashboard');
    } else {
      setError(res.error || 'Login failed.');
    }
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
        {/* Branding header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={logoIconStyle}>
            <Activity size={20} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Sign in to Reachable AI control center
          </p>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {/* Input fields */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="name@company.com"
              autoComplete="off"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
              <span 
                onClick={() => navigate('forgot-password')}
                style={forgotLinkStyle}
              >
                Forgot password?
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '2.5rem' }}
                placeholder="Enter password"
                autoComplete="new-password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeButtonStyle}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={submitButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-primary)'}
          >
            {loading ? 'Signing in...' : 'Sign in'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Footnotes */}
        <div style={footNoteStyle}>
          Don't have an account?{' '}
          <span onClick={() => navigate('signup')} style={linkStyle}>
            Create an account
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// Styling details
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

const eyeButtonStyle = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'transparent',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
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
  marginTop: '0.5rem',
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

const forgotLinkStyle = {
  fontSize: '0.75rem',
  color: 'var(--blue-primary)',
  fontWeight: 500,
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
