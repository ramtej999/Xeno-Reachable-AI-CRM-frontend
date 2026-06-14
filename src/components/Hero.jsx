import React from 'react';
import HeroScene from './HeroScene';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero({ navigate }) {
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section style={{
      minHeight: '110vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '8rem',
      paddingBottom: '4rem',
      position: 'relative',
      overflow: 'hidden'
    }} className="gradient-bg dot-grid">
      
      {/* Background soft glow blobs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.04) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container-custom" style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4rem'
      }}>
        {/* Centered Typography Content */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
          maxWidth: '850px'
        }}>
          {/* Tagline */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--blue-light)',
            color: 'var(--blue-primary)',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            border: '1px solid var(--blue-border)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--blue-primary)', display: 'inline-block' }} />
            Retail Marketing CRM Powered by AI
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            fontWeight: 800,
            letterSpacing: '-0.03em'
          }}>
            Reach the Right Customers.<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--blue-primary) 0%, var(--green-primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Grow Revenue Automatically.</span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '650px',
            fontWeight: 400
          }}>
            Reachable AI transforms customer data into intelligent marketing campaigns that drive retention, repeat purchases, and measurable business growth.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => navigate ? navigate('signup') : handleScrollTo('final-cta')}
              style={{
                backgroundColor: 'var(--blue-primary)',
                border: 'none',
                color: '#ffffff',
                padding: '0.9rem 1.8rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                boxShadow: '0 8px 20px var(--blue-glow)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--blue-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(37, 99, 235, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--blue-primary)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 8px 20px var(--blue-glow)';
              }}
            >
              Get Started <ArrowRight size={18} />
            </button>

            <button
              onClick={() => handleScrollTo('showcase')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--text-muted)',
                color: 'var(--text-secondary)',
                padding: '0.9rem 1.8rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-primary)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-muted)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <Play size={16} fill="var(--text-secondary)" /> Watch Demo
            </button>
          </div>
        </div>

        {/* Full-width 3D visualization scene container */}
        <div style={{
          height: '520px',
          width: '100%',
          maxWidth: '1200px',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid rgba(15, 23, 42, 0.05)',
          background: 'rgba(255, 255, 255, 0.4)',
          boxShadow: 'var(--shadow-premium)',
          overflow: 'hidden',
          position: 'relative'
        }} className="glass-panel">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
