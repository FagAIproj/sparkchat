import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../logo.png'
import { useAuth } from '../context/AuthContext'

/* ─── Floating sparks ─────────────────────────────────────── */
function Sparks() {
  const sparks = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    bottom: `${5 + Math.random() * 35}%`,
    delay: `${(Math.random() * 5).toFixed(1)}s`,
    dur:   `${(4 + Math.random() * 4).toFixed(1)}s`,
    size:  `${4 + Math.random() * 7}px`,
    color: ['#FF6B00','#FFD700','#FF4500','#FFA500','#FFB830'][i % 5],
  }))
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      <style>{`@keyframes sparkUp{0%{transform:translateY(0) scale(1);opacity:.7}50%{transform:translateY(-60px) translateX(12px) scale(1.2);opacity:1}100%{transform:translateY(-130px) translateX(-8px) scale(.3);opacity:0}}`}</style>
      {sparks.map(s => (
        <div key={s.id} style={{
          position:'absolute', bottom:s.bottom, left:s.left,
          width:s.size, height:s.size, borderRadius:'50%',
          background:s.color, boxShadow:`0 0 6px ${s.color}`,
          animation:`sparkUp ${s.dur} ${s.delay} infinite ease-out`,
        }}/>
      ))}
    </div>
  )
}

/* ─── Nav ─────────────────────────────────────────────────── */
function Nav({ onLogin }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      height:64, display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 clamp(20px,5vw,60px)',
      background: scrolled ? 'rgba(12,10,9,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(18px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,107,0,0.1)' : '1px solid transparent',
      transition:'all .35s ease',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <img src={logo} alt="SparkChat" style={{ width:34, height:34 }}/>
        <span style={{
          fontFamily:'var(--font-h)', fontWeight:800, fontSize:19,
          background:'linear-gradient(90deg,#FF6B00,#FFD700)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        }}>SparkChat</span>
      </div>
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        {['Features','How it works'].map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`}
            style={{ color:'var(--text-2)', textDecoration:'none', fontSize:14, fontWeight:500, transition:'color .2s' }}
            onMouseEnter={e=>e.target.style.color='var(--text)'}
            onMouseLeave={e=>e.target.style.color='var(--text-2)'}>{l}</a>
        ))}
        <NavCta onClick={onLogin} small>Sign In</NavCta>
      </div>
    </nav>
  )
}

function NavCta({ children, onClick, small }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        padding: small ? '8px 18px' : '13px 32px',
        fontSize: small ? 13 : 15, fontWeight:700,
        fontFamily:'var(--font-b)', border:'none', borderRadius:'var(--r-full)',
        cursor:'pointer', transition:'all .22s',
        background: h ? 'linear-gradient(135deg,#ff8c00,#e03b00)' : 'linear-gradient(135deg,#FF6B00,#FF4500)',
        color:'#fff',
        boxShadow: h ? '0 8px 28px rgba(255,107,0,.45)' : '0 3px 14px rgba(255,107,0,.3)',
        transform: h ? 'translateY(-1px)' : 'none',
      }}>{children}</button>
  )
}

function OutlineCta({ children, onClick }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        padding:'13px 32px', fontSize:15, fontWeight:700,
        fontFamily:'var(--font-b)', borderRadius:'var(--r-full)',
        cursor:'pointer', transition:'all .22s',
        background: h ? 'rgba(255,107,0,0.1)' : 'transparent',
        color:'var(--spark)', border:'1.5px solid rgba(255,107,0,.4)',
        transform: h ? 'translateY(-1px)' : 'none',
      }}>{children}</button>
  )
}

/* ─── Features data ───────────────────────────────────────── */
const FEATURES = [
  { icon:'⚡', title:'Real-Time Chat',     desc:'Messages arrive instantly via Supabase Realtime — no refresh needed.',     accent:'#FF6B00' },
  { icon:'🔒', title:'Private & Secure',   desc:'Row-level security means only you and your friend can read your messages.', accent:'#FFD700' },
  { icon:'✨', title:'Spark Codes',        desc:'Add friends with a unique 6-char code. No phone number ever required.',      accent:'#FF4500' },
  { icon:'✓✓', title:'Read Receipts',      desc:'See exactly when messages are sent, delivered and read.',                    accent:'#FFA500' },
  { icon:'🌐', title:'Multi-Device Sync',  desc:'Log in from any browser — all your messages are instantly there.',           accent:'#FF6B00' },
  { icon:'👤', title:'Custom Profiles',    desc:'Username, avatar and your personal Spark Code — all yours.',                 accent:'#FFD700' },
]

function FeatureCard({ f, i }) {
  const [h, setH] = useState(false)
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        padding:'26px 24px', background: h ? 'var(--panel-2)' : 'var(--panel)',
        border:`1px solid ${h ? f.accent+'30' : 'var(--border)'}`,
        borderRadius:20, transition:'all .28s',
        transform: h ? 'translateY(-4px)' : 'none',
        boxShadow: h ? `0 12px 40px ${f.accent}12` : 'none',
        animationDelay:`${i*60}ms`,
      }}>
      <div style={{
        width:50, height:50, borderRadius:14,
        background:`${f.accent}18`, border:`1px solid ${f.accent}28`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:22, marginBottom:16,
        boxShadow: h ? `0 0 18px ${f.accent}22` : 'none', transition:'box-shadow .28s',
      }}>{f.icon}</div>
      <h3 style={{ fontFamily:'var(--font-h)', fontSize:17, fontWeight:700, marginBottom:8, letterSpacing:'-.2px' }}>{f.title}</h3>
      <p style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.65, fontWeight:300 }}>{f.desc}</p>
    </div>
  )
}

/* ─── Steps ───────────────────────────────────────────────── */
const STEPS = [
  { n:'01', icon:'🔑', title:'Create your account',   desc:'Sign up with email or Google in seconds. Your profile and Spark Code are ready instantly.' },
  { n:'02', icon:'🔥', title:'Share your Spark Code', desc:'Give your 6-character code to friends. They add you, you accept — done.' },
  { n:'03', icon:'💬', title:'Start chatting',         desc:'Real-time messages, read receipts and online status. Synced across all your devices.' },
]

/* ─── Landing page ────────────────────────────────────────── */
export default function LandingPage() {
  const navigate  = useNavigate()
  const { session } = useAuth()

  // Already logged in → go straight to app
  // Auto-redirect removed — let user choose to enter app

  const goAuth = () => navigate('/auth')

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', overflowX:'hidden' }}>
      <Nav onLogin={goAuth}/>

      {/* ── Hero ── */}
      <section style={{
        minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'120px 24px 80px', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:600, background:'radial-gradient(ellipse, rgba(255,107,0,0.1) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,107,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,0,0.03) 1px,transparent 1px)', backgroundSize:'60px 60px', maskImage:'radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)', pointerEvents:'none' }}/>
        <Sparks/>

        <div style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:720 }}>
          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 18px', borderRadius:'var(--r-full)', background:'rgba(255,107,0,0.1)', border:'1px solid rgba(255,107,0,0.22)', marginBottom:32, animation:'fadeIn .8s ease both' }}>
            <span style={{ fontSize:13 }}>✦</span>
            <span style={{ color:'var(--spark-3)', fontSize:13, fontWeight:600, letterSpacing:'.4px' }}>No download needed — runs in your browser</span>
          </div>

          {/* Logo */}
          <div style={{ marginBottom:24, animation:'scaleIn .9s cubic-bezier(.34,1.56,.64,1) .1s both' }}>
            <img src={logo} alt="SparkChat" style={{ width:110, height:110, filter:'drop-shadow(0 0 36px rgba(255,107,0,.55))', animation:'floatY 5s ease-in-out infinite' }}/>
            <style>{`@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
          </div>

          <h1 style={{
            fontFamily:'var(--font-h)', fontSize:'clamp(52px,10vw,96px)',
            fontWeight:800, lineHeight:1.0, letterSpacing:'-3px', marginBottom:22,
            animation:'fadeInUp .9s ease .2s both',
          }}>
            <span style={{ background:'linear-gradient(135deg,#FFF5EC 0%,#FFD09A 55%,#FF6B00 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Spark</span>
            <span>Chat</span>
          </h1>

          <p style={{ fontSize:'clamp(17px,2.4vw,21px)', color:'var(--text-2)', maxWidth:520, margin:'0 auto 40px', lineHeight:1.65, fontWeight:300, animation:'fadeInUp .9s ease .32s both' }}>
            Real-time messaging that <em style={{ color:'var(--spark-3)', fontStyle:'normal', fontWeight:500 }}>ignites</em> connections.
            Chat with friends instantly — right in your browser.
          </p>

          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', animation:'fadeInUp .9s ease .44s both' }}>
            <NavCta onClick={goAuth}>Get Started Free</NavCta>
            <OutlineCta onClick={goAuth}>Sign In</OutlineCta>
          </div>

          <p style={{ color:'var(--text-3)', fontSize:13, marginTop:24, animation:'fadeIn 1s ease .7s both' }}>
            Free forever · No ads · No downloads
          </p>
        </div>

        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:180, background:'linear-gradient(transparent,var(--bg))', pointerEvents:'none' }}/>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding:'90px 24px', maxWidth:1080, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <p style={{ color:'var(--spark)', fontSize:12, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:10 }}>✦ Features</p>
          <h2 style={{ fontFamily:'var(--font-h)', fontSize:'clamp(34px,5vw,54px)', fontWeight:800, letterSpacing:'-1.5px', lineHeight:1.1 }}>
            Everything you need.<br/><span style={{ color:'var(--spark-3)' }}>Nothing you don't.</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:14 }}>
          {FEATURES.map((f, i) => <FeatureCard key={i} f={f} i={i}/>)}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding:'80px 24px', maxWidth:820, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <p style={{ color:'var(--spark)', fontSize:12, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:10 }}>✦ How It Works</p>
          <h2 style={{ fontFamily:'var(--font-h)', fontSize:'clamp(34px,5vw,54px)', fontWeight:800, letterSpacing:'-1.5px', lineHeight:1.1 }}>
            Up and chatting<br/><span style={{ color:'var(--spark-3)' }}>in 60 seconds.</span>
          </h2>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {STEPS.map((s, i) => <StepCard key={i} s={s}/>)}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:'80px 24px 100px', display:'flex', justifyContent:'center' }}>
        <div style={{
          maxWidth:700, width:'100%', textAlign:'center',
          background:'var(--panel)', border:'1px solid rgba(255,107,0,0.2)',
          borderRadius:28, padding:'clamp(36px,6vw,68px)',
          position:'relative', overflow:'hidden',
          boxShadow:'0 0 80px rgba(255,107,0,0.07)',
        }}>
          <div style={{ position:'absolute', top:'-70px', left:'50%', transform:'translateX(-50%)', width:400, height:250, background:'radial-gradient(ellipse,rgba(255,107,0,.13) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <img src={logo} alt="" style={{ width:76, height:76, marginBottom:20, filter:'drop-shadow(0 0 24px rgba(255,107,0,.45))', position:'relative', zIndex:1 }}/>
          <h2 style={{ fontFamily:'var(--font-h)', fontSize:'clamp(28px,5vw,48px)', fontWeight:800, letterSpacing:'-1.2px', lineHeight:1.1, marginBottom:14, position:'relative', zIndex:1 }}>
            Ready to <span style={{ background:'linear-gradient(90deg,#FF6B00,#FFD700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>start sparking?</span>
          </h2>
          <p style={{ fontSize:15, color:'var(--text-2)', maxWidth:400, margin:'0 auto 32px', lineHeight:1.7, fontWeight:300, position:'relative', zIndex:1 }}>
            Free forever. No ads. No nonsense. Just you and the people who matter.
          </p>
          <div style={{ position:'relative', zIndex:1 }}>
            <NavCta onClick={goAuth}>Open SparkChat</NavCta>
          </div>
          <p style={{ color:'var(--text-3)', fontSize:12, marginTop:20, position:'relative', zIndex:1 }}>No download · Works in any browser</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop:'1px solid var(--border)', padding:'28px clamp(20px,5vw,60px)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src={logo} alt="" style={{ width:26, height:26 }}/>
          <span style={{ fontFamily:'var(--font-h)', fontWeight:800, fontSize:15, background:'linear-gradient(90deg,#FF6B00,#FFD700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SparkChat</span>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          {['Privacy','Terms','Support'].map(l => (
            <a key={l} href="#" style={{ color:'var(--text-3)', fontSize:13, textDecoration:'none', transition:'color .2s' }}
              onMouseEnter={e=>e.target.style.color='var(--spark)'}
              onMouseLeave={e=>e.target.style.color='var(--text-3)'}>{l}</a>
          ))}
        </div>
        <p style={{ color:'var(--text-3)', fontSize:12 }}>© {new Date().getFullYear()} SparkChat · Made with 🔥</p>
      </footer>
    </div>
  )
}

function StepCard({ s }) {
  const [h, setH] = useState(false)
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'flex', alignItems:'center', gap:20, padding:'22px 26px',
        background: h ? 'var(--panel-2)' : 'var(--panel)',
        border:`1px solid ${h ? 'rgba(255,107,0,.22)' : 'var(--border)'}`,
        borderRadius:18, transition:'all .28s',
        transform: h ? 'translateX(6px)' : 'none',
        boxShadow: h ? '0 8px 32px rgba(255,107,0,.08)' : 'none',
      }}>
      <span style={{ fontFamily:'var(--font-h)', fontSize:11, fontWeight:800, color:'var(--spark)', letterSpacing:1, opacity:.6, minWidth:22 }}>{s.n}</span>
      <div style={{ width:52, height:52, borderRadius:14, background:'rgba(255,107,0,.1)', border:'1px solid rgba(255,107,0,.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{s.icon}</div>
      <div style={{ flex:1 }}>
        <h3 style={{ fontFamily:'var(--font-h)', fontSize:18, fontWeight:700, marginBottom:5, letterSpacing:'-.2px' }}>{s.title}</h3>
        <p style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.6, fontWeight:300 }}>{s.desc}</p>
      </div>
      <span style={{ color:'var(--spark)', fontSize:18, opacity: h ? 1 : .2, transition:'opacity .28s', flexShrink:0 }}>→</span>
    </div>
  )
}
