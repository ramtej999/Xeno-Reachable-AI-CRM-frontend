import React from 'react';
import { Cpu, Database, Send, Server, Terminal, Code2 } from 'lucide-react';

export default function Architecture() {
  return (
    <section id="architecture" style={{
      padding: '8rem 0',
      backgroundColor: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }} className="dot-grid">
      
      {/* Subtle Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.02) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
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
            Infrastructure
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-title)',
            lineHeight: 1.2
          }}>
            Built for Scale. Engineered for Intelligence.
          </h2>
          <p style={{
            marginTop: '1rem',
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            maxWidth: '520px',
            margin: '1rem auto 0'
          }}>
            An investor-grade stack optimized for asynchronous campaign delivery, vector embeddings, and real-time analytics.
          </p>
        </div>

        {/* Architecture Flow Diagram Wrapper */}
        <div className="arch-diagram-wrapper" style={{
          width: '100%',
          maxWidth: '850px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.6)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid rgba(15, 23, 42, 0.05)',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-premium)',
          position: 'relative'
        }}>
          {/* Node SVG Connections Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none'
          }} className="arch-svg-container">
            <svg width="100%" height="100%" viewBox="0 0 800 460" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              {/* Paths definitions */}
              
              {/* Frontend <-> Backend */}
              <path d="M 400 90 L 400 170" stroke="#cbd5e1" strokeWidth="2" />
              <path d="M 400 90 L 400 170" stroke="var(--blue-primary)" strokeWidth="2" strokeDasharray="8 8" className="animated-flow-line" />

              {/* Backend <-> Groq AI */}
              <path d="M 460 200 H 600" stroke="#cbd5e1" strokeWidth="2" />
              <path d="M 460 200 H 600" stroke="var(--blue-primary)" strokeWidth="2" strokeDasharray="8 8" className="animated-flow-line" />

              {/* Backend <-> PostgreSQL */}
              <path d="M 340 200 H 200" stroke="#cbd5e1" strokeWidth="2" />
              <path d="M 340 200 H 200" stroke="var(--blue-primary)" strokeWidth="2" strokeDasharray="8 8" className="animated-flow-line" style={{ animationDirection: 'reverse' }} />

              {/* Backend <-> Channel Service */}
              <path d="M 400 230 V 350" stroke="#cbd5e1" strokeWidth="2" />
              <path d="M 400 230 V 350" stroke="var(--green-primary)" strokeWidth="2" strokeDasharray="8 8" className="animated-flow-line" />
            </svg>
          </div>

          {/* Interactive HTML Nodes Container */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            height: '400px',
            width: '100%'
          }} className="arch-nodes-grid">
            
            {/* 1. React Frontend */}
            <div style={{ ...nodeStyle, top: '20px', left: '50%', transform: 'translateX(-50%)' }} className="arch-node">
              <div style={nodeHeaderStyle('var(--blue-primary)')}>
                <Code2 size={16} /> React Frontend
              </div>
              <div style={nodeBodyStyle}>
                <div style={nodeTextLineStyle}>Vite Single Page App</div>
                <div style={nodeSublineStyle}>Framer Motion & charts</div>
              </div>
            </div>

            {/* 2. FastAPI Backend */}
            <div style={{ ...nodeStyle, top: '160px', left: '50%', transform: 'translateX(-50%)' }} className="arch-node">
              <div style={nodeHeaderStyle('var(--blue-primary)')}>
                <Server size={16} /> FastAPI Core
              </div>
              <div style={nodeBodyStyle}>
                <div style={nodeTextLineStyle}>Python Async Backend</div>
                <div style={nodeSublineStyle}>REST API & WebSockets</div>
              </div>
            </div>

            {/* 3. PostgreSQL Database */}
            <div style={{ ...nodeStyle, top: '160px', left: '50px' }} className="arch-node">
              <div style={nodeHeaderStyle('var(--text-primary)')}>
                <Database size={16} /> PostgreSQL
              </div>
              <div style={nodeBodyStyle}>
                <div style={nodeTextLineStyle}>Data & Profile Store</div>
                <div style={nodeSublineStyle}>Vector extension indexed</div>
              </div>
            </div>

            {/* 4. Groq AI Service */}
            <div style={{ ...nodeStyle, top: '160px', right: '50px' }} className="arch-node">
              <div style={nodeHeaderStyle('var(--blue-primary)')}>
                <Cpu size={16} /> Groq LLM
              </div>
              <div style={nodeBodyStyle}>
                <div style={nodeTextLineStyle}>AI Decision Engine</div>
                <div style={nodeSublineStyle}>NLP Segmentation & Copy</div>
              </div>
            </div>

            {/* 5. Channel Service */}
            <div style={{ ...nodeStyle, bottom: '20px', left: '50%', transform: 'translateX(-50%)' }} className="arch-node">
              <div style={nodeHeaderStyle('var(--green-primary)')}>
                <Send size={16} /> Channel Router
              </div>
              <div style={nodeBodyStyle}>
                <div style={nodeTextLineStyle}>WhatsApp / SMS / Email</div>
                <div style={nodeSublineStyle}>Celery workers queue</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        /* Responsive tweaks for architecture layout */
        @media (max-width: 768px) {
          .arch-svg-container {
            display: none !important;
          }
          .arch-nodes-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 1.5rem !important;
            height: auto !important;
          }
          .arch-node {
            position: static !important;
            transform: none !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 320px !important;
          }
          .arch-diagram-wrapper {
            padding: 1.5rem 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}

const nodeStyle = {
  position: 'absolute',
  width: '180px',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  borderRadius: 'var(--border-radius-md)',
  boxShadow: 'var(--shadow-md)',
  overflow: 'hidden',
  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
  cursor: 'default',
  zIndex: 10
};

// Hover scaling of architecture nodes
Object.defineProperty(nodeStyle, ':hover', {
  value: {
    transform: 'scale(1.03)',
    borderColor: 'var(--blue-primary)',
    boxShadow: 'var(--shadow-lg)'
  }
});

const nodeHeaderStyle = (color) => ({
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
  padding: '0.4rem 0.8rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: color,
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem'
});

const nodeBodyStyle = {
  padding: '0.6rem 0.8rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem'
};

const nodeTextLineStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-primary)'
};

const nodeSublineStyle = {
  fontSize: '0.65rem',
  color: 'var(--text-secondary)'
};
