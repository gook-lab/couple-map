// typography.jsx — typography spec sheets for the 3 directions.

function TypoSheet({ dir, name, displayFont, bodyFont, accentFont, fontUrl, accent }) {
  return (
    <div className={'dir-' + dir} style={{ width: 720, height: 1040, padding: 56, background: 'var(--bg)', position: 'relative', boxSizing: 'border-box', color: 'var(--ink)', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', borderBottom: '1.5px solid var(--ink)', paddingBottom: 14 }}>
        <div>
          <div className="tiny">TYPOGRAPHY · DIRECTION {dir.toUpperCase()}</div>
          <div className="h1" style={{ marginTop: 4 }}>{name}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div className="meta">Display</div>
          <div className="h3" style={{ fontFamily: displayFont }}>{displayFont.split(',')[0].replace(/"/g, '')}</div>
          <div className="meta" style={{ marginTop: 8 }}>Body</div>
          <div className="h3">{bodyFont.split(',')[0].replace(/"/g, '')}</div>
        </div>
      </div>

      {/* type scale */}
      <div style={{ marginTop: 28 }}>
        <div className="tiny" style={{ color: accent }}>TYPE SCALE</div>
        <div style={{ marginTop: 12 }}>
          {[
            { name:'H1', class:'h1', size: '28-32px', weight: dir === 'a' ? '700 · Gaegu' : '800 · Pretendard', sample:'우리의 일기장', use:'Page hero · 1 per screen' },
            { name:'H2', class:'h2', size: '20-22px', weight: dir === 'a' ? '700 · Gaegu' : '700 · Pretendard', sample:'다가오는 기념일', use:'Section header' },
            { name:'H3', class:'h3', size: '15-17px', weight: dir === 'c' ? '700' : '600', sample:'한라산 정상에서', use:'Card title · list row' },
            { name:'Body', class:'body', size: '14-15px', weight: dir === 'c' ? '500' : '400', sample:'눈이 무릎까지 쌓여 있었지. 미루가 자꾸 미끄러져서.', use:'Body copy · paragraphs' },
            { name:'Meta', class:'meta', size: '12-13px', weight: '400', sample:'2024년 5월 10일 · 토요일', use:'Timestamps · subtitles' },
            { name:'Tiny', class:'tiny', size: '10-11px', weight: dir === 'c' ? '700' : '600', sample:'WISHLIST · MAY 2024', use:'Eyebrow · labels · uppercase' },
          ].map((row, i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'70px 100px 140px 1fr', alignItems:'baseline', gap: 16, padding: '14px 0', borderBottom: '1px dashed var(--line)' }}>
              <div className="tiny" style={{ color: accent, alignSelf:'center' }}>{row.name}</div>
              <div className="meta" style={{ fontFamily:'ui-monospace, SF Mono, Menlo, monospace', fontSize: 11 }}>{row.size}<br/><span style={{ opacity: 0.7 }}>{row.weight}</span></div>
              <div style={{ alignSelf:'center' }}>
                <div className="meta" style={{ fontSize: 10 }}>{row.use}</div>
              </div>
              <div className={row.class}>{row.sample}</div>
            </div>
          ))}
        </div>
      </div>

      {/* font specimen — display */}
      <div style={{ marginTop: 30, padding: 20, borderRadius: dir === 'b' ? 14 : dir === 'c' ? 18 : 10, background: 'var(--paper)', border: dir === 'a' ? '1px solid var(--line)' : dir === 'c' ? '1.5px solid var(--ink)' : 'none', boxShadow: dir === 'b' ? 'var(--shadow)' : dir === 'c' ? 'var(--shadow-chunk)' : 'none' }}>
        <div className="tiny" style={{ color: accent }}>DISPLAY SPECIMEN</div>
        <div className="h1" style={{ marginTop: 8, fontSize: 56, lineHeight: 1.05 }}>오늘도 함께</div>
        <div className="meta" style={{ marginTop: 6 }}>AaBbCc · 가나다 · 0123 · ♥ ✦</div>
      </div>

      {/* accent script (direction A only) — for warm diary, secondary handwriting font */}
      {dir === 'a' && (
        <div style={{ marginTop: 20, padding: 16, borderRadius: 10, background: 'var(--accent-soft)', border: '1px solid var(--line)' }}>
          <div className="tiny" style={{ color: 'var(--accent)' }}>ACCENT · HANDWRITTEN (CAVEAT)</div>
          <div className="script" style={{ marginTop: 6, fontSize: 28 }}>벚꽃 보러 간 날 — 한 줄 메모, 코멘트에 사용</div>
        </div>
      )}

      {/* footer · usage rules */}
      <div style={{ position:'absolute', left: 56, right: 56, bottom: 40 }}>
        <div className="tiny" style={{ color:'var(--ink-3)' }}>RULES</div>
        <div className="meta" style={{ marginTop: 6, lineHeight: 1.7 }}>
          {dir === 'a' && '• 본문은 Pretendard, 헤드라인·메모는 Gaegu / Caveat을 혼용해 손맛을 표현. 한 화면에 손글씨는 1-2곳까지.'}
          {dir === 'b' && '• 단일 폰트(Pretendard) · 굵기 차이로 위계 표현. letter-spacing 음수(-0.3~-0.6px) 적용으로 모던한 느낌. 한 화면에 H1은 1개만.'}
          {dir === 'c' && '• 단일 폰트(Pretendard) · 굵기는 500/700/800 위주로 묵직하게. 이모지·뱃지와 조합해 발랄함을 더함. 본문도 500 이상으로 두껍게.'}
        </div>
      </div>
    </div>
  );
}

function TypoSheetA() { return <TypoSheet dir="a" name="Warm Diary" displayFont='"Gaegu", "Pretendard"' bodyFont='"Pretendard"' accentFont='"Caveat"' accent="var(--accent)"/>; }
function TypoSheetB() { return <TypoSheet dir="b" name="Modern Clean" displayFont='"Pretendard"' bodyFont='"Pretendard"' accent="var(--accent)"/>; }
function TypoSheetC() { return <TypoSheet dir="c" name="Memory Pocket" displayFont='"Pretendard"' bodyFont='"Pretendard"' accent="var(--accent)"/>; }

Object.assign(window, { TypoSheetA, TypoSheetB, TypoSheetC });
