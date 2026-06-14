import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Brain, Send, History, BarChart3, 
  Sparkles, Settings, LogOut, Search, Bell, ChevronDown, User, Activity,
  Percent, RefreshCw
} from 'lucide-react';
import CrmDashboard from './CrmDashboard';
import CrmCustomers from './CrmCustomers';
import CrmAudienceBuilder from './CrmAudienceBuilder';
import CrmCampaignStudio from './CrmCampaignStudio';
import CrmCampaignHistory from './CrmCampaignHistory';
import CrmAnalytics from './CrmAnalytics';
import CrmCopilot from './CrmCopilot';
import CrmSettings from './CrmSettings';
import CrmCartNegotiator from './CrmCartNegotiator';
import CrmTestingCenter from './CrmTestingCenter';
import { useAuth } from '../auth/AuthContext';
import { useCrm } from './CrmContext';

export default function AppShell({ navigate }) {
  const [activePage, setActivePage] = useState('dashboard');
  const { user: authUser, logout } = useAuth();
  const { 
    campaigns, 
    customers,
    setCampaignStudioState,
    setAudienceBuilderState,
    setCopilotState,
    setNegotiatorState,
    setAnalyticsState
  } = useCrm();
  const [user, setUser] = useState({ name: '', email: '', org: '' });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser({
        name: authUser.name || '',
        email: authUser.email || '',
        org: authUser.org || 'Reachable Organization'
      });
    }
  }, [authUser]);

  const handleLogout = () => {
    logout();
    navigate('landing');
  };

  // Main Page Router inside CRM
  const renderActivePage = () => {
    switch(activePage) {
      case 'dashboard': return <CrmDashboard setActivePage={setActivePage} />;
      case 'customers': return <CrmCustomers />;
      case 'audience': return <CrmAudienceBuilder />;
      case 'campaign': return <CrmCampaignStudio />;
      case 'history': return <CrmCampaignHistory />;
      case 'analytics': return <CrmAnalytics />;
      case 'copilot': return <CrmCopilot />;
      case 'settings': return <CrmSettings user={user} setUser={setUser} />;
      case 'negotiator': return <CrmCartNegotiator />;
      case 'testing': return <CrmTestingCenter />;
      default: return <CrmDashboard setActivePage={setActivePage} />;
    }
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'customers', name: 'Customers', icon: <Users size={16} /> },
    { id: 'audience', name: 'AI Audience Builder', icon: <Brain size={16} />, highlight: true },
    { id: 'campaign', name: 'Campaign Studio', icon: <Send size={16} /> },
    { id: 'history', name: 'Campaign History', icon: <History size={16} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={16} /> },
    { id: 'negotiator', name: 'Cart Negotiator Lab', icon: <Percent size={16} />, highlight: true },
    { id: 'testing', name: 'Testing Center', icon: <Activity size={16} /> },
    { id: 'copilot', name: 'AI Copilot', icon: <Sparkles size={16} />, highlight: true },
    { id: 'settings', name: 'Settings', icon: <Settings size={16} /> }
  ];

  return (
    <div style={shellContainerStyle}>
      {/* 1. LEFT SIDEBAR */}
      <aside style={sidebarStyle}>
        {/* Sidebar Logo Header */}
        <div style={logoContainerStyle}>
          <div style={logoIconStyle}>
            <Activity size={18} />
          </div>
          <div>
            <div style={logoTextStyle}>REACHABLE <span style={{ color: 'var(--blue-primary)', fontWeight: 400 }}>AI</span></div>
            <div style={logoSubTextStyle}>CRM BY XENO</div>
          </div>
        </div>

        {/* Navigation directory */}
        <nav style={navContainerStyle}>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                style={{
                  ...navButtonStyle,
                  backgroundColor: isActive ? 'var(--blue-light)' : 'transparent',
                  color: isActive ? 'var(--blue-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{item.name}</span>
                {item.highlight && (
                  <span style={highlightBadgeStyle}>AI</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Details */}
        <div style={sidebarFooterStyle}>
          <div style={userCardStyle}>
            <div style={avatarStyle}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={userNameStyle}>{user.name}</div>
              <div style={userEmailStyle}>{user.org}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={logoutButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div style={mainContentStyle}>
        {/* HEADER UTILITIES */}
        <header style={headerStyle}>
          {/* Universal Search Command Bar */}
          <div style={searchContainerStyle}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search customers, campaigns, segments... (Ctrl + K)" 
              style={searchInputStyle}
            />
          </div>

          {/* Right utility items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative' }}>
            
            {/* Active Page Reset Button */}
            <button 
              onClick={() => {
                const pageNames = {
                  'campaign': 'Campaign Studio',
                  'audience': 'Audience Builder',
                  'copilot': 'AI Copilot',
                  'negotiator': 'Cart Negotiator Lab',
                  'analytics': 'Analytics',
                  'testing': 'Testing Center'
                };
                const pageName = pageNames[activePage];
                
                if (!pageName) {
                  alert('There are no saved inputs to clear on this page.');
                  return;
                }
                
                if (window.confirm(`Are you sure you want to clear all inputs and reset the ${pageName} page?`)) {
                  if (activePage === 'campaign') {
                    setCampaignStudioState({ audience: 'Dormant Customers', channel: 'whatsapp', goal: 'Winback dormant champions with a premium incentive.', campaign: null });
                  } else if (activePage === 'audience') {
                    setAudienceBuilderState({ prompt: 'Show customers inactive for 60 days who spent more than ₹5000.', result: null });
                  } else if (activePage === 'copilot') {
                    setCopilotState({ messages: [{ role: 'assistant', text: "Hello! I am your Reachable AI Copilot. Ask me anything about your retail databases, cohort segments, or campaign ROI performance. What would you like to achieve today?" }], input: '' });
                  } else if (activePage === 'negotiator') {
                    setNegotiatorState({ selectedCustomerId: '', negotiationId: null, customerName: 'John Doe', phoneNumber: '+91 98765 43210', productName: 'Nike Air Max 90', productCategory: 'Footwear', originalPrice: 9999, marginFloorPrice: 6999, maxDiscountPercent: 30, strategy: 'Balanced', negotiationActive: false, messages: [], inputText: '', turns: 0, currentOffer: 9999, status: 'Active', probability: 45, logs: [], insights: [], hasFreeShipping: false });
                  } else if (activePage === 'analytics') {
                    setAnalyticsState({ dateRange: '30d', selectedChannel: 'all' });
                  } else if (activePage === 'testing') {
                    localStorage.removeItem('testingCenterSimulation');
                    window.location.reload();
                  }
                }
              }}
              title="Reset Current Page"
              style={utilityIconButtonStyle}
            >
              <RefreshCw size={18} />
            </button>

            {/* Notification Badge */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                style={utilityIconButtonStyle}
              >
                <Bell size={18} />
                <span style={bellBadgeStyle} />
              </button>
              {showNotifications && (() => {
                const totalRevenue = campaigns.reduce((acc, c) => acc + (c.revenueImpact || 0), 0);
                const waRevenue = campaigns.filter(c => c.channel === 'WhatsApp').reduce((acc, c) => acc + (c.revenueImpact || 0), 0);
                const waPct = totalRevenue > 0 ? ((waRevenue / totalRevenue) * 100).toFixed(0) : 0;
                return (
                  <div style={notificationDropdownStyle} className="glass-panel">
                    <div style={dropdownHeaderStyle}>Notifications</div>
                    <div style={dropdownItemStyle}>
                      <div style={{ fontWeight: 600 }}>📈 ROI Alert</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {waRevenue > 0 
                          ? `WhatsApp attribution represents ${waPct}% (₹${waRevenue.toLocaleString()}) of campaign revenue.` 
                          : "No WhatsApp campaign revenue attributed yet. Trigger one in Campaign Studio."}
                      </div>
                    </div>
                    <div style={dropdownItemStyle}>
                      <div style={{ fontWeight: 600 }}>🤖 Copilot Insight</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {customers.length > 0 
                          ? `Analyzed ${customers.length} customer records. Segment recommendations generated in AI Audience Builder.` 
                          : "Database is currently empty. Seed database in the Testing Center."}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Profile Dropdown */}
            <div>
              <button 
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                style={profileTriggerStyle}
              >
                <div style={avatarHeaderStyle}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
              </button>
              {showProfileMenu && (
                <div style={profileDropdownStyle} className="glass-panel">
                  <div style={dropdownHeaderStyle}>{user.name}</div>
                  <div 
                    onClick={() => { setActivePage('settings'); setShowProfileMenu(false); }} 
                    style={{ ...dropdownItemStyle, cursor: 'pointer' }}
                  >
                    Account Settings
                  </div>
                  <div 
                    onClick={handleLogout} 
                    style={{ ...dropdownItemStyle, color: '#ef4444', cursor: 'pointer', borderTop: '1px solid #f1f5f9' }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* SCROLLABLE CRM PAGES INJECT */}
        <main style={workspaceStyle}>
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

// Shell Layout coordinates
const shellContainerStyle = {
  display: 'flex',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: '#f8fafc',
  color: 'var(--text-primary)'
};

const sidebarStyle = {
  width: '260px',
  backgroundColor: '#ffffff',
  borderRight: '1px solid rgba(15, 23, 42, 0.06)',
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem',
  flexShrink: 0,
  boxSizing: 'border-box'
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '2rem'
};

const logoIconStyle = {
  width: '2rem',
  height: '2rem',
  borderRadius: 'var(--border-radius-sm)',
  backgroundColor: 'var(--blue-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff'
};

const logoTextStyle = {
  fontSize: '1rem',
  fontWeight: 800,
  fontFamily: 'var(--font-family-title)',
  letterSpacing: '-0.02em',
  lineHeight: 1
};

const logoSubTextStyle = {
  fontSize: '0.55rem',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  letterSpacing: '0.1em',
  marginTop: '0.15rem'
};

const navContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  flex: 1
};

const navButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  padding: '0.65rem 0.8rem',
  fontSize: '0.85rem',
  border: 'none',
  borderRadius: 'var(--border-radius-sm)',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box'
};

const highlightBadgeStyle = {
  fontSize: '0.6rem',
  fontWeight: 700,
  backgroundColor: 'var(--blue-primary)',
  color: '#ffffff',
  padding: '0.1rem 0.35rem',
  borderRadius: '4px',
  marginLeft: 'auto'
};

const sidebarFooterStyle = {
  borderTop: '1px solid #f1f5f9',
  paddingTop: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: 'auto'
};

const userCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  fontSize: '0.8rem'
};

const avatarStyle = {
  width: '2rem',
  height: '2rem',
  borderRadius: '50%',
  backgroundColor: 'var(--blue-light)',
  color: 'var(--blue-primary)',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const userNameStyle = {
  fontWeight: 700,
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const userEmailStyle = {
  fontSize: '0.7rem',
  color: 'var(--text-secondary)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const logoutButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-muted)',
  fontSize: '0.8rem',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0 0.5rem',
  fontFamily: 'inherit',
  transition: 'color 0.2s ease',
  alignSelf: 'flex-start'
};

const mainContentStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
  boxSizing: 'border-box'
};

const headerStyle = {
  height: '64px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid rgba(15, 23, 42, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  flexShrink: 0,
  boxSizing: 'border-box'
};

const searchContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  backgroundColor: '#f1f5f9',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '0.4rem 0.8rem',
  width: '320px'
};

const searchInputStyle = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  fontSize: '0.8rem',
  fontFamily: 'inherit',
  width: '100%',
  color: 'var(--text-primary)'
};

const utilityIconButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: '0.25rem',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s'
};

const bellBadgeStyle = {
  position: 'absolute',
  top: '3px',
  right: '3px',
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: '#ef4444'
};

const profileTriggerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0
};

const avatarHeaderStyle = {
  width: '1.8rem',
  height: '1.8rem',
  borderRadius: '50%',
  backgroundColor: '#f1f5f9',
  color: 'var(--text-secondary)',
  fontWeight: 700,
  fontSize: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const workspaceStyle = {
  flex: 1,
  overflowY: 'auto',
  boxSizing: 'border-box'
};

const notificationDropdownStyle = {
  position: 'absolute',
  top: '40px',
  right: '40px',
  width: '280px',
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  boxShadow: 'var(--shadow-lg)',
  zIndex: 100,
  padding: '0.5rem 0',
  display: 'flex',
  flexDirection: 'column'
};

const profileDropdownStyle = {
  position: 'absolute',
  top: '40px',
  right: '0px',
  width: '180px',
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  boxShadow: 'var(--shadow-lg)',
  zIndex: 100,
  padding: '0.5rem 0',
  display: 'flex',
  flexDirection: 'column'
};

const dropdownHeaderStyle = {
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)',
  padding: '0.5rem 1rem',
  borderBottom: '1px solid #f1f5f9'
};

const dropdownItemStyle = {
  padding: '0.6rem 1rem',
  fontSize: '0.8rem',
  color: 'var(--text-primary)',
  lineHeight: 1.3
};
