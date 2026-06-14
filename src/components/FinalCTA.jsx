import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTA({ navigate }) {
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
    <section id="final-cta" style={{
      padding: '9rem 0',
      backgroundColor: '#ffffff',
      borderTop: '1px solid rgba(15, 23, 42, 0.05)',
      position: 'relative',
      overflow: 'hidden'
    }} className="dot-grid">
      
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, rgba(37, 99, 235, 0.03) 40%, rgba(255,255,255,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{
          maxWidth: '650px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem'
        }}>
          
          {/* Micro-Indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'var(--green-light)',
            color: 'var(--green-primary)',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            border: '1px solid var(--green-border)'
          }}>
            <Sparkles size={14} /> Series A Demo Live
          </div>

          {/* Heading */}
          <h2 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-title)',
            lineHeight: 1.15
          }}>
            Turn Customer Data<br />
            Into Attributed Revenue
          </h2>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            Reach the right audience, launch smarter campaigns, and drive measurable business growth through AI-powered marketing intelligence.
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '1rem'
          }}>
            <button 
              onClick={() => navigate ? navigate('signup') : null}
              style={{
                backgroundColor: 'var(--blue-primary)',
                border: 'none',
                color: '#ffffff',
                padding: '1rem 2.2rem',
                fontSize: '1rem',
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
              Get Started Now <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate ? navigate('signup') : null}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--text-muted)',
                color: 'var(--text-secondary)',
                padding: '1rem 2.2rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
              Request Enterprise Quote
            </button>
          </div>

          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.5rem'
          }}>
            No credit card required. 14-day free trial. Integrates with Shopify, Salesforce, and Snowflake in 5 minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
