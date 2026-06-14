import React, { useState } from 'react';
import { LayoutDashboard, Users, Brain, Send, BarChart3, Search, Sparkles, Plus, Play, Calendar, UserCheck, MessageSquare, Mail, RefreshCw } from 'lucide-react';

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [segmentPrompt, setSegmentPrompt] = useState('Find high-value fashion buyers who spent > $150 in the last 60 days but have not made a purchase recently.');
  const [segmentCompiling, setSegmentCompiling] = useState(false);
  const [segmentResult, setSegmentResult] = useState(null);

  // AI Prompt compiler simulation
  const handleCompileSegment = () => {
    setSegmentCompiling(true);
    setTimeout(() => {
      setSegmentCompiling(false);
      setSegmentResult({
        count: '1,492 Customers',
        percentage: '8.4% of total base',
        aov: '$186.40 Avg. Order Value',
        filters: [
          { name: 'Last Purchase Date', op: 'within 60 days' },
          { name: 'Total Spend', op: 'greater than $150' },
          { name: 'Last Campaign Engagement', op: 'None (WhatsApp / SMS)' }
        ]
      });
    }, 1200);
  };

  // WhatsApp template rotation
  const [whatsappCopy, setWhatsappCopy] = useState("Hey Sarah! We noticed you loved our premium collection. Here is a private 15% VIP discount code for your next order: VIP15");
  const [isRegeneratingCopy, setIsRegeneratingCopy] = useState(false);
  const handleRegenerateCopy = () => {
    setIsRegeneratingCopy(true);
    setTimeout(() => {
      const copies = [
        "Hi Sarah, hope your week is going great! Exclusive VIP invite: enjoy 15% off our leather jackets. Use code VIP15 at checkout.",
        "Quick update Sarah! The jackets you viewed are running low on stock. Claim your 15% off code VIP15 now before they are sold out.",
        "Special reward, Sarah: Get 15% off our new arrivals. We picked these just for you. Apply code VIP15 today!"
      ];
      setWhatsappCopy(copies[Math.floor(Math.random() * copies.length)]);
      setIsRegeneratingCopy(false);
    }, 800);
  };

  return (
    <section id="showcase" style={{
      padding: '8rem 0',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid rgba(15, 23, 42, 0.05)',
      position: 'relative'
    }}>
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--blue-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '0.75rem'
          }}>
            Interactive Demo
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-title)',
            lineHeight: 1.2
          }}>
            Experience Reachable AI In Action
          </h2>
          <p style={{
            marginTop: '1rem',
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            maxWidth: '520px',
            margin: '1rem auto 0'
          }}>
            Interact with actual platform features. Switch tabs to see how client details, AI segmentations, and analytics operate.
          </p>
        </div>

        {/* Dashboard Shell Wrapper */}
        <div className="dashboard-shell" style={{
          width: '100%',
          background: '#ffffff',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: 'var(--shadow-premium)',
          display: 'grid',
          gridTemplateColumns: '1fr',
          minHeight: '620px',
          overflow: 'hidden'
        }}>
          
          {/* Internal Navigation Sidebar (Tabs) */}
          <div style={{
            borderRight: '1px solid rgba(15, 23, 42, 0.05)',
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
            justifyContent: 'center'
          }} className="dashboard-tabs">
            <button 
              onClick={() => setActiveTab('dashboard')}
              style={activeTab === 'dashboard' ? activeTabStyle : inactiveTabStyle}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('customers')}
              style={activeTab === 'customers' ? activeTabStyle : inactiveTabStyle}
            >
              <Users size={16} /> Customers
            </button>
            <button 
              onClick={() => setActiveTab('segment')}
              style={activeTab === 'segment' ? activeTabStyle : inactiveTabStyle}
            >
              <Brain size={16} /> AI Segment Builder
            </button>
            <button 
              onClick={() => setActiveTab('studio')}
              style={activeTab === 'studio' ? activeTabStyle : inactiveTabStyle}
            >
              <Send size={16} /> Campaign Studio
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              style={activeTab === 'analytics' ? activeTabStyle : inactiveTabStyle}
            >
              <BarChart3 size={16} /> Analytics
            </button>
          </div>

          {/* Main Dashboard Screen Viewport */}
          <div style={{ padding: '2rem', backgroundColor: '#f8fafc', overflowX: 'auto' }}>
            
            {/* TAB 1: DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                  <div style={statsBoxStyle}>
                    <span style={statsLabelStyle}>Attributed Repeat Revenue</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>$240,482</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green-primary)' }}>+14.2% MoM</span>
                    </div>
                  </div>
                  <div style={statsBoxStyle}>
                    <span style={statsLabelStyle}>Campaign Blasts ROI</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>4.82x</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green-primary)' }}>+0.3x this week</span>
                    </div>
                  </div>
                  <div style={statsBoxStyle}>
                    <span style={statsLabelStyle}>Avg. Repeat Purchase Rate</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>38.4%</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green-primary)' }}>+4.1% Lift</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Chart and Recent Campaigns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="dash-grid-split">
                  {/* Revenue Growth SVG Chart */}
                  <div style={panelCardStyle}>
                    <h4 style={panelHeaderTitleStyle}>Attributed Revenue Growth (Last 6 Months)</h4>
                    <div style={{ height: '220px', width: '100%', marginTop: '1rem', position: 'relative' }}>
                      {/* Grid background lines */}
                      <div style={{ position: 'absolute', width: '100%', borderBottom: '1px dashed #e2e8f0', top: '25%' }} />
                      <div style={{ position: 'absolute', width: '100%', borderBottom: '1px dashed #e2e8f0', top: '50%' }} />
                      <div style={{ position: 'absolute', width: '100%', borderBottom: '1px dashed #e2e8f0', top: '75%' }} />
                      
                      <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none" style={{ position: 'relative', zIndex: 1 }}>
                        <defs>
                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--green-primary)" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="var(--green-primary)" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        {/* Area shading */}
                        <path d="M 0 170 Q 100 130 200 120 T 300 80 T 400 40 T 500 20 L 500 200 L 0 200 Z" fill="url(#chartGlow)" />
                        {/* Path Line */}
                        <path d="M 0 170 Q 100 130 200 120 T 300 80 T 400 40 T 500 20" fill="none" stroke="var(--green-primary)" strokeWidth="3" />
                        
                        {/* Dots along path */}
                        <circle cx="200" cy="120" r="5" fill="var(--green-primary)" />
                        <circle cx="300" cy="80" r="5" fill="var(--green-primary)" />
                        <circle cx="400" cy="40" r="5" fill="var(--green-primary)" />
                      </svg>
                    </div>
                  </div>

                  {/* Recent Campaigns table */}
                  <div style={panelCardStyle}>
                    <h4 style={panelHeaderTitleStyle}>Active Automated Campaigns</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '0.5rem 0' }}>Campaign Name</th>
                          <th>Channel</th>
                          <th>Open Rate</th>
                          <th>Revenue Attributed</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>VIP Re-Engagement</td>
                          <td><span style={whatsappBadge}>WhatsApp</span></td>
                          <td>82.4%</td>
                          <td style={{ color: 'var(--green-primary)', fontWeight: 600 }}>$14,210</td>
                          <td><span style={badgeStatus('var(--green-light)', 'var(--green-primary)')}>Active</span></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>Abandonment Recovery</td>
                          <td><span style={smsBadge}>SMS</span></td>
                          <td>94.1%</td>
                          <td style={{ color: 'var(--green-primary)', fontWeight: 600 }}>$38,124</td>
                          <td><span style={badgeStatus('var(--green-light)', 'var(--green-primary)')}>Active</span></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>Spring Fashion Digest</td>
                          <td><span style={emailBadge}>Email</span></td>
                          <td>41.2%</td>
                          <td style={{ color: 'var(--green-primary)', fontWeight: 600 }}>$8,441</td>
                          <td><span style={badgeStatus('var(--blue-light)', 'var(--blue-primary)')}>Scheduling</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOMERS */}
            {activeTab === 'customers' && (
              <div style={panelCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative', width: '280px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="Search customers by name, tag..." 
                      defaultValue="Sarah Jenkins"
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem 0.5rem 2.2rem',
                        fontSize: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <button style={{
                    backgroundColor: 'var(--blue-primary)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}><Plus size={14} /> Add Customer</button>
                </div>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.5rem 0' }}>Customer</th>
                      <th>Lifetime Value</th>
                      <th>Last Purchase</th>
                      <th>Audience Segments</th>
                      <th>Propensity to Buy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--blue-primary)' }}>SJ</div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sarah Jenkins</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>sarah@example.com</div>
                        </div>
                      </td>
                      <td><strong>$1,240.00</strong></td>
                      <td>12 days ago</td>
                      <td style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '1.2rem' }}>
                        <span style={customerChip('#eff6ff', '#2563eb')}>Champions</span>
                        <span style={customerChip('#ecfdf5', '#10b981')}>Active SMS</span>
                      </td>
                      <td><span style={badgeStatus('var(--green-light)', 'var(--green-primary)')}>High (92%)</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text-secondary)' }}>MR</div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Marcus Rivera</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>marcus@example.com</div>
                        </div>
                      </td>
                      <td><strong>$450.00</strong></td>
                      <td>29 days ago</td>
                      <td style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '1.2rem' }}>
                        <span style={customerChip('#fef3c7', '#d97706')}>Dormant</span>
                        <span style={customerChip('#eff6ff', '#2563eb')}>WhatsApp</span>
                      </td>
                      <td><span style={badgeStatus('#fef3c7', '#d97706')}>Medium (45%)</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--blue-primary)' }}>EL</div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Elena Lopez</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>elena@example.com</div>
                        </div>
                      </td>
                      <td><strong>$1,890.00</strong></td>
                      <td>4 days ago</td>
                      <td style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '1.2rem' }}>
                        <span style={customerChip('#eff6ff', '#2563eb')}>Champions</span>
                        <span style={customerChip('#fef2f2', '#ef4444')}>At Risk of Churn</span>
                      </td>
                      <td><span style={badgeStatus('var(--green-light)', 'var(--green-primary)')}>High (88%)</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: AI SEGMENT BUILDER */}
            {activeTab === 'segment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={panelCardStyle}>
                  <h4 style={{ ...panelHeaderTitleStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Brain size={18} style={{ color: 'var(--blue-primary)' }} /> AI Natural Language Compiler
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: '1.5rem' }}>
                    Type the segment target in plain English. The Groq model automatically parses database filters.
                  </p>
                  
                  {/* NLP Textarea Prompt */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <textarea 
                      value={segmentPrompt}
                      onChange={(e) => setSegmentPrompt(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '1rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: 'var(--border-radius-md)',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'inherit',
                        lineHeight: 1.4
                      }}
                    />
                    <button 
                      onClick={handleCompileSegment}
                      disabled={segmentCompiling}
                      style={{
                        backgroundColor: 'var(--blue-primary)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        alignSelf: 'flex-end',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px var(--blue-glow)'
                      }}
                    >
                      {segmentCompiling ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Compiling...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} /> Compile Segment
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Compile Result block */}
                {segmentResult ? (
                  <div style={{
                    ...panelCardStyle,
                    background: '#eff6ff',
                    border: '1px solid var(--blue-border)',
                    animation: 'float 4s ease-in-out infinite'
                  }}>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <UserCheck size={16} /> Cohort Generated
                    </h5>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Target Cohort</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{segmentResult.count}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Customer Share</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{segmentResult.percentage}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Average LTV</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{segmentResult.aov}</div>
                      </div>
                    </div>

                    {/* Filters breakdown */}
                    <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--blue-border)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>SQL Compiled Parameters:</div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {segmentResult.filters.map((f, i) => (
                          <span key={i} style={{ fontSize: '0.7rem', background: '#ffffff', color: 'var(--blue-primary)', border: '1px solid var(--blue-border)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            <strong>{f.name}</strong> {f.op}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ ...panelCardStyle, borderStyle: 'dashed', textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)' }}>
                    Enter a prompt and click compile to simulate cohort generation.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: CAMPAIGN STUDIO */}
            {activeTab === 'studio' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="dash-grid-split">
                
                {/* Left Column Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Visual Editor triggers */}
                  <div style={panelCardStyle}>
                    <h4 style={panelHeaderTitleStyle}>Configure Campaign Step</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Target Segment</label>
                        <select style={selectStyle}>
                          <option>Champions (LTV &gt; $500)</option>
                          <option>Dormant Buyers (30d inactive)</option>
                          <option>Price Sensitive Shoppers</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Marketing Channel</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <button style={{ ...channelButtonStyle, borderColor: 'var(--green-primary)', background: 'var(--green-light)', color: 'var(--green-primary)' }}>
                            <MessageSquare size={14} /> WhatsApp
                          </button>
                          <button style={channelButtonStyle}>
                            <Mail size={14} /> Email
                          </button>
                          <button style={channelButtonStyle}>
                            <Send size={14} /> SMS
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Schedule recommendation */}
                  <div style={{ ...panelCardStyle, background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', border: '1px solid var(--blue-border)' }}>
                    <h4 style={{ ...panelHeaderTitleStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={16} style={{ color: 'var(--blue-primary)' }} /> AI Predictive Scheduling
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.4 }}>
                      AI Analytics suggests releasing this campaign during the high-engagement window to maximize exposure for your business.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--green-light)', color: 'var(--green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Calendar size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Optimal Send Time</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Today, 6:00 PM – 8:00 PM</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Expected Open Rate</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--green-primary)' }}>84.2%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat Preview */}
                <div style={panelCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>WhatsApp Live Preview</span>
                    <button 
                      onClick={handleRegenerateCopy}
                      disabled={isRegeneratingCopy}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--blue-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <RefreshCw size={12} className={isRegeneratingCopy ? 'animate-spin' : ''} style={{ animation: isRegeneratingCopy ? 'spin 1s linear infinite' : 'none' }} /> 
                      Regenerate Copy
                    </button>
                  </div>
                  
                  {/* Whatsapp UI mock */}
                  <div style={{
                    background: '#efeae2',
                    borderRadius: '8px',
                    padding: '1rem',
                    minHeight: '180px',
                    backgroundImage: 'radial-gradient(#dfdcd6 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}>
                    <div style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      padding: '0.6rem 0.8rem',
                      maxWidth: '85%',
                      boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
                      fontSize: '0.75rem',
                      lineHeight: 1.4,
                      position: 'relative',
                      alignSelf: 'flex-start'
                    }}>
                      {/* Message text */}
                      {whatsappCopy}
                      <span style={{
                        fontSize: '0.6rem',
                        color: 'var(--text-muted)',
                        float: 'right',
                        marginTop: '0.4rem',
                        marginLeft: '1rem'
                      }}>12:34 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={panelCardStyle}>
                  <h4 style={panelHeaderTitleStyle}>Outreach Conversion Funnel</h4>
                  <div style={{ height: '240px', width: '100%', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {/* Funnel Step 1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ width: '80px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Delivered</span>
                      <div style={{ flex: 1, height: '20px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '95%', height: '100%', backgroundColor: 'var(--blue-primary)', borderRadius: '4px' }} />
                      </div>
                      <span style={{ width: '50px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'right' }}>95.1%</span>
                    </div>
                    {/* Funnel Step 2 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ width: '80px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Opened</span>
                      <div style={{ flex: 1, height: '20px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '73%', height: '100%', backgroundColor: 'var(--blue-primary)', borderRadius: '4px' }} />
                      </div>
                      <span style={{ width: '50px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'right' }}>73.0%</span>
                    </div>
                    {/* Funnel Step 3 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ width: '80px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Clicked</span>
                      <div style={{ flex: 1, height: '20px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '38%', height: '100%', backgroundColor: 'var(--blue-primary)', borderRadius: '4px' }} />
                      </div>
                      <span style={{ width: '50px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'right' }}>38.2%</span>
                    </div>
                    {/* Funnel Step 4 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ width: '80px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Purchased</span>
                      <div style={{ flex: 1, height: '20px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '14.2%', height: '100%', backgroundColor: 'var(--green-primary)', borderRadius: '4px' }} />
                      </div>
                      <span style={{ width: '50px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--green-primary)', textAlign: 'right' }}>14.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        .dashboard-tabs {
          flex-direction: row !important;
          border-right: none !important;
          border-bottom: 1px solid rgba(15, 23, 42, 0.05) !important;
        }

        .dash-grid-split {
          grid-template-columns: 1fr !important;
        }

        @media (min-width: 992px) {
          .dashboard-shell {
            grid-template-columns: 240px 1fr !important;
          }
          .dashboard-tabs {
            flex-direction: column !important;
            align-items: stretch !important;
            justify-content: flex-start !important;
            border-right: 1px solid rgba(15, 23, 42, 0.05) !important;
            border-bottom: none !important;
          }
          .dash-grid-split {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

// Button Tab styling
const activeTabStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.6rem 0.9rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--blue-primary)',
  backgroundColor: 'var(--blue-light)',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  maxWidth: '220px',
  transition: 'all 0.2s ease'
};

const inactiveTabStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.6rem 0.9rem',
  fontSize: '0.8rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  maxWidth: '220px',
  transition: 'all 0.2s ease'
};

const statsBoxStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: '8px',
  padding: '1.25rem',
  boxShadow: 'var(--shadow-sm)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const statsLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const panelCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: 'var(--border-radius-md)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-sm)'
};

const panelHeaderTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family-title)'
};

const whatsappBadge = {
  backgroundColor: 'var(--green-light)',
  color: 'var(--green-primary)',
  fontSize: '0.7rem',
  fontWeight: 600,
  padding: '0.2rem 0.4rem',
  borderRadius: '4px',
  border: '1px solid var(--green-border)'
};

const smsBadge = {
  backgroundColor: 'var(--blue-light)',
  color: 'var(--blue-primary)',
  fontSize: '0.7rem',
  fontWeight: 600,
  padding: '0.2rem 0.4rem',
  borderRadius: '4px',
  border: '1px solid var(--blue-border)'
};

const emailBadge = {
  backgroundColor: '#f1f5f9',
  color: 'var(--text-secondary)',
  fontSize: '0.7rem',
  fontWeight: 600,
  padding: '0.2rem 0.4rem',
  borderRadius: '4px',
  border: '1px solid #cbd5e1'
};

const badgeStatus = (bg, color) => ({
  backgroundColor: bg,
  color: color,
  fontSize: '0.7rem',
  fontWeight: 600,
  padding: '0.15rem 0.4rem',
  borderRadius: '4px'
});

const customerChip = (bg, color) => ({
  backgroundColor: bg,
  color: color,
  fontSize: '0.65rem',
  fontWeight: 600,
  padding: '0.15rem 0.35rem',
  borderRadius: '4px',
  border: `1px solid ${color}20`
});

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  display: 'block',
  marginBottom: '0.25rem'
};

const selectStyle = {
  width: '100%',
  padding: '0.5rem',
  fontSize: '0.8rem',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  outline: 'none',
  backgroundColor: '#ffffff'
};

const channelButtonStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.3rem',
  padding: '0.5rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  backgroundColor: '#ffffff',
  color: 'var(--text-secondary)',
  cursor: 'pointer'
};
