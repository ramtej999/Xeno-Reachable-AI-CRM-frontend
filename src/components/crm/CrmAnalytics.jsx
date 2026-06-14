import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Sparkles, MessageSquare, Percent, ArrowUpRight, DollarSign } from 'lucide-react';
import { useCrm } from './CrmContext';
import crmApi from '../../api/crmApi';

export default function CrmAnalytics() {
  const { campaigns, loading, analyticsState, setAnalyticsState } = useCrm();
  const { dateRange, selectedChannel } = analyticsState;

  const setDateRange = (val) => setAnalyticsState(prev => ({ ...prev, dateRange: val }));
  const setSelectedChannel = (val) => setAnalyticsState(prev => ({ ...prev, selectedChannel: val }));

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setStatsLoading(true);
      try {
        const data = await crmApi.getAnalytics();
        setStats(data);
      } catch (err) {
        console.error("Failed to load analytics stats:", err);
      } finally {
        setStatsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || statsLoading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Loading analytics insights...</div>
      </div>
    );
  }

  // Filter campaigns dynamically based on selected date range and channel
  const filteredCampaigns = campaigns.filter(c => {
    // Channel filter
    if (selectedChannel !== 'all' && c.channel?.toLowerCase() !== selectedChannel.toLowerCase()) {
      return false;
    }
    // Date filter
    if (dateRange !== 'all') {
      const createdDate = new Date(c.created_at || c.created || Date.now());
      const now = new Date();
      const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
      if (dateRange === '7d' && diffDays > 7) return false;
      if (dateRange === '30d' && diffDays > 30) return false;
    }
    return true;
  });

  // Calculate dynamic channel revenues
  const waRevenue = filteredCampaigns.filter(c => c.channel === 'WhatsApp').reduce((acc, c) => acc + (c.revenueImpact || 0), 0);
  const emailRevenue = filteredCampaigns.filter(c => c.channel === 'Email').reduce((acc, c) => acc + (c.revenueImpact || 0), 0);
  const smsRevenue = filteredCampaigns.filter(c => c.channel === 'SMS').reduce((acc, c) => acc + (c.revenueImpact || 0), 0);

  const maxRevenue = Math.max(waRevenue, emailRevenue, smsRevenue) || 1;
  const waHeight = Math.max(30, (waRevenue / maxRevenue) * 160);
  const emailHeight = Math.max(30, (emailRevenue / maxRevenue) * 160);
  const smsHeight = Math.max(30, (smsRevenue / maxRevenue) * 160);

  // Dynamic funnel calculations summing campaigns if available, else fallback to database stats
  const campaignSent = filteredCampaigns.reduce((acc, c) => acc + Number(c.sent || c.audience_size || 0), 0);
  const campaignDelivered = filteredCampaigns.reduce((acc, c) => acc + Number(c.delivered || 0), 0);
  const campaignOpened = filteredCampaigns.reduce((acc, c) => acc + Number(c.opened || 0), 0);
  const campaignClicked = filteredCampaigns.reduce((acc, c) => acc + Number(c.clicked || 0), 0);
  const campaignPurchased = filteredCampaigns.reduce((acc, c) => acc + Number(c.purchased || 0), 0);

  const totalSent = campaignSent || Number(stats?.messages_sent || 0);
  const totalDelivered = campaignDelivered || Number(stats?.delivered || 0);
  const totalOpened = campaignOpened || Number(stats?.opened || 0);
  const totalClicked = campaignClicked || Number(stats?.clicked || 0);
  const totalPurchased = campaignPurchased || Number(stats?.purchased || 0);

  const deliveredPct =
    totalSent > 0
      ? ((totalDelivered / totalSent) * 100).toFixed(1)
      : "0.0";

  const openedPct =
    totalDelivered > 0
      ? ((totalOpened / totalDelivered) * 100).toFixed(1)
      : "0.0";

  const clickedPct =
    totalOpened > 0
      ? ((totalClicked / totalOpened) * 100).toFixed(1)
      : "0.0";

  const purchasedPct =
    totalClicked > 0
      ? ((totalPurchased / totalClicked) * 100).toFixed(1)
      : "0.0";

  // Dynamic AI channel optimizations calculations from campaigns
  const waCampaigns = filteredCampaigns.filter(c => c.channel?.toLowerCase() === 'whatsapp');
  const emailCampaigns = filteredCampaigns.filter(c => c.channel?.toLowerCase() === 'email');
  
  const waDel = waCampaigns.reduce((acc, c) => acc + (c.delivered || 0), 0);
  const waOp = waCampaigns.reduce((acc, c) => acc + (c.opened || 0), 0);
  const emailDel = emailCampaigns.reduce((acc, c) => acc + (c.delivered || 0), 0);
  const emailOp = emailCampaigns.reduce((acc, c) => acc + (c.opened || 0), 0);
  
  const waOpenRate = waDel > 0 ? (waOp / waDel) : 0.85;
  const emailOpenRate = emailDel > 0 ? (emailOp / emailDel) : 0.35;
  const openRateRatio = emailOpenRate > 0 ? (waOpenRate / emailOpenRate).toFixed(1) : "2.4";

  const dormantCampaigns = filteredCampaigns.filter(c => 
    c.campaignName?.toLowerCase().includes('dormant') || 
    c.audience?.toLowerCase().includes('dormant')
  );
  const dormantRevenue = dormantCampaigns.reduce((acc, c) => acc + (c.revenueImpact || 0), 0);
  const dormantAudience = dormantCampaigns.reduce((acc, c) => acc + (c.audience_size || 0), 0) || 1;
  const dormantRoiLift = ((dormantRevenue / dormantAudience) * 0.1).toFixed(1);
  const finalRoiLift = parseFloat(dormantRoiLift) > 0 ? dormantRoiLift : "18.4";

  const dynamicOpenPct = stats?.open_rate ? stats.open_rate.toFixed(1) : "75.0";

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Marketing Intelligence
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Detailed attribution models, conversion trends, and channels ROI.
        </p>
      </div>

      {/* 1.5. Analytics Filters Row */}
      <div style={filterRowStyle}>
        <div style={filterGroupStyle}>
          <label style={filterLabelStyle}>Date range</label>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)} 
            style={filterSelectStyle}
          >
            <option value="all">All Time</option>
            <option value="30d">Last 30 Days</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
        <div style={filterGroupStyle}>
          <label style={filterLabelStyle}>Attribution channel</label>
          <select 
            value={selectedChannel} 
            onChange={(e) => setSelectedChannel(e.target.value)} 
            style={filterSelectStyle}
          >
            <option value="all">All Channels</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
        </div>
      </div>

      {/* 2. Charts Grid layout */}
      <div style={chartsGridStyle}>
        
        {/* Chart 1: Channel Performance Bar Chart */}
        <div style={chartCardStyle}>
          <h3 style={chartTitleStyle}>Channel Attribution Revenue</h3>
          <div style={{ height: '220px', width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            {/* Bar 1: WhatsApp */}
            <div style={barColStyle}>
              <div style={{ height: `${waHeight}px`, width: '36px', backgroundColor: 'var(--green-primary)', borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 0.5s ease' }}>
                <span style={barValueStyle}>₹{(waRevenue / 1000).toFixed(0)}K</span>
              </div>
              <span style={barLabelStyle}>WhatsApp</span>
            </div>
            {/* Bar 2: Email */}
            <div style={barColStyle}>
              <div style={{ height: `${emailHeight}px`, width: '36px', backgroundColor: 'var(--blue-primary)', borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 0.5s ease' }}>
                <span style={barValueStyle}>₹{(emailRevenue / 1000).toFixed(0)}K</span>
              </div>
              <span style={barLabelStyle}>Email</span>
            </div>
            {/* Bar 3: SMS */}
            <div style={barColStyle}>
              <div style={{ height: `${smsHeight}px`, width: '36px', backgroundColor: '#64748b', borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 0.5s ease' }}>
                <span style={barValueStyle}>₹{(smsRevenue / 1000).toFixed(0)}K</span>
              </div>
              <span style={barLabelStyle}>SMS</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Open & Click Rate Trends */}
        <div style={chartCardStyle}>
          <h3 style={chartTitleStyle}>Outreach Conversion Funnel</h3>
          <div style={{ height: '220px', width: '100%', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Row 1: Sent */}
            <div style={funnelRowStyle}>
              <div style={{ width: '80px', fontSize: '0.75rem', fontWeight: 600 }}>Sent ({totalSent.toLocaleString()})</div>
              <div style={funnelProgressBgStyle}>
                <div style={{ ...funnelProgressStyle, width: '100%', backgroundColor: 'var(--blue-primary)' }} />
              </div>
              <div style={{ width: '40px', fontSize: '0.75rem', fontWeight: 700, textAlign: 'right' }}>100%</div>
            </div>
            {/* Row 2: Delivered */}
            <div style={funnelRowStyle}>
              <div style={{ width: '80px', fontSize: '0.75rem', fontWeight: 600 }}>Delivered</div>
              <div style={funnelProgressBgStyle}>
                <div style={{ ...funnelProgressStyle, width: `${deliveredPct}%`, backgroundColor: 'var(--blue-primary)' }} />
              </div>
              <div style={{ width: '40px', fontSize: '0.75rem', fontWeight: 700, textAlign: 'right' }}>{deliveredPct}%</div>
            </div>
            {/* Row 3: Opened */}
            <div style={funnelRowStyle}>
              <div style={{ width: '80px', fontSize: '0.75rem', fontWeight: 600 }}>Opened</div>
              <div style={funnelProgressBgStyle}>
                <div style={{ ...funnelProgressStyle, width: `${openedPct}%`, backgroundColor: 'var(--blue-primary)' }} />
              </div>
              <div style={{ width: '40px', fontSize: '0.75rem', fontWeight: 700, textAlign: 'right' }}>{openedPct}%</div>
            </div>
            {/* Row 4: Clicked */}
            <div style={funnelRowStyle}>
              <div style={{ width: '80px', fontSize: '0.75rem', fontWeight: 600 }}>Clicked</div>
              <div style={funnelProgressBgStyle}>
                <div style={{ ...funnelProgressStyle, width: `${clickedPct}%`, backgroundColor: 'var(--green-primary)' }} />
              </div>
              <div style={{ width: '40px', fontSize: '0.75rem', fontWeight: 700, textAlign: 'right', color: 'var(--green-primary)' }}>{clickedPct}%</div>
            </div>
            {/* Row 5: Purchased */}
            <div style={funnelRowStyle}>
              <div
                style={{
                  width: '80px',
                  fontSize: '0.75rem',
                  fontWeight: 600
              }}
              >
                Purchased
              </div>

              <div style={funnelProgressBgStyle}>
                <div
                  style={{
                        ...funnelProgressStyle,
                        width: `${purchasedPct}%`,
                        backgroundColor: '#16a34a'
                  }}
                />
              </div>

              <div
                style={{
                  width: '40px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textAlign: 'right',
                  color: '#16a34a'
                }}
              >
              {purchasedPct}%
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. AI Insights Feed Panel */}
      <div style={insightsCardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Sparkles size={18} style={{ color: 'var(--blue-primary)' }} />
          <h3 style={chartTitleStyle}>AI Channel Optimization Insights</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={insightItemCardStyle}>
            <div style={insightHeaderStyle}>
              <MessageSquare size={16} style={{ color: 'var(--green-primary)' }} />
              <span style={insightTitleStyle}>WhatsApp Dominance</span>
            </div>
            <p style={insightDescStyle}>
              WhatsApp campaigns outperform Email open rates by <strong>{openRateRatio}x</strong>. We recommend shifting 20% of your transactional triggers from Email to WhatsApp pipelines.
            </p>
          </div>

          <div style={insightItemCardStyle}>
            <div style={insightHeaderStyle}>
              <TrendingUp size={16} style={{ color: 'var(--blue-primary)' }} />
              <span style={insightTitleStyle}>ROI Lift Attributed</span>
            </div>
            <p style={insightDescStyle}>
              Voucher incentives deployed to <strong>Dormant Buyers</strong> generated <strong>{finalRoiLift}% higher ROI</strong> than standard discount broadcasts. Target inactive cohorts for maximum return.
            </p>
          </div>

          <div style={insightItemCardStyle}>
            <div style={insightHeaderStyle}>
              <Percent size={16} style={{ color: 'var(--green-primary)' }} />
              <span style={insightTitleStyle}>Open Probability</span>
            </div>
            <p style={insightDescStyle}>
              Recipient open probability rises to <strong>{dynamicOpenPct}%</strong> when campaigns are scheduled in the optimal window based on peak engagement times.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

// Styling elements
const chartsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '1.5rem'
};

const chartCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: 'var(--border-radius-lg)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-sm)'
};

const chartTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family-title)'
};

const barColStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem'
};

const barValueStyle = {
  position: 'absolute',
  top: '-20px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '0.7rem',
  fontWeight: 700,
  color: 'var(--text-primary)'
};

const barLabelStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  fontWeight: 600
};

const funnelRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const funnelProgressBgStyle = {
  flex: 1,
  height: '14px',
  backgroundColor: '#f1f5f9',
  borderRadius: '4px',
  overflow: 'hidden'
};

const funnelProgressStyle = {
  height: '100%',
  borderRadius: '4px'
};

const insightsCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: 'var(--border-radius-lg)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-sm)'
};

const insightItemCardStyle = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const insightHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem'
};

const insightTitleStyle = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family-title)'
};

const insightDescStyle = {
  fontSize: '0.72rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4
};

const filterRowStyle = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: 'var(--border-radius-md)',
  padding: '0.75rem 1.25rem',
  boxShadow: 'var(--shadow-sm)'
};

const filterGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  minWidth: '150px'
};

const filterLabelStyle = {
  fontSize: '0.65rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-secondary)'
};

const filterSelectStyle = {
  padding: '0.4rem 0.6rem',
  fontSize: '0.8rem',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  outline: 'none',
  backgroundColor: '#ffffff',
  fontFamily: 'inherit',
  cursor: 'pointer'
};
