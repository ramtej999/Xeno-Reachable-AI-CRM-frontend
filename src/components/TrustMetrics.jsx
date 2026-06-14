import React, { useEffect, useState, useRef } from 'react';

// Viewport-aware counter hook
function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out function
      const easeOutQuad = (t) => t * (2 - t);
      const currentVal = Math.floor(easeOutQuad(progress) * end);
      
      setCount(currentVal);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return (
    <span ref={elementRef} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function TrustMetrics() {
  return (
    <section id="metrics" style={{
      padding: '7rem 0',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid rgba(15, 23, 42, 0.05)',
      position: 'relative'
    }}>
      <div className="container-custom">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--blue-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '0.75rem'
          }}>
            Social Proof & Scalability
          </p>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}>
            Trusted by Modern Retail Brands
          </h2>
        </div>

        {/* Retail Logo Grid - Elegant SVGs resembling luxury/modern retail brands */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.8,
          marginBottom: '6rem'
        }}>
          {logos.map((logo, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'center',
              filter: 'grayscale(100%) opacity(0.4)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'grayscale(0%) opacity(0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'grayscale(100%) opacity(0.4)';
            }}
            >
              {logo.svg}
            </div>
          ))}
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          textAlign: 'center'
        }}>
          {/* Card 1 */}
          <div className="metric-card" style={metricCardStyle}>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-family-title)',
              color: 'var(--blue-primary)',
              lineHeight: 1,
              marginBottom: '0.5rem'
            }}>
              <AnimatedCounter end={5000} suffix="+" />
            </div>
            <div style={metricLabelStyle}>Customers Managed</div>
            <p style={metricSubStyle}>Retail brands leveraging Reachable database profiles.</p>
          </div>

          {/* Card 2 */}
          <div className="metric-card" style={metricCardStyle}>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-family-title)',
              color: 'var(--green-primary)',
              lineHeight: 1,
              marginBottom: '0.5rem'
            }}>
              <AnimatedCounter end={95} suffix="%" />
            </div>
            <div style={metricLabelStyle}>Campaign Delivery Rate</div>
            <p style={metricSubStyle}>Reliable cross-channel messaging (SMS, WhatsApp, Email).</p>
          </div>

          {/* Card 3 */}
          <div className="metric-card" style={metricCardStyle}>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-family-title)',
              color: 'var(--blue-primary)',
              lineHeight: 1,
              marginBottom: '0.5rem'
            }}>
              <AnimatedCounter end={73} suffix="%" />
            </div>
            <div style={metricLabelStyle}>Average Open Rate</div>
            <p style={metricSubStyle}>Highly personalized AI messaging drives record engagement.</p>
          </div>

          {/* Card 4 */}
          <div className="metric-card" style={metricCardStyle}>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-family-title)',
              color: 'var(--green-primary)',
              lineHeight: 1,
              marginBottom: '0.5rem'
            }}>
              <AnimatedCounter end={40} suffix="%" />
            </div>
            <div style={metricLabelStyle}>Increase in Repeat Revenue</div>
            <p style={metricSubStyle}>AI-powered segments boost customer return rates.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const metricCardStyle = {
  background: '#ffffff',
  padding: '2.5rem 2rem',
  borderRadius: 'var(--border-radius-md)',
  boxShadow: 'var(--shadow-sm)',
  border: '1px solid rgba(15, 23, 42, 0.03)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'default'
};

const metricLabelStyle = {
  fontSize: '1.05rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: '0.5rem'
};

const metricSubStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4
};

// SVG retail logo data
const logos = [
  {
    name: 'VALENTINE',
    svg: (
      <svg width="120" height="35" viewBox="0 0 120 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="25" fill="#0f172a" fontFamily="Georgia, serif" fontSize="20" fontWeight="bold" letterSpacing="0.1em">VALENTINE</text>
      </svg>
    )
  },
  {
    name: 'MODERN RETAIL',
    svg: (
      <svg width="120" height="35" viewBox="0 0 120 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="25" fill="#0f172a" fontFamily="Helvetica, Arial, sans-serif" fontSize="16" fontWeight="800" letterSpacing="0.15em">M O D E R N</text>
      </svg>
    )
  },
  {
    name: 'E L I X I R',
    svg: (
      <svg width="120" height="35" viewBox="0 0 120 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="25" fill="#0f172a" fontFamily="Cinzel, serif, Times New Roman" fontSize="19" fontWeight="300" letterSpacing="0.2em">ELIXIR</text>
      </svg>
    )
  },
  {
    name: 'AURUM',
    svg: (
      <svg width="120" height="35" viewBox="0 0 120 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="25" fill="#0f172a" fontFamily="Impact, sans-serif" fontSize="22" fontWeight="500" letterSpacing="0.05em">A U R U M</text>
      </svg>
    )
  },
  {
    name: 'V O G U E',
    svg: (
      <svg width="120" height="35" viewBox="0 0 120 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="25" fill="#0f172a" fontFamily="Didot, Bodoni MT, serif" fontSize="24" fontWeight="bold" fontStyle="italic" letterSpacing="0.1em">VOGUE</text>
      </svg>
    )
  }
];
