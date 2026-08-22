// screens-c.jsx — Direction C: Memory Pocket
// Aesthetic: chunky borders, multi-pastel sticker-style, badges, drop shadows, gamified.

const dirC = 'c';

function C_Onboarding() {
  return (
    <Frame dir={dirC}>
      <div style={{ padding: '32px 24px 24px', height: '100%', display:'flex', flexDirection:'column' }}>
        {/* progress bubbles */}
        <div style={{ display:'flex', gap: 8, alignItems:'center' }}>
          {[1,1,0].map((v,i)=>(
            <div key={i} className="badge-c" style={{ background: v?'var(--c-mint)':'var(--paper)' }}>{i+1}</div>
          ))}
          <div className="meta" style={{ marginLeft: 'auto' }}>2/3 단계</div>
        </div>

        <div className="h1" style={{ marginTop: 28 }}>둘이 모이면<br/>지도가 색칠돼요 🎨</div>

        {/* preview map */}
        <div className="card" style={{ marginTop: 22, padding: 18, position:'relative', height: 180, overflow:'hidden' }}>
          <div style={{ position:'absolute', left: 30, top: 26, width: 60, height: 50, background:'var(--c-peach)', borderRadius: 14, border:'1.5px solid var(--ink)' }}/>
          <div style={{ position:'absolute', left: 100, top: 50, width: 70, height: 60, background:'var(--c-mint)', borderRadius: 14, border:'1.5px solid var(--ink)' }}/>
          <div style={{ position:'absolute', left: 180, top: 30, width: 60, height: 50, background:'var(--c-butter)', borderRadius: 14, border:'1.5px solid var(--ink)' }}/>
          <div style={{ position:'absolute', left: 80, top: 110, width: 100, height: 50, background:'var(--c-sky)', borderRadius: 14, border:'1.5px solid var(--ink)' }}/>
          <div style={{ position:'absolute', right: 14, top: 14 }}>
            <div className="sticker" style={{ background:'var(--c-butter)', border:'1.5px solid var(--ink)' }}>+12 곳!</div>
          </div>
        </div>

        {/* code input chunky */}
        <div style={{ marginTop: 22, padding: 18, borderRadius: 22, background:'var(--paper)', border: '1.5px solid var(--ink)', boxShadow: 'var(--shadow-chunk)' }}>
          <div className="tiny">파트너 코드 입력</div>
          <div style={{ display:'flex', gap: 6, marginTop: 10, justifyContent:'space-between' }}>
            {['J','M','7','3','_','_'].map((c,i)=>(
              <div key={i} style={{ width: 42, height: 52, borderRadius: 12, background: c==='_'?'var(--paper-2)':'var(--c-butter)', border: '1.5px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 22, fontWeight: 800, color: c==='_'?'var(--ink-3)':'var(--ink)' }}>{c==='_'?'':c}</div>
            ))}
          </div>
        </div>

        {/* my code */}
        <div style={{ marginTop: 14, padding: 14, borderRadius: 22, background:'var(--c-mint)', border:'1.5px solid var(--ink)', boxShadow: 'var(--shadow-chunk)', display:'flex', alignItems:'center', gap: 12 }}>
          <div className="sticker" style={{ background:'white', border:'1.5px solid var(--ink)' }}>MY CODE</div>
          <div style={{ flex: 1, fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>HX9-K2P</div>
          <button className="btn" style={{ padding: '8px 12px', fontSize: 12 }}>공유</button>
        </div>

        <div style={{ flex: 1 }} />
        <button className="btn btn-accent" style={{ width: '100%' }}>연결하고 시작!</button>
      </div>
    </Frame>
  );
}

function C_Today() {
  return (
    <Frame dir={dirC}>
      <div style={{ padding: '14px 18px 90px' }}>
        {/* top with sticker greeting */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div className="sticker" style={{ background:'var(--c-butter)', border:'1.5px solid var(--ink)' }}>5월 15일 · 금</div>
            <div className="h1" style={{ marginTop: 8 }}>안녕 준오!</div>
          </div>
          <div style={{ position:'relative' }}>
            <div className="icon-sq"><I name="bell" size={18}/></div>
            <div style={{ position:'absolute', top:-4, right:-4 }} className="badge-c">3</div>
          </div>
        </div>

        {/* couple chunky card */}
        <div style={{ marginTop: 16, padding: 18, borderRadius: 22, background:'var(--c-peach)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <Avatar dir={dirC} initial="J" color="#FF7A6B" size={48}/>
            <div style={{ fontSize: 26, fontWeight: 800 }}>+</div>
            <Avatar dir={dirC} initial="M" color="#C6A8E5" size={48}/>
          </div>
          <div className="h2" style={{ marginTop: 12 }}>준오 ❤︎ 미루</div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 6 }}>
            <div style={{ fontSize: 38, fontWeight: 800, color:'var(--ink)' }}>423</div>
            <div className="body">일째 함께</div>
          </div>
          <div className="sticker" style={{ position:'absolute', right: 14, top: 14, background:'var(--c-butter)', border:'1.5px solid var(--ink)' }}>🔥 STREAK</div>
        </div>

        {/* level up card */}
        <div style={{ marginTop: 12, padding: 14, borderRadius: 18, background:'var(--c-mint)', border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background:'white', border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 18 }}>🏅</div>
          <div style={{ flex: 1 }}>
            <div className="meta">레벨 7 · 추억 수집가</div>
            <div style={{ height: 8, background:'rgba(255,255,255,0.6)', borderRadius: 999, overflow:'hidden', border:'1px solid var(--ink)', marginTop: 4 }}>
              <div style={{ width:'62%', height:'100%', background:'var(--ink)' }}/>
            </div>
          </div>
          <div className="meta" style={{ fontWeight: 700 }}>13/20</div>
        </div>

        {/* quick action grid - colorful */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 14 }}>
          {[
            ['오늘의 질문','💬','var(--c-sky)'],
            ['데이트 룰렛','🎲','var(--c-butter)'],
            ['오늘의 챌린지','🎯','var(--c-pink)'],
            ['편지 쓰기','✉️','var(--c-lilac)'],
          ].map(([l,e,c],i)=>(
            <div key={i} style={{ padding: 14, borderRadius: 16, background: c, border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', position:'relative' }}>
              <div style={{ fontSize: 26 }}>{e}</div>
              <div className="h3" style={{ marginTop: 6 }}>{l}</div>
              {i === 0 && <div className="sticker" style={{ position:'absolute', right:6, top:6, background:'white', border:'1.5px solid var(--ink)', fontSize: 9 }}>NEW</div>}
            </div>
          ))}
        </div>

        <div className="tiny" style={{ marginTop: 22 }}>같은 날의 추억</div>
        <div style={{ marginTop: 8, padding: 14, borderRadius: 16, background:'var(--paper)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', display:'flex', gap: 12 }}>
          <div className="ph" style={{ width: 70, height: 70, borderRadius: 12 }}>1년 전</div>
          <div style={{ flex: 1 }}>
            <div className="h3">작년 오늘 한강에서</div>
            <div className="meta">2023년 5월 15일</div>
            <div style={{ display:'flex', gap: 4, marginTop: 6 }}>
              <div className="sticker" style={{ background:'var(--c-butter)', border:'1.5px solid var(--ink)' }}>#한강</div>
              <div className="sticker" style={{ background:'var(--c-mint)', border:'1.5px solid var(--ink)' }}>#벚꽃</div>
            </div>
          </div>
        </div>
      </div>
      <TabBar active="home" dir={dirC} />
    </Frame>
  );
}

function C_Map() {
  return (
    <Frame dir={dirC}>
      <div style={{ padding: '14px 18px 90px' }}>
        <div className="h1">스티커북 🗺️</div>
        <div className="meta" style={{ marginTop: 2 }}>9 / 17 지역 색칠 완료!</div>

        {/* country tabs */}
        <div style={{ display:'flex', gap: 8, marginTop: 12, overflowX:'auto' }}>
          {[['🇰🇷','한국',1],['🇯🇵','일본',0],['🇺🇸','미국',0],['🌍','세계',0]].map(([f,n,active],i)=>(
            <div key={i} style={{ padding: '8px 14px', borderRadius: 999, border:'1.5px solid var(--ink)', background: active?'var(--c-butter)':'var(--paper)', boxShadow: active?'var(--shadow-chunk)':'none', display:'flex', gap: 6, alignItems:'center', fontWeight: 700, flex:'none' }}>
              <span style={{ fontSize: 16 }}>{f}</span>
              <span style={{ fontSize: 13 }}>{n}</span>
            </div>
          ))}
        </div>

        {/* map */}
        <div style={{ marginTop: 14, padding: 16, height: 360, borderRadius: 22, background:'var(--paper)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', position:'relative', overflow:'hidden' }}>
          {/* colorful regions */}
          {[
            ['var(--c-peach)', 80, 30, 60, 70, '서울'],
            ['var(--c-mint)', 150, 24, 50, 50, '강원'],
            ['var(--c-sky)', 100, 110, 110, 80, '경기'],
            ['var(--paper-2)', 160, 200, 70, 60, ''],
            ['var(--c-butter)', 90, 230, 90, 70, '경상'],
            ['var(--c-lilac)', 200, 280, 60, 40, '제주'],
          ].map(([c,l,t,w,h,n],i)=>(
            <div key={i} style={{ position:'absolute', left: l, top: t, width: w, height: h, background: c, borderRadius: 16, border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 11, fontWeight: 700, color:'var(--ink)' }}>{n}</div>
          ))}
          {/* stickers floating */}
          <div className="sticker" style={{ position:'absolute', right: 16, top: 16, background:'white', border:'1.5px solid var(--ink)', fontSize: 11 }}>✓ 9곳</div>
          <div style={{ position:'absolute', right: 18, top: 50, fontSize: 32, transform:'rotate(8deg)' }}>📍</div>
        </div>

        {/* legend stickers */}
        <div style={{ display:'flex', gap: 6, marginTop: 12, flexWrap:'wrap' }}>
          {[['var(--c-peach)','다녀옴'],['var(--c-mint)','별 5개'],['var(--c-sky)','계획중'],['var(--paper-2)','미방문']].map(([c,n],i)=>(
            <div key={i} style={{ padding: '4px 8px', borderRadius: 999, background:'var(--paper)', border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', gap: 4, fontSize: 11 }}>
              <div style={{ width: 10, height: 10, background: c, borderRadius: 3, border:'1px solid var(--ink)' }}/>
              <span style={{ fontWeight: 700 }}>{n}</span>
            </div>
          ))}
        </div>

        {/* recent regions */}
        <div className="tiny" style={{ marginTop: 18 }}>최근 색칠한 곳</div>
        <div style={{ display:'flex', gap: 10, marginTop: 8, overflowX:'auto' }}>
          {[['제주','15곳','var(--c-lilac)'],['부산','7곳','var(--c-peach)'],['속초','4곳','var(--c-mint)']].map(([n,c,bg],i)=>(
            <div key={i} style={{ flex:'none', width: 110, padding: 12, borderRadius: 16, background: bg, border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)' }}>
              <div className="h3">{n}</div>
              <div className="meta">{c}</div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="map" dir={dirC} />
    </Frame>
  );
}

function C_AddPlace() {
  return (
    <Frame dir={dirC}>
      <TopBar dir={dirC} title="새 핀 꽂기" back right={<I name="x" size={18}/>} />
      <div style={{ padding: '106px 18px 22px' }}>
        {/* place pill */}
        <div style={{ padding: 14, borderRadius: 18, background:'var(--c-peach)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background:'white', border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 22 }}>🏔️</div>
          <div style={{ flex: 1 }}>
            <div className="h3">한라산국립공원</div>
            <div className="meta">제주 · 서귀포</div>
          </div>
        </div>

        {/* mood sticker picker */}
        <div className="tiny" style={{ marginTop: 18 }}>오늘의 기분</div>
        <div style={{ display:'flex', gap: 8, marginTop: 8, flexWrap:'wrap' }}>
          {[['🥰','감동','var(--c-pink)'],['😎','쿨한','var(--c-sky)'],['🤩','짜릿','var(--c-butter)'],['😋','맛집','var(--c-peach)'],['🥶','추웠어','var(--paper-2)']].map(([e,n,c],i)=>(
            <div key={i} style={{ padding: '8px 12px', borderRadius: 999, border:'1.5px solid var(--ink)', background: i===0 ? c : 'var(--paper)', boxShadow: i===0 ? 'var(--shadow-chunk)' : 'none', display:'flex', alignItems:'center', gap: 4, fontWeight: 700, fontSize: 13 }}>
              <span style={{ fontSize: 16 }}>{e}</span><span>{n}</span>
            </div>
          ))}
        </div>

        {/* photos */}
        <div className="tiny" style={{ marginTop: 18 }}>사진 · 3장</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
          {[1,2,3].map(i=>(
            <div key={i} style={{ aspectRatio:'1', borderRadius: 14, background:'var(--paper-2)', border:'1.5px solid var(--ink)', position:'relative' }}>
              <div style={{ position:'absolute', right:4, top: 4 }}>
                <div className="badge-c" style={{ background:'white', minWidth: 22, height: 22, fontSize: 11 }}>{i}</div>
              </div>
            </div>
          ))}
          <div style={{ aspectRatio:'1', borderRadius: 14, background:'var(--paper)', border:'1.5px dashed var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)', fontWeight: 800 }}>+</div>
          <div style={{ aspectRatio:'1', borderRadius: 14, background:'var(--paper)', border:'1.5px dashed var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)', fontSize: 18 }}><I name="mic" size={18}/></div>
        </div>

        {/* memo */}
        <div className="tiny" style={{ marginTop: 18 }}>한 줄</div>
        <div style={{ marginTop: 8, padding: 14, borderRadius: 14, background:'var(--paper)', border:'1.5px solid var(--ink)' }}>
          <div className="body">눈 쌓인 한라산. 너랑 같이 정상까지! ⛰️</div>
        </div>

        {/* badges to earn */}
        <div className="tiny" style={{ marginTop: 18 }}>이번에 받게 될 뱃지</div>
        <div style={{ display:'flex', gap: 8, marginTop: 8 }}>
          <div style={{ padding: '10px 12px', borderRadius: 14, background:'var(--c-mint)', border:'1.5px solid var(--ink)', display:'flex', gap: 8, alignItems:'center', boxShadow:'var(--shadow-chunk)' }}>
            <span style={{ fontSize: 18 }}>⛰️</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 12 }}>등반가</div>
              <div className="meta" style={{ fontSize: 10 }}>첫 산 정상!</div>
            </div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 14, background:'var(--c-butter)', border:'1.5px solid var(--ink)', display:'flex', gap: 8, alignItems:'center', boxShadow:'var(--shadow-chunk)' }}>
            <span style={{ fontSize: 18 }}>🏝️</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 12 }}>제주 정복</div>
              <div className="meta" style={{ fontSize: 10 }}>15곳 달성</div>
            </div>
          </div>
        </div>

        <button className="btn btn-accent" style={{ width: '100%', marginTop: 22 }}>핀 꽂기 ✨</button>
      </div>
    </Frame>
  );
}

function C_Timeline() {
  return (
    <Frame dir={dirC}>
      <div style={{ padding: '14px 18px 90px' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div className="h1">추억 보관함</div>
          <div className="sticker" style={{ background:'var(--c-butter)', border:'1.5px solid var(--ink)' }}>87개</div>
        </div>

        {/* view tabs */}
        <div style={{ display:'flex', gap: 6, marginTop: 14 }}>
          {[['📚','일기'],['🎨','폴라로이드'],['📍','지도']].map(([e,n],i)=>(
            <div key={i} style={{ flex: 1, padding: '10px 0', textAlign:'center', borderRadius: 14, background: i===1?'var(--ink)':'var(--paper)', color: i===1?'var(--paper)':'var(--ink)', border:'1.5px solid var(--ink)', boxShadow: i===1?'var(--shadow-chunk)':'none', fontWeight: 700, fontSize: 13 }}>{e} {n}</div>
          ))}
        </div>

        {/* polaroid grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginTop: 18 }}>
          {[
            { t:'벚꽃 한강', d:'5/15', tape: 'var(--c-pink)', rot: -1.5 },
            { t:'한라산 정상', d:'5/10', tape: 'var(--c-butter)', rot: 1.5 },
            { t:'케이크 망함', d:'5/4', tape: 'var(--c-mint)', rot: 1 },
            { t:'속초 새벽', d:'4/28', tape: 'var(--c-sky)', rot: -1 },
            { t:'경복궁 한복', d:'4/14', tape: 'var(--c-lilac)', rot: 0.5 },
            { t:'성수동 카페', d:'4/8', tape: 'var(--c-peach)', rot: -0.8 },
          ].map((m,i)=>(
            <div key={i} style={{ padding: 8, paddingBottom: 22, borderRadius: 6, background:'var(--paper)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', transform: `rotate(${m.rot}deg)`, position:'relative' }}>
              <div style={{ position:'absolute', left: '50%', top: -10, width: 40, height: 16, background: m.tape, border:'1.5px solid var(--ink)', transform: 'translateX(-50%) rotate(-3deg)' }}/>
              <div className="ph" style={{ height: 100, borderRadius: 4 }}>{m.t}</div>
              <div style={{ marginTop: 6, fontFamily: 'var(--font)', fontWeight: 700, fontSize: 12 }}>{m.t}</div>
              <div className="meta">{m.d}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop: 20 }}>
          <button className="btn btn-ghost" style={{ padding: '10px 16px' }}>더 보기 ↓</button>
        </div>
      </div>
      <TabBar active="timeline" dir={dirC} />
    </Frame>
  );
}

function C_MemoryDetail() {
  return (
    <Frame dir={dirC}>
      <TopBar dir={dirC} title="" back right={<div style={{ display:'flex', gap: 8 }}><I name="heart" size={20}/></div>} transparent />
      {/* polaroid hero */}
      <div style={{ position:'absolute', top: 110, left: 18, right: 18, padding: 10, paddingBottom: 32, background:'var(--paper)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', borderRadius: 8, transform: 'rotate(-1.5deg)', zIndex: 5 }}>
        <div style={{ position:'absolute', left: '50%', top: -14, width: 56, height: 22, background:'var(--c-butter)', border:'1.5px solid var(--ink)', transform:'translateX(-50%) rotate(-4deg)' }}/>
        <div className="ph" style={{ height: 240, borderRadius: 4 }}>한라산 정상 · 2024.05.10</div>
        <div className="script" style={{ marginTop: 8, fontFamily:'var(--font)', fontWeight: 700, fontSize: 14 }}>한라산 정상에서</div>
      </div>

      <div style={{ position:'absolute', top: 450, left: 0, right: 0, bottom: 0, background:'var(--bg)', padding: '22px 18px', overflow:'auto' }}>
        {/* stickers row */}
        <div style={{ display:'flex', gap: 6, flexWrap:'wrap' }}>
          {[['🥰','감동','var(--c-pink)'],['⛰️','등산','var(--c-mint)'],['❄️','겨울','var(--c-sky)'],['💪','정복','var(--c-butter)']].map(([e,n,c],i)=>(
            <div key={i} style={{ padding: '6px 12px', borderRadius: 999, background: c, border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', gap: 4, fontWeight: 700, fontSize: 12 }}>
              <span>{e}</span><span>{n}</span>
            </div>
          ))}
        </div>

        <div className="h2" style={{ marginTop: 14 }}>한라산 정상에서</div>
        <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 6 }}>
          <Avatar dir={dirC} initial="J" color="#FF7A6B" size={26}/>
          <Avatar dir={dirC} initial="M" color="#C6A8E5" size={26}/>
          <div className="meta">준오 & 미루 · 제주</div>
        </div>

        <div className="body" style={{ marginTop: 14, lineHeight: 1.7 }}>
          새벽 4시 출발. 어리목 코스 8시간. 미루가 자꾸 미끄러져서 손 꼭 잡고 올라갔어. 정상 12시 32분 도착, 라면 끓여 먹음.
        </div>

        {/* unlocked badge */}
        <div style={{ marginTop: 18, padding: 14, borderRadius: 18, background:'var(--c-mint)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', display:'flex', alignItems:'center', gap: 12 }}>
          <div style={{ fontSize: 32 }}>🏅</div>
          <div style={{ flex: 1 }}>
            <div className="tiny">새 뱃지 잠금 해제!</div>
            <div className="h3" style={{ marginTop: 2 }}>등반가 · Lv.1</div>
          </div>
          <div className="sticker" style={{ background:'var(--ink)', color:'var(--paper)', border:'1.5px solid var(--ink)' }}>NEW</div>
        </div>
      </div>
    </Frame>
  );
}

function C_Calendar() {
  const days = Array.from({length: 35}, (_,i) => i);
  const today = 16;
  const evt = { 4: ['🎂','var(--c-pink)'], 10: ['⛰️','var(--c-mint)'], 22: ['💕','var(--c-peach)'], 25: ['🎉','var(--c-butter)'] };
  return (
    <Frame dir={dirC}>
      <div style={{ padding: '14px 18px 90px' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div>
            <div className="meta">2024</div>
            <div className="h1">5월</div>
          </div>
          <div className="sticker" style={{ background:'var(--c-butter)', border:'1.5px solid var(--ink)' }}>D-DAY 3개</div>
        </div>

        {/* calendar */}
        <div style={{ marginTop: 14, padding: 14, borderRadius: 22, background:'var(--paper)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
            {['일','월','화','수','목','금','토'].map((d,i)=>(
              <div key={i} className="tiny" style={{ textAlign:'center', fontWeight: 800, color: i===0?'var(--accent)':'var(--ink-2)' }}>{d}</div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap: 4 }}>
            {days.map(d => {
              const dn = d - 2;
              const isToday = dn === today;
              const e = evt[dn];
              const valid = dn >= 1 && dn <= 31;
              return (
                <div key={d} style={{ aspectRatio:'1', borderRadius: 10, background: e ? e[1] : (isToday?'var(--ink)':'transparent'), border: e || isToday ? '1.5px solid var(--ink)' : 'none', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', color: isToday?'var(--paper)':'var(--ink)', fontWeight: 700, fontSize: 13 }}>
                  {valid?dn:''}
                  {e && <div style={{ position:'absolute', bottom: 2, fontSize: 10 }}>{e[0]}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* anniversary cards in pastels */}
        <div className="tiny" style={{ marginTop: 22 }}>다가오는 기념일</div>
        {[
          { e:'💕', n:'만난 지 500일', d:'D-77', c:'var(--c-pink)' },
          { e:'🎂', n:'미루 생일', d:'D-10', c:'var(--c-butter)' },
          { e:'✈️', n:'제주 1주년', d:'D-7', c:'var(--c-sky)' },
        ].map((a,i)=>(
          <div key={i} style={{ marginTop: 10, padding: 14, borderRadius: 18, background: a.c, border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ fontSize: 28 }}>{a.e}</div>
            <div style={{ flex: 1 }}>
              <div className="h3">{a.n}</div>
              <div className="meta">알림 설정됨 · 3일 전</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{a.d}</div>
          </div>
        ))}
      </div>
      <TabBar active="home" dir={dirC} />
    </Frame>
  );
}

function C_Profile() {
  return (
    <Frame dir={dirC}>
      <div style={{ padding: '14px 18px 90px' }}>
        <div className="h1">My 📦</div>

        {/* big profile card */}
        <div style={{ marginTop: 14, padding: 20, borderRadius: 24, background:'var(--c-peach)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', position:'relative' }}>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap: 12 }}>
            <Avatar dir={dirC} initial="J" color="#FF7A6B" size={64}/>
            <div style={{ fontSize: 28, fontWeight: 800 }}>+</div>
            <Avatar dir={dirC} initial="M" color="#C6A8E5" size={64}/>
          </div>
          <div className="h2" style={{ textAlign:'center', marginTop: 12 }}>준오 + 미루</div>
          <div className="meta" style={{ textAlign:'center' }}>D+423 · since 2023.03.14</div>

          <div className="sticker" style={{ position:'absolute', top: 14, right: 14, background:'var(--c-butter)', border:'1.5px solid var(--ink)' }}>Lv.7</div>
        </div>

        {/* badge collection */}
        <div className="tiny" style={{ marginTop: 22, display:'flex', justifyContent:'space-between' }}>
          <span>모은 뱃지</span>
          <span style={{ color:'var(--accent)' }}>12/30</span>
        </div>
        <div style={{ marginTop: 8, padding: 14, borderRadius: 18, background:'var(--paper)', border:'1.5px solid var(--ink)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 10 }}>
            {[
              ['⛰️','var(--c-mint)'],['🏝️','var(--c-sky)'],['🌸','var(--c-pink)'],['☕','var(--c-butter)'],['🎂','var(--c-peach)'],
              ['🍱','var(--c-lilac)'],['📷','var(--c-mint)'],['💌','var(--c-pink)'],['?','var(--paper-2)'],['?','var(--paper-2)'],
            ].map(([e,c],i)=>(
              <div key={i} style={{ aspectRatio:'1', borderRadius: 12, background: c, border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 22, opacity: i < 8 ? 1 : 0.45 }}>{e}</div>
            ))}
          </div>
        </div>

        {/* menu */}
        <div className="tiny" style={{ marginTop: 18 }}>설정</div>
        <div style={{ marginTop: 8, borderRadius: 18, background:'var(--paper)', border:'1.5px solid var(--ink)', overflow:'hidden' }}>
          {[['🎨','테마 · 메모리 포켓'],['🔔','알림'],['📥','내보내기'],['❓','도움말']].map(([e,t],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '14px 14px', borderBottom: i < 3 ? '1.5px solid var(--ink)' : 'none' }}>
              <div style={{ fontSize: 18 }}>{e}</div>
              <div className="h3" style={{ flex: 1 }}>{t}</div>
              <I name="chev" size={14}/>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="me" dir={dirC} />
    </Frame>
  );
}

function C_Notifications() {
  return (
    <Frame dir={dirC}>
      <TopBar dir={dirC} title="알림" back />
      <div style={{ padding: '106px 18px 22px' }}>
        <div className="tiny" style={{ display:'flex', justifyContent:'space-between' }}>
          <span>오늘 · 3개</span>
          <span style={{ color:'var(--accent)', fontWeight: 700 }}>모두 읽음</span>
        </div>
        {[
          { e:'💌', t:'미루가 편지를 보냈어요!', m:'10분 전', c:'var(--c-pink)' },
          { e:'🏅', t:'새 뱃지: 등반가 Lv.1 해제!', m:'1시간 전', c:'var(--c-butter)' },
          { e:'🎂', t:'미루 생일이 10일 남았어요', m:'2시간 전', c:'var(--c-peach)' },
        ].map((n,i)=>(
          <div key={i} style={{ marginTop: 10, padding: 14, borderRadius: 18, background: n.c, border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background:'white', border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 22 }}>{n.e}</div>
            <div style={{ flex: 1 }}>
              <div className="h3">{n.t}</div>
              <div className="meta">{n.m}</div>
            </div>
          </div>
        ))}

        <div className="tiny" style={{ marginTop: 22 }}>이전</div>
        {[['🗺️','부산에 새 핀이 추가됐어요','화요일'],['💬','오늘의 질문이 도착했어요','월요일']].map(([e,t,m],i)=>(
          <div key={i} style={{ marginTop: 10, padding: 14, borderRadius: 18, background:'var(--paper)', border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background:'var(--paper-2)', border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 18 }}>{e}</div>
            <div style={{ flex: 1 }}>
              <div className="h3" style={{ color:'var(--ink-2)' }}>{t}</div>
              <div className="meta">{m}</div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// NEW FLOW · Solo Mode (파트너 연결 전/이별 후)
function C_SoloMode() {
  return (
    <Frame dir={dirC}>
      <div style={{ padding: '14px 18px 90px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div className="sticker" style={{ background:'var(--c-lilac)', border:'1.5px solid var(--ink)' }}>SOLO MODE</div>
            <div className="h1" style={{ marginTop: 8 }}>혼자서도 충분해 🪴</div>
            <div className="meta" style={{ marginTop: 2 }}>나만의 여행 기록을 시작해요</div>
          </div>
        </div>

        {/* invite banner */}
        <div style={{ marginTop: 16, padding: 16, borderRadius: 20, background:'var(--c-mint)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', display:'flex', alignItems:'center', gap: 12 }}>
          <div style={{ fontSize: 36 }}>💌</div>
          <div style={{ flex: 1 }}>
            <div className="h3">연인을 초대해 보세요</div>
            <div className="meta">함께 색칠하면 더 재밌어요</div>
          </div>
          <button className="btn btn-accent" style={{ padding: '8px 12px', fontSize: 12 }}>초대</button>
        </div>

        {/* solo stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 14 }}>
          <div style={{ padding: 14, borderRadius: 16, background:'var(--c-butter)', border:'1.5px solid var(--ink)' }}>
            <div className="meta">혼자 다녀온 곳</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>23 곳</div>
          </div>
          <div style={{ padding: 14, borderRadius: 16, background:'var(--c-sky)', border:'1.5px solid var(--ink)' }}>
            <div className="meta">시작한 지</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>67일</div>
          </div>
        </div>

        {/* solo features */}
        <div className="tiny" style={{ marginTop: 22 }}>솔로 모드 기능</div>
        <div style={{ marginTop: 8, borderRadius: 18, background:'var(--paper)', border:'1.5px solid var(--ink)', overflow:'hidden' }}>
          {[
            ['📓','혼자 쓰는 다이어리','연결 시 합치기'],
            ['📍','내 핀 모음','23개'],
            ['🌱','오늘의 질문 (솔로)','자기성찰 모드'],
            ['🎯','혼자만의 챌린지','3/10 진행중'],
          ].map(([e,t,m],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '14px 14px', borderBottom: i < 3 ? '1.5px solid var(--ink)' : 'none' }}>
              <div style={{ fontSize: 22 }}>{e}</div>
              <div style={{ flex: 1 }}>
                <div className="h3">{t}</div>
                <div className="meta">{m}</div>
              </div>
              <I name="chev" size={14}/>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, padding: 12, borderRadius: 14, background:'var(--paper-2)', display:'flex', gap: 8, alignItems:'center' }}>
          <div style={{ fontSize: 18 }}>💡</div>
          <div className="meta" style={{ flex: 1 }}>나중에 연결하면 기록이 자동으로 합쳐져요</div>
        </div>
      </div>
      <TabBar active="home" dir={dirC} />
    </Frame>
  );
}

Object.assign(window, { C_Onboarding, C_Today, C_Map, C_AddPlace, C_Timeline, C_MemoryDetail, C_Calendar, C_Profile, C_Notifications, C_SoloMode });
