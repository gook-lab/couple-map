// helpers.jsx — shared frame components & icon glyphs (line-art style).

const W = 402;
const H = 874;

function StatusBar() {
  return (
    <div className="status">
      <span>9:41</span>
      <span style={{ display:'flex', gap:5, alignItems:'center', fontSize: 12 }}>
        <span>●●●</span>
        <span style={{ fontSize: 14 }}>◗</span>
        <span style={{ display:'inline-block', width: 22, height: 11, border:'1.4px solid currentColor', borderRadius: 3, position:'relative' }}>
          <span style={{ position:'absolute', inset: 1.5, background:'currentColor', width: '70%', borderRadius: 1 }} />
        </span>
      </span>
    </div>
  );
}

function HomeIndicator() {
  return <div className="home-ind" />;
}

function Frame({ dir, children, bgOverride, scroll = true }) {
  return (
    <div className={'frame dir-' + dir} style={bgOverride ? { background: bgOverride } : undefined}>
      <StatusBar />
      {scroll ? <div className="scroll">{children}</div> : children}
      <HomeIndicator />
    </div>
  );
}

// ── Line-art icons (no SVG paths). Pure CSS shapes. Inherit color from currentColor ──
function I({ name, size = 22 }) {
  const s = size;
  const stroke = 1.6;
  const c = 'currentColor';
  if (name === 'home') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: 2, top: s*0.4, width: s-4, height: s*0.55, border: `${stroke}px solid ${c}`, borderRadius: 2 }} />
      <span style={{ position:'absolute', left: s*0.5 - (s*0.45), top: 1, width: s*0.9, height: s*0.5, borderTop: `${stroke}px solid ${c}`, borderLeft: `${stroke}px solid ${c}`, transform: `rotate(45deg)`, transformOrigin: 'top left' }} />
    </span>;
  }
  if (name === 'map') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: 2, top: 4, width: s-4, height: s-8, border: `${stroke}px solid ${c}`, borderRadius: 2 }} />
      <span style={{ position:'absolute', left: s*0.33, top: 4, height: s-8, borderLeft: `${stroke}px solid ${c}` }} />
      <span style={{ position:'absolute', left: s*0.66, top: 4, height: s-8, borderLeft: `${stroke}px solid ${c}` }} />
    </span>;
  }
  if (name === 'plus') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: 2, top: s/2 - stroke/2, width: s-4, height: stroke, background: c }} />
      <span style={{ position:'absolute', top: 2, left: s/2 - stroke/2, height: s-4, width: stroke, background: c }} />
    </span>;
  }
  if (name === 'heart') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: 0, top: 2, width: s*0.55, height: s*0.55, background: c, borderRadius: '50%' }} />
      <span style={{ position:'absolute', right: 0, top: 2, width: s*0.55, height: s*0.55, background: c, borderRadius: '50%' }} />
      <span style={{ position:'absolute', left: '50%', top: '55%', width: s*0.7, height: s*0.7, background: c, transform: 'translateX(-50%) rotate(45deg)', transformOrigin: 'top center' }} />
      <span style={{ position:'absolute', inset: 0, width: s, height: s, clipPath: `polygon(50% 100%, 0 35%, 50% 0, 100% 35%)`}} />
    </span>;
  }
  if (name === 'calendar') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: 2, top: 4, width: s-4, height: s-6, border: `${stroke}px solid ${c}`, borderRadius: 3 }} />
      <span style={{ position:'absolute', left: 2, top: 8, width: s-4, borderTop: `${stroke}px solid ${c}` }} />
      <span style={{ position:'absolute', left: 5, top: 1, height: 6, width: stroke, background: c }} />
      <span style={{ position:'absolute', right: 5, top: 1, height: 6, width: stroke, background: c }} />
    </span>;
  }
  if (name === 'user') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: '50%', top: 2, width: s*0.45, height: s*0.45, border: `${stroke}px solid ${c}`, borderRadius: '50%', transform: 'translateX(-50%)' }} />
      <span style={{ position:'absolute', left: 1, bottom: 2, width: s-2, height: s*0.4, borderTop: `${stroke}px solid ${c}`, borderLeft: `${stroke}px solid ${c}`, borderRight: `${stroke}px solid ${c}`, borderTopLeftRadius: s, borderTopRightRadius: s }} />
    </span>;
  }
  if (name === 'pin') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: '50%', top: 2, width: s*0.7, height: s*0.7, background: c, borderRadius: '50% 50% 50% 0', transform: 'translateX(-50%) rotate(-45deg)' }} />
      <span style={{ position:'absolute', left: '50%', top: s*0.32, width: 5, height: 5, background: 'var(--paper)', borderRadius: '50%', transform: 'translateX(-50%)' }} />
    </span>;
  }
  if (name === 'chev') {
    return <span style={{ display:'inline-block', width: s*0.4, height: s*0.4, borderTop: `${stroke}px solid ${c}`, borderRight: `${stroke}px solid ${c}`, transform: 'rotate(45deg)' }} />;
  }
  if (name === 'chev-l') {
    return <span style={{ display:'inline-block', width: s*0.4, height: s*0.4, borderTop: `${stroke}px solid ${c}`, borderLeft: `${stroke}px solid ${c}`, transform: 'rotate(-45deg)' }} />;
  }
  if (name === 'search') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: 2, top: 2, width: s*0.65, height: s*0.65, border: `${stroke}px solid ${c}`, borderRadius: '50%' }} />
      <span style={{ position:'absolute', right: 2, bottom: 2, width: s*0.32, height: stroke, background: c, transform: 'rotate(45deg)', transformOrigin: 'right' }} />
    </span>;
  }
  if (name === 'bell') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: '50%', top: 2, width: s*0.7, height: s*0.7, border: `${stroke}px solid ${c}`, borderRadius: '50% 50% 8px 8px', transform: 'translateX(-50%)' }} />
      <span style={{ position:'absolute', left: '50%', bottom: 1, width: 6, height: 4, background: c, borderRadius: '0 0 4px 4px', transform: 'translateX(-50%)' }} />
    </span>;
  }
  if (name === 'camera') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: 1, top: 5, right: 1, height: s*0.7, border: `${stroke}px solid ${c}`, borderRadius: 3 }} />
      <span style={{ position:'absolute', left: '50%', top: '55%', width: s*0.35, height: s*0.35, border: `${stroke}px solid ${c}`, borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
    </span>;
  }
  if (name === 'wifi-off') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: '50%', bottom: 4, width: 6, height: 6, background: c, borderRadius: '50%', transform: 'translateX(-50%)' }} />
      <span style={{ position:'absolute', left: 2, top: '50%', width: s-4, height: stroke, background: c, transform: 'rotate(45deg)' }} />
    </span>;
  }
  if (name === 'lock') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: 2, bottom: 2, right: 2, height: s*0.55, border: `${stroke}px solid ${c}`, borderRadius: 3 }} />
      <span style={{ position:'absolute', left: '50%', top: 1, width: s*0.55, height: s*0.45, border: `${stroke}px solid ${c}`, borderBottom: 'none', borderRadius: '50% 50% 0 0', transform: 'translateX(-50%)' }} />
    </span>;
  }
  if (name === 'arrow-r') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: 2, top: '50%', right: 2, height: stroke, background: c, transform: 'translateY(-50%)' }} />
      <span style={{ position:'absolute', right: 2, top: '50%', width: s*0.35, height: s*0.35, borderTop: `${stroke}px solid ${c}`, borderRight: `${stroke}px solid ${c}`, transform: 'translateY(-50%) rotate(45deg)' }} />
    </span>;
  }
  if (name === 'check') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: '20%', top: '50%', width: s*0.3, height: stroke, background: c, transform: 'rotate(45deg)', transformOrigin: 'left' }} />
      <span style={{ position:'absolute', left: '38%', top: '70%', width: s*0.55, height: stroke, background: c, transform: 'rotate(-45deg)', transformOrigin: 'left' }} />
    </span>;
  }
  if (name === 'x') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: 2, top: '50%', right: 2, height: stroke, background: c, transform: 'rotate(45deg)' }} />
      <span style={{ position:'absolute', left: 2, top: '50%', right: 2, height: stroke, background: c, transform: 'rotate(-45deg)' }} />
    </span>;
  }
  if (name === 'mic') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: '50%', top: 2, width: s*0.4, height: s*0.55, background: c, borderRadius: 999, transform: 'translateX(-50%)' }} />
      <span style={{ position:'absolute', left: '50%', bottom: 4, width: s*0.7, height: s*0.4, borderLeft: `${stroke}px solid ${c}`, borderRight: `${stroke}px solid ${c}`, borderBottom: `${stroke}px solid ${c}`, borderRadius: '0 0 999px 999px', transform: 'translateX(-50%)' }} />
    </span>;
  }
  if (name === 'gift') {
    return <span style={{ display:'inline-block', width: s, height: s, position:'relative' }}>
      <span style={{ position:'absolute', left: 1, top: s*0.32, right: 1, bottom: 1, border: `${stroke}px solid ${c}`, borderRadius: 2 }} />
      <span style={{ position:'absolute', left: 1, top: s*0.18, right: 1, height: s*0.18, border: `${stroke}px solid ${c}`, borderRadius: 2 }} />
      <span style={{ position:'absolute', left: '50%', top: s*0.18, bottom: 1, width: stroke, background: c, transform: 'translateX(-50%)' }} />
    </span>;
  }
  return null;
}

// ── Top bar with title + optional back/right action ──
function TopBar({ title, dir, back, right, transparent }) {
  return (
    <div style={{
      position:'absolute', top: 54, left: 0, right: 0, height: 52, padding: '0 16px',
      display: 'flex', alignItems:'center', justifyContent: 'space-between',
      background: transparent ? 'transparent' : 'var(--bg)',
      zIndex: 20,
    }}>
      <div style={{ width: 36, display:'flex', alignItems:'center' }}>
        {back && <span style={{ color: 'var(--ink)', display:'inline-flex' }}><I name="chev-l" size={20}/></span>}
      </div>
      <div className="h3" style={{ fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
      <div style={{ width: 36, display:'flex', justifyContent:'flex-end', color: 'var(--ink)' }}>{right}</div>
    </div>
  );
}

// ── Bottom tab bar ──
function TabBar({ active = 'home', dir }) {
  const tabs = [
    { id: 'home', label: '오늘', icon: 'home' },
    { id: 'map', label: '지도', icon: 'map' },
    { id: 'add', label: '', icon: 'plus' },
    { id: 'timeline', label: '추억', icon: 'heart' },
    { id: 'me', label: 'My', icon: 'user' },
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => {
        const isAdd = t.id === 'add';
        if (isAdd) {
          return (
            <div key={t.id} style={{ display:'flex', justifyContent:'center', paddingTop: 0 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--accent)', color: 'white', display:'flex', alignItems:'center', justifyContent:'center', marginTop: -10, boxShadow: dir === 'c' ? '0 3px 0 rgba(43,27,62,0.18)' : '0 4px 12px rgba(0,0,0,0.15)', border: dir === 'c' ? '1.5px solid var(--ink)' : 'none' }}>
                <I name="plus" size={18}/>
              </div>
            </div>
          );
        }
        return (
          <div key={t.id} className={'tab' + (active === t.id ? ' active' : '')}>
            <I name={t.icon} size={20} />
            <div>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Cute avatar circles ──
function Avatar({ size = 36, color = '#FFB89B', initial = 'J', dir = 'a', src }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color,
      display: 'flex', alignItems:'center', justifyContent:'center',
      color: 'white', fontWeight: 800, fontSize: size * 0.42,
      border: dir === 'c' ? '1.5px solid var(--ink)' : 'none',
      fontFamily: 'var(--font)',
      flex: 'none',
    }}>{initial}</div>
  );
}

// expose to global scope for cross-file babel
Object.assign(window, { Frame, StatusBar, HomeIndicator, TabBar, TopBar, Avatar, I, FRAME_W: W, FRAME_H: H });
