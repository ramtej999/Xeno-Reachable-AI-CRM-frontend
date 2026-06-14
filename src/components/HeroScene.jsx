import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { User, Layers, TrendingUp, Target, MessageSquare, Percent, Clock, DollarSign, ShieldCheck, Activity } from 'lucide-react';

// Coordinates setup for the Enterprise AI Control Center
const LAYOUT = {
  center: [0, 0, 0],
  
  // Left: Ingesting Customer Intelligence (x = -4.5)
  left: [
    {
      id: 'l1',
      name: 'Customer Data',
      category: 'Ingest',
      label: 'Shopify & POS profiles',
      pos: [-4.5, 1.5, 0],
      icon: <User size={12} style={{ color: 'var(--blue-primary)' }} />,
      color: 'var(--blue-primary)'
    },
    {
      id: 'l2',
      name: 'Audience Segments',
      category: 'Data Pool',
      label: 'Natural Language Cohorts',
      pos: [-4.5, 0.5, 0.2],
      icon: <Layers size={12} style={{ color: 'var(--blue-primary)' }} />,
      color: 'var(--blue-primary)'
    },
    {
      id: 'l3',
      name: 'Purchase Behavior',
      category: 'Event Stream',
      label: 'Recency & Frequency logs',
      pos: [-4.5, -0.5, -0.2],
      icon: <TrendingUp size={12} style={{ color: 'var(--blue-primary)' }} />,
      color: 'var(--blue-primary)'
    },
    {
      id: 'l4',
      name: 'Customer Intel',
      category: 'Scoring',
      label: 'LTV & Propensity Index',
      pos: [-4.5, -1.5, 0],
      icon: <Target size={12} style={{ color: 'var(--blue-primary)' }} />,
      color: 'var(--blue-primary)'
    }
  ],

  // Right: Output Marketing Actions & Forecasts (x = 4.5)
  right: [
    {
      id: 'r1',
      name: 'Best Channel',
      category: 'Decision',
      label: 'WhatsApp & Email routing',
      pos: [4.5, 1.6, 0],
      icon: <MessageSquare size={12} style={{ color: 'var(--blue-primary)' }} />,
      color: 'var(--blue-primary)'
    },
    {
      id: 'r2',
      name: 'Personalized Offer',
      category: 'Decision',
      label: 'Dynamic coupon: VIP15',
      pos: [4.5, 0.8, -0.1],
      icon: <Percent size={12} style={{ color: 'var(--blue-primary)' }} />,
      color: 'var(--blue-primary)'
    },
    {
      id: 'r3',
      name: 'Timing Optimization',
      category: 'Decision',
      label: 'Thursday at 2:00 PM slot',
      pos: [4.5, 0, 0.1],
      icon: <Clock size={12} style={{ color: 'var(--blue-primary)' }} />,
      color: 'var(--blue-primary)'
    },
    {
      id: 'r4',
      name: '+$14,240 Forecast',
      category: 'Revenue Impact',
      label: 'Predicted campaign return',
      pos: [4.5, -0.8, 0],
      icon: <DollarSign size={12} style={{ color: 'var(--green-primary)' }} />,
      color: 'var(--green-primary)'
    },
    {
      id: 'r5',
      name: 'Campaign Strategy',
      category: 'Action',
      label: 'Automated repeat purchaser flow',
      pos: [4.5, -1.6, -0.1],
      icon: <ShieldCheck size={12} style={{ color: 'var(--blue-primary)' }} />,
      color: 'var(--blue-primary)'
    }
  ]
};

// Continuous particles flowing Left ➔ Center Hub, and Center Hub ➔ Right
function FlowParticles({ speedFactor }) {
  const particles = useMemo(() => {
    const list = [];
    const countPerPath = 3;

    // Paths: Left ➔ Center Hub
    LAYOUT.left.forEach((l) => {
      const pStart = new THREE.Vector3(...l.pos);
      const pEnd = new THREE.Vector3(...LAYOUT.center);
      const cp = new THREE.Vector3(
        (pStart.x + pEnd.x) / 2,
        (pStart.y + pEnd.y) / 2 + 0.2,
        (pStart.z + pEnd.z) / 2 + 0.1
      );
      const curve = new THREE.QuadraticBezierCurve3(pStart, cp, pEnd);

      for (let i = 0; i < countPerPath; i++) {
        list.push({
          curve,
          delay: i / countPerPath,
          speed: 0.18,
          color: l.color,
          size: 0.045
        });
      }
    });

    // Paths: Center Hub ➔ Right
    LAYOUT.right.forEach((r) => {
      const pStart = new THREE.Vector3(...LAYOUT.center);
      const pEnd = new THREE.Vector3(...r.pos);
      const cp = new THREE.Vector3(
        (pStart.x + pEnd.x) / 2,
        (pStart.y + pEnd.y) / 2 - 0.2,
        (pStart.z + pEnd.z) / 2 + 0.1
      );
      const curve = new THREE.QuadraticBezierCurve3(pStart, cp, pEnd);

      for (let i = 0; i < countPerPath; i++) {
        list.push({
          curve,
          delay: i / countPerPath,
          speed: 0.2,
          color: r.color,
          size: 0.05
        });
      }
    });

    return list;
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <SingleParticle key={i} particle={p} speedFactor={speedFactor} />
      ))}
    </>
  );
}

function SingleParticle({ particle, speedFactor }) {
  const ref = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const t = ((time * particle.speed * speedFactor + particle.delay) % 1);
    
    if (ref.current) {
      const pos = particle.curve.getPointAt(t);
      ref.current.position.copy(pos);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[particle.size, 8, 8]} />
      <meshBasicMaterial color={particle.color} transparent opacity={0.7} />
    </mesh>
  );
}

// Background pipelines paths
function ConnectionPipelines() {
  const lines = useMemo(() => {
    const list = [];
    
    // Left ➔ Center Hub
    LAYOUT.left.forEach((l) => {
      const pStart = new THREE.Vector3(...l.pos);
      const pEnd = new THREE.Vector3(...LAYOUT.center);
      const cp = new THREE.Vector3(
        (pStart.x + pEnd.x) / 2,
        (pStart.y + pEnd.y) / 2 + 0.2,
        (pStart.z + pEnd.z) / 2 + 0.1
      );
      const curve = new THREE.QuadraticBezierCurve3(pStart, cp, pEnd);
      list.push(curve.getPoints(30));
    });

    // Center Hub ➔ Right
    LAYOUT.right.forEach((r) => {
      const pStart = new THREE.Vector3(...LAYOUT.center);
      const pEnd = new THREE.Vector3(...r.pos);
      const cp = new THREE.Vector3(
        (pStart.x + pEnd.x) / 2,
        (pStart.y + pEnd.y) / 2 - 0.2,
        (pStart.z + pEnd.z) / 2 + 0.1
      );
      const curve = new THREE.QuadraticBezierCurve3(pStart, cp, pEnd);
      list.push(curve.getPoints(30));
    });

    return list;
  }, []);

  return (
    <>
      {lines.map((points, idx) => {
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        // Green lines near predicted output impact
        const strokeColor = idx >= 7 ? '#a7f3d0' : '#cbd5e1';
        return (
          <line key={idx}>
            <primitive object={geom} attach="geometry" />
            <lineBasicMaterial color={strokeColor} linewidth={1} transparent opacity={0.3} />
          </line>
        );
      })}
    </>
  );
}

// Slow camera drift
function SceneEffects() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    camera.position.x = Math.sin(time * 0.04) * 0.12;
    camera.position.y = Math.cos(time * 0.03) * 0.08 + 0.15;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// AI Hub concentric rings
function AIEngineHub({ hovered, setHovered }) {
  const groupRef = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speed = hovered ? 2.5 : 1.0;

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.04 * speed;
    }
    
    if (ring1.current) {
      ring1.current.rotation.z = time * 0.45 * speed;
      ring1.current.rotation.x = time * 0.1;
    }
    if (ring2.current) {
      ring2.current.rotation.z = -time * 0.3 * speed;
      ring2.current.rotation.y = time * 0.15;
    }
    if (ring3.current) {
      ring3.current.rotation.z = time * 0.2 * speed;
      ring3.current.rotation.x = -time * 0.08;
    }
  });

  return (
    <group 
      position={LAYOUT.center} 
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Central Core sphere node */}
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? '#3b82f6' : '#2563eb'} 
          emissive="#2563eb"
          emissiveIntensity={hovered ? 1.0 : 0.4}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Ring 1 */}
      <mesh ref={ring1}>
        <ringGeometry args={[1.35, 1.38, 64]} />
        <meshBasicMaterial color="#3b82f6" side={THREE.DoubleSide} transparent opacity={0.3} wireframe />
      </mesh>

      {/* Ring 2 */}
      <mesh ref={ring2}>
        <ringGeometry args={[1.65, 1.68, 64]} />
        <meshBasicMaterial color="#60a5fa" side={THREE.DoubleSide} transparent opacity={0.2} />
      </mesh>

      {/* Ring 3 */}
      <mesh ref={ring3}>
        <ringGeometry args={[2.0, 2.03, 64]} />
        <meshBasicMaterial color="#93c5fd" side={THREE.DoubleSide} transparent opacity={0.1} wireframe />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  const [aiHovered, setAiHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const speedFactor = aiHovered ? 2.5 : 1.0;

  // Unified Card Styles
  const cardStyle = (id, hoverColor = 'var(--blue-primary)', width = '144px') => {
    const isHovered = hoveredCard === id;
    return {
      backgroundColor: '#ffffff',
      border: isHovered ? `1px solid ${hoverColor}` : '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '8px',
      padding: '0.7rem 0.9rem', // Identical padding
      boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: 'pointer',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      width,
      fontFamily: 'var(--font-family-body)',
      pointerEvents: 'auto',
      userSelect: 'none',
      boxSizing: 'border-box'
    };
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 52 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        
        {/* Conduits & Flowing Particles */}
        <ConnectionPipelines />
        <FlowParticles speedFactor={speedFactor} />
        
        {/* Core Hub concentric processing rings */}
        <AIEngineHub hovered={aiHovered} setHovered={setAiHovered} />

        {/* 1. CENTRAL ENGINE PANEL: REACHABLE AI HUB */}
        <FloatingGroup initialPos={LAYOUT.center} offsetTime={0}>
          <Html distanceFactor={8.5} center>
            <div 
              style={{
                ...cardStyle('center', 'var(--blue-primary)', '210px'),
                border: aiHovered ? '1px solid var(--blue-primary)' : '1px solid rgba(15, 23, 42, 0.1)',
                boxShadow: aiHovered ? 'var(--shadow-xl)' : 'var(--shadow-premium)',
                transform: aiHovered ? 'scale(1.04) translateY(-3px)' : 'none',
                gap: '0.5rem',
                padding: '1rem'
              }}
              onMouseEnter={() => setAiHovered(true)}
              onMouseLeave={() => setAiHovered(false)}
            >
              {/* Hub Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Activity size={12} style={{ color: 'var(--blue-primary)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-family-title)', letterSpacing: '-0.02em' }}>
                    REACHABLE AI HUB
                  </span>
                </div>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--green-primary)',
                  display: 'inline-block',
                  animation: 'pulse-soft 2s infinite'
                }} />
              </div>

              {/* Hub Metrics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.62rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Confidence Score</span>
                  <strong style={{ color: 'var(--blue-primary)' }}>98.4%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Profiles Analyzed</span>
                  <strong style={{ color: 'var(--text-primary)' }}>24,192</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Decisions / min</span>
                  <strong style={{ color: 'var(--text-primary)' }}>8,421</strong>
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--blue-light)',
                color: 'var(--blue-primary)',
                fontSize: '0.55rem',
                fontWeight: 700,
                textAlign: 'center',
                padding: '0.2rem',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Active Processing
              </div>
            </div>
          </Html>
        </FloatingGroup>

        {/* 2. LEFT INPUT CARDS (Ingest) */}
        {LAYOUT.left.map((c, idx) => (
          <FloatingGroup key={c.id} initialPos={c.pos} offsetTime={idx * 1.5}>
            <Html distanceFactor={8.5} center>
              <div 
                style={cardStyle(c.id, c.color)}
                onMouseEnter={() => setHoveredCard(c.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={cardHeaderLabelStyle}>
                  {c.icon} <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.category}</span>
                </div>
                {/* Metric Title (large Outfit) */}
                <div style={cardMetricTitleStyle}>{c.name}</div>
                <div style={cardSubtextStyle}>{c.label}</div>
              </div>
            </Html>
          </FloatingGroup>
        ))}

        {/* 3. RIGHT OUTPUT CARDS (Decisions) */}
        {LAYOUT.right.map((c, idx) => (
          <FloatingGroup key={c.id} initialPos={c.pos} offsetTime={idx * 1.5 + 2}>
            <Html distanceFactor={8.5} center>
              <div 
                style={cardStyle(c.id, c.color)}
                onMouseEnter={() => setHoveredCard(c.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ ...cardHeaderLabelStyle, color: c.color === 'var(--green-primary)' ? 'var(--green-primary)' : 'var(--text-muted)' }}>
                  {c.icon} <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.category}</span>
                </div>
                <div style={{ ...cardMetricTitleStyle, color: c.color === 'var(--green-primary)' ? 'var(--green-primary)' : 'var(--text-primary)' }}>
                  {c.name}
                </div>
                <div style={cardSubtextStyle}>{c.label}</div>
              </div>
            </Html>
          </FloatingGroup>
        ))}

        <SceneEffects />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Visual Pipeline Stage Labels */}
      <div style={{
        position: 'absolute',
        bottom: '0.75rem',
        left: '5%',
        right: '5%',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1.2fr',
        textAlign: 'center',
        fontSize: '0.62rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-secondary)',
        pointerEvents: 'none',
        borderTop: '1px solid rgba(15, 23, 42, 0.05)',
        paddingTop: '0.6rem'
      }}>
        <div>Customer Intelligence Ingest</div>
        <div>AI Decision Engine</div>
        <div>Marketing Actions & Forecasts</div>
      </div>
    </div>
  );
}

// Float drift wrap
function FloatingGroup({ children, initialPos, offsetTime }) {
  const ref = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime() + offsetTime;
    if (ref.current) {
      ref.current.position.y = initialPos[1] + Math.sin(time * 0.8) * 0.05;
      ref.current.position.x = initialPos[0] + Math.cos(time * 0.6) * 0.03;
    }
  });

  return (
    <group ref={ref} position={initialPos}>
      {children}
    </group>
  );
}

const cardHeaderLabelStyle = {
  fontSize: '0.55rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  lineHeight: 1
};

const cardMetricTitleStyle = {
  fontSize: '1.05rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family-title)',
  lineHeight: 1.2,
  marginTop: '0.2rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const cardSubtextStyle = {
  fontSize: '0.62rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.2,
  marginTop: '0.05rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};
