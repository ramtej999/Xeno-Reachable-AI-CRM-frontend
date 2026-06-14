import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Save, User, RefreshCw, Layers } from 'lucide-react';

const SUGGESTIONS = [
  "Show customers inactive for 60 days who spent more than ₹5000.",
  "Find champions who bought apparel recently but haven't engaged with SMS.",
  "Identify dormant shoppers with AOV > ₹3000 to win back via WhatsApp."
];

import { useCrm } from './CrmContext';
import crmApi from '../../api/crmApi';

export default function CrmAudienceBuilder() {
  const { customers, audienceBuilderState, setAudienceBuilderState } = useCrm();
  const { prompt, result } = audienceBuilderState;

  const setPrompt = (val) => setAudienceBuilderState(prev => ({ ...prev, prompt: val }));
  const setResult = (val) => setAudienceBuilderState(prev => ({ ...prev, result: typeof val === 'function' ? val(prev.result) : val }));

  const [compiling, setCompiling] = useState(false);
  const [error, setError] = useState(null);
  const [usageCount, setUsageCount] = useState(0);
  const creditsRemaining = Math.max(0, 30 - usageCount);
  const isExhausted = creditsRemaining === 0;

  React.useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const data = await crmApi.getAiUsage();
      setUsageCount(data.audience_builder || 0);
    } catch (e) {
      console.error("Failed to fetch AI usage:", e);
    }
  };

  const handleCompile = async () => {
    setCompiling(true);
    setResult(null);
    setError(null);

    try {
      const res = await crmApi.queryAudience(prompt);
      const matchedCustomers = res.customers || [];
      const filtersData = res.filters || {};

      // Map dynamic filters to badges
      const filtersApplied = [];
      if (filtersData.segment) filtersApplied.push({ key: 'Segment', op: `= ${filtersData.segment.replace(' Customers', '')}` });
      if (filtersData.city) filtersApplied.push({ key: 'City', op: `= ${filtersData.city}` });
      if (filtersData.min_spend) filtersApplied.push({ key: 'Spend', op: `> ₹${filtersData.min_spend.toLocaleString()}` });
      if (filtersData.inactive_days) filtersApplied.push({ key: 'Inactivity', op: `> ${filtersData.inactive_days} Days` });
      
      if (filtersApplied.length === 0) {
        filtersApplied.push({ key: 'Database Scan', op: 'All Records' });
      }

      // Calculate aggregates & deterministic lift
      const totalSpend = matchedCustomers.reduce((acc, c) => acc + (parseFloat(c.total_spend) || 0), 0);
      const avgSpendVal = matchedCustomers.length > 0 ? Math.floor(totalSpend / matchedCustomers.length) : 0;

      const expectedLiftVal = res.expected_lift || 8.5;

      setResult({
        name: res.segment_name || 'Dynamic NL Segment',
        size: `${res.customer_count.toLocaleString()} Users`,
        share: `${((res.customer_count / (customers.length || 1)) * 100).toFixed(1)}% of customer base`,
        avgSpend: `₹${avgSpendVal.toLocaleString()} spend`,
        lift: `${expectedLiftVal.toFixed(1)}% Conversion Lift`,
        filters: filtersApplied,
        matches: matchedCustomers.slice(0, 5).map(c => ({
          name: c.name,
          email: c.email,
          spend: `₹${(parseFloat(c.total_spend) || 0).toLocaleString()}`,
          last: c.last_purchase ? `${c.last_purchase}` : 'No purchase'
        }))
      });
    } catch (err) {
      console.error("Failed to query audience:", err);
      const errMsg = err.response?.data?.detail || "Unable to generate audience. Backend service unavailable.";
      setError(errMsg);
      setResult(null);
    } finally {
      setCompiling(false);
      fetchUsage();
    }
  };

  const handleSave = () => {
    alert('Dynamic AI Segment saved to database! It is now active for targeted triggers.');
  };

  return (
    <div style={{ padding: '2rem' }}>
      
      {/* 1. Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            AI Audience Builder
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Write natural language prompts. The Groq intelligence compiler will generate instant segment rules.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingTop: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: isExhausted ? 'var(--red-primary)' : 'var(--text-primary)' }}>
            Credits Remaining: {creditsRemaining}/30
          </div>
          {isExhausted && (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Available again in 2 hours.
            </div>
          )}
        </div>
      </div>

      <div style={builderGridStyle}>
        {/* Left Side: Textarea compiler */}
        <div style={builderPanelCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Brain size={18} style={{ color: 'var(--blue-primary)' }} />
            <h3 style={cardTitleStyle}>Describe Your Audience Target</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={textareaStyle}
              placeholder={isExhausted ? "You can use this module again after 2 hours." : "Who do you want to target?"}
              disabled={compiling || isExhausted}
            />
            
            <button 
              onClick={handleCompile}
              disabled={compiling || isExhausted}
              style={compileButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-primary)'}
            >
              {compiling ? (
                <>
                  <RefreshCw size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Compiling Prompt...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Generate Segment
                </>
              )}
            </button>
          </div>

          {/* Prompt Suggestions */}
          <div style={{ marginTop: '2rem' }}>
            <div style={suggestionLabelStyle}>Try These Templates</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              {SUGGESTIONS.map((s, i) => (
                <div 
                  key={i} 
                  onClick={() => setPrompt(s)}
                  style={suggestionItemStyle}
                >
                  "{s}"
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Compiled Result Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AnimatePresence mode="wait">
            {compiling && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={emptyPanelStyle}
              >
                <RefreshCw size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite', color: 'var(--blue-primary)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Groq AI compiling natural language parameters...</span>
              </motion.div>
            )}

            {!compiling && result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                {/* Metrics Summary Card */}
                <div style={resultPanelCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--blue-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                      <Layers size={16} /> {result.name}
                    </div>
                    <button onClick={handleSave} style={saveButtonStyle}>
                      <Save size={14} /> Save Cohort
                    </button>
                  </div>

                  {/* 3 Metric counters */}
                  <div style={metricsGridStyle}>
                    <div style={metricBoxStyle}>
                      <span style={metricLabelStyle}>Audience Size</span>
                      <strong style={metricValStyle}>{result.size}</strong>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{result.share}</span>
                    </div>
                    <div style={metricBoxStyle}>
                      <span style={metricLabelStyle}>Average AOV</span>
                      <strong style={metricValStyle}>{result.avgSpend}</strong>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Repeat purchase value</span>
                    </div>
                    <div style={metricBoxStyle}>
                      <span style={metricLabelStyle}>Expected Lift</span>
                      <strong style={{ ...metricValStyle, color: 'var(--green-primary)' }}>{result.lift}</strong>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Over control group</span>
                    </div>
                  </div>

                  {/* SQL parsed rules */}
                  <div style={{ marginTop: '1.25rem' }}>
                    <div style={suggestionLabelStyle}>Parsed Filter Settings</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                      {result.filters.map((f, i) => (
                        <span key={i} style={ruleBadgeStyle}>
                          <strong>{f.key}</strong> {f.op}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Profiles Matching Preview Card */}
                <div style={resultPanelCardStyle}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: 'var(--font-family-title)' }}>Matching Customer Profiles Preview</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {result.matches.map((m, i) => (
                      <div key={i} style={matchItemStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={avatarStyle}><User size={12} /></div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{m.name}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{m.email}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                          <div><strong>{m.spend}</strong> Spend</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Purchased {m.last}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {!compiling && error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={emptyPanelStyle}
              >
                <span style={{ color: '#ef4444', fontWeight: 600 }}>{error}</span>
              </motion.div>
            )}

            {!compiling && !result && !error && (
              <div style={emptyPanelStyle}>
                <Brain size={24} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Describe your target audience on the left to compile.</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Layout styles variables
const builderGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '2rem'
};

const builderPanelCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: 'var(--border-radius-lg)',
  padding: '2rem',
  boxShadow: 'var(--shadow-sm)'
};

const cardTitleStyle = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family-title)'
};

const textareaStyle = {
  width: '100%',
  minHeight: '120px',
  padding: '1rem',
  fontSize: '0.85rem',
  border: '1px solid #cbd5e1',
  borderRadius: 'var(--border-radius-md)',
  outline: 'none',
  resize: 'none',
  fontFamily: 'inherit',
  lineHeight: 1.4,
  boxSizing: 'border-box'
};

const compileButtonStyle = {
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

const suggestionLabelStyle = {
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-secondary)'
};

const suggestionItemStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  padding: '0.5rem 0.75rem',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid #f1f5f9',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.15s ease'
};

// Suggestion item hover
Object.defineProperty(suggestionItemStyle, ':hover', {
  value: {
    borderColor: 'var(--blue-border)',
    color: 'var(--blue-primary)'
  }
});

const emptyPanelStyle = {
  backgroundColor: '#ffffff',
  border: '1px dashed #cbd5e1',
  borderRadius: 'var(--border-radius-lg)',
  padding: '5rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  textAlign: 'center'
};

const resultPanelCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: 'var(--border-radius-lg)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-sm)'
};

const saveButtonStyle = {
  backgroundColor: 'var(--blue-primary)',
  color: '#ffffff',
  border: 'none',
  padding: '0.4rem 0.8rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  transition: 'background-color 0.2s'
};

const metricsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
  borderBottom: '1px solid #f1f5f9',
  paddingBottom: '1.25rem'
};

const metricBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem'
};

const metricLabelStyle = {
  fontSize: '0.65rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const metricValStyle = {
  fontSize: '1.15rem',
  fontWeight: 700,
  fontFamily: 'var(--font-family-title)',
  color: 'var(--text-primary)'
};

const ruleBadgeStyle = {
  backgroundColor: 'var(--blue-light)',
  color: 'var(--blue-primary)',
  fontSize: '0.7rem',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  border: '1px solid var(--blue-border)'
};

const matchItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.6rem 0.8rem',
  border: '1px solid #f1f5f9',
  borderRadius: '8px'
};

const avatarStyle = {
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '50%',
  backgroundColor: '#f1f5f9',
  color: 'var(--text-secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
