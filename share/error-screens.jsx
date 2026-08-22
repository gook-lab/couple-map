// error-screens.jsx — error/empty state screens × 3 directions.

// ── 404 ──────────────────────────────────────────────────
function A_404() {
  return (
    <Frame dir="a">
      <TopBar dir="a" title="" back />
      <div style={{ padding: '120px 24px 22px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div className="script" style={{ fontSize: 90, lineHeight: 1, color: 'var(--accent)' }}>404</div>
        <div className="h2" style={{ marginTop: 12 }}>여기는 아직 가보지 못한 곳이네요</div>
        <div className="body" style={{ marginTop: 8, color:'var(--ink-2)' }}>주소가 바뀌었거나 사라진 페이지일 수 있어요.</div>
        <div className="card" style={{ marginTop: 22, padding: 14, transform:'rotate(-1deg)' }}>
          <div className="ph" style={{ width: 240, height: 140, borderRadius: 4 }}>missing photo</div>
          <div className="script" style={{ marginTop: 8 }}>여기 뭐가 있었더라…</div>
        </div>
        <button className="btn btn-accent" style={{ marginTop: 22, width: '100%' }}>홈으로 돌아가기</button>
        <button className="btn btn-ghost" style={{ marginTop: 8, width: '100%' }}>이전 페이지</button>
      </div>
    </Frame>
  );
}

function B_404() {
  return (
    <Frame dir="b">
      <TopBar dir="b" title="" back />
      <div style={{ padding: '140px 24px 22px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ width: 100, height: 100, borderRadius: 28, background:'var(--paper)', boxShadow:'var(--shadow)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 48 }}>🔍</div>
        <div className="h1" style={{ marginTop: 22 }}>페이지를 찾을 수 없어요</div>
        <div className="body" style={{ marginTop: 10, color:'var(--ink-2)', lineHeight: 1.7 }}>
          이미 삭제되었거나 잘못된 주소로 접속했어요. 홈으로 돌아가서 다시 시도해 주세요.
        </div>
        <div className="meta" style={{ marginTop: 18, padding: '8px 12px', borderRadius: 8, background:'var(--paper-2)', fontFamily:'ui-monospace, SF Mono, Menlo, monospace' }}>error_code: 404 · not_found</div>
        <div style={{ height: 'auto', minHeight: 80 }}/>
        <button className="btn btn-accent" style={{ marginTop: 24, width: '100%' }}>홈으로</button>
        <button className="btn btn-ghost" style={{ marginTop: 8, width: '100%' }}>고객센터 문의</button>
      </div>
    </Frame>
  );
}

function C_404() {
  return (
    <Frame dir="c">
      <TopBar dir="c" title="" back />
      <div style={{ padding: '100px 24px 22px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ position:'relative', marginTop: 20 }}>
          <div style={{ width: 130, height: 130, borderRadius: 30, background:'var(--c-peach)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 64, transform: 'rotate(-4deg)' }}>🗺️</div>
          <div className="sticker" style={{ position:'absolute', top: -8, right: -16, background:'var(--c-butter)', border:'1.5px solid var(--ink)', fontSize: 14, transform:'rotate(8deg)' }}>404</div>
        </div>
        <div className="h1" style={{ marginTop: 22 }}>길을 잃었어요!</div>
        <div className="body" style={{ marginTop: 10, color:'var(--ink-2)', lineHeight: 1.6 }}>
          여긴 우리 지도에 없는 곳이에요.<br/>홈으로 다시 가볼까요?
        </div>
        <button className="btn btn-accent" style={{ marginTop: 28, width: '100%' }}>🏠 홈으로 가기</button>
        <button className="btn btn-ghost" style={{ marginTop: 8, width: '100%' }}>지도로 가기</button>
      </div>
    </Frame>
  );
}

// ── Network Offline ──────────────────────────────────────
function A_Offline() {
  return (
    <Frame dir="a">
      <div style={{ padding: '120px 24px 22px', textAlign:'center' }}>
        <div className="script" style={{ fontSize: 28 }}>잠시만, 연결이…</div>
        <div className="h1" style={{ marginTop: 6 }}>오프라인</div>
        <div className="body" style={{ marginTop: 10, color:'var(--ink-2)' }}>인터넷 연결을 확인해 주세요. 작성하던 글은 자동으로 저장되었어요.</div>

        <div className="card" style={{ marginTop: 22, padding: 14, textAlign:'left' }}>
          <div className="tiny" style={{ color:'var(--accent)' }}>OFFLINE DRAFTS · 2</div>
          {['한라산 정상에서 (5/10)','속초 새벽 드라이브 (4/28)'].map((t,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, padding: '10px 0', borderBottom: i === 0 ? '1px dashed var(--line)' : 'none' }}>
              <div style={{ fontSize: 18 }}>📝</div>
              <div className="body" style={{ flex: 1 }}>{t}</div>
              <div className="meta">대기중</div>
            </div>
          ))}
        </div>
        <button className="btn btn-accent" style={{ marginTop: 22, width: '100%' }}>다시 시도</button>
      </div>
    </Frame>
  );
}

function B_Offline() {
  return (
    <Frame dir="b">
      <div style={{ position:'absolute', top: 54, left: 0, right: 0, padding: 10, background:'var(--warn)', color:'white', textAlign:'center', fontWeight: 700, fontSize: 13 }}>● 오프라인 모드 · 연결 대기중</div>
      <div style={{ padding: '120px 24px 22px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: 22, background:'var(--paper-2)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink-2)' }}><I name="wifi-off" size={36}/></div>
        <div className="h1" style={{ marginTop: 18 }}>인터넷 연결 없음</div>
        <div className="body" style={{ marginTop: 8, color:'var(--ink-2)', lineHeight: 1.7 }}>지금까지 작성한 내용은 안전하게 저장되어 있어요. 연결되면 자동으로 동기화됩니다.</div>

        <div className="card" style={{ marginTop: 22, padding: 14, textAlign:'left', width: '100%', background:'var(--paper-2)', boxShadow:'none' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div className="icon-sq">📝</div>
            <div style={{ flex: 1 }}>
              <div className="h3">대기중인 변경사항</div>
              <div className="meta">사진 3장, 메모 1개</div>
            </div>
            <div className="pill" style={{ color:'var(--warn)', background:'white' }}>2</div>
          </div>
        </div>
        <button className="btn btn-accent" style={{ marginTop: 22, width: '100%' }}>다시 시도</button>
        <button className="btn btn-ghost" style={{ marginTop: 8, width: '100%' }}>오프라인으로 계속</button>
      </div>
    </Frame>
  );
}

function C_Offline() {
  return (
    <Frame dir="c">
      <div style={{ padding: '110px 24px 22px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ position:'relative' }}>
          <div style={{ width: 130, height: 130, borderRadius: 30, background:'var(--c-sky)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 56, transform:'rotate(3deg)' }}>📡</div>
          <div className="sticker" style={{ position:'absolute', bottom: -10, left: -10, background:'var(--c-pink)', border:'1.5px solid var(--ink)', fontSize: 14, transform:'rotate(-8deg)' }}>OFF</div>
        </div>
        <div className="h1" style={{ marginTop: 22 }}>잠깐, 끊겼어요!</div>
        <div className="body" style={{ marginTop: 10, color:'var(--ink-2)' }}>인터넷 연결을 확인해 주세요.<br/>적어둔 내용은 안 사라져요 😉</div>

        {/* drafts queue */}
        <div style={{ marginTop: 22, width: '100%', padding: 14, borderRadius: 18, background:'var(--c-butter)', border:'1.5px solid var(--ink)', textAlign:'left' }}>
          <div className="tiny" style={{ display:'flex', justifyContent:'space-between' }}>
            <span>저장 대기중</span>
            <span>2개</span>
          </div>
          {[['📝','한라산 정상에서'],['📷','속초 새벽 드라이브']].map(([e,t],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, paddingTop: 10 }}>
              <div style={{ fontSize: 18 }}>{e}</div>
              <div className="body" style={{ flex: 1, fontWeight: 700 }}>{t}</div>
              <div className="badge-c" style={{ background:'white', minWidth: 0, width: 22, height: 22, fontSize: 14 }}>⏳</div>
            </div>
          ))}
        </div>

        <button className="btn btn-accent" style={{ marginTop: 22, width: '100%' }}>다시 시도</button>
      </div>
    </Frame>
  );
}

// ── Permission Denied (camera/location) ───────────────────
function A_Permission() {
  return (
    <Frame dir="a">
      <TopBar dir="a" title="" back right={<I name="x" size={18}/>} />
      <div style={{ padding: '110px 24px 22px', textAlign:'center' }}>
        <div style={{ fontSize: 54, marginTop: 10 }}>📍</div>
        <div className="h1" style={{ marginTop: 14 }}>위치 권한이 필요해요</div>
        <div className="body" style={{ marginTop: 10, color:'var(--ink-2)', lineHeight: 1.7 }}>
          지금 있는 곳에 핀을 꽂으려면 위치 정보가 필요해요. 설정에서 권한을 허용해 주세요.
        </div>

        <div className="card" style={{ marginTop: 22, padding: 14, textAlign:'left' }}>
          <div className="tiny">권한 안내</div>
          {[
            ['📍','위치','지금 있는 곳을 자동으로 기록'],
            ['📷','카메라','사진을 바로 첨부'],
            ['🔔','알림','파트너 활동 알림'],
          ].map(([e,t,m],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, padding: '10px 0', borderBottom: i < 2 ? '1px dashed var(--line)' : 'none' }}>
              <div style={{ fontSize: 20 }}>{e}</div>
              <div style={{ flex: 1 }}>
                <div className="h3">{t}</div>
                <div className="meta">{m}</div>
              </div>
              <div className="pill" style={{ background: i===0?'var(--accent-soft)':'var(--paper-2)', color: i===0?'var(--accent)':'var(--ink-2)' }}>{i===0?'거부됨':'허용됨'}</div>
            </div>
          ))}
        </div>

        <button className="btn btn-accent" style={{ marginTop: 22, width: '100%' }}>설정 열기</button>
        <button className="btn btn-ghost" style={{ marginTop: 8, width: '100%' }}>지금은 건너뛰기</button>
      </div>
    </Frame>
  );
}

function B_Permission() {
  return (
    <Frame dir="b">
      <div style={{ position:'absolute', inset: 0, background:'rgba(20,22,26,0.4)' }}/>
      {/* sheet */}
      <div style={{ position:'absolute', left: 0, right: 0, bottom: 0, background:'var(--paper)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background:'var(--line)', margin:'0 auto 22px' }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width: 72, height: 72, borderRadius: 18, background:'var(--accent-soft)', color:'var(--accent)', margin: '0 auto' }}><I name="lock" size={32}/></div>
        <div className="h1" style={{ textAlign:'center', marginTop: 18 }}>카메라 권한이 필요해요</div>
        <div className="body" style={{ textAlign:'center', marginTop: 8, color:'var(--ink-2)', lineHeight: 1.7 }}>
          사진을 첨부하려면 카메라 권한이 있어야 해요. 설정에서 언제든 변경할 수 있어요.
        </div>

        <div style={{ marginTop: 22 }}>
          {[
            ['📷','사진만 사용','업로드한 사진은 둘만 봐요'],
            ['🔒','암호화 저장','전송 중 암호화 적용'],
            ['🚫','광고/추적 없음','데이터를 팔지 않아요'],
          ].map(([e,t,m],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 14, padding: '12px 0' }}>
              <div className="icon-sq">{e}</div>
              <div style={{ flex: 1 }}>
                <div className="h3">{t}</div>
                <div className="meta">{m}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-accent" style={{ marginTop: 18, width: '100%' }}>설정에서 허용하기</button>
        <button className="btn btn-ghost" style={{ marginTop: 8, width: '100%' }}>나중에</button>
      </div>
    </Frame>
  );
}

function C_Permission() {
  return (
    <Frame dir="c">
      <div style={{ padding: '90px 24px 22px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ position:'relative', marginTop: 14 }}>
          <div style={{ width: 130, height: 130, borderRadius: 30, background:'var(--c-mint)', border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 60, transform:'rotate(-3deg)' }}>📷</div>
          <div className="sticker" style={{ position:'absolute', top: 6, right: -12, background:'var(--c-pink)', border:'1.5px solid var(--ink)', fontSize: 14, transform:'rotate(10deg)' }}>OFF</div>
        </div>
        <div className="h1" style={{ marginTop: 22 }}>사진 추가하려면 권한 필요!</div>
        <div className="body" style={{ marginTop: 10, color:'var(--ink-2)', lineHeight: 1.6 }}>
          카메라 권한을 켜면 추억을 바로 찍어 올릴 수 있어요 ✨
        </div>

        {/* permission cards */}
        <div style={{ marginTop: 22, width: '100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          {[
            ['📷','카메라','꺼짐','var(--c-pink)'],
            ['📍','위치','켜짐','var(--c-mint)'],
            ['🔔','알림','켜짐','var(--c-butter)'],
            ['🎤','마이크','꺼짐','var(--c-sky)'],
          ].map(([e,t,s,c],i)=>(
            <div key={i} style={{ padding: 12, borderRadius: 14, background: c, border:'1.5px solid var(--ink)', textAlign:'left' }}>
              <div style={{ fontSize: 22 }}>{e}</div>
              <div className="h3" style={{ marginTop: 4 }}>{t}</div>
              <div style={{ marginTop: 6 }}>
                <div className="sticker" style={{ background:'white', border:'1.5px solid var(--ink)', fontSize: 10 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-accent" style={{ marginTop: 22, width: '100%' }}>설정 열기 →</button>
      </div>
    </Frame>
  );
}

// ── Empty State (no memories yet) ─────────────────────────
function A_Empty() {
  return (
    <Frame dir="a">
      <div style={{ padding: '14px 22px 90px' }}>
        <div className="h1">우리의 일기장</div>
        <div className="meta" style={{ marginTop: 4 }}>아직 비어있어요 · 함께 채워봐요</div>

        {/* big empty card */}
        <div className="card" style={{ marginTop: 30, padding: 24, transform: 'rotate(-1deg)', position:'relative', textAlign:'center' }}>
          <div className="tape" style={{ top: -10, left: 40 }}/>
          <div className="tape" style={{ top: -10, right: 40, transform:'rotate(4deg)' }}/>
          <div style={{ fontSize: 48, marginTop: 10 }}>📔</div>
          <div className="script" style={{ marginTop: 8, fontSize: 26 }}>첫 페이지를 함께 써봐요</div>
          <div className="body" style={{ marginTop: 8, color:'var(--ink-2)' }}>
            가장 좋아하는 장소부터 시작해도 좋고,<br/>오늘 점심 먹은 식당부터 시작해도 좋아요.
          </div>
          {/* faded ruled lines */}
          <div style={{ marginTop: 14 }}>
            {[1,2,3,4].map(i=>(<div key={i} style={{ borderBottom:'1px dashed var(--line)', marginTop: 12, opacity: 1 - i*0.18 }}/>))}
          </div>
        </div>

        <button className="btn btn-accent" style={{ marginTop: 22, width: '100%' }}>첫 추억 적기 ✎</button>
        <button className="btn btn-ghost" style={{ marginTop: 8, width: '100%' }}>예시 보기</button>
      </div>
      <TabBar active="timeline" dir="a" />
    </Frame>
  );
}

function B_Empty() {
  return (
    <Frame dir="b">
      <div style={{ padding: '14px 20px 90px' }}>
        <div className="h1">추억</div>
        <div className="meta" style={{ marginTop: 4 }}>아직 추억이 없어요</div>

        <div style={{ marginTop: 60, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: 24, background:'var(--accent-soft)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 44 }}>📷</div>
          <div className="h1" style={{ marginTop: 22 }}>첫 추억을 기록해보세요</div>
          <div className="body" style={{ marginTop: 10, color:'var(--ink-2)', lineHeight: 1.7 }}>
            장소, 사진, 한 줄 메모만 있으면<br/>충분해요. 30초면 끝나요.
          </div>
        </div>

        {/* example cards (faded) */}
        <div className="tiny" style={{ marginTop: 30 }}>이렇게 쌓여요</div>
        <div style={{ display:'flex', gap: 10, marginTop: 10, opacity: 0.5 }}>
          {[['🏝️','제주'],['🌸','한강'],['🍱','오사카']].map(([e,n],i)=>(
            <div key={i} className="card" style={{ flex: 1, padding: 12, boxShadow:'none' }}>
              <div className="ph" style={{ height: 70, borderRadius: 8 }}/>
              <div className="h3" style={{ marginTop: 8 }}>{e} {n}</div>
              <div className="meta">예시</div>
            </div>
          ))}
        </div>

        <button className="btn btn-accent" style={{ marginTop: 22, width: '100%' }}>+ 첫 추억 만들기</button>
      </div>
      <TabBar active="timeline" dir="b" />
    </Frame>
  );
}

function C_Empty() {
  return (
    <Frame dir="c">
      <div style={{ padding: '14px 18px 90px' }}>
        <div className="h1">추억 보관함 📦</div>
        <div className="meta" style={{ marginTop: 4 }}>아직 비어 있어요</div>

        {/* empty box illustration */}
        <div style={{ marginTop: 36, padding: 28, borderRadius: 28, background:'var(--c-butter)', border:'1.5px dashed var(--ink)', textAlign:'center', position:'relative' }}>
          <div style={{ fontSize: 70 }}>📦</div>
          <div className="sticker" style={{ position:'absolute', top: 16, right: 16, background:'var(--c-pink)', border:'1.5px solid var(--ink)', transform:'rotate(8deg)' }}>비어있음</div>
          <div className="h2" style={{ marginTop: 12 }}>첫 추억을 넣어볼까요?</div>
          <div className="meta" style={{ marginTop: 6 }}>오늘부터 차근차근 쌓아봐요</div>
        </div>

        {/* starter prompts */}
        <div className="tiny" style={{ marginTop: 22 }}>이런 거 어때요?</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 8 }}>
          {[
            ['☕','오늘 간 카페','var(--c-peach)'],
            ['🍱','지난 데이트 맛집','var(--c-mint)'],
            ['📷','가장 좋아하는 사진','var(--c-sky)'],
            ['💌','첫 만난 날','var(--c-lilac)'],
          ].map(([e,t,c],i)=>(
            <div key={i} style={{ padding: 12, borderRadius: 14, background: c, border:'1.5px solid var(--ink)', boxShadow:'var(--shadow-chunk)' }}>
              <div style={{ fontSize: 24 }}>{e}</div>
              <div className="h3" style={{ marginTop: 6 }}>{t}</div>
            </div>
          ))}
        </div>

        <button className="btn btn-accent" style={{ marginTop: 22, width: '100%' }}>+ 시작하기</button>
      </div>
      <TabBar active="timeline" dir="c" />
    </Frame>
  );
}

Object.assign(window, {
  A_404, B_404, C_404,
  A_Offline, B_Offline, C_Offline,
  A_Permission, B_Permission, C_Permission,
  A_Empty, B_Empty, C_Empty,
});
