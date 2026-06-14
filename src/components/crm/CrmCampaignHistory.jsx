import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, Send, ArrowUpRight, BarChart3, X, Calendar, TrendingUp, Activity, CheckCircle } from 'lucide-react';

import { useCrm } from './CrmContext';
import crmApi from '../../api/crmApi';

export default function CrmCampaignHistory() {
  const { campaigns, loading, cancelCampaign } = useCrm();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };
  const [performanceData, setPerformanceData] = useState([]);
  const [perfLoading, setPerfLoading] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [secondsTick, setSecondsTick] = useState(0);

  // Tick every second so running campaign badge animates
  useEffect(() => {
    const t = setInterval(() => setSecondsTick(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const runningCampaigns = campaigns.filter(c => c.status === 'Running');

  const handleSelectCampaign = async (c) => {
    const isWhatsApp = c.channel.toLowerCase() === 'whatsapp';
    const isEmail = c.channel.toLowerCase() === 'email';
    const badgeBg = isWhatsApp ? 'var(--green-light)' : (isEmail ? 'var(--blue-light)' : '#f1f5f9');
    const badgeColor = isWhatsApp ? 'var(--green-primary)' : (isEmail ? 'var(--blue-primary)' : 'var(--text-secondary)');
    const icon = isWhatsApp ? <MessageSquare size={14} /> : (isEmail ? <Mail size={14} /> : <Send size={14} />);
    const status = c.status || 'Completed';

    setSelectedCampaign({ ...c, badgeBg, badgeColor, icon, status });
    setPerfLoading(true);
    setPerformanceData([]);
    setFilterType('All');
    try {
      const res = await crmApi.getCampaignPerformance(c.id);
      setPerformanceData(res.performance || []);
    } catch (err) {
      console.error("Failed to fetch campaign performance:", err);
    } finally {
      setPerfLoading(false);
    }
  };

  const filteredPerfData = performanceData.filter(p => {
    if (filterType === 'All') return true;
    if (filterType === 'Sent') return p.sent;
    if (filterType === 'Delivered') return p.delivered;
    if (filterType === 'Opened') return p.opened;
    if (filterType === 'Clicked') return p.clicked;
    if (filterType === 'Purchased') return p.purchased;
    if (filterType === 'Failed') return p.failed;
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Loading campaign records...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', position: 'relative', minHeight: '85vh' }}>
      
      {/* 1. Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Campaign Performance
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Historical logs of triggered automation flows and attributed ROI.
        </p>
      </div>

      {/* 2. Running Campaign Banner */}
      {runningCampaigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #f59e0b',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.75rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.82rem',
            color: '#92400e'
          }}
        >
          <Activity size={16} style={{ color: '#f59e0b', flexShrink: 0 }} className="animate-pulse" />
          <span>
            <strong>{runningCampaigns.length} campaign{runningCampaigns.length > 1 ? 's' : ''} running</strong>
            {' '}— Revenue and funnel metrics update in real-time. Final attributed sales settle within
            <strong> 15–30 seconds</strong> after the simulation completes. Stay on this page to watch live.
          </span>
        </motion.div>
      )}

      {/* 3. Campaigns Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderRowStyle}>
              <th style={tableHeaderStyle}>Campaign Name</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Scheduled Time</th>
              <th style={tableHeaderStyle}>Launch Time</th>
              <th style={tableHeaderStyle}>Audience Size</th>
              <th style={tableHeaderStyle}>Delivered</th>
              <th style={tableHeaderStyle}>Opened</th>
              <th style={tableHeaderStyle}>Clicked</th>
              <th style={tableHeaderStyle}>Purchased</th>
              <th style={tableHeaderStyle}>Conversion Rate</th>
              <th style={tableHeaderStyle}>Attributed Revenue</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, idx) => {
              const isWhatsApp = c.channel.toLowerCase() === 'whatsapp';
              const isEmail = c.channel.toLowerCase() === 'email';
              
              const badgeBg = isWhatsApp ? 'var(--green-light)' : (isEmail ? 'var(--blue-light)' : '#f1f5f9');
              const badgeColor = isWhatsApp ? 'var(--green-primary)' : (isEmail ? 'var(--blue-primary)' : 'var(--text-secondary)');
              const icon = isWhatsApp ? <MessageSquare size={14} /> : (isEmail ? <Mail size={14} /> : <Send size={14} />);
              const status = c.status || 'Completed';
              
              const isCancelled = status === 'Cancelled';
              const scheduledTime = (c.scheduled_time && !isCancelled) ? new Date(c.scheduled_time).toLocaleString() : '-';
              const launchTime = (c.launch_time && !isCancelled)
                ? new Date(c.launch_time).toLocaleString() 
                : ((c.scheduled_time && !isCancelled) ? '-' : (c.created_at && !isCancelled ? new Date(c.created_at).toLocaleString() : '-'));
              
              const conversionRate = c.audience_size > 0 ? ((c.purchased / c.audience_size) * 100).toFixed(1) + "%" : "0.0%";
              
              return (
                <tr 
                  key={idx} 
                  onClick={() => handleSelectCampaign(c)}
                  style={tableRowStyle}
                  className="campaign-row"
                >
                  <td style={{ ...tableCellStyle, fontWeight: 700 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span>{c.campaignName}</span>
                      <span style={channelBadgeStyle(badgeBg, badgeColor)}>
                        {icon} {c.channel.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={statusBadgeStyle(status)}>
                      {status === 'Running' && (
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          backgroundColor: '#f59e0b', display: 'inline-block',
                          animation: 'pulse 1.2s ease-in-out infinite'
                        }} />
                      )}
                      {status}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{scheduledTime}</td>
                  <td style={tableCellStyle}>{launchTime}</td>
                  <td style={{ ...tableCellStyle, fontWeight: 600 }}>{(c.audience_size || 0).toLocaleString()}</td>
                  <td style={tableCellStyle}>{(c.delivered || 0).toLocaleString()}</td>
                  <td style={tableCellStyle}>{(c.opened || 0).toLocaleString()}</td>
                  <td style={tableCellStyle}>{(c.clicked || 0).toLocaleString()}</td>
                  <td style={tableCellStyle}>{(c.purchased || 0).toLocaleString()}</td>
                  <td style={{ ...tableCellStyle, fontWeight: 700, color: 'var(--blue-primary)' }}>{conversionRate}</td>
                  <td style={{ ...tableCellStyle, fontWeight: 700, color: 'var(--green-primary)' }}>
                    ₹{(c.revenueImpact ?? 0).toLocaleString()}
                  </td>
                  <td style={tableCellStyle}>
                    {status === 'Scheduled' && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const res = await cancelCampaign(c.id);
                          if (res.success) {
                            showToast("Campaign schedule cancelled.", "success");
                          } else {
                            showToast(res.error || "Failed to cancel campaign.", "error");
                          }
                        }}
                        style={{
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(elm) => elm.currentTarget.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(elm) => elm.currentTarget.style.backgroundColor = '#ef4444'}
                      >
                        Cancel Schedule
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Detailed Campaign Analytics Drawer */}
      <AnimatePresence>
        {selectedCampaign && (
          <>
            {/* Drawer Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCampaign(null)}
              style={backdropStyle}
            />
            {/* Slide-out Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, cubicBezier: [0.16, 1, 0.3, 1] }}
              style={drawerStyle}
              className="glass-panel"
            >
              {/* Drawer Header */}
              <div style={drawerHeaderStyle}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-family-title)' }}>Campaign Analytics</h3>
                <button 
                  onClick={() => setSelectedCampaign(null)}
                  style={closeButtonStyle}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content */}
              <div style={drawerContentStyle}>
                
                {/* Basic info panel */}
                <div style={campaignProfileCardStyle}>
                  <span style={channelBadgeStyle(selectedCampaign.badgeBg, selectedCampaign.badgeColor)}>
                    {selectedCampaign.icon} {selectedCampaign.channel.toUpperCase()}
                  </span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.5rem', textAlign: 'center' }}>{selectedCampaign.campaignName}</h4>
                  
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    <Calendar size={12} /> Target: {selectedCampaign.audience}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.2rem', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                    <strong>Scheduled:</strong> {selectedCampaign.status !== 'Cancelled' && selectedCampaign.scheduled_time ? new Date(selectedCampaign.scheduled_time).toLocaleString() : '-'}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.1rem', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                    <strong>Launched:</strong> {selectedCampaign.status !== 'Cancelled' && selectedCampaign.launch_time ? new Date(selectedCampaign.launch_time).toLocaleString() : (selectedCampaign.status !== 'Cancelled' && selectedCampaign.scheduled_time ? '-' : (selectedCampaign.status !== 'Cancelled' && selectedCampaign.created_at ? new Date(selectedCampaign.created_at).toLocaleString() : '-'))}
                  </div>
                </div>

                {/* Conversion Funnel stats */}
                <div style={drawerCardStyle}>
                  <h5 style={drawerCardTitleStyle}><BarChart3 size={14} style={{ color: 'var(--blue-primary)' }} /> Delivery Funnel Analysis</h5>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                    {/* Sent */}
                    <div style={funnelRowStyle}>
                      <span style={funnelLabelStyle}>Sent</span>
                      <strong style={funnelValStyle}>{(selectedCampaign.sent || 0).toLocaleString()}</strong>
                    </div>
                    {/* Delivered */}
                    <div style={funnelRowStyle}>
                      <span style={funnelLabelStyle}>Delivered</span>
                      <strong style={funnelValStyle}>{(selectedCampaign.delivered || 0).toLocaleString()} ({selectedCampaign.sent > 0 ? ((selectedCampaign.delivered / selectedCampaign.sent) * 100).toFixed(1) : "0.0"}%)</strong>
                    </div>
                    {/* Opened */}
                    <div style={funnelRowStyle}>
                      <span style={funnelLabelStyle}>Opened</span>
                      <strong style={funnelValStyle}>{(selectedCampaign.opened || 0).toLocaleString()} ({selectedCampaign.delivered > 0 ? ((selectedCampaign.opened / selectedCampaign.delivered) * 100).toFixed(1) : "0.0"}%)</strong>
                    </div>
                    {/* Clicked */}
                    <div style={funnelRowStyle}>
                      <span style={funnelLabelStyle}>Clicked</span>
                      <strong style={funnelValStyle}>{(selectedCampaign.clicked || 0).toLocaleString()} ({selectedCampaign.opened > 0 ? ((selectedCampaign.clicked / selectedCampaign.opened) * 100).toFixed(1) : "0.0"}%)</strong>
                    </div>
                  </div>
                </div>

                {/* Attributed ROI Card */}
                <div style={drawerCardStyle}>
                  <h5 style={drawerCardTitleStyle}><TrendingUp size={14} style={{ color: 'var(--green-primary)' }} /> Revenue Impact Attribution</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Direct Sales Attributed</span>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--green-primary)' }}>₹{(selectedCampaign.revenueImpact ?? 0).toLocaleString()}</strong>
                    </div>
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Avg. Order Lift</span>
                      <strong>+18.4%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Attributed ROI</span>
                      <strong>4.8x Return</strong>
                    </div>
                  </div>
                </div>

                {/* Recipient Activity Log (Priority 6 Drill-Down) */}
                <div style={drawerCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <h5 style={{ ...drawerCardTitleStyle, borderBottom: 'none', paddingBottom: 0 }}><MessageSquare size={14} style={{ color: 'var(--blue-primary)' }} /> Recipient Log</h5>
                    <select 
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value)}
                      style={{ fontSize: '0.7rem', padding: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none' }}
                    >
                      <option value="All">All Events</option>
                      <option value="Sent">Sent</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Opened">Opened</option>
                      <option value="Clicked">Clicked</option>
                      <option value="Purchased">Purchased</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                  
                  {perfLoading ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem' }}>Loading logs...</div>
                  ) : filteredPerfData.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem' }}>No recipients match.</div>
                  ) : (
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: '6px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '0.4rem 0.5rem', fontWeight: 600 }}>Name</th>
                            <th style={{ padding: '0.4rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Funnel Steps</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPerfData.map((p, pIdx) => (
                            <tr key={pIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700 }}>{p.customer_name}</td>
                              <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <span style={{ color: p.sent ? 'var(--blue-primary)' : 'var(--text-muted)', marginRight: '2px' }}>✓S</span>
                                <span style={{ color: p.delivered ? 'var(--blue-primary)' : 'var(--text-muted)', marginRight: '2px' }}>➔✓D</span>
                                <span style={{ color: p.opened ? 'var(--blue-primary)' : 'var(--text-muted)', marginRight: '2px' }}>➔✓O</span>
                                <span style={{ color: p.clicked ? 'var(--green-primary)' : 'var(--text-muted)', marginRight: '2px' }}>➔✓C</span>
                                {p.purchased && <span style={{ color: 'var(--green-primary)', fontWeight: 'bold', marginRight: '2px' }}>➔✓P</span>}
                                {p.failed && <span style={{ color: '#ef4444', fontWeight: 'bold' }}>➔✗F</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              backgroundColor: '#ffffff',
              border: `1px solid ${toast.type === 'success' ? 'var(--green-border)' : '#fca5a5'}`,
              borderRadius: 'var(--border-radius-md)',
              padding: '0.75rem 1.25rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              zIndex: 9999,
              color: toast.type === 'success' ? 'var(--green-primary)' : '#dc2626'
            }}
            className="glass-panel"
          >
            <CheckCircle size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .campaign-row {
          transition: background-color 0.2s;
        }
        .campaign-row:hover {
          background-color: var(--bg-secondary) !important;
          cursor: pointer;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Styling coordinates
const tableContainerStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: 'var(--border-radius-md)',
  boxShadow: 'var(--shadow-sm)',
  overflowX: 'auto'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontSize: '0.8rem'
};

const tableHeaderRowStyle = {
  borderBottom: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc'
};

const tableHeaderStyle = {
  padding: '0.8rem 1.2rem',
  fontWeight: 700,
  color: 'var(--text-secondary)'
};

const tableRowStyle = {
  borderBottom: '1px solid #f1f5f9'
};

const tableCellStyle = {
  padding: '0.9rem 1.2rem',
  color: 'var(--text-primary)',
  verticalAlign: 'middle'
};

const channelBadgeStyle = (bg, color) => ({
  fontSize: '0.7rem',
  fontWeight: 700,
  padding: '0.2rem 0.45rem',
  borderRadius: '4px',
  backgroundColor: bg,
  color: color,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  border: `1px solid ${color}20`
});

const statusBadgeStyle = (status) => {
  const map = {
    Running:   { bg: '#fffbeb', color: '#b45309', border: '#f59e0b' },
    Scheduled: { bg: '#eff6ff', color: '#1d4ed8', border: '#3b82f6' },
    Completed: { bg: 'var(--green-light)', color: 'var(--green-primary)', border: 'var(--green-border)' },
    Failed:    { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5' },
    Cancelled: { bg: '#f1f5f9', color: '#64748b', border: '#cbd5e1' },
    Draft:     { bg: '#f8fafc', color: 'var(--text-secondary)', border: '#cbd5e1' },
  };
  const t = map[status] || map.Draft;
  return {
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    backgroundColor: t.bg,
    color: t.color,
    border: `1px solid ${t.border}`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
  };
};

// Drawer style coordinates (synchronized with Customers Explorer)
const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#0f172a',
  zIndex: 1000
};

const drawerStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  maxWidth: '400px',
  backgroundColor: '#ffffff',
  boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.05)',
  zIndex: 1001,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box'
};

const drawerHeaderStyle = {
  padding: '1.25rem 1.5rem',
  borderBottom: '1px solid #f1f5f9',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const closeButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '0.2rem'
};

const drawerContentStyle = {
  padding: '1.5rem',
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

const campaignProfileCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 'var(--border-radius-md)',
  padding: '1.5rem'
};

const drawerCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: 'var(--border-radius-md)',
  padding: '1.25rem',
  boxShadow: 'var(--shadow-sm)'
};

const drawerCardTitleStyle = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  borderBottom: '1px solid #f1f5f9',
  paddingBottom: '0.5rem',
  fontFamily: 'var(--font-family-title)'
};

const funnelRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.78rem',
  padding: '0.2rem 0'
};

const funnelLabelStyle = {
  color: 'var(--text-secondary)',
  fontWeight: 500
};

const funnelValStyle = {
  color: 'var(--text-primary)',
  fontWeight: 700
};
