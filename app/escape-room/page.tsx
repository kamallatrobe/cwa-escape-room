'use client';

import { useEffect, useMemo, useState } from 'react';

type Stage = {
  id: number;
  title: string;
  prompt: string;
  placeholder?: string;
  validator: (answer: string) => boolean;
  hint?: string;
};

export default function EscapeRoom() {
  // ---- basic state
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 min
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle'|'right'|'wrong'|'saved'|'saving'|'error'>('idle');

  // ---- stages (keep it simple & winnable)
  const stages: Stage[] = useMemo(() => ([
    {
      id: 1,
      title: 'Fix the bug',
      prompt: `Find the error: function add(a,b){ return a + b } // (tip: missing ;)`,
      validator: (a) => a.trim().includes('return a + b;'),
      hint: 'Ensure the line ends with a semicolon.',
    },
    {
      id: 2,
      title: 'Numbers 0–1000',
      prompt: 'Write JS that prints numbers 0..1000 (any loop is fine).',
      placeholder: 'for (let i=0;i<=1000;i++){ console.log(i) }',
      validator: (a) => /for\s*\(.*i\s*=\s*0.*i\s*<=\s*1000.*i\+\+/.test(a.replace(/\s+/g,'')),
      hint: 'Use a for-loop that starts at 0 and ends at 1000.',
    },
    {
      id: 3,
      title: 'Convert CSV → JSON',
      prompt: `Given "id,name\\n1,Ada\\n2,Grace", write a snippet that becomes [{id:1,name:"Ada"},{id:2,name:"Grace"}].`,
      validator: (a) => a.toLowerCase().includes('split') && a.toLowerCase().includes('map'),
      hint: 'Think: split by \\n, then split by comma, then map to objects.',
    },
  ]), []);

  // ---- timer
  useEffect(() => {
    if (!started) return;
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const stage = stages[current];
  const finished = current >= stages.length;

  // ---- check answer
  function submit() {
    if (finished || secondsLeft <= 0) return;
    if (stage.validator(answer)) {
      setStatus('right');
      setTimeout(() => {
        setStatus('idle');
        setAnswer('');
        setCurrent((c) => c + 1);
      }, 600);
    } else {
      setStatus('wrong');
      setTimeout(() => setStatus('idle'), 900);
    }
  }

  // ---- inline HTML generator (for “Save Output”)
  function generateInlineHTML() {
    const solved = Math.min(current, stages.length);
    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>Escape Room Export</title>
<style>
  body{font-family:system-ui,Arial;margin:0;padding:24px;background:#0b1220;color:#fff}
  .card{background:#111827;border:1px solid #374151;border-radius:12px;padding:16px;margin:12px 0}
</style>
</head>
<body>
  <h1>Escape Room – Result</h1>
  <div class="card">Solved Stages: ${solved} / ${stages.length}</div>
  <div class="card">Time Remaining: ${minutes}:${seconds}</div>
  <script>
    // Inline JS example
    console.log('Escape Room export loaded');
  </script>
</body>
</html>`;
    return html;
  }

  async function saveOutput() {
    setStatus('saving');
    try {
      const res = await fetch('/api/outputs', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ htmlCode: generateInlineHTML() })
      });
      if (!res.ok) throw new Error('Failed to save');
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (e) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1974&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '24px',
      }}
    >
      <div style={{
        maxWidth: 900, margin: '0 auto',
        background: 'rgba(0,0,0,0.6)',
        borderRadius: 16, padding: 24, color: '#fff'
      }}>
        <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h1 style={{margin:0}}>🗝️ Escape Room</h1>
          <div style={{fontVariantNumeric:'tabular-nums'}}>⏱ {minutes}:{seconds}</div>
        </header>

        {!started ? (
          <button onClick={() => setStarted(true)} style={{
            padding:'10px 16px', borderRadius:8, border:'1px solid #999', background:'#111', color:'#fff', cursor:'pointer'
          }}>
            Start (5:00)
          </button>
        ) : finished ? (
          <div style={{padding:16, background:'#065f46', borderRadius:12}}>
            <strong>Congratulations!</strong> You escaped 🎉
          </div>
        ) : secondsLeft <= 0 ? (
          <div style={{padding:16, background:'#7f1d1d', borderRadius:12}}>
            <strong>Time’s up!</strong> Try again.
          </div>
        ) : (
          <section style={{marginTop:12}}>
            <h2 style={{margin:'4px 0'}}>{stage.title}</h2>
            <p style={{margin:'4px 0 12px'}}>{stage.prompt}</p>

            <textarea
              value={answer}
              onChange={(e)=>setAnswer(e.target.value)}
              placeholder={stage.placeholder ?? 'Type your answer here…'}
              style={{width:'100%',minHeight:120,borderRadius:8,border:'1px solid #555',padding:10,background:'#0f172a',color:'#fff'}}
            />
            <div style={{display:'flex',gap:8,marginTop:10}}>
              <button onClick={submit} style={{padding:'8px 14px',borderRadius:8,border:'1px solid #999',background:'#0b0',color:'#000',cursor:'pointer'}}>Submit</button>
              <button onClick={() => alert(stage.hint ?? 'Think carefully!')} style={{padding:'8px 14px',borderRadius:8,border:'1px solid #999',background:'#111',color:'#fff',cursor:'pointer'}}>Hint</button>
            </div>

            {status === 'right' && <p style={{color:'#22c55e',marginTop:8}}>✅ Correct! Moving on…</p>}
            {status === 'wrong' && <p style={{color:'#ef4444',marginTop:8}}>❌ Not quite. Try again.</p>}
          </section>
        )}

        <hr style={{margin:'20px 0', borderColor:'#334155'}}/>

        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <button onClick={saveOutput} disabled={!started} style={{padding:'8px 14px',borderRadius:8,border:'1px solid #999',background:'#111',color:'#fff',cursor:'pointer'}}>
            💾 Save Output
          </button>
          {status === 'saving' && <span>Saving…</span>}
          {status === 'saved' && <span style={{color:'#22c55e'}}>Saved!</span>}
          {status === 'error' && <span style={{color:'#ef4444'}}>Save failed.</span>}
        </div>
      </div>
    </main>
  );
}

