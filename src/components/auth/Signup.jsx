import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Signup({ navigate }) {
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await signup(name, org, email, password);
    setLoading(false);
    if (res.success) {
      navigate('dashboard');
    } else {
      setError(res.error || 'Signup failed.');
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={logoIconStyle}>
            <Activity size={20} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Create your account
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Start scaling your retail customer retention
          </p>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              placeholder="Arjun Sharma"
              autoComplete="off"
            />
          </div>

          <div>
            <label style={labelStyle}>Organization Name</label>
            <input 
              type="text" 
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              style={inputStyle}
              placeholder="Reachable Retail Group"
              autoComplete="off"
            />
          </div>

          <div>
            <label style={labelStyle}>Work Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="arjun@example.com"
              autoComplete="off"
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={submitButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-primary)'}
          >
            {loading ? 'Creating account...' : 'Create Account'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={footNoteStyle}>
          Already have an account?{' '}
          <span onClick={() => navigate('login')} style={linkStyle}>
            Sign in
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// Styling details (synchronized with Login)
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
