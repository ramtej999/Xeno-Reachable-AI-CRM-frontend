import React from 'react';
import { UserCheck, Sparkles, Eye, TrendingUp, Cpu, Terminal, ShieldCheck } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" style={{
      padding: '8rem 0',
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid rgba(15, 23, 42, 0.05)',
      borderBottom: '1px solid rgba(15, 23, 42, 0.05)',
      position: 'relative'
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
            Core Capabilities
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-title)',
            lineHeight: 1.2
          }}>
            Powerful AI Tools for Hyper-Growth
          </h2>
          <p style={{
            marginTop: '1rem',
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            maxWidth: '550px',
            margin: '1rem auto 0'
          }}>
            Run complex segmentations, creative copy generation, and channel analytics instantly without writing SQL or code.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="feature-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2.5rem'
        }}>
          {/* Card 1: AI Audience Builder */}
          <div className="feature-card" style={featureCardStyle}>
            <div style={featureTextContainer}>
              <div style={iconBoxStyle('var(--blue-light)', 'var(--blue-primary)')}>
                <UserCheck size={20} />
              </div>
              <h3 style={featureTitleStyle}>AI Audience Builder</h3>
              <p style={featureDescStyle}>
                Create complex target customer segments using natural language. Query parameters are automatically compiled into real-time segments.
              </p>
            </div>
            
            {/* Micro-UI: NL Query Builder */}
            <div style={microUIContainerStyle}>
              <div className="glass-panel" style={microUIWindowStyle}>
                <div style={microUIHeaderStyle}>
                  <div style={dotsStyle}>
                    <span style={dotStyle('#ef4444')} />
                    <span style={dotStyle('#eab308')} />
                    <span style={dotStyle('#22c55e')} />
                  </div>
                  <span style={microUITitleStyle}>Segment Builder</span>
                </div>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <Terminal size={14} style={{ color: 'var(--blue-primary)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                      "Find shoppers who spent &gt; $200 and haven't purchased in 30 days"
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Compiling parameters...</span>
                    <span style={{
                      backgroundColor: 'var(--green-light)',
                      color: 'var(--green-primary)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--green-border)'
                    }}>
                      8,421 Customers Matching
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Campaign Generator */}
          <div className="feature-card" style={featureCardStyle}>
            <div style={featureTextContainer}>
              <div style={iconBoxStyle('var(--blue-light)', 'var(--blue-primary)')}>
                <Sparkles size={20} />
              </div>
              <h3 style={featureTitleStyle}>Campaign Generator</h3>
              <p style={featureDescStyle}>
                Generate highly personalized copy and templates for Email, SMS, or WhatsApp instantly. Tailored context increases click-through rates.
              </p>
            </div>

            {/* Micro-UI: AI Template Editor */}
            <div style={microUIContainerStyle}>
              <div className="glass-panel" style={microUIWindowStyle}>
                <div style={microUIHeaderStyle}>
                  <div style={dotsStyle}>
                    <span style={dotStyle('#ef4444')} />
                    <span style={dotStyle('#eab308')} />
                    <span style={dotStyle('#22c55e')} />
                  </div>
                  <span style={microUITitleStyle}>WhatsApp Editor</span>
                </div>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.6rem 0.8rem', background: '#eff6ff', fontSize: '0.75rem', position: 'relative' }}>
                    <div style={{ fontWeight: 600, color: 'var(--blue-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Cpu size={12} /> Groq-Generated Copy
                    </div>
                    "Hey &#123;&#123;first_name&#125;&#125;! We noticed you loved our leather jackets. Here is a private 15% code for your next order: VIP15"
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
                    <button style={microButtonSecondary}>Edit Prompt</button>
                    <button style={microButtonPrimary}>Apply to Flow</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Customer Intelligence */}
          <div className="feature-card" style={featureCardStyle}>
            <div style={featureTextContainer}>
              <div style={iconBoxStyle('var(--blue-light)', 'var(--blue-primary)')}>
                <Eye size={20} />
              </div>
              <h3 style={featureTitleStyle}>Customer Intelligence</h3>
              <p style={featureDescStyle}>
                Monitor key customer metrics, purchase frequencies, average order value (AOV), and customer lifetime value (LTV) cohorts automatically.
              </p>
            </div>

            {/* Micro-UI: Customer Cohort Card */}
            <div style={microUIContainerStyle}>
              <div className="glass-panel" style={microUIWindowStyle}>
                <div style={microUIHeaderStyle}>
                  <div style={dotsStyle}>
                    <span style={dotStyle('#ef4444')} />
                    <span style={dotStyle('#eab308')} />
                    <span style={dotStyle('#22c55e')} />
                  </div>
                  <span style={microUITitleStyle}>Cohort breakdown</span>
                </div>
                <div style={{ padding: '0.8rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={cohortChipStyle('#eff6ff', '#2563eb', 'Champions (LTV > $500)')} />
                  <div style={cohortChipStyle('#ecfdf5', '#10b981', 'Dormant Buyers (30d inactive)')} />
                  <div style={cohortChipStyle('#fef2f2', '#ef4444', 'At Risk of Churn')} />
                  <div style={cohortChipStyle('#fef3c7', '#d97706', 'Price Sensitive')} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Analytics Copilot */}
          <div className="feature-card" style={featureCardStyle}>
            <div style={featureTextContainer}>
              <div style={iconBoxStyle('var(--blue-light)', 'var(--blue-primary)')}>
                <TrendingUp size={20} />
              </div>
              <h3 style={featureTitleStyle}>Analytics Copilot</h3>
              <p style={featureDescStyle}>
                Receive real-time automated notifications regarding campaign performance, delivery rates, and ROI optimizations to run better ads.
              </p>
            </div>

            {/* Micro-UI: Smart Recommendation Alert */}
            <div style={microUIContainerStyle}>
              <div className="glass-panel" style={microUIWindowStyle}>
                <div style={microUIHeaderStyle}>
                  <div style={dotsStyle}>
                    <span style={dotStyle('#ef4444')} />
                    <span style={dotStyle('#eab308')} />
                    <span style={dotStyle('#22c55e')} />
                  </div>
                  <span style={microUITitleStyle}>Copilot Feed</span>
                </div>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', background: '#ecfdf5', border: '1px solid var(--green-border)', padding: '0.6rem', borderRadius: '8px' }}>
                    <ShieldCheck size={14} style={{ color: 'var(--green-primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--green-primary)' }}>Insight Detected</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-primary)', marginTop: '0.1rem', lineHeight: 1.3 }}>
                        WhatsApp blast in "Champions" segment drove <strong>+$14,240</strong> repeat revenue. Increase daily outreach limit?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .feature-grid {
          grid-template-columns: 1fr !important;
        }

        @media (min-width: 992px) {
          .feature-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}

const featureCardStyle = {
  background: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: 'var(--border-radius-lg)',
  padding: '3rem 2.5rem',
  boxShadow: 'var(--shadow-sm)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '2.5rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'default'
};

const featureTextContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const iconBoxStyle = (bg, color) => ({
  width: '3rem',
  height: '3rem',
  borderRadius: 'var(--border-radius-sm)',
  backgroundColor: bg,
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `0 4px 10px ${color}10`
});

const featureTitleStyle = {
  fontSize: '1.4rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family-title)'
};

const featureDescStyle = {
  fontSize: '0.95rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5
};

const microUIContainerStyle = {
  width: '100%',
  minHeight: '130px',
  background: '#f8fafc',
  borderRadius: 'var(--border-radius-md)',
  border: '1px solid #f1f5f9',
  padding: '1.2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const microUIWindowStyle = {
  width: '100%',
  maxWidth: '360px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
  overflow: 'hidden',
  border: '1px solid #e2e8f0'
};

const microUIHeaderStyle = {
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
  padding: '0.4rem 0.8rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const dotsStyle = {
  display: 'flex',
  gap: '4px'
};

const dotStyle = (color) => ({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: color
});

const microUITitleStyle = {
  fontSize: '0.65rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const microButtonPrimary = {
  backgroundColor: 'var(--blue-primary)',
  color: '#ffffff',
  fontSize: '0.7rem',
  fontWeight: 500,
  padding: '0.3rem 0.6rem',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer'
};

const microButtonSecondary = {
  backgroundColor: 'transparent',
  color: 'var(--text-secondary)',
  fontSize: '0.7rem',
  fontWeight: 500,
  padding: '0.3rem 0.6rem',
  borderRadius: '4px',
  border: '1px solid #cbd5e1',
  cursor: 'pointer'
};

const cohortChipStyle = (bg, color, text) => ({
  backgroundColor: bg,
  color: color,
  fontSize: '0.7rem',
  fontWeight: 500,
  padding: '0.3rem 0.6rem',
  borderRadius: '4px',
  border: `1px solid ${color}20`
});
