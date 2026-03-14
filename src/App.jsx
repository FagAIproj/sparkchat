import React, { useEffect, useRef, useState } from 'react'
import logo from './logo.png'

// ─── Scroll reveal hook ────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ─── Floating spark particles ──────────────────────────────────
function Sparks() {
  const sparks = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    delay: `${Math.random() * 6}s`,
    duration: `${4 + Math.random() * 5}s`,
    size: `${4 + Math.random() * 8}px`,
    color: ['#FF6B00', '#FFD700', '#FF4500', '#FFA500', '#FFB830'][Math.floor(Math.random() * 5)],
  }))

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {sparks.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          bottom: `${10 + Math.random() * 30}%`,
          left: s.left,
          width: s.size,
          height: s.size,
          borderRadius: '50%',
          background: s.color,
          boxShadow: `0 0 8px ${s.color}`,
          animation: `sparkFloat ${s.duration} ${s.delay} infinite ease-out`,
        }} />
      ))}
    </div>
  )
}

// ─── Nav ───────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px',
      height: '68px',
      background: scrolled ? 'rgba(12, 10, 9, 0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,107,0,0.1)' : '1px solid transparent',
      transition: 'all 0.4s ease',
    }}>
      {/* Logo + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={logo} alt="SparkChat" style={{ width: 36, height: 36 }} />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '20px',
          background: 'linear-gradient(90deg, #FF6B00, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.3px',
        }}>SparkChat</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {['Features', 'How it works', 'Download'].map(item => (
          <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.2px',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
          >{item}</a>
        ))}
        <CtaButton small>Get the App</CtaButton>
      </div>
    </nav>
  )
}

// ─── CTA Button ────────────────────────────────────────────────
function CtaButton({ children, small, outline }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: small ? '9px 20px' : '15px 36px',
        fontSize: small ? '13px' : '16px',
        fontWeight: 700,
        fontFamily: 'var(--font-body)',
        border: outline ? '1.5px solid rgba(255,107,0,0.5)' : 'none',
        borderRadius: '100px',
        cursor: 'pointer',
        letterSpacing: '0.2px',
        transition: 'all 0.25s ease',
        background: outline
          ? hovered ? 'rgba(255,107,0,0.12)' : 'transparent'
          : hovered
            ? 'linear-gradient(135deg, #ff8c00, #FF4500)'
            : 'linear-gradient(135deg, #FF6B00, #FF4500)',
        color: outline ? 'var(--spark-1)' : '#fff',
        boxShadow: !outline && hovered ? '0 8px 30px rgba(255,107,0,0.45)' : !outline ? '0 4px 20px rgba(255,107,0,0.3)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >{children}</button>
  )
}

// ─── Hero ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '120px 24px 80px',
      overflow: 'hidden',
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '900px', height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(255,107,0,0.12) 0%, rgba(255,69,0,0.06) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,107,0,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,107,0,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />

      <Sparks />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px',
          borderRadius: '100px',
          background: 'rgba(255,107,0,0.1)',
          border: '1px solid rgba(255,107,0,0.25)',
          marginBottom: '32px',
          animation: 'fadeIn 0.8s ease both',
        }}>
          <span style={{ fontSize: '14px' }}>✦</span>
          <span style={{ color: 'var(--spark-3)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>
            Now available on iOS & Android
          </span>
        </div>

        {/* Logo */}
        <div style={{
          marginBottom: '28px',
          animation: 'scaleIn 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
        }}>
          <img src={logo} alt="SparkChat" style={{
            width: '120px',
            height: '120px',
            filter: 'drop-shadow(0 0 40px rgba(255,107,0,0.6)) drop-shadow(0 0 80px rgba(255,107,0,0.25))',
            animation: 'floatY 5s ease-in-out infinite',
          }} />
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(52px, 9vw, 96px)',
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: '-3px',
          marginBottom: '24px',
          animation: 'fadeInUp 0.9s ease 0.2s both',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #FFF5EC 0%, #FFD09A 60%, #FF6B00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Spark</span>
          <span style={{ color: 'var(--text-primary)' }}>Chat</span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(17px, 2.5vw, 22px)',
          color: 'var(--text-secondary)',
          maxWidth: '540px',
          lineHeight: 1.65,
          margin: '0 auto 40px',
          fontWeight: 300,
          animation: 'fadeInUp 0.9s ease 0.35s both',
        }}>
          Messaging that <em style={{ color: 'var(--spark-3)', fontStyle: 'normal', fontWeight: 500 }}>ignites</em> connections.
          Real-time chat with friends, built on trust, speed and stunning simplicity.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap',
          animation: 'fadeInUp 0.9s ease 0.5s both',
        }}>
          <CtaButton>Download Free</CtaButton>
          <CtaButton outline>See How It Works</CtaButton>
        </div>

        {/* Social proof */}
        <p style={{
          color: 'var(--text-muted)', fontSize: '13px', marginTop: '28px',
          animation: 'fadeIn 1s ease 0.8s both',
        }}>
          Join <span style={{ color: 'var(--spark-3)', fontWeight: 600 }}>50,000+</span> people already chatting
        </p>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px',
        background: 'linear-gradient(transparent, var(--bg))',
        pointerEvents: 'none',
      }} />
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────
const features = [
  {
    icon: '⚡',
    title: 'Real-Time Messages',
    desc: 'Powered by Supabase Realtime. Messages arrive the instant they are sent — no polling, no delays.',
    accent: '#FF6B00',
  },
  {
    icon: '🔒',
    title: 'Private by Design',
    desc: 'Row-level security ensures your conversations are completely invisible to anyone but you.',
    accent: '#FFD700',
  },
  {
    icon: '✨',
    title: 'Friend Codes',
    desc: 'Add friends using a unique 6-character spark code. No phone number required.',
    accent: '#FF4500',
  },
  {
    icon: '📱',
    title: 'iOS & Android',
    desc: 'Built with React Native and Expo. One codebase, two platforms, flawless experience.',
    accent: '#FFA500',
  },
  {
    icon: '🌐',
    title: 'Sync Everywhere',
    desc: 'Log in from any device and your messages are instantly there. Seamless multi-device support.',
    accent: '#FF6B00',
  },
  {
    icon: '👁',
    title: 'Read Receipts',
    desc: 'Know when messages are sent, delivered and read with elegant status indicators.',
    accent: '#FFD700',
  },
]

function Features() {
  return (
    <section id="features" style={{ padding: '100px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="reveal" style={{ textAlign: 'center', marginBottom: '64px' }}>
        <p style={{ color: 'var(--spark-1)', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
          ✦ Features
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 5vw, 56px)',
          fontWeight: 800,
          letterSpacing: '-1.5px',
          lineHeight: 1.1,
          color: 'var(--text-primary)',
        }}>
          Everything you need.<br />
          <span style={{ color: 'var(--spark-3)' }}>Nothing you don't.</span>
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
      }}>
        {features.map((f, i) => (
          <FeatureCard key={i} feature={f} delay={i * 80} />
        ))}
      </div>
    </section>
  )
}

function FeatureCard({ feature, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="reveal"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transitionDelay: `${delay}ms`,
        padding: '28px',
        background: hovered ? 'var(--bg-card-2)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? feature.accent + '30' : 'var(--border)'}`,
        borderRadius: '20px',
        cursor: 'default',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? `0 8px 40px ${feature.accent}15` : 'none',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div style={{
        width: '52px', height: '52px',
        borderRadius: '14px',
        background: `${feature.accent}18`,
        border: `1px solid ${feature.accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', marginBottom: '18px',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? `0 0 20px ${feature.accent}25` : 'none',
      }}>
        {feature.icon}
      </div>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '19px', fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '8px',
        letterSpacing: '-0.3px',
      }}>{feature.title}</h3>
      <p style={{
        fontSize: '14px', lineHeight: 1.65,
        color: 'var(--text-secondary)',
        fontWeight: 300,
      }}>{feature.desc}</p>
    </div>
  )
}

// ─── How It Works ──────────────────────────────────────────────
const steps = [
  { num: '01', title: 'Create your account', desc: 'Sign up with email or Google in seconds. Your profile and unique Spark Code are ready instantly.', icon: '🔑' },
  { num: '02', title: 'Share your Spark Code', desc: 'Give your 6-character code to friends. They add you, you accept — and the conversation starts.', icon: '🔥' },
  { num: '03', title: 'Start chatting', desc: 'Real-time messages, read receipts, online presence. Everything synced across all your devices.', icon: '💬' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" style={{
      padding: '100px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(255,107,0,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ color: 'var(--spark-1)', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            ✦ How It Works
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}>
            Up and chatting<br />
            <span style={{ color: 'var(--spark-3)' }}>in 60 seconds.</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {steps.map((step, i) => (
            <StepCard key={i} step={step} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({ step, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="reveal"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transitionDelay: `${delay}ms`,
        display: 'flex', alignItems: 'center', gap: '28px',
        padding: '28px 32px',
        background: hovered ? 'var(--bg-card-2)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.25)' : 'var(--border)'}`,
        borderRadius: '20px',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
        boxShadow: hovered ? '0 8px 40px rgba(255,107,0,0.1)' : 'none',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '13px', fontWeight: 800,
        color: 'var(--spark-1)',
        letterSpacing: '1px',
        minWidth: '32px',
        opacity: 0.7,
      }}>{step.num}</div>

      <div style={{
        width: '56px', height: '56px', borderRadius: '16px',
        background: 'rgba(255,107,0,0.1)',
        border: '1px solid rgba(255,107,0,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '26px', flexShrink: 0,
      }}>{step.icon}</div>

      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px', fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '6px',
          letterSpacing: '-0.3px',
        }}>{step.title}</h3>
        <p style={{
          fontSize: '14px', color: 'var(--text-secondary)',
          lineHeight: 1.6, fontWeight: 300,
        }}>{step.desc}</p>
      </div>

      <div style={{
        fontSize: '20px', color: 'var(--spark-1)',
        opacity: hovered ? 1 : 0.2,
        transition: 'opacity 0.3s',
        flexShrink: 0,
      }}>→</div>
    </div>
  )
}

// ─── Download CTA ──────────────────────────────────────────────
function Download() {
  return (
    <section id="download" style={{
      padding: '100px 24px 120px',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div className="reveal" style={{
        maxWidth: '780px',
        width: '100%',
        background: 'var(--bg-card)',
        border: '1px solid rgba(255,107,0,0.2)',
        borderRadius: '28px',
        padding: 'clamp(40px, 6vw, 72px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 80px rgba(255,107,0,0.08)',
      }}>
        {/* Inner glow */}
        <div style={{
          position: 'absolute', top: '-80px', left: '50%',
          transform: 'translateX(-50%)',
          width: '400px', height: '250px',
          background: 'radial-gradient(ellipse, rgba(255,107,0,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Rotating ring */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '240px', height: '240px',
          border: '1px solid rgba(255,107,0,0.1)',
          borderRadius: '50%',
          animation: 'rotateSlow 30s linear infinite',
        }} />

        <img src={logo} alt="SparkChat" style={{
          width: '88px', height: '88px', marginBottom: '24px',
          filter: 'drop-shadow(0 0 30px rgba(255,107,0,0.5))',
          position: 'relative', zIndex: 1,
        }} />

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 800,
          letterSpacing: '-1.5px',
          lineHeight: 1.1,
          marginBottom: '16px',
          position: 'relative', zIndex: 1,
        }}>
          Ready to <span style={{
            background: 'linear-gradient(90deg, #FF6B00, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>start sparking?</span>
        </h2>

        <p style={{
          fontSize: '16px', color: 'var(--text-secondary)',
          maxWidth: '420px', margin: '0 auto 36px',
          lineHeight: 1.7, fontWeight: 300,
          position: 'relative', zIndex: 1,
        }}>
          Free forever. No ads. No nonsense. Just you and the people who matter.
        </p>

        <div style={{
          display: 'flex', gap: '14px',
          justifyContent: 'center', flexWrap: 'wrap',
          position: 'relative', zIndex: 1,
        }}>
          <StoreButton platform="ios" />
          <StoreButton platform="android" />
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '24px', position: 'relative', zIndex: 1 }}>
          Available for iOS 15+ and Android 8+
        </p>
      </div>
    </section>
  )
}

function StoreButton({ platform }) {
  const [hovered, setHovered] = useState(false)
  const isIos = platform === 'ios'

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '13px 24px',
        background: hovered ? 'var(--surface)' : 'var(--bg-card-2)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.35)' : 'var(--border)'}`,
        borderRadius: '14px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <span style={{ fontSize: '28px' }}>{isIos ? '🍎' : '🤖'}</span>
      <div style={{ textAlign: 'left' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.5px' }}>
          {isIos ? 'Download on the' : 'Get it on'}
        </div>
        <div style={{
          color: 'var(--text-primary)', fontSize: '16px',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          letterSpacing: '-0.3px',
        }}>
          {isIos ? 'App Store' : 'Google Play'}
        </div>
      </div>
    </button>
  )
}

// ─── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '40px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={logo} alt="SparkChat" style={{ width: 28, height: 28 }} />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800, fontSize: '16px',
          background: 'linear-gradient(90deg, #FF6B00, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>SparkChat</span>
      </div>

      <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
        {['Privacy', 'Terms', 'Support', 'GitHub'].map(l => (
          <a key={l} href="#" style={{
            color: 'var(--text-muted)', fontSize: '13px',
            textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = 'var(--spark-1)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >{l}</a>
        ))}
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
        © {new Date().getFullYear()} SparkChat. Made with 🔥
      </p>
    </footer>
  )
}

// ─── App ───────────────────────────────────────────────────────
export default function App() {
  useReveal()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Download />
      <Footer />
    </div>
  )
}
