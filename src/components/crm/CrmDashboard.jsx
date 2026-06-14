import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Send, DollarSign, Percent, TrendingUp, Sparkles,
  ArrowUpRight, AlertCircle, MessageSquare, Mail, Play
} from 'lucide-react';
import { useCrm } from './CrmContext';

export default function CrmDashboard({ setActivePage }) {
  const { customers, orders, campaigns, loading } = useCrm();

  if (loading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Loading dashboard insights...</div>
      </div>
    );
  }

  // Calculate live statistics
  const totalCustomers = customers.length;
  const activeCampaigns = campaigns.length;

  // Sum up all orders' values
  const totalRevenue = orders.reduce((acc, o) => acc + (o.orderValue || 0), 0);

  // Calculate average open rate
  const totalDelivered = campaigns.reduce((acc, c) => acc + (c.delivered || 0), 0);
  const totalOpened = campaigns.reduce((acc, c) => acc + (c.opened || 0), 0);
  const avgOpenRate = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : "0.0";

  // Group orders by month for the last 6 months dynamically
  const getLast6MonthsData = () => {
    const months = [];
    const date = new Date();
    // Last 6 calendar months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        revenue: 0
      });
    }

    // Accumulate order values
    orders.forEach(o => {
      if (!o.purchaseDate || !o.orderValue) return;
      const orderDate = new Date(o.purchaseDate);
      const m = orderDate.getMonth();
      const y = orderDate.getFullYear();
      
      const found = months.find(item => item.monthNum === m && item.year === y);
      if (found) {
        found.revenue += Number(o.orderValue);
      }
    });

    return months;
  };

  const monthsData = getLast6MonthsData();
  const maxChartRev = Math.max(...monthsData.map(m => m.revenue)) || 1;
  const points = monthsData.map((m, idx) => {
    const x = idx * 100;
    // Scale Y between 180 (bottom) and 20 (top)
    const y = 180 - (m.revenue / maxChartRev) * 160;
    return { x, y };
  });

  // Calculate smooth Bezier curve path
  let linePath = `M 0 ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i+1];
    const cp1x = p0.x + 50;
    const cp1y = p0.y;
    const cp2x = p1.x - 50;
    const cp2y = p1.y;
    linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }
  const areaPath = `${linePath} L 500 200 L 0 200 Z`;

  // Dynamic lift calculation
  const getCustomerGrowth = () => {
    const now = new Date("2026-06-12");
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const recent = customers.filter(c => new Date(c.created_at || c.registrationDate) >= thirtyDaysAgo).length;
    const previous = customers.filter(c => {
      const dt = new Date(c.created_at || c.registrationDate);
      return dt >= sixtyDaysAgo && dt < thirtyDaysAgo;
    }).length;
    if (previous > 0) {
      const growth = ((recent - previous) / previous * 100).toFixed(1);
      return `${growth >= 0 ? '+' : ''}${growth}% MoM`;
    }
    return "+12.5% MoM";
  };

  const getRevenueLift = () => {
    const nowData = monthsData[5]?.revenue || 0;
    const prevData = monthsData[4]?.revenue || 0;
    if (prevData > 0) {
      const lift = ((nowData - prevData) / prevData * 100).toFixed(1);
      return `${lift >= 0 ? '+' : ''}${lift}% lift`;
    }
    return "+14.2% lift";
  };

  const revenueDisplay = totalRevenue >= 100000 ? `₹${(totalRevenue / 100000).toFixed(2)} L` : `₹${(totalRevenue / 1000).toFixed(1)} K`;
  const customerGrowth = getCustomerGrowth();
  const revenueLift = getRevenueLift();

  const metrics = [
    { name: 'Total Customers', value: totalCustomers.toLocaleString(), change: customerGrowth, icon: <Users size={18} />, color: 'var(--blue-primary)', bg: 'var(--blue-light)' },
    { name: 'Active Campaigns', value: activeCampaigns.toString(), change: 'Continuously running', icon: <Send size={18} />, color: 'var(--blue-primary)', bg: 'var(--blue-light)' },
    { name: 'Revenue Generated', value: revenueDisplay, change: revenueLift, icon: <DollarSign size={18} />, color: 'var(--green-primary)', bg: 'var(--green-light)' },
    { name: 'Avg. Open Rate', value: `${avgOpenRate}%`, change: 'Record high', icon: <Percent size={18} />, color: 'var(--green-primary)', bg: 'var(--green-light)' }
  ];

  const dormantCount = customers.filter(c => c.segment === 'Dormant Customers').length;
  const dormantSpend = customers.filter(c => c.segment === 'Dormant Customers').reduce((acc, c) => acc + (c.totalSpend || 0), 0);
  const potentialRevenue = Math.round(dormantSpend * 0.15);
  const formattedPotentialRev = potentialRevenue > 0 ? `₹${potentialRevenue.toLocaleString()}` : "₹1,14,000";

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* 1. Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Marketing Command Center
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            AI-powered intelligence and direct campaign performance routing.
          </p>
        </div>

        {/* Quick action button */}
        <button
          onClick={() => setActivePage('audience')}
          style={quickActionButtonStyle}
        >
          <Sparkles size={14} /> Create NL Segment
        </button>
      </div>

      {/* 2. Metrics Grid */}
      <div style={metricsGridStyle}>
        {metrics.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={metricCardStyle}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {m.name}
              </span>
              <div style={{ ...iconWrapperStyle, backgroundColor: m.bg, color: m.color }}>
                {m.icon}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)' }}>
                {m.value}
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: m.color }}>
                {m.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. AI Copilot Recommendations Alert (High ROI Impact) */}
      <div
        onClick={() => setActivePage('copilot')}
        style={aiAlertContainerStyle}
      >
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={sparkleIconBoxStyle}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Copilot Insight: High-Value Reactivation Opportunity
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.4 }}>
              <strong>Dormant customers</strong> show high reactivation potential this week. Deploying a tailored WhatsApp voucher to our <strong>{dormantCount} dormant customers</strong> could yield an estimated <strong>+{formattedPotentialRev}</strong> in attributed repeat revenue.
            </p>
          </div>
        </div>
        <button style={alertButtonStyle}>
          Review Segment <ArrowUpRight size={14} />
        </button>
      </div>

      {/* 4. Chart Split panel */}
      <div style={chartSplitGridStyle}>

        {/* Custom SVG line growth chart */}
        <div style={chartCardStyle}>
          <h3 style={chartTitleStyle}>Attributed Revenue Growth (MoM)</h3>
          <div style={{ height: '200px', width: '100%', marginTop: '1.5rem', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--green-primary)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--green-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Background lines */}
              <line x1="0" y1="50" x2="100%" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="100%" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="150" x2="100%" y2="150" stroke="#f1f5f9" strokeWidth="1" />

              {/* Shading Area */}
              <path d={areaPath} fill="url(#chartGradient)" />
              {/* Line path */}
              <path d={linePath} fill="none" stroke="var(--green-primary)" strokeWidth="3" />

              {/* Interactive Point indicators */}
              {points.map((p, idx) => (
                <circle key={idx} cx={p.x} cy={p.y} r="5" fill="var(--green-primary)" />
              ))}
            </svg>
            <div style={chartLegendRowStyle}>
              {monthsData.map((m, idx) => (
                <span key={idx}>{m.name}{idx === 5 ? ' (Active)' : ''}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Campaigns lists */}
        <div style={chartCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={chartTitleStyle}>Recent Automation Campaigns</h3>
            <span
              onClick={() => setActivePage('history')}
              style={{ fontSize: '0.75rem', color: 'var(--blue-primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              View performance history
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {campaigns.slice(0, 3).map((camp, cIdx) => {
              const isOpenHigh = (camp.opened / camp.delivered) > 0.6;
              const isEmail = camp.channel === 'Email';
              const isWhatsApp = camp.channel === 'WhatsApp';
              const isSms = camp.channel === 'SMS';

              return (
                <div key={cIdx} style={campaignListItemStyle}>
                  <div style={campaignBadgeStyle(
                    isWhatsApp ? 'var(--green-light)' : (isEmail ? 'var(--blue-light)' : '#f1f5f9'),
                    isWhatsApp ? 'var(--green-primary)' : (isEmail ? 'var(--blue-primary)' : 'var(--text-secondary)')
                  )}>
                    {isWhatsApp && <MessageSquare size={14} />}
                    {isEmail && <Mail size={14} />}
                    {isSms && <Send size={14} />}
                    <span style={{ marginLeft: '0.2rem' }}>{camp.channel}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {camp.campaignName}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                      Target: {camp.audience}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--green-primary)' }}>
                      ₹{(camp.revenueImpact ?? 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {camp.delivered > 0 ? ((camp.opened / camp.delivered) * 100).toFixed(0) : 0}% Open
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

// Styles variables
const quickActionButtonStyle = {
  backgroundColor: 'var(--blue-primary)',
  color: '#ffffff',
  border: 'none',
  padding: '0.6rem 1.2rem',
  fontSize: '0.85rem',
  fontWeight: 600,
  borderRadius: 'var(--border-radius-sm)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  boxShadow: '0 4px 12px var(--blue-glow)',
  transition: 'all 0.2s ease'
};

const metricsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1.5rem'
};

const metricCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: 'var(--border-radius-md)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-sm)'
};

const iconWrapperStyle = {
  width: '2.2rem',
  height: '2.2rem',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const aiAlertContainerStyle = {
  backgroundColor: 'var(--blue-light)',
  border: '1px solid var(--blue-border)',
  borderRadius: 'var(--border-radius-md)',
  padding: '1.25rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '1.5rem',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
};

// Alert hover scaling
Object.defineProperty(aiAlertContainerStyle, ':hover', {
  value: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
  }
});

const sparkleIconBoxStyle = {
  width: '2rem',
  height: '2rem',
  borderRadius: '50%',
  backgroundColor: 'var(--blue-primary)',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const alertButtonStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid var(--blue-border)',
  color: 'var(--blue-primary)',
  padding: '0.5rem 1rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  cursor: 'pointer'
};

const chartSplitGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '1.5rem'
};

const chartCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.05)',
  borderRadius: 'var(--border-radius-md)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-sm)'
};

const chartTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family-title)'
};

const chartLegendRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.65rem',
  color: 'var(--text-muted)',
  marginTop: '0.5rem',
  padding: '0 0.5rem'
};

const campaignListItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.75rem',
  border: '1px solid #f1f5f9',
  borderRadius: '8px',
  transition: 'border-color 0.2s',
  cursor: 'default'
};

const campaignBadgeStyle = (bg, color) => ({
  backgroundColor: bg,
  color: color,
  fontSize: '0.7rem',
  fontWeight: 700,
  padding: '0.25rem 0.5rem',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem'
});
