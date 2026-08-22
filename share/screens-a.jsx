// screens-a.jsx — Direction A: Warm Diary
// Aesthetic: handwritten Gaegu titles, cream paper, coral accent, washi tape, polaroid photos.

const dirA = 'a';

// ─────────────────────────────────────────────────────────────
// A1 · Onboarding — partner code
// ─────────────────────────────────────────────────────────────
function A_Onboarding() {
  return (
    <Frame dir={dirA}>
      <div style={{ padding: '20px 24px 0', height: '100%', display:'flex', flexDirection:'column' }}>
        <div className="tiny" style={{ color: 'var(--accent)' }}>STEP 02 / 03</div>
        <div className="h1" style={{ marginTop: 6 }}>둘만의<br/>여행을 시작해요</div>
        <div className="body" style={{ marginTop: 10, color: 'var(--ink-2)' }}>파트너의 초대 코드를 입력하거나, 내 코드를 공유해 주세요.</div>

        {/* Code input — pencil-line style */}
        <div style={{ marginTop: 28, display:'flex', gap: 10, justifyContent:'center' }}>
          {['J','M','7','3','K','9'].map((c,i)=>(
            <div key={i} style={{ width: 44, height: 56, borderBottom: '2px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize: 28, fontWeight: 700, color: i < 4 ? 'var(--ink)' : 'var(--ink-3)' }}>{i < 4 ? c : ''}</div>
          ))}
        </div>
        <div className="meta" style={{ textAlign:'center', marginTop: 12 }}>또는</div>

        {/* My code card */}
        <div className="card" style={{ marginTop: 16, padding: 18, position:'relative', transform: 'rotate(-1deg)' }}>
          <div className="tape" style={{ top: -8, left: 24 }} />
          <div className="tiny">MY INVITE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 4, marginTop: 6 }}>HX9-K2P</div>
          <div className="meta" style={{ marginTop: 4 }}>코드를 복사해서 연인에게 보내세요</div>
          <button className="btn btn-ghost" style={{ marginTop: 14, width: '100%' }}>코드 복사하기</button>
        </div>

        <div style={{ flex: 1 }} />
        <button className="btn btn-accent" style={{ width: '100%', marginBottom: 14 }}>연결하고 시작하기</button>
        <div className="meta" style={{ textAlign:'center', marginBottom: 8 }}>
          <span style={{ textDecoration: 'underline' }}>혼자 먼저 시작할게요</span>
        </div>
      </div>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// A2 · Today (Home)
// ─────────────────────────────────────────────────────────────
function A_Today() {
  return (
    <Frame dir={dirA}>
      <div style={{ padding: '14px 22px 90px' }}>
        {/* greeting */}
        <div className="meta">5월 15일 금요일</div>
        <div className="h1" style={{ marginTop: 4 }}>오늘도 <span className="script">함께</span></div>

        {/* couple D-day card */}
        <div className="card" style={{ marginTop: 14, padding: 16, display:'flex', alignItems:'center', gap: 14, position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center' }}>
            <Avatar dir={dirA} initial="J" color="#E76F51" />
            <Avatar dir={dirA} initial="M" color="#4F8FA6" size={36} />
          </div>
          <div style={{ flex: 1, marginLeft: -8 }}>
            <div className="h3">준오 ♥ 미루</div>
            <div className="meta">함께한 지 <b style={{ color: 'var(--accent)' }}>423일</b></div>
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize: 26, color: 'var(--accent)' }}>D+423</div>
        </div>

        {/* today's memory polaroid */}
        <div style={{ marginTop: 22 }}>
          <div className="tiny" style={{ marginBottom: 8 }}>오늘의 추억</div>
          <div className="card" style={{ padding: 12, paddingBottom: 36, transform: 'rotate(-1.5deg)', position:'relative' }}>
            <div className="ph" style={{ height: 180, borderRadius: 4 }}>2024 · 5 · 15 · 한강</div>
            <div className="script" style={{ position:'absolute', bottom: 6, left: 14 }}>벚꽃 보러 간 날</div>
          </div>
          <div className="card" style={{ padding: 12, paddingBottom: 36, transform: 'rotate(1.5deg) translateY(-30px)', marginLeft: 60, position:'relative' }}>
            <div className="ph" style={{ height: 130, borderRadius: 4 }}>2023 · 5 · 15</div>
            <div className="script" style={{ position:'absolute', bottom: 6, left: 14, fontSize: 18 }}>작년 오늘</div>
          </div>
        </div>

        {/* quick actions */}
        <div className="tiny" style={{ marginTop: 0, marginBottom: 10 }}>오늘 뭐 할까?</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          {[['데이트 룰렛','🎲'],['오늘의 질문','💬'],['가고 싶은 곳','📍'],['편지 쓰기','✉️']].map(([l,e],i)=>(
            <div key={i} className="card" style={{ padding: '14px 14px', display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{ fontSize: 22 }}>{e}</div>
              <div className="h3">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="home" dir={dirA} />
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// A3 · Map (Travel)
// ─────────────────────────────────────────────────────────────
function A_Map() {
  return (
    <Frame dir={dirA}>
      <div style={{ padding: '14px 22px 90px' }}>
        <div className="h1">우리의 지도</div>
        <div className="meta" style={{ marginTop: 4 }}>대한민국 · <span style={{ color: 'var(--accent)' }}>9곳</span> 방문</div>

        {/* segmented control */}
        <div style={{ display:'flex', gap: 6, marginTop: 14 }}>
          {['한국','일본','세계'].map((t,i)=>(
            <div key={i} className="pill" style={i===0?{ background:'var(--ink)', color:'var(--paper)', borderColor:'var(--ink)' }:undefined}>{t}</div>
          ))}
        </div>

        {/* simulated korea map */}
        <div className="card" style={{ marginTop: 12, padding: 16, position:'relative', height: 360, background: 'var(--paper)', backgroundImage: 'var(--paper-grain)' }}>
          {/* fake regions */}
          <div style={{ position:'absolute', left: 80, top: 30, width: 60, height: 70, background: 'var(--accent-soft)', border: '1px solid var(--line-strong)', borderRadius: 8, transform: 'rotate(-3deg)' }}/>
          <div style={{ position:'absolute', left: 150, top: 24, width: 50, height: 50, background: 'var(--accent)', border: '1px solid var(--ink)', borderRadius: 8, transform: 'rotate(2deg)', opacity: 0.85 }}/>
          <div style={{ position:'absolute', left: 100, top: 110, width: 110, height: 80, background: 'var(--accent-soft)', border: '1px solid var(--line-strong)', borderRadius: 12, transform: 'rotate(1deg)' }}/>
          <div style={{ position:'absolute', left: 160, top: 200, width: 70, height: 60, background: 'var(--paper-2)', border: '1px solid var(--line-strong)', borderRadius: 10 }}/>
          <div style={{ position:'absolute', left: 90, top: 230, width: 90, height: 70, background: 'var(--accent)', border: '1px solid var(--ink)', borderRadius: 10, opacity: 0.9 }}/>
          <div style={{ position:'absolute', left: 200, top: 280, width: 50, height: 30, background: 'var(--paper-2)', border: '1px solid var(--line-strong)', borderRadius: 999 }}/>
          {/* pin */}
          <div style={{ position:'absolute', left: 130, top: 145, color:'var(--ink)' }}><I name="pin" size={20}/></div>
          {/* label */}
          <div className="script" style={{ position:'absolute', right: 18, top: 18 }}>서울에서 시작해서…</div>
          <div className="meta" style={{ position:'absolute', right: 18, bottom: 12 }}>탭하면 추억을 볼 수 있어요</div>
        </div>

        {/* recent list */}
        <div className="tiny" style={{ marginTop: 18, marginBottom: 8 }}>최근 방문</div>
        {[['제주도','15곳 · 3박 4일','#E76F51'],['부산','7곳 · 당일','#4F8FA6'],['속초','4곳 · 1박','#8FA873']].map(([n,m,c],i)=>(
          <div key={i} className="card" style={{ marginBottom: 8, padding: 12, display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: c, border: '1px solid var(--ink)' }} />
            <div style={{ flex: 1 }}>
              <div className="h3">{n}</div>
              <div className="meta">{m}</div>
            </div>
            <I name="chev" size={16} />
          </div>
        ))}
      </div>
      <TabBar active="map" dir={dirA} />
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// A4 · Add Place (search + form)
// ─────────────────────────────────────────────────────────────
function A_AddPlace() {
  return (
    <Frame dir={dirA}>
      <TopBar dir={dirA} title="장소 추가" back right={<I name="x" size={18}/>} />
      <div style={{ paddingTop: 106, padding: '106px 22px 22px' }}>
        {/* search */}
        <div className="card" style={{ padding: 12, display:'flex', alignItems:'center', gap: 8 }}>
          <I name="search" size={18}/>
          <div className="body" style={{ flex: 1 }}>한라산 윗세오름</div>
          <div className="pill" style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent)' }}>제주 ✓</div>
        </div>

        {/* selected place */}
        <div className="card" style={{ marginTop: 14, padding: 14, position:'relative' }}>
          <div className="tape" style={{ top: -8, right: 24 }}/>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--accent-soft)', border: '1px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center' }}>🏔️</div>
            <div style={{ flex: 1 }}>
              <div className="h3">한라산국립공원</div>
              <div className="meta">제주특별자치도 · 서귀포</div>
            </div>
          </div>
        </div>

        {/* photos */}
        <div className="tiny" style={{ marginTop: 18 }}>사진</div>
        <div style={{ display:'flex', gap: 8, marginTop: 8, overflowX:'auto' }}>
          {[1,2,3].map(i => (
            <div key={i} className="ph" style={{ width: 90, height: 90, borderRadius: 6, flex:'none' }}>photo {i}</div>
          ))}
          <div className="ph" style={{ width: 90, height: 90, borderRadius: 6, flex:'none', borderStyle: 'dashed', color: 'var(--accent)' }}>+ 추가</div>
        </div>

        {/* memo */}
        <div className="tiny" style={{ marginTop: 18 }}>한 줄 메모</div>
        <div className="card" style={{ marginTop: 8, padding: 14, minHeight: 90 }}>
          <div className="script">눈 쌓인 한라산. 너랑 같이 정상까지!</div>
          <div style={{ borderBottom: '1px dashed var(--line)', marginTop: 8 }}/>
          <div style={{ borderBottom: '1px dashed var(--line)', marginTop: 16 }}/>
        </div>

        {/* date + meta */}
        <div style={{ display:'flex', gap: 8, marginTop: 14 }}>
          <div className="card" style={{ padding: 10, flex: 1 }}>
            <div className="tiny">날짜</div>
            <div className="h3" style={{ marginTop: 2 }}>2024.05.10</div>
          </div>
          <div className="card" style={{ padding: 10, flex: 1 }}>
            <div className="tiny">함께</div>
            <div className="h3" style={{ marginTop: 2 }}>준오 ♥ 미루</div>
          </div>
        </div>

        <button className="btn btn-accent" style={{ width: '100%', marginTop: 22 }}>핀 꽂기</button>
      </div>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// A5 · Timeline (vertical diary)
// ─────────────────────────────────────────────────────────────
function A_Timeline() {
  return (
    <Frame dir={dirA}>
      <div style={{ padding: '14px 22px 90px' }}>
        <div className="h1">우리의 일기장</div>
        <div className="meta" style={{ marginTop: 4 }}>총 <b style={{ color:'var(--accent)' }}>87개</b>의 추억 · 12개월</div>

        {/* year switcher */}
        <div style={{ display:'flex', gap: 8, marginTop: 14, overflowX:'auto' }}>
          {['전체','2024','2023','2022'].map((y,i)=>(
            <div key={i} className="pill" style={i===1?{ background:'var(--ink)', color:'var(--paper)', borderColor:'var(--ink)' }:undefined}>{y}</div>
          ))}
        </div>

        {/* month header */}
        <div className="tiny" style={{ marginTop: 22, color:'var(--accent)' }}>2024 · MAY</div>
        <div style={{ height: 1, background: 'var(--ink)', marginTop: 6 }}/>

        {/* entries */}
        {[
          { day: 15, mo: '5월', title: '벚꽃 끝물', body: '한강에서 벚꽃 보고 라면 끓여 먹음. 좀 추웠어.', img: 'han-river' },
          { day: 10, mo: '5월', title: '한라산 정상', body: '눈 쌓여 있어서 진짜 힘들었는데 정상에서 본 풍경 평생 못 잊을 듯', img: 'hallasan' },
          { day: 4, mo: '5월', title: '쪼꼬케이크', body: '미루 생일. 케이크 망함 ㅠ', img: 'cake' },
        ].map((e,i)=>(
          <div key={i} style={{ display:'flex', gap: 12, marginTop: 18 }}>
            <div style={{ flex:'none', width: 44, textAlign:'right' }}>
              <div className="h2" style={{ fontFamily:'var(--font-display)', color: 'var(--accent)' }}>{e.day}</div>
              <div className="meta">{e.mo}</div>
            </div>
            <div className="card" style={{ flex: 1, padding: 12, transform: i%2===0?'rotate(-0.6deg)':'rotate(0.6deg)' }}>
              <div className="ph" style={{ height: 100, borderRadius: 4 }}>{e.img}</div>
              <div className="h3" style={{ marginTop: 8 }}>{e.title}</div>
              <div className="body" style={{ marginTop: 2, color:'var(--ink-2)' }}>{e.body}</div>
              <div style={{ display:'flex', gap: 4, marginTop: 8 }}>
                <span className="pill" style={{ background:'var(--accent-soft)' }}>♥ 2</span>
                <span className="pill">💬 1</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <TabBar active="timeline" dir={dirA} />
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// A6 · Memory Detail
// ─────────────────────────────────────────────────────────────
function A_MemoryDetail() {
  return (
    <Frame dir={dirA}>
      <TopBar dir={dirA} title="" back right={<I name="heart" size={18}/>} transparent />
      {/* hero image */}
      <div style={{ position:'absolute', left: 0, right: 0, top: 54, height: 320, background: '#D9C8A8', backgroundImage: 'var(--paper-grain)' }}>
        <div className="ph" style={{ width: '100%', height: '100%', border: 0 }}>hero photo · 한라산</div>
      </div>

      <div style={{ position:'absolute', top: 290, left: 0, right: 0, bottom: 0, background:'var(--bg)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, overflow:'auto' }}>
        <div className="tiny" style={{ color:'var(--accent)' }}>2024.05.10 · 토</div>
        <div className="h1" style={{ marginTop: 4 }}>한라산 정상에서</div>

        <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 10 }}>
          <Avatar dir={dirA} initial="J" color="#E76F51" size={28}/>
          <Avatar dir={dirA} initial="M" color="#4F8FA6" size={28}/>
          <div className="meta">준오 & 미루 · 제주특별자치도</div>
        </div>

        <div className="script" style={{ marginTop: 16, fontSize: 22, lineHeight: 1.4 }}>
          눈이 무릎까지 쌓여 있었지. 미루가 자꾸 미끄러져서 손 꼭 잡고 올라갔어. 정상에서 본 그 풍경은 아직도 생생해.
        </div>
        <div className="body" style={{ marginTop: 14, color:'var(--ink-2)', lineHeight: 1.7 }}>
          새벽 4시 출발. 어리목 코스 · 8시간. 정상 도착 시간 12시 32분. 라면 끓여 먹음.
        </div>

        {/* sub photos */}
        <div style={{ display:'flex', gap: 8, marginTop: 16 }}>
          {[1,2,3].map(i => <div key={i} className="ph" style={{ width: 90, height: 90, borderRadius: 6 }}>photo {i+1}</div>)}
        </div>

        {/* comment from partner */}
        <div className="card" style={{ marginTop: 18, padding: 12, background: 'var(--accent-soft)', borderColor:'var(--accent)' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
            <Avatar dir={dirA} initial="M" color="#4F8FA6" size={22}/>
            <div className="tiny" style={{ color:'var(--ink)' }}>미루의 메모</div>
          </div>
          <div className="script" style={{ marginTop: 6, fontSize: 18 }}>내가 더 미끄러진 건 비밀</div>
        </div>
      </div>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// A7 · Calendar / Anniversary
// ─────────────────────────────────────────────────────────────
function A_Calendar() {
  const days = Array.from({length: 35}, (_,i) => i);
  const today = 16;
  const evt = { 4: 'red', 10: 'blue', 16: 'today', 22: 'red', 25: 'yellow' };
  return (
    <Frame dir={dirA}>
      <div style={{ padding: '14px 22px 90px' }}>
        <div className="h1">2024 · 5월</div>
        <div className="meta" style={{ marginTop: 4 }}>이번 달 기념일 <b style={{ color:'var(--accent)' }}>3개</b></div>

        {/* calendar grid */}
        <div className="card" style={{ marginTop: 14, padding: 12 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
            {['일','월','화','수','목','금','토'].map((d,i)=>(
              <div key={i} className="meta" style={{ textAlign:'center', color: i===0?'var(--accent)':'var(--ink-2)' }}>{d}</div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap: 2 }}>
            {days.map(d => {
              const dn = d - 2;
              const isToday = dn === today;
              const e = evt[dn];
              return (
                <div key={d} style={{ aspectRatio: '1', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', fontFamily:'var(--font-display)', fontSize: 16, color: dn < 1 || dn > 31 ? 'var(--ink-3)' : 'var(--ink)', background: isToday ? 'var(--ink)' : 'transparent', color: isToday ? 'var(--paper)' : undefined, borderRadius: 999 }}>
                  {dn >= 1 && dn <= 31 ? dn : ''}
                  {e && e !== 'today' && <div style={{ position:'absolute', bottom: 3, width: 4, height: 4, borderRadius: '50%', background: e === 'red' ? 'var(--accent)' : e === 'blue' ? 'var(--accent-2)' : 'var(--yellow)' }}/>}
                </div>
              );
            })}
          </div>
        </div>

        {/* anniversaries */}
        <div className="tiny" style={{ marginTop: 18 }}>다가오는 기념일</div>
        {[['만난 지 500일', 'D-77', '#E76F51'],['미루 생일', 'D-19', '#4F8FA6'],['첫 여행 1주년', 'D-32', '#F4D27A']].map(([n,d,c],i)=>(
          <div key={i} className="card" style={{ marginTop: 8, padding: 12, display:'flex', alignItems:'center', gap: 12, position:'relative' }}>
            <div style={{ width: 8, height: 36, background: c, borderRadius: 4 }}/>
            <div style={{ flex: 1 }}>
              <div className="h3">{n}</div>
              <div className="meta">2024년 7월 31일</div>
            </div>
            <div className="script" style={{ color: c, fontSize: 24 }}>{d}</div>
          </div>
        ))}
      </div>
      <TabBar active="home" dir={dirA} />
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// A8 · Profile
// ─────────────────────────────────────────────────────────────
function A_Profile() {
  return (
    <Frame dir={dirA}>
      <div style={{ padding: '14px 22px 90px' }}>
        <div className="h1">My</div>

        {/* couple profile card */}
        <div className="card" style={{ marginTop: 14, padding: 18, position:'relative' }}>
          <div className="tape" style={{ top: -8, left: 32 }} />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: 8 }}>
            <Avatar dir={dirA} initial="J" color="#E76F51" size={56}/>
            <div style={{ fontFamily:'var(--font-display)', fontSize: 28, color:'var(--accent)' }}>♥</div>
            <Avatar dir={dirA} initial="M" color="#4F8FA6" size={56}/>
          </div>
          <div className="h2" style={{ textAlign:'center', marginTop: 12 }}>준오 & 미루</div>
          <div className="meta" style={{ textAlign:'center' }}>2023.03.14 부터 함께</div>

          <div style={{ display:'flex', justifyContent:'space-around', marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
            {[['423','일'],['87','추억'],['12','도시']].map(([n,l],i)=>(
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize: 22, color:'var(--ink)' }}>{n}</div>
                <div className="tiny">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* menu */}
        <div className="tiny" style={{ marginTop: 18 }}>설정</div>
        <div className="card" style={{ marginTop: 8 }}>
          {[['🔔','알림 설정'],['🎨','테마 · 코랄'],['📥','내보내기'],['🔒','개인정보'],['💬','문의하기']].map(([e,l],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '14px 14px', borderBottom: i < 4 ? '1px dashed var(--line)' : 'none' }}>
              <div style={{ width: 28, fontSize: 18 }}>{e}</div>
              <div className="h3" style={{ flex: 1 }}>{l}</div>
              <I name="chev" size={14} />
            </div>
          ))}
        </div>
      </div>
      <TabBar active="me" dir={dirA} />
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// A9 · Notifications
// ─────────────────────────────────────────────────────────────
function A_Notifications() {
  return (
    <Frame dir={dirA}>
      <TopBar dir={dirA} title="알림" back />
      <div style={{ padding: '106px 22px 22px' }}>
        <div className="tiny" style={{ color:'var(--accent)' }}>오늘</div>
        {[
          { e:'💌', t:'미루가 편지를 보냈어요', m:'10분 전', new: true },
          { e:'📷', t:'한라산 추억에 사진을 추가했어요', m:'1시간 전', new: true },
          { e:'🎂', t:'미루 생일이 19일 남았어요', m:'2시간 전', new: false },
        ].map((n,i)=>(
          <div key={i} className="card" style={{ marginTop: 10, padding: 14, display:'flex', alignItems:'center', gap: 12, opacity: n.new ? 1 : 0.7 }}>
            <div style={{ fontSize: 22 }}>{n.e}</div>
            <div style={{ flex: 1 }}>
              <div className="h3">{n.t}</div>
              <div className="meta">{n.m}</div>
            </div>
            {n.new && <div style={{ width: 8, height: 8, borderRadius:'50%', background:'var(--accent)' }}/>}
          </div>
        ))}

        <div className="tiny" style={{ marginTop: 22, color:'var(--ink-3)' }}>이번 주</div>
        {[
          { e:'🗺️', t:'부산에 새 핀이 추가됐어요', m:'화요일' },
          { e:'💬', t:'오늘의 질문 · "처음 만난 날 기억나?"', m:'월요일' },
          { e:'🎲', t:'데이트 룰렛 결과: 한강 라면', m:'일요일' },
        ].map((n,i)=>(
          <div key={i} className="card" style={{ marginTop: 10, padding: 14, display:'flex', alignItems:'center', gap: 12, opacity: 0.65 }}>
            <div style={{ fontSize: 22 }}>{n.e}</div>
            <div style={{ flex: 1 }}>
              <div className="h3">{n.t}</div>
              <div className="meta">{n.m}</div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// A10 · NEW FLOW · Wishlist (가고 싶은 곳)
// ─────────────────────────────────────────────────────────────
function A_Wishlist() {
  return (
    <Frame dir={dirA}>
      <TopBar dir={dirA} title="가고 싶은 곳" back right={<I name="plus" size={18}/>} />
      <div style={{ padding: '106px 22px 22px' }}>
        <div className="card" style={{ padding: 14, background: 'var(--accent-soft)', borderColor: 'var(--accent)' }}>
          <div className="tiny" style={{ color:'var(--accent)' }}>WISHLIST</div>
          <div className="h2" style={{ marginTop: 4 }}>둘이 같이 적은 곳, <span className="script">14곳</span></div>
        </div>

        {/* filters */}
        <div style={{ display:'flex', gap: 6, marginTop: 14, overflowX:'auto' }}>
          {['전체','국내','해외','데이트','맛집'].map((t,i)=>(
            <div key={i} className="pill" style={i===0?{ background:'var(--ink)', color:'var(--paper)', borderColor:'var(--ink)' }:undefined}>{t}</div>
          ))}
        </div>

        {/* wishlist items */}
        {[
          { p: 'J', n: '오로라 보러 핀란드', who: '준오가 적음', when: '12월쯤', emoji: '❄️' },
          { p: 'M', n: '교토 단풍 료칸', who: '미루가 적음', when: '가을', emoji: '🍁' },
          { p: 'BOTH', n: '제주 한 달 살기', who: '둘 다 ♥', when: '내년 봄', emoji: '🏝️' },
          { p: 'M', n: '강릉 바다 새벽 드라이브', who: '미루가 적음', when: '아무 때나', emoji: '🌊' },
        ].map((w,i)=>(
          <div key={i} className="card" style={{ marginTop: 12, padding: 14, position:'relative', transform: i%2===0?'rotate(-0.4deg)':'rotate(0.4deg)' }}>
            <div style={{ position:'absolute', left: 14, top: 14, fontSize: 22 }}>{w.emoji}</div>
            <div style={{ marginLeft: 36 }}>
              <div className="h3">{w.n}</div>
              <div className="meta">{w.who} · {w.when}</div>
              <div style={{ display:'flex', gap: 6, marginTop: 8 }}>
                <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }}>일정 잡기</button>
                <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }}>✓ 다녀옴</button>
              </div>
            </div>
            {w.p === 'BOTH' && (
              <div style={{ position:'absolute', right: 14, top: 14, display:'flex' }}>
                <Avatar dir={dirA} initial="J" color="#E76F51" size={20}/>
                <Avatar dir={dirA} initial="M" color="#4F8FA6" size={20}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </Frame>
  );
}

Object.assign(window, { A_Onboarding, A_Today, A_Map, A_AddPlace, A_Timeline, A_MemoryDetail, A_Calendar, A_Profile, A_Notifications, A_Wishlist });
