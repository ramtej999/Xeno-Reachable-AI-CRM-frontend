import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, Send, Sparkles, Clock, Percent, ArrowRight, Play, Eye, CheckCircle, AlertTriangle } from 'lucide-react';

import { useCrm } from './CrmContext';
import crmApi from '../../api/crmApi';

export default function CrmCampaignStudio() {
  const { customers, addCampaign, campaignStudioState, setCampaignStudioState } = useCrm();
  const { audience, channel, goal, campaign } = campaignStudioState;

  const setAudience = (val) => setCampaignStudioState(prev => ({ ...prev, audience: val }));
  const setChannel = (val) => setCampaignStudioState(prev => ({ ...prev, channel: val }));
  const setGoal = (val) => setCampaignStudioState(prev => ({ ...prev, goal: val }));
  const setCampaign = (val) => setCampaignStudioState(prev => ({ ...prev, campaign: typeof val === 'function' ? val(prev.campaign) : val }));

  const [compiling, setCompiling] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  
  const [usageCount, setUsageCount] = useState(0);
  const creditsRemaining = Math.max(0, 30 - usageCount);
  const isExhausted = creditsRemaining === 0;

  React.useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const data = await crmApi.getAiUsage();
      setUsageCount(data.campaign_studio || 0);
    } catch (e) {
      console.error("Failed to fetch AI usage:", e);
    }
  };

  const handleGenerate = async () => {
    setCompiling(true);
    setCampaign(null);

    try {
      const res = await crmApi.generateCampaign(goal, audience, channel);
      const camp = res.campaign;
      const copyData = res.copy;

      setCampaign({
        id: camp.id,
        campaignName: camp.campaign_name,
        copy: copyData.message_body || (channel === 'whatsapp'
          ? copyData.whatsapp_message
          : channel === 'email'
            ? copyData.email_content
            : copyData.sms_content),
        timing: copyData.timing || 'Thursday at 2:00 PM',
        timingReason: copyData.timing_reason || 'Peak activity window',
        timingSource: copyData.timing_source || 'benchmark',
        recommendedScheduledTime: copyData.recommended_scheduled_time || null,
        openRate: copyData.predicted_open_rate || '75%',
        ctr: copyData.predicted_ctr || '15%'
      });
    } catch (error) {
      console.error("Failed to generate campaign:", error);
      const errorMessage = error.response?.data?.detail || "AI Campaign generation failed. Using default template.";
      alert(errorMessage);
      setCampaign({
        id: null,
        campaignName: goal,
        copy: "Special VIP discount: Use code VIP15 for 15% off today!",
        timing: '10 AM – 12 PM',
        timingReason: 'Historically peak window.',
        openRate: '75%',
        ctr: '15%'
      });
    } finally {
      setCompiling(false);
      fetchUsage();
    }
  };

  const handleLaunch = async () => {
    if (!campaign) return;

    try {
      if (campaign.id) {
        await crmApi.sendCampaign(campaign.id);
        
        const audienceCount = customers.filter(c => c.segment === audience).length || customers.length;
        // Push the launched campaign details to context
        addCampaign({
          id: campaign.id,
          campaignName: campaign.campaignName,
          audience: audience,
          channel: channel === 'whatsapp' ? 'WhatsApp' : channel === 'email' ? 'Email' : 'SMS',
          audience_size: audienceCount,
          status: 'Running',
          revenue: 0.0,
          created_at: new Date().toISOString()
        });

        alert('Campaign launched! Message dispatches have been queued in the Channel Service.');
      } else {
        alert('Cannot launch a draft campaign without a backend ID.');
      }
    } catch (error) {
      console.error("Failed to launch campaign:", error);
      alert('Campaign launch failed.');
    } finally {
      setCampaign(null);
    }
  };

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSchedule = () => {
    if (!campaign) return;
    const defaultDateStr = campaign.recommendedScheduledTime
      ? campaign.recommendedScheduledTime.slice(0, 16)
      : new Date(Date.now() + 10 * 60000 - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    setScheduleTime(defaultDateStr);
    setShowScheduleModal(true);
  };

  const submitScheduleCampaign = async () => {
    if (!campaign || !scheduleTime) return;

    try {
      if (campaign.id) {
        const scheduledTime = new Date(scheduleTime).toISOString();
        await crmApi.scheduleCampaign(campaign.id, scheduledTime);
        
        const audienceCount = customers.filter(c => c.segment === audience).length || customers.length;
        addCampaign({
          id: campaign.id,
          campaignName: campaign.campaignName,
          audience: audience,
          channel: channel === 'whatsapp' ? 'WhatsApp' : channel === 'email' ? 'Email' : 'SMS',
          audience_size: audienceCount,
          status: 'Scheduled',
          scheduled_time: scheduledTime,
          revenue: 0.0,
          created_at: new Date().toISOString()
        });

        showToast(`Campaign successfully scheduled for ${new Date(scheduleTime).toLocaleString()}!`, 'success');
      } else {
        showToast('Cannot schedule a draft campaign without a backend ID.', 'error');
      }
    } catch (error) {
      console.error("Failed to schedule campaign:", error);
      showToast('Campaign scheduling failed.', 'error');
    } finally {
      setShowScheduleModal(false);
      setCampaign(null);
    }
  };

  const uniqueSegments = Array.from(new Set(customers.map(c => c.segment).filter(Boolean)));
  const activeSegments = uniqueSegments.length > 0 ? uniqueSegments : ['Dormant Customers', 'High Value Customers', 'Loyal Customers', 'At Risk Customers', 'New Customers'];

  return (
    <div style={{ padding: '2rem' }}>
      
      {/* 1. Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Campaign Studio
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Select cohort, choose channel, describe goals, and compile customized campaign flows.
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
        
        {/* Left pane: Configure campaign parameters */}
        <div style={panelCardStyle}>
          <h3 style={cardTitleStyle}>Configure Campaign Steps</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
            {/* Step 1: Select Audience */}
            <div>
              <label style={labelStyle}>1. Select Target Segment</label>
              <select 
                value={audience} 
                onChange={(e) => setAudience(e.target.value)}
                style={selectStyle}
              >
                {activeSegments.map(seg => {
                  const count = customers.filter(c => c.segment === seg).length;
                  return (
                    <option key={seg} value={seg}>
                      {seg} ({count} users)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Step 2: Choose Channel */}
            <div>
              <label style={labelStyle}>2. Select Channel Route</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button 
                  onClick={() => setChannel('whatsapp')}
                  style={{
                    ...channelButtonStyle,
                    borderColor: channel === 'whatsapp' ? 'var(--green-primary)' : '#cbd5e1',
                    backgroundColor: channel === 'whatsapp' ? 'var(--green-light)' : '#ffffff',
                    color: channel === 'whatsapp' ? 'var(--green-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <MessageSquare size={14} /> WhatsApp
                </button>
                <button 
                  onClick={() => setChannel('email')}
                  style={{
                    ...channelButtonStyle,
                    borderColor: channel === 'email' ? 'var(--blue-primary)' : '#cbd5e1',
                    backgroundColor: channel === 'email' ? 'var(--blue-light)' : '#ffffff',
                    color: channel === 'email' ? 'var(--blue-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <Mail size={14} /> Email
                </button>
                <button 
                  onClick={() => setChannel('sms')}
                  style={{
                    ...channelButtonStyle,
                    borderColor: channel === 'sms' ? 'var(--text-primary)' : '#cbd5e1',
                    backgroundColor: channel === 'sms' ? '#f1f5f9' : '#ffffff',
                    color: channel === 'sms' ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <Send size={14} /> SMS
                </button>
              </div>
            </div>

            {/* Step 3: Campaign Goal prompt */}
            <div>
              <label style={labelStyle}>3. Describe Campaign Goal</label>
              <input 
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                style={inputStyle}
                placeholder={isExhausted ? "You can use this module again after 2 hours." : "e.g. Winback dormant buyers with 15% code"}
                disabled={isExhausted}
              />
            </div>

            {/* Generate Trigger */}
            <button 
              onClick={handleGenerate}
              disabled={compiling || isExhausted}
              style={generateButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-primary)'}
            >
              {compiling ? 'Compiling AI draft...' : 'Compile AI Campaign'} <Sparkles size={14} />
            </button>
          </div>
        </div>

        {/* Right pane: Previews & AI Insights */}
        <div>
          <AnimatePresence mode="wait">
            {compiling && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={emptyPanelStyle}
              >
                <RefreshCw size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite', color: 'var(--blue-primary)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Groq compiling templates & predicting open rates...</span>
              </motion.div>
            )}

            {!compiling && campaign && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                {/* Live Preview Card */}
                <div style={panelCardStyle}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-family-title)' }}>
                    <Eye size={14} /> Device Preview ({channel.toUpperCase()})
                  </h4>

                  {channel === 'whatsapp' && (
                    <div style={whatsappPreviewStyle}>
                      <div style={whatsappHeaderStyle}>
                        <div style={whatsappAvatarStyle}>W</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-primary)' }}>Reachable Partner</div>
                          <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Verified Sender</div>
                        </div>
                      </div>
                      <div style={whatsappBubbleStyle}>
                        {campaign.copy}
                        <span style={timeStyle}>12:34 PM</span>
                      </div>
                      <div style={whatsappActionButtonStyle}>
                        Shop Now 🛍️
                      </div>
                    </div>
                  )}

                  {channel === 'email' && (
                    <div style={emailPreviewStyle}>
                      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem', fontFamily: 'inherit', color: 'var(--text-primary)', margin: 0 }}>
                        {campaign.copy}
                      </pre>
                    </div>
                  )}

                  {channel === 'sms' && (
                    <div style={smsPreviewStyle}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                        {campaign.copy}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI recommendation & Performance Metrics prediction */}
                <div style={panelCardStyle}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', fontFamily: 'var(--font-family-title)' }}>AI Copilot Optimization Predictions</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={insightBoxStyle}>
                      <div style={insightLabelStyle}><Clock size={12} /> Recommended Timing</div>
                      <strong style={insightValStyle}>{campaign.timing}</strong>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>{campaign.timingReason}</span>
                      {campaign.timingSource === 'benchmark' && (
                        <span style={{ fontSize: '0.55rem', color: '#f59e0b', fontWeight: 600, marginTop: '0.2rem', display: 'block' }}>
                          ⚠ Industry benchmark — limited event history
                        </span>
                      )}
                      {campaign.timingSource === 'data' && (
                        <span style={{ fontSize: '0.55rem', color: 'var(--green-primary)', fontWeight: 600, marginTop: '0.2rem', display: 'block' }}>
                          ✓ Based on your customers' real open history
                        </span>
                      )}
                    </div>

                    <div style={insightBoxStyle}>
                      <div style={insightLabelStyle}><Percent size={12} /> Predicted Open Rate</div>
                      <strong style={{ ...insightValStyle, color: 'var(--green-primary)' }}>{campaign.openRate}</strong>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Expected CTR: {campaign.ctr}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={handleSchedule}
                      style={secondaryButtonStyle}
                    >
                      Schedule
                    </button>
                    <button 
                      onClick={handleLaunch}
                      style={primaryLaunchButtonStyle}
                    >
                      Launch Campaign <Play size={12} fill="#ffffff" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {!compiling && !campaign && (
              <div style={emptyPanelStyle}>
                <Sparkles size={24} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Describe campaign objectives on the left to generate templates.</span>
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

      {/* Schedule Campaign Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div style={modalOverlayStyle}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={modalCardStyle}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)' }}>
                Schedule Campaign
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Campaign Name
                </span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {campaign?.campaignName}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Select Date & Time
                </label>
                <input 
                  type="datetime-local" 
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    fontSize: '0.9rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.6rem 1.2rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                >
                  Cancel
                </button>
                <button 
                  onClick={submitScheduleCampaign}
                  style={{
                    backgroundColor: 'var(--blue-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.6rem 1.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px var(--blue-glow)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-primary)'}
                >
                  Schedule Campaign
                </button>
              </div>
            </motion.div>
          </div>
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
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Styles variables
const builderGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '2rem'
};

const panelCardStyle = {
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

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  display: 'block',
  marginBottom: '0.4rem'
};

const selectStyle = {
  width: '100%',
  padding: '0.65rem 0.8rem',
  fontSize: '0.85rem',
  border: '1px solid #cbd5e1',
  borderRadius: 'var(--border-radius-sm)',
  outline: 'none',
  backgroundColor: '#ffffff',
  fontFamily: 'inherit'
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
  boxSizing: 'border-box'
};

const channelButtonStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
  padding: '0.6rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.2s'
};

const generateButtonStyle = {
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
  transition: 'all 0.2s ease',
  marginTop: '0.5rem'
};

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
  textAlign: 'center',
  minHeight: '280px'
};

const RefreshCw = ({ size, className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

// Device Previews mockup styling
const whatsappPreviewStyle = {
  backgroundColor: '#efeae2',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '1rem',
  backgroundImage: 'radial-gradient(#dfdcd6 1px, transparent 1px)',
  backgroundSize: '16px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const whatsappHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  paddingBottom: '0.4rem'
};

const whatsappAvatarStyle = {
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '50%',
  backgroundColor: 'var(--green-primary)',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '0.7rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const whatsappBubbleStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '0.6rem 0.8rem',
  fontSize: '0.75rem',
  lineHeight: 1.3,
  alignSelf: 'flex-start',
  maxWidth: '85%',
  boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
  position: 'relative'
};

const timeStyle = {
  fontSize: '0.55rem',
  color: 'var(--text-muted)',
  float: 'right',
  marginTop: '0.4rem',
  marginLeft: '1rem'
};

const whatsappActionButtonStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  padding: '0.4rem',
  fontSize: '0.72rem',
  color: 'var(--blue-primary)',
  fontWeight: 600,
  textAlign: 'center',
  cursor: 'default',
  width: '85%',
  boxShadow: '0 1px 1px rgba(0,0,0,0.05)'
};

const emailPreviewStyle = {
  backgroundColor: '#f8fafc',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  padding: '1rem',
  minHeight: '140px',
  boxSizing: 'border-box'
};

const smsPreviewStyle = {
  backgroundColor: '#e2e8f0',
  borderRadius: '16px',
  padding: '0.8rem 1rem',
  maxWidth: '75%',
  alignSelf: 'flex-start',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

// Insight variables
const insightBoxStyle = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem'
};

const insightLabelStyle = {
  fontSize: '0.65rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem'
};

const insightValStyle = {
  fontSize: '1.1rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family-title)'
};

const secondaryButtonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #cbd5e1',
  color: 'var(--text-secondary)',
  padding: '0.65rem 1.2rem',
  fontSize: '0.85rem',
  fontWeight: 600,
  borderRadius: 'var(--border-radius-sm)',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontFamily: 'inherit'
};

const primaryLaunchButtonStyle = {
  flex: 1,
  backgroundColor: 'var(--blue-primary)',
  color: '#ffffff',
  border: 'none',
  padding: '0.65rem 1.5rem',
  fontSize: '0.85rem',
  fontWeight: 600,
  borderRadius: 'var(--border-radius-sm)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  boxShadow: '0 4px 12px var(--blue-glow)',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999
};

const modalCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  width: '450px',
  padding: '24px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  boxSizing: 'border-box'
};
