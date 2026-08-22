// styles.jsx — three design directions for couple-app proposals.
// Each direction exports a CSS-vars block consumed by .dir-a, .dir-b, .dir-c roots.

(function injectFonts() {
  if (document.getElementById('proposal-fonts')) return;
  const l = document.createElement('link');
  l.id = 'proposal-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Pretendard:wght@400;500;600;700;800&family=Caveat:wght@400;600&family=Nanum+Pen+Script&display=swap';
  document.head.appendChild(l);

  // Pretendard isn't on Google Fonts; use the official CDN
  const p = document.createElement('link');
  p.rel = 'stylesheet';
  p.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css';
  document.head.appendChild(p);
})();

(function injectStyles() {
  if (document.getElementById('proposal-styles')) return;
  const s = document.createElement('style');
  s.id = 'proposal-styles';
  s.textContent = `
  /* ============================================================
     DIRECTION A — Warm Diary
     ============================================================ */
  .dir-a {
    --font: "Pretendard", -apple-system, sans-serif;
    --font-display: "Gaegu", "Nanum Pen Script", "Pretendard", cursive;
    --font-accent: "Caveat", "Gaegu", cursive;
    --bg: #FBF6EC;
    --paper: #FFFDF6;
    --paper-2: #F4ECDB;
    --ink: #2A241D;
    --ink-2: #6B5E4E;
    --ink-3: #A89B85;
    --line: rgba(42, 36, 29, 0.16);
    --line-strong: rgba(42, 36, 29, 0.36);
    --accent: #E76F51;
    --accent-soft: #FBE0D4;
    --accent-2: #4F8FA6;
    --yellow: #F4D27A;
    --green: #8FA873;
    --radius: 10px;
    --radius-lg: 16px;
    --shadow: 0 2px 0 rgba(42,36,29,0.06), 0 8px 24px rgba(42,36,29,0.06);
    --shadow-tape: 1px 1px 0 rgba(42,36,29,0.08);
    --paper-grain: radial-gradient(rgba(42,36,29,0.04) 1px, transparent 1px) 0 0/3px 3px,
                   radial-gradient(rgba(42,36,29,0.03) 1px, transparent 1px) 1.5px 1.5px/3px 3px;
  }
  .dir-a .h1 { font-family: var(--font-display); font-weight: 700; font-size: 32px; letter-spacing: -0.2px; line-height: 1.15;}
  .dir-a .h2 { font-family: var(--font-display); font-weight: 700; font-size: 22px; line-height: 1.2; }
  .dir-a .h3 { font-family: var(--font); font-weight: 700; font-size: 15px; }
  .dir-a .body { font-family: var(--font); font-weight: 400; font-size: 14px; color: var(--ink);}
  .dir-a .meta { font-family: var(--font); font-size: 12px; color: var(--ink-2); }
  .dir-a .tiny { font-family: var(--font); font-size: 10px; color: var(--ink-3); letter-spacing: 0.6px; text-transform: uppercase; }
  .dir-a .script { font-family: var(--font-accent); font-weight: 600; font-size: 22px; color: var(--accent); }

  /* ============================================================
     DIRECTION B — Modern Clean
     ============================================================ */
  .dir-b {
    --font: "Pretendard", -apple-system, sans-serif;
    --font-display: "Pretendard", sans-serif;
    --bg: #F4F5F7;
    --paper: #FFFFFF;
    --paper-2: #EEF0F4;
    --ink: #14161A;
    --ink-2: #5F6470;
    --ink-3: #9098A4;
    --line: #E5E8ED;
    --line-strong: #C9CFD8;
    --accent: #3461F0;
    --accent-soft: #E8EEFE;
    --accent-2: #00B86B;
    --warn: #FF8E3C;
    --pink: #FF6F91;
    --radius: 14px;
    --radius-lg: 20px;
    --shadow: 0 1px 2px rgba(20,22,26,0.04), 0 6px 20px rgba(20,22,26,0.05);
  }
  .dir-b .h1 { font-family: var(--font); font-weight: 800; font-size: 28px; letter-spacing: -0.6px; line-height: 1.2; }
  .dir-b .h2 { font-family: var(--font); font-weight: 700; font-size: 20px; letter-spacing: -0.3px; line-height: 1.25; }
  .dir-b .h3 { font-family: var(--font); font-weight: 600; font-size: 15px; letter-spacing: -0.1px; }
  .dir-b .body { font-family: var(--font); font-weight: 400; font-size: 14px; color: var(--ink); }
  .dir-b .meta { font-family: var(--font); font-size: 12px; color: var(--ink-2); }
  .dir-b .tiny { font-family: var(--font); font-size: 11px; color: var(--ink-3); font-weight: 600; letter-spacing: 0.2px; }

  /* ============================================================
     DIRECTION C — Memory Pocket (playful, sticker-y)
     ============================================================ */
  .dir-c {
    --font: "Pretendard", -apple-system, sans-serif;
    --font-display: "Pretendard", sans-serif;
    --bg: #FFF5E8;
    --paper: #FFFFFF;
    --paper-2: #FFEEDC;
    --ink: #2B1B3E;
    --ink-2: #6B5E81;
    --ink-3: #A99FB6;
    --line: rgba(43,27,62,0.12);
    --line-strong: rgba(43,27,62,0.22);
    --accent: #FF7A6B;
    --accent-soft: #FFE0D9;
    --c-peach: #FFB89B;
    --c-mint: #8FD7B8;
    --c-sky: #9FC9F2;
    --c-butter: #F7D77E;
    --c-lilac: #C6A8E5;
    --c-pink: #FF9BC1;
    --radius: 18px;
    --radius-lg: 26px;
    --shadow: 0 2px 0 rgba(43,27,62,0.05), 0 10px 24px rgba(43,27,62,0.10);
    --shadow-chunk: 0 3px 0 rgba(43,27,62,0.18);
  }
  .dir-c .h1 { font-family: var(--font); font-weight: 800; font-size: 28px; letter-spacing: -0.4px; line-height: 1.15; }
  .dir-c .h2 { font-family: var(--font); font-weight: 800; font-size: 20px; letter-spacing: -0.2px; }
  .dir-c .h3 { font-family: var(--font); font-weight: 700; font-size: 15px; }
  .dir-c .body { font-family: var(--font); font-weight: 500; font-size: 14px; color: var(--ink); }
  .dir-c .meta { font-family: var(--font); font-weight: 500; font-size: 12px; color: var(--ink-2); }
  .dir-c .tiny { font-family: var(--font); font-weight: 700; font-size: 10px; color: var(--ink-2); letter-spacing: 0.6px; text-transform: uppercase; }

  /* shared helpers across all directions */
  .frame { width: 402px; height: 874px; position: relative; overflow: hidden; background: var(--bg); }
  .frame, .frame * { box-sizing: border-box; }
  .frame .body, .frame .h1, .frame .h2, .frame .h3, .frame .meta, .frame .tiny { font-family: var(--font); }
  .frame .h1, .frame .h2 { font-family: var(--font-display, var(--font)); }
  .scroll { position: absolute; inset: 0; padding-top: 54px; padding-bottom: 80px; overflow: hidden; }

  /* status bar */
  .status { position: absolute; top: 0; left: 0; right: 0; height: 54px; padding: 18px 24px 0; display: flex; justify-content: space-between; align-items: center; font-family: var(--font); font-size: 14px; font-weight: 600; color: var(--ink); z-index: 30; }
  .home-ind { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); width: 134px; height: 5px; border-radius: 3px; background: var(--ink); opacity: 0.35; }

  /* placeholder imagery */
  .ph { display:flex; align-items:center; justify-content:center; color: var(--ink-3); font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 10px; letter-spacing: 0.4px; text-transform: uppercase; }
  .dir-a .ph { background:
      repeating-linear-gradient(135deg, transparent 0 9px, rgba(42,36,29,0.08) 9px 10px),
      linear-gradient(180deg, #F0E8D5, #E6DCC5);
    border: 1px solid var(--line); }
  .dir-b .ph { background:
      repeating-linear-gradient(135deg, transparent 0 9px, rgba(20,22,26,0.05) 9px 10px),
      #EEF0F4;
    border: 1px dashed var(--line-strong); border-radius: var(--radius); }
  .dir-c .ph { background:
      repeating-linear-gradient(135deg, transparent 0 9px, rgba(43,27,62,0.07) 9px 10px),
      var(--paper-2);
    border: 0; border-radius: var(--radius); }

  /* pill */
  .pill { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
  .dir-a .pill { background: var(--paper); border: 1px solid var(--line-strong); color: var(--ink); }
  .dir-b .pill { background: var(--paper-2); color: var(--ink); }
  .dir-c .pill { background: var(--paper); border: 1.5px solid var(--ink); color: var(--ink); box-shadow: 0 2px 0 rgba(43,27,62,0.12); }

  /* card */
  .card { background: var(--paper); border-radius: var(--radius); }
  .dir-a .card { border: 1px solid var(--line); box-shadow: var(--shadow); }
  .dir-b .card { box-shadow: var(--shadow); }
  .dir-c .card { border: 1.5px solid var(--ink); box-shadow: var(--shadow-chunk); }

  /* primary button */
  .btn { display:inline-flex; align-items:center; justify-content:center; gap: 6px; padding: 12px 18px; border: 0; cursor: pointer; font-weight: 700; font-size: 14px; }
  .dir-a .btn { background: var(--ink); color: var(--paper); border-radius: 999px; }
  .dir-a .btn-accent { background: var(--accent); color: white; }
  .dir-a .btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line-strong); }
  .dir-b .btn { background: var(--ink); color: white; border-radius: var(--radius); padding: 14px 18px; }
  .dir-b .btn-accent { background: var(--accent); }
  .dir-b .btn-ghost { background: var(--paper-2); color: var(--ink); }
  .dir-c .btn { background: var(--ink); color: var(--paper); border-radius: 999px; box-shadow: var(--shadow-chunk); border: 1.5px solid var(--ink); padding: 14px 20px; }
  .dir-c .btn-accent { background: var(--accent); color: white; }
  .dir-c .btn-ghost { background: var(--paper); color: var(--ink); }

  /* bottom tab bar */
  .tabbar { position:absolute; left:0; right:0; bottom:0; height: 80px; padding: 8px 12px 24px; display:grid; grid-template-columns: repeat(5, 1fr); align-items: start; }
  .dir-a .tabbar { background: var(--paper); border-top: 1px solid var(--line); }
  .dir-b .tabbar { background: rgba(255,255,255,0.94); backdrop-filter: blur(20px); border-top: 1px solid var(--line); }
  .dir-c .tabbar { background: var(--paper); border-top: 1.5px solid var(--ink); }
  .tab { display:flex; flex-direction:column; align-items:center; gap:3px; padding-top: 8px; font-size: 10px; color: var(--ink-3); }
  .tab.active { color: var(--ink); font-weight: 700; }
  .dir-a .tab.active, .dir-c .tab.active { color: var(--accent); }
  .dir-b .tab.active { color: var(--accent); }

  /* decorative pieces */
  .tape { position: absolute; width: 56px; height: 18px; background: rgba(244, 210, 122, 0.55); transform: rotate(-4deg); box-shadow: 1px 1px 0 rgba(42,36,29,0.06); }
  .underline-script { background: linear-gradient(transparent 60%, var(--yellow) 60% 95%, transparent 95%); padding: 0 2px; }
  .sticker { display:inline-flex; align-items:center; justify-content:center; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; }

  /* badge accent for direction C */
  .badge-c { display:inline-flex; align-items:center; justify-content:center; min-width: 28px; height: 28px; padding: 0 8px; border-radius: 999px; font-weight: 800; font-size: 12px; border: 1.5px solid var(--ink); box-shadow: 0 2px 0 rgba(43,27,62,0.15); }

  /* fab */
  .fab { position: absolute; right: 18px; bottom: 96px; width: 56px; height: 56px; border-radius: 50%; display:flex; align-items:center; justify-content:center; font-size: 26px; font-weight: 700; color: white; cursor: pointer; }
  .dir-a .fab { background: var(--accent); box-shadow: 0 6px 14px rgba(231,111,81,0.4); }
  .dir-b .fab { background: var(--accent); box-shadow: 0 8px 24px rgba(52,97,240,0.34); }
  .dir-c .fab { background: var(--accent); border: 1.5px solid var(--ink); box-shadow: var(--shadow-chunk); }

  /* small icon block */
  .icon-sq { display:inline-flex; align-items:center; justify-content:center; width: 36px; height: 36px; border-radius: 10px; font-size: 16px; }
  .dir-a .icon-sq { background: var(--paper-2); }
  .dir-b .icon-sq { background: var(--accent-soft); color: var(--accent); border-radius: 10px; }
  .dir-c .icon-sq { background: var(--accent-soft); border: 1.5px solid var(--ink); }
  `;
  document.head.appendChild(s);
})();
