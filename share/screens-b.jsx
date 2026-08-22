// screens-b.jsx — Direction B: Modern Clean
// Aesthetic: Pretendard, generous whitespace, blue accent, soft cards with shadows, big numbers.

const dirB = 'b';

function B_Onboarding() {
  return (
    <Frame dir={dirB}>
      <div style={{ padding: '32px 24px 24px', height: '100%', display:'flex', flexDirection:'column' }}>
        {/* progress dots */}
        <div style={{ display:'flex', gap: 6 }}>
          {[1,1,0].map((v,i)=>(<div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: v?'var(--accent)':'var(--line)' }}/>))}
        </div>
        <div className="meta" style={{ marginTop: 28 }}>2/3 단계</div>
        <div className="h1" style={{ marginTop: 6 }}>파트너와<br/>연결할게요</div>
        <div className="body" style={{ marginTop: 12, color:'var(--ink-2)' }}>두 사람의 코드가 만나면 함께 기록을 시작할 수 있어요.</div>

        {/* code input */}
        <div style={{ marginTop: 28, display:'flex', gap: 8, justifyContent:'space-between' }}>
          {['J','M','7','3','K','9'].map((c,i)=>(
            <div key={i} style={{ width: 48, height: 60, borderRadius: 12, background: i < 4 ? 'var(--accent-soft)' : 'var(--paper-2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 24, fontWeight: 700, color: i < 4 ? 'var(--accent)' : 'var(--ink-3)' }}>{i < 4 ? c : ''}</div>
          ))}
        </div>

        {/* my code */}
        <div style={{ marginTop: 24, padding: 20, borderRadius: 16, background: 'var(--ink)', color: 'white' }}>
          <div className="tiny" style={{ color:'rgba(255,255,255,0.6)' }}>내 초대 코드</div>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 4, marginTop: 8 }}>HX9-K2P</div>
          <div style={{ display:'flex', gap: 8, marginTop: 14 }}>
            <button style={{ flex: 1, padding: '10px 0', borderRadius: 10, background:'rgba(255,255,255,0.16)', color:'white', border: 0, fontSize: 13, fontWeight: 600 }}>복사</button>
            <button style={{ flex: 1, padding: '10px 0', borderRadius: 10, background:'rgba(255,255,255,0.16)', color:'white', border: 0, fontSize: 13, fontWeight: 600 }}>QR로 공유</button>
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <button className="btn btn-accent" style={{ width: '100%' }}>연결하고 시작하기</button>
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }}>혼자 먼저 시작</button>
      </div>
    </Frame>
  );
}

function B_Today() {
  return (
    <Frame dir={dirB}>
      <div style={{ padding: '14px 20px 90px' }}>
        {/* greeting */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div className="meta">5월 15일 · 금요일</div>
            <div className="h1" style={{ marginTop: 2 }}>안녕, 준오</div>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            <div className="icon-sq" style={{ background:'var(--paper)', boxShadow:'var(--shadow)' }}><I name="search" size={18}/></div>
            <div className="icon-sq" style={{ background:'var(--paper)', boxShadow:'var(--shadow)', position:'relative' }}>
              <I name="bell" size={18}/>
              <div style={{ position:'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius:'50%', background:'var(--pink)', border:'1.5px solid white' }}/>
            </div>
          </div>
        </div>

        {/* hero d-day card */}
        <div style={{ marginTop: 16, padding: 20, borderRadius: 20, background: 'linear-gradient(135deg, var(--accent), #6E8FFF)', color: 'white', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right: -20, top: -20, width: 140, height: 140, borderRadius:'50%', background:'rgba(255,255,255,0.10)' }}/>
          <div style={{ position:'absolute', right: -50, bottom: -50, width: 180, height: 180, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
          <div className="tiny" style={{ color:'rgba(255,255,255,0.78)' }}>JUN-O ❤︎ MIRU</div>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1, marginTop: 6 }}>D+423</div>
          <div className="body" style={{ marginTop: 2, color:'rgba(255,255,255,0.86)' }}>500일까지 77일 남았어요</div>
          {/* progress */}
          <div style={{ marginTop: 14, height: 6, borderRadius: 3, background:'rgba(255,255,255,0.22)', overflow:'hidden' }}>
            <div style={{ width: '84.6%', height: '100%', background:'white' }}/>
          </div>
        </div>

        {/* stat row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
          {[['87','추억'],['12','도시'],['3','이번 달']].map(([n,l],i)=>(
            <div key={i} className="card" style={{ padding: 14, textAlign:'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color:'var(--ink)' }}>{n}</div>
              <div className="meta">{l}</div>
            </div>
          ))}
        </div>

        {/* today feature card */}
        <div className="card" style={{ marginTop: 14, padding: 16, display:'flex', alignItems:'center', gap: 12, background: 'var(--accent-soft)', boxShadow:'none' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 24 }}>💬</div>
          <div style={{ flex: 1 }}>
            <div className="meta" style={{ color:'var(--accent)', fontWeight: 600 }}>오늘의 질문</div>
            <div className="h3" style={{ marginTop: 2 }}>처음 만났던 날 어땠어?</div>
          </div>
          <I name="chev" size={14}/>
        </div>

        {/* recent memory */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 22, marginBottom: 10 }}>
          <div className="h2">최근 추억</div>
          <div className="meta" style={{ color:'var(--accent)', fontWeight:600 }}>전체보기</div>
        </div>
        <div style={{ display:'flex', gap: 10, overflowX:'auto' }}>
          {[['한라산 정상','5/10','#E8EEFE'],['벚꽃 한강','5/15','#FFE5E0'],['속초 바다','4/28','#E5F5E8']].map(([n,d,c],i)=>(
            <div key={i} style={{ flex:'none', width: 140 }}>
              <div className="ph" style={{ height: 140, background: c, borderRadius: 14, borderStyle:'solid' }}>{n}</div>
              <div className="h3" style={{ marginTop: 8 }}>{n}</div>
              <div className="meta">{d}</div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="home" dir={dirB} />
    </Frame>
  );
}

function B_Map() {
  return (
    <Frame dir={dirB}>
      <div style={{ padding: '14px 20px 90px' }}>
        {/* header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div className="h1">우리 지도</div>
          <div className="icon-sq" style={{ background:'var(--paper)', boxShadow:'var(--shadow)' }}><I name="search" size={18}/></div>
        </div>

        {/* tabs */}
        <div style={{ display:'flex', gap: 4, marginTop: 14, padding: 4, borderRadius: 12, background: 'var(--paper-2)' }}>
          {['한국','일본','미국','세계'].map((t,i)=>(
            <div key={i} className="meta" style={{ flex: 1, textAlign:'center', padding: '8px 0', borderRadius: 8, background: i===0?'var(--paper)':'transparent', color: i===0?'var(--ink)':'var(--ink-2)', fontWeight: i===0?700:500, boxShadow: i===0?'0 1px 2px rgba(0,0,0,0.08)':'none' }}>{t}</div>
          ))}
        </div>

        {/* map card */}
        <div className="card" style={{ marginTop: 14, padding: 16, position:'relative', height: 380, background:'linear-gradient(180deg, #F8FAFD, #EEF2F8)' }}>
          {/* fake region blobs */}
          <div style={{ position:'absolute', left: 88, top: 30, width: 60, height: 70, background: 'var(--accent)', borderRadius: 14, opacity: 0.9 }}/>
          <div style={{ position:'absolute', left: 100, top: 110, width: 100, height: 80, background: 'var(--accent-soft)', borderRadius: 16, border:'2px solid var(--accent)' }}/>
          <div style={{ position:'absolute', left: 160, top: 200, width: 70, height: 60, background: 'var(--paper-2)', borderRadius: 14 }}/>
          <div style={{ position:'absolute', left: 90, top: 230, width: 90, height: 70, background: 'var(--accent)', borderRadius: 14, opacity: 0.65 }}/>
          <div style={{ position:'absolute', left: 200, top: 280, width: 50, height: 30, background: 'var(--paper-2)', borderRadius: 12 }}/>

          {/* legend */}
          <div style={{ position:'absolute', right: 14, top: 14, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display:'flex', alignItems:'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background:'var(--accent)' }}/>
              <div className="meta">방문함</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background:'var(--paper-2)', border:'1px solid var(--line)' }}/>
              <div className="meta">가고 싶음</div>
            </div>
          </div>

          {/* bottom progress */}
          <div style={{ position:'absolute', left: 16, right: 16, bottom: 16, padding: '14px 16px', borderRadius: 14, background:'rgba(255,255,255,0.94)', backdropFilter:'blur(10px)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <div className="h3">대한민국</div>
              <div className="meta" style={{ color:'var(--accent)', fontWeight: 700 }}>9 / 17 지역</div>
            </div>
            <div style={{ marginTop: 8, height: 6, borderRadius: 3, background:'var(--paper-2)', overflow:'hidden' }}>
              <div style={{ width: '53%', height: '100%', background: 'var(--accent)' }}/>
            </div>
          </div>
        </div>

        {/* region list */}
        <div className="h3" style={{ marginTop: 18 }}>최근 방문</div>
        <div className="card" style={{ marginTop: 8 }}>
          {[['🏝️','제주도','15곳 · 3박 4일'],['🌊','부산','7곳 · 당일'],['🏔️','속초','4곳 · 1박']].map(([e,n,m],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '12px 14px', borderBottom: i < 2 ? '1px solid var(--line)' : 'none' }}>
              <div className="icon-sq">{e}</div>
              <div style={{ flex: 1 }}>
                <div className="h3">{n}</div>
                <div className="meta">{m}</div>
              </div>
              <I name="chev" size={14}/>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="map" dir={dirB} />
    </Frame>
  );
}

function B_AddPlace() {
  return (
    <Frame dir={dirB}>
      <TopBar dir={dirB} title="새 추억" back right={<div className="meta" style={{ color:'var(--accent)', fontWeight:700 }}>저장</div>} />
      <div style={{ padding: '106px 20px 22px' }}>
        {/* step indicator */}
        <div style={{ display:'flex', gap: 4 }}>
          {[1,1,1,0].map((v,i)=>(<div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: v?'var(--accent)':'var(--line)' }}/>))}
        </div>
        <div className="tiny" style={{ marginTop: 8, color:'var(--accent)' }}>4단계 · 마지막</div>
        <div className="h1" style={{ marginTop: 6 }}>거의 다 됐어요</div>

        {/* place chip */}
        <div className="card" style={{ marginTop: 16, padding: 14, display:'flex', alignItems:'center', gap: 12, background:'var(--accent-soft)', boxShadow:'none' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background:'var(--accent)', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}><I name="pin" size={18}/></div>
          <div style={{ flex: 1 }}>
            <div className="h3">한라산국립공원</div>
            <div className="meta">제주특별자치도 서귀포</div>
          </div>
          <div className="meta" style={{ color:'var(--accent)', fontWeight: 600 }}>변경</div>
        </div>

        {/* photos */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 22, marginBottom: 8 }}>
          <div className="h3">사진</div>
          <div className="meta">3 / 9</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 8 }}>
          {[1,2,3].map(i=> <div key={i} className="ph" style={{ aspectRatio:'1' }}>photo {i}</div>)}
          <div className="ph" style={{ aspectRatio:'1', color:'var(--accent)', borderColor:'var(--accent)' }}>+</div>
        </div>

        {/* note */}
        <div className="h3" style={{ marginTop: 22 }}>한 줄 메모</div>
        <div className="card" style={{ marginTop: 8, padding: 14, minHeight: 80, boxShadow:'none', background:'var(--paper-2)' }}>
          <div className="body">눈 쌓인 한라산. 너랑 같이 정상까지 ⛰️</div>
        </div>

        {/* meta rows */}
        <div className="card" style={{ marginTop: 14 }}>
          {[['📅','날짜','2024.05.10 (금)'],['🏷️','태그','#등산 #제주 #커플'],['❤️','분위기','감동']].map(([e,k,v],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '14px 16px', borderBottom: i < 2 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ fontSize: 16 }}>{e}</div>
              <div className="meta" style={{ width: 56 }}>{k}</div>
              <div className="body" style={{ flex: 1 }}>{v}</div>
              <I name="chev" size={14}/>
            </div>
          ))}
        </div>

        <button className="btn btn-accent" style={{ width: '100%', marginTop: 22 }}>저장하기</button>
      </div>
    </Frame>
  );
}

function B_Timeline() {
  return (
    <Frame dir={dirB}>
      <div style={{ padding: '14px 20px 90px' }}>
        <div className="h1">추억</div>

        {/* segmented */}
        <div style={{ display:'flex', gap: 4, marginTop: 14, padding: 4, borderRadius: 12, background:'var(--paper-2)' }}>
          {['타임라인','그리드','지도'].map((t,i)=>(
            <div key={i} className="meta" style={{ flex: 1, textAlign:'center', padding: '8px 0', borderRadius: 8, background: i===0?'var(--paper)':'transparent', fontWeight: i===0?700:500, color: i===0?'var(--ink)':'var(--ink-2)', boxShadow: i===0?'0 1px 2px rgba(0,0,0,0.08)':'none' }}>{t}</div>
          ))}
        </div>

        {/* month header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop: 22 }}>
          <div className="h2">2024년 5월</div>
          <div className="meta" style={{ color:'var(--accent)', fontWeight: 600 }}>5개</div>
        </div>

        {/* entries */}
        {[
          { day: 15, w: '금', t: '벚꽃 끝물', body: '한강에서 라면 끓여 먹음.', tag: '#한강' },
          { day: 10, w: '토', t: '한라산 정상', body: '눈 쌓여 있어서 진짜 힘들었지만…', tag: '#제주' },
          { day: 4, w: '토', t: '미루 생일 케이크', body: '망함 ㅠ 다시 만들기로.', tag: '#기념일' },
        ].map((e,i)=>(
          <div key={i} className="card" style={{ marginTop: 12, padding: 14, display:'flex', gap: 12 }}>
            <div style={{ flex:'none', textAlign:'center', width: 44 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color:'var(--ink)' }}>{e.day}</div>
              <div className="meta">{e.w}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="h3">{e.t}</div>
              <div className="meta" style={{ marginTop: 2 }}>{e.body}</div>
              <div style={{ display:'flex', gap: 6, marginTop: 8, alignItems:'center' }}>
                <div className="pill" style={{ color:'var(--accent)', background:'var(--accent-soft)' }}>{e.tag}</div>
                <div className="meta" style={{ marginLeft: 'auto' }}>♥ 2 · 💬 1</div>
              </div>
            </div>
            <div className="ph" style={{ width: 72, height: 72, borderStyle:'solid', borderRadius: 12 }}/>
          </div>
        ))}

        <div className="h2" style={{ marginTop: 22 }}>2024년 4월</div>
        <div className="card" style={{ marginTop: 12, padding: 14, display:'flex', gap: 12 }}>
          <div style={{ flex:'none', textAlign:'center', width: 44 }}>
            <div style={{ fontSize: 28, fontWeight: 800 }}>28</div>
            <div className="meta">일</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="h3">속초 바다</div>
            <div className="meta">새벽 드라이브 다녀왔어요.</div>
          </div>
          <div className="ph" style={{ width: 72, height: 72, borderStyle:'solid', borderRadius: 12 }}/>
        </div>
      </div>
      <TabBar active="timeline" dir={dirB} />
    </Frame>
  );
}

function B_MemoryDetail() {
  return (
    <Frame dir={dirB}>
      <TopBar dir={dirB} title="" back right={<div style={{ display:'flex', gap: 8 }}><I name="heart" size={20}/></div>} transparent />
      {/* hero */}
      <div style={{ position:'absolute', left: 0, right: 0, top: 0, height: 380, background:'#B4C8DC' }}>
        <div className="ph" style={{ width:'100%', height:'100%', border: 0, borderRadius: 0, background:'linear-gradient(180deg, #C5D5E5, #93A8C0)' }}>hero · 한라산</div>
      </div>
      {/* image dots */}
      <div style={{ position:'absolute', left: 0, right: 0, top: 340, display:'flex', justifyContent:'center', gap: 6 }}>
        {[1,1,0,0].map((v,i)=>(<div key={i} style={{ width: v?16:6, height: 6, borderRadius: 3, background: v?'white':'rgba(255,255,255,0.5)' }}/>))}
      </div>

      <div style={{ position:'absolute', top: 350, left: 0, right: 0, bottom: 0, background:'var(--bg)', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, overflow:'auto' }}>
        <div style={{ display:'flex', gap: 6 }}>
          <div className="pill" style={{ color:'var(--accent)', background:'var(--accent-soft)' }}>#제주</div>
          <div className="pill" style={{ color:'var(--accent-2)', background:'#E5F8EE' }}>#등산</div>
        </div>
        <div className="h1" style={{ marginTop: 10 }}>한라산 정상에서</div>
        <div className="meta" style={{ marginTop: 4 }}>2024년 5월 10일 · 토</div>

        <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 14, padding: '10px 12px', borderRadius: 14, background:'var(--paper)' }}>
          <Avatar dir={dirB} initial="J" color="#3461F0" size={28}/>
          <Avatar dir={dirB} initial="M" color="#FF6F91" size={28}/>
          <div style={{ flex: 1 }}>
            <div className="h3" style={{ fontSize: 13 }}>준오 & 미루</div>
            <div className="meta">제주특별자치도 서귀포</div>
          </div>
          <I name="pin" size={16}/>
        </div>

        <div className="body" style={{ marginTop: 16, lineHeight: 1.7, color:'var(--ink)' }}>
          새벽 4시 출발. 어리목 코스로 올라가는 길에 눈이 무릎까지 쌓여 있었어. 미루가 자꾸 미끄러져서 손 꼭 잡고 올라갔지. 정상에서 본 풍경, 평생 기억할 거야.
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8, marginTop: 16 }}>
          {[1,2,3,4].map(i=> <div key={i} className="ph" style={{ aspectRatio:'1', borderStyle:'solid' }}>photo {i+1}</div>)}
        </div>

        {/* partner note */}
        <div style={{ marginTop: 18, padding: 14, borderRadius: 14, background:'var(--accent-soft)' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
            <Avatar dir={dirB} initial="M" color="#FF6F91" size={22}/>
            <div className="meta" style={{ fontWeight: 600 }}>미루의 코멘트</div>
          </div>
          <div className="body" style={{ marginTop: 6 }}>내가 더 미끄러진 건 비밀이야 🤫</div>
        </div>
      </div>
    </Frame>
  );
}

function B_Calendar() {
  const days = Array.from({length: 35}, (_,i) => i);
  const today = 16;
  const evt = { 4:'pink', 10:'blue', 22:'pink', 25:'orange' };
  return (
    <Frame dir={dirB}>
      <div style={{ padding: '14px 20px 90px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
          <div>
            <div className="meta">2024</div>
            <div className="h1">5월</div>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            <div className="icon-sq" style={{ background:'var(--paper-2)' }}><I name="chev-l" size={16}/></div>
            <div className="icon-sq" style={{ background:'var(--paper-2)' }}><I name="chev" size={16}/></div>
          </div>
        </div>

        {/* calendar */}
        <div className="card" style={{ marginTop: 14, padding: 14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap: 0, marginBottom: 6 }}>
            {['일','월','화','수','목','금','토'].map((d,i)=>(
              <div key={i} className="tiny" style={{ textAlign:'center', color: i===0?'var(--pink)': i===6?'var(--accent)':'var(--ink-3)' }}>{d}</div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap: 0 }}>
            {days.map(d => {
              const dn = d - 2;
              const isToday = dn === today;
              const e = evt[dn];
              const valid = dn >= 1 && dn <= 31;
              return (
                <div key={d} style={{ aspectRatio: '1', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: isToday?'var(--accent)':'transparent', color: isToday?'white':valid?'var(--ink)':'var(--ink-3)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: isToday?700:500, fontSize: 13 }}>{valid?dn:''}</div>
                  {e && <div style={{ position:'absolute', bottom: 4, width: 5, height: 5, borderRadius:'50%', background: e==='pink'?'var(--pink)':e==='blue'?'var(--accent)':'var(--warn)' }}/>}
                </div>
              );
            })}
          </div>
        </div>

        {/* anniversaries */}
        <div className="h3" style={{ marginTop: 22 }}>다가오는 D-day</div>
        <div className="card" style={{ marginTop: 8 }}>
          {[['🎂','미루 생일','5월 25일','D-10','var(--warn)'],['💕','만난 지 500일','7월 31일','D-77','var(--accent)'],['✈️','제주 1주년','5월 22일','D-7','var(--pink)']].map(([e,n,d,dd,c],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '14px 16px', borderBottom: i < 2 ? '1px solid var(--line)' : 'none' }}>
              <div className="icon-sq" style={{ background:'var(--paper-2)', fontSize: 18 }}>{e}</div>
              <div style={{ flex: 1 }}>
                <div className="h3">{n}</div>
                <div className="meta">{d}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: c }}>{dd}</div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="home" dir={dirB} />
    </Frame>
  );
}

function B_Profile() {
  return (
    <Frame dir={dirB}>
      <div style={{ padding: '14px 20px 90px' }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <div className="h1">My</div>
          <div className="icon-sq" style={{ background:'var(--paper)', boxShadow:'var(--shadow)' }}>⚙</div>
        </div>

        {/* profile gradient card */}
        <div style={{ marginTop: 14, padding: 20, borderRadius: 20, background:'var(--paper)', boxShadow:'var(--shadow)' }}>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap: 16 }}>
            <Avatar dir={dirB} initial="J" color="#3461F0" size={68}/>
            <div style={{ fontSize: 22, color:'var(--accent)' }}>♡</div>
            <Avatar dir={dirB} initial="M" color="#FF6F91" size={68}/>
          </div>
          <div className="h2" style={{ textAlign:'center', marginTop: 14 }}>준오 & 미루</div>
          <div className="meta" style={{ textAlign:'center' }}>2023.03.14 부터 423일</div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
            {[['87','추억'],['12','도시'],['9','지역']].map(([n,l],i)=>(
              <div key={i} style={{ background:'var(--paper-2)', borderRadius: 12, padding: '10px 0', textAlign:'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{n}</div>
                <div className="meta">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* menu */}
        <div className="tiny" style={{ marginTop: 22, color:'var(--ink-3)' }}>커플</div>
        <div className="card" style={{ marginTop: 8 }}>
          {[['🌍','우리의 통계','87곳 · 12도시'],['📖','여행기 만들기','PDF 내보내기'],['📨','파트너에게 편지','새 편지 1개']].map(([e,t,m],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '14px 16px', borderBottom: i < 2 ? '1px solid var(--line)' : 'none' }}>
              <div className="icon-sq">{e}</div>
              <div style={{ flex: 1 }}>
                <div className="h3">{t}</div>
                <div className="meta">{m}</div>
              </div>
              <I name="chev" size={14}/>
            </div>
          ))}
        </div>

        <div className="tiny" style={{ marginTop: 18, color:'var(--ink-3)' }}>설정</div>
        <div className="card" style={{ marginTop: 8 }}>
          {[['🎨','테마','블루'],['🔔','알림','켜짐'],['❓','도움말','']].map(([e,t,m],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '14px 16px', borderBottom: i < 2 ? '1px solid var(--line)' : 'none' }}>
              <div className="icon-sq">{e}</div>
              <div className="h3" style={{ flex: 1 }}>{t}</div>
              <div className="meta">{m}</div>
              <I name="chev" size={14}/>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="me" dir={dirB} />
    </Frame>
  );
}

function B_Notifications() {
  return (
    <Frame dir={dirB}>
      <TopBar dir={dirB} title="알림" back right={<div className="meta" style={{ color:'var(--accent)', fontWeight:600 }}>모두 읽음</div>} />
      <div style={{ padding: '106px 20px 22px' }}>
        <div className="tiny" style={{ color:'var(--ink-3)' }}>새 알림 · 3</div>
        <div className="card" style={{ marginTop: 8 }}>
          {[
            { e:'💌', t:'미루가 편지를 보냈어요', m:'10분 전', new: true, c:'var(--pink)' },
            { e:'📷', t:'한라산 추억에 사진을 추가했어요', m:'1시간 전', new: true, c:'var(--accent)' },
            { e:'🎂', t:'미루 생일이 10일 남았어요', m:'2시간 전', new: true, c:'var(--warn)' },
          ].map((n,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '14px 16px', borderBottom: i < 2 ? '1px solid var(--line)' : 'none', position:'relative' }}>
              <div className="icon-sq" style={{ background: 'var(--accent-soft)', color: n.c }}>{n.e}</div>
              <div style={{ flex: 1 }}>
                <div className="h3">{n.t}</div>
                <div className="meta">{n.m}</div>
              </div>
              <div style={{ width: 8, height: 8, borderRadius:'50%', background:'var(--accent)' }}/>
            </div>
          ))}
        </div>

        <div className="tiny" style={{ marginTop: 22, color:'var(--ink-3)' }}>이전</div>
        <div className="card" style={{ marginTop: 8 }}>
          {[['🗺️','부산에 새 핀이 추가됐어요','화요일'],['💬','오늘의 질문이 도착했어요','월요일'],['🎲','데이트 룰렛 결과 알림','일요일']].map(([e,t,m],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '14px 16px', borderBottom: i < 2 ? '1px solid var(--line)' : 'none' }}>
              <div className="icon-sq" style={{ background:'var(--paper-2)' }}>{e}</div>
              <div style={{ flex: 1 }}>
                <div className="h3" style={{ color:'var(--ink-2)' }}>{t}</div>
                <div className="meta">{m}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// NEW FLOW · Time Capsule (미래의 우리에게)
function B_TimeCapsule() {
  return (
    <Frame dir={dirB}>
      <TopBar dir={dirB} title="타임캡슐" back right={<I name="plus" size={18}/>} />
      <div style={{ padding: '106px 20px 22px' }}>
        {/* hero */}
        <div style={{ padding: 20, borderRadius: 20, background:'linear-gradient(135deg, #2C2D5F, #4A3D8A)', color:'white', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-30, top:-30, width: 140, height: 140, borderRadius:'50%', background:'rgba(255,255,255,0.10)' }}/>
          <div className="tiny" style={{ color:'rgba(255,255,255,0.7)' }}>FUTURE LETTERS</div>
          <div className="h1" style={{ marginTop: 4 }}>미래의 우리에게</div>
          <div className="body" style={{ marginTop: 6, color:'rgba(255,255,255,0.86)' }}>지정한 날까지 잠겨 있어요</div>
        </div>

        {/* locked capsules */}
        <div className="tiny" style={{ marginTop: 22, color:'var(--ink-3)' }}>잠긴 캡슐 · 3</div>
        {[
          { t:'500일 기념', from: '준오 → 미루', when:'D-77', open:'7월 31일', locked: true, c: 'var(--accent)' },
          { t:'결혼 5주년에', from: '둘 다', when:'D-1825', open:'2029.03.14', locked: true, c: 'var(--pink)' },
          { t:'30살의 우리에게', from: '미루 → 미루', when:'D-432', open:'2025.07.20', locked: true, c: 'var(--warn)' },
        ].map((c,i)=>(
          <div key={i} className="card" style={{ marginTop: 8, padding: 14, display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.c, color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}><I name="lock" size={18}/></div>
            <div style={{ flex: 1 }}>
              <div className="h3">{c.t}</div>
              <div className="meta">{c.from} · 열림 {c.open}</div>
            </div>
            <div className="pill" style={{ background:'var(--paper-2)', fontWeight: 700 }}>{c.when}</div>
          </div>
        ))}

        {/* unlocked */}
        <div className="tiny" style={{ marginTop: 22, color:'var(--ink-3)' }}>열린 캡슐 · 1</div>
        <div className="card" style={{ marginTop: 8, padding: 14, display:'flex', alignItems:'center', gap: 12, background:'var(--accent-soft)', boxShadow:'none' }}>
          <div className="icon-sq" style={{ fontSize: 18 }}>✨</div>
          <div style={{ flex: 1 }}>
            <div className="h3">100일 기념 편지</div>
            <div className="meta">2023.06.22 에 작성</div>
          </div>
          <div className="meta" style={{ color:'var(--accent)', fontWeight: 700 }}>읽기</div>
        </div>

        <button className="btn btn-accent" style={{ width: '100%', marginTop: 22 }}>새 캡슐 만들기</button>
      </div>
    </Frame>
  );
}

Object.assign(window, { B_Onboarding, B_Today, B_Map, B_AddPlace, B_Timeline, B_MemoryDetail, B_Calendar, B_Profile, B_Notifications, B_TimeCapsule });
