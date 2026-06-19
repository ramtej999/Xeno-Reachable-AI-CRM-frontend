import React from 'react';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid rgba(15, 23, 42, 0.05)',
      padding: '5rem 0 3rem 0',
      color: 'var(--text-secondary)',
      fontSize: '0.85rem'
    }}>
      <div className="container-custom">
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          
          {/* Logo & Slogan Column */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="footer-brand-col">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '2.2rem',
                height: '2.2rem',
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: 'var(--blue-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Activity size={18} />
              </div>
              <div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-family-title)',
                  color: 'var(--text-primary)',
                  lineHeight: 1
                }}>
                  REACHABLE AI
                </div>
                <div style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  marginTop: '0.15rem'
                }}>
                  by Reachable AI
                </div>
              </div>
            </div>
            
            <p style={{
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
              maxWidth: '260px'
            }}>
              Automated marketing CRM that turns retail customer profiles into repeat purchases and measurable revenue.
            </p>
          </div>

          {/* Product links */}
          <div style={footerColStyle}>
            <h5 style={footerColTitleStyle}>Product</h5>
            <span style={footerLinkStyle}>Features</span>
            <span style={footerLinkStyle}>Marketing Flow</span>
            <span style={footerLinkStyle}>Integrations</span>
            <span style={footerLinkStyle}>Pricing</span>
          </div>

          {/* Developers links */}
          <div style={footerColStyle}>
            <h5 style={footerColTitleStyle}>Developers</h5>
            <span style={footerLinkStyle}>API Documentation</span>
            <span style={footerLinkStyle}>Status Webhook</span>
            <span style={footerLinkStyle}>Open Source SDK</span>
            <span style={footerLinkStyle}>Developer Guide</span>
          </div>

          {/* Company links */}
          <div style={footerColStyle}>
            <h5 style={footerColTitleStyle}>Company</h5>
            <span style={footerLinkStyle}>About Us</span>
            <span style={footerLinkStyle}>Security Standard</span>
            <span style={footerLinkStyle}>Series A Deck</span>
            <span style={footerLinkStyle}>Contact Sales</span>
          </div>

          {/* Legal links */}
          <div style={footerColStyle}>
            <h5 style={footerColTitleStyle}>Legal</h5>
            <span style={footerLinkStyle}>Privacy Policy</span>
            <span style={footerLinkStyle}>Terms of Service</span>
            <span style={footerLinkStyle}>Data Protection (GDPR)</span>
            <span style={footerLinkStyle}>DPA Addendum</span>
          </div>

        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid rgba(15, 23, 42, 0.05)',
          paddingTop: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} © {new Date().getFullYear()} Reachable AI. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Security Status</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>System Uptime (99.99%)</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }
        .footer-brand-col {
          grid-column: span 2 !important;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(6, 1fr) !important;
          }
          .footer-brand-col {
            grid-column: span 2 !important;
          }
        }
      `}</style>
    </footer>
  );
}

const footerColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem'
};

const footerColTitleStyle = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.5rem'
};

const footerLinkStyle = {
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  fontSize: '0.8rem'
};
// Add hover selector behavior
Object.defineProperty(footerLinkStyle, ':hover', {
  value: {
    color: 'var(--text-primary)'
  }
});
