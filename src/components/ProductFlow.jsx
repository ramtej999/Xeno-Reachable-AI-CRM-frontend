import React from 'react';
import { Database, Brain, Sparkles, Send, BarChart3, ArrowDown, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Customer Data',
    desc: 'Unify Shopify, POS, and custom CRM profiles in a clean customer database.',
    icon: <Database size={24} style={{ color: 'var(--blue-primary)' }} />,
    color: 'var(--blue-primary)',
    bg: 'var(--blue-light)'
  },
  {
    num: '02',
    title: 'AI Audience Builder',
    desc: 'Describe segments in natural language to target high-value cohorts.',
    icon: <Brain size={24} style={{ color: 'var(--blue-primary)' }} />,
    color: 'var(--blue-primary)',
    bg: 'var(--blue-light)'
  },
  {
    num: '03',
    title: 'Campaign Studio',
    desc: 'Instantly generate customized emails, SMS, and WhatsApp campaigns.',
    icon: <Sparkles size={24} style={{ color: 'var(--blue-primary)' }} />,
    color: 'var(--blue-primary)',
    bg: 'var(--blue-light)'
  },
  {
    num: '04',
    title: 'Multi-Channel Outreach',
    desc: 'Trigger automatic flows across WhatsApp, Email, SMS, and RCS.',
    icon: <Send size={24} style={{ color: 'var(--green-primary)' }} />,
    color: 'var(--green-primary)',
    bg: 'var(--green-light)'
  },
  {
    num: '05',
    title: 'Performance Analytics',
    desc: 'Track repeat purchase lift, open rates, and direct attributed revenue growth.',
    icon: <BarChart3 size={24} style={{ color: 'var(--green-primary)' }} />,
    color: 'var(--green-primary)',
    bg: 'var(--green-light)'
  }
];

export default function ProductFlow() {
  return (
    <section id="product-flow" style={{
      padding: '8rem 0',
      backgroundColor: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--blue-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '0.75rem'
          }}>
            Platform Flow
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.2
          }}>
            Everything Your Marketing Team Needs
          </h2>
          <p style={{
            marginTop: '1rem',
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            maxWidth: '500px',
            margin: '1rem auto 0'
          }}>
            The automated pipeline that turns cold customer logs into repeat revenue.
          </p>
        </div>

        {/* Step Cards Flow */}
        <div className="flow-container" style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem'
        }}>
          {/* Animated SVG Path for Desktop */}
          <div className="desktop-connector-svg" style={{
            position: 'absolute',
            top: '4rem',
            left: '5%',
            width: '90%',
            height: '4px',
            zIndex: 0,
            pointerEvents: 'none'
          }}>
            <svg width="100%" height="4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="2" x2="100%" y2="2" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="0" y1="2" x2="100%" y2="2" stroke="var(--blue-primary)" strokeWidth="2" strokeDasharray="12 12" className="animated-flow-line" />
            </svg>
          </div>

          <div className="flow-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            position: 'relative',
            zIndex: 1
          }}>
            {STEPS.map((step, index) => (
              <div 
                key={index} 
                className="flow-card"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(15, 23, 42, 0.05)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '2.5rem 1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = step.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.05)';
                }}
              >
                {/* Step Circle number */}
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '1.5rem',
                  backgroundColor: step.bg,
                  color: step.color,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  border: `1px solid ${step.color}30`
                }}>
                  {step.num}
                </div>

                {/* Icon wrapper */}
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: step.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 10px ${step.color}15`
                }}>
                  {step.icon}
                </div>

                {/* Title & Desc */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-family-title)'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4
                  }}>
                    {step.desc}
                  </p>
                </div>

                {/* Interactive mobile arrow indicators */}
                {index < STEPS.length - 1 && (
                  <div className="mobile-arrow" style={{
                    display: 'none',
                    justifyContent: 'center',
                    marginTop: '1rem',
                    color: 'var(--text-muted)'
                  }}>
                    <ArrowDown size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .flow-grid {
          grid-template-columns: 1fr !important;
        }
        .desktop-connector-svg {
          display: none !important;
        }
        .mobile-arrow {
          display: flex !important;
        }

        @media (min-width: 992px) {
          .flow-grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
          .desktop-connector-svg {
            display: block !important;
          }
          .mobile-arrow {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
