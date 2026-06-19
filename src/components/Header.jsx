import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Activity } from 'lucide-react';

export default function Header({ navigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed header
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
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(15, 23, 42, 0.05)' : '1px solid transparent',
      padding: scrolled ? '1rem 0' : '1.5rem 0'
    }}>
      <div className="container-custom" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: 'var(--blue-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px var(--blue-glow)'
          }}>
            <Activity size={20} />
          </div>
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'var(--font-family-title)',
              color: 'var(--text-primary)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              REACHABLE <span style={{ color: 'var(--blue-primary)', fontWeight: 400 }}>AI</span>
            </div>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              marginTop: '0.2rem'
            }}>
              AI-Powered Marketing CRM
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav style={{
          display: 'none',
          gap: '2rem',
          alignItems: 'center',
        }} className="desktop-nav">
          <span onClick={() => scrollToSection('product-flow')} style={navLinkStyle}>Overview</span>
          <span onClick={() => scrollToSection('features')} style={navLinkStyle}>Features</span>
          <span onClick={() => scrollToSection('showcase')} style={navLinkStyle}>Product Demo</span>
          <span onClick={() => scrollToSection('architecture')} style={navLinkStyle}>Architecture</span>
          <span onClick={() => scrollToSection('metrics')} style={navLinkStyle}>Metrics</span>
        </nav>

        {/* Desktop CTAs */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '1rem'
        }} className="desktop-nav">
          <button 
            onClick={() => navigate ? navigate('login') : null}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.6rem 1rem'
            }}
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate ? navigate('signup') : null}
            style={{
              backgroundColor: 'var(--blue-primary)',
              border: 'none',
              color: '#ffffff',
              padding: '0.6rem 1.4rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              borderRadius: 'var(--border-radius-sm)',
              cursor: 'pointer',
              boxShadow: '0 4px 12px var(--blue-glow)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--blue-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--blue-primary)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            Get Started <ArrowRight size={16} />
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}
          className="mobile-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          padding: '6rem 2rem 2rem',
          gap: '2rem',
          zIndex: 999
        }}>
          <span onClick={() => scrollToSection('product-flow')} style={mobileNavLinkStyle}>Overview</span>
          <span onClick={() => scrollToSection('features')} style={mobileNavLinkStyle}>Features</span>
          <span onClick={() => scrollToSection('showcase')} style={mobileNavLinkStyle}>Product Demo</span>
          <span onClick={() => scrollToSection('architecture')} style={mobileNavLinkStyle}>Architecture</span>
          <span onClick={() => scrollToSection('metrics')} style={mobileNavLinkStyle}>Metrics</span>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: 'auto'
          }}>
            <button 
              onClick={() => { setIsOpen(false); if (navigate) navigate('login'); }}
              style={{
                background: 'transparent',
                border: '1px solid var(--text-muted)',
                color: 'var(--text-secondary)',
                padding: '0.8rem',
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsOpen(false); if (navigate) navigate('signup'); }}
              style={{
                backgroundColor: 'var(--blue-primary)',
                border: 'none',
                color: '#ffffff',
                padding: '0.8rem',
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Styles injected to page */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

const navLinkStyle = {
  fontSize: '0.9rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  position: 'relative',
};

// Subtle hover underlines for links
Object.defineProperty(navLinkStyle, ':hover', {
  value: {
    color: 'var(--text-primary)'
  }
});

const mobileNavLinkStyle = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  cursor: 'pointer',
  borderBottom: '1px solid var(--bg-tertiary)',
  paddingBottom: '0.75rem'
};
