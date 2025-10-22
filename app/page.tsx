'use client';

import { useEffect, useState } from 'react';
import { getCookie } from '@/lib/cookies';

type Tab = { label: string; content: string };

export default function HomePage() {
  const [tabs, setTabs] = useState<Tab[]>([
    { label: 'Tab 1', content: 'Hello from Tab 1' },
    { label: 'Tab 2', content: 'Hello from Tab 2' },
  ]);
  const [output, setOutput] = useState('');

  useEffect(() => {
    // OPTIONAL: Uncomment to auto-navigate to last menu page stored in cookie
    // const last = getCookie('lastMenuPath');
    // if (last && last !== window.location.pathname) window.location.href = last;
  }, []);

  const updateLabel = (i: number, value: string) => {
    const next = [...tabs];
    next[i].label = value;
    setTabs(next);
  };

  const updateContent = (i: number, value: string) => {
    const next = [...tabs];
    next[i].content = value;
    setTabs(next);
  };

  const addTab = () => setTabs((t) => [...t, { label: `Tab ${t.length + 1}`, content: '' }]);
  const removeTab = (i: number) => setTabs((t) => t.filter((_, idx) => idx !== i));

  const generate = () => {
    const escapeHtml = (s: string) =>
      s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Tabs</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: Arial, sans-serif; margin: 16px; }
      .tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
      .tab-btn {
        padding: 8px 12px; border: 1px solid #ccc; background: #f9f9f9; cursor: pointer;
        border-radius: 6px;
      }
      .tab-btn[aria-selected="true"] {
        background: #e6f0ff; border-color: #7aa7ff; font-weight: 600;
      }
      .panel { display: none; border: 1px solid #ddd; padding: 12px; border-radius: 6px; }
      .panel[data-active="true"] { display: block; }
    </style>
  </head>
  <body>
    <h1>Tabs</h1>
    <div class="tabs" role="tablist" aria-label="Sample tabs">
      ${tabs
        .map(
          (t, i) => `<button
        role="tab"
        id="tab-${i}"
        class="tab-btn"
        aria-selected="${i === 0 ? 'true' : 'false'}"
        aria-controls="panel-${i}"
        tabindex="${i === 0 ? '0' : '-1'}"
        onclick="selectTab(${i})"
      >${escapeHtml(t.label)}</button>`
        )
        .join('\\n')}
    </div>

    ${tabs
      .map(
        (t, i) => `<div
      role="tabpanel"
      id="panel-${i}"
      aria-labelledby="tab-${i}"
      class="panel"
      data-active="${i === 0 ? 'true' : 'false'}"
    >${escapeHtml(t.content).replace(/\\n/g, '<br>')}</div>`
      )
      .join('\\n')}

    <script>
      function selectTab(index) {
        const tabs = document.querySelectorAll('[role="tab"]');
        const panels = document.querySelectorAll('[role="tabpanel"]');
        tabs.forEach((t, i) => {
          t.setAttribute('aria-selected', String(i === index));
          t.setAttribute('tabindex', i === index ? '0' : '-1');
        });
        panels.forEach((p, i) => p.setAttribute('data-active', String(i === index)));
        tabs[index].focus();
      }
      document.addEventListener('keydown', (e) => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const current = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
        if (e.key === 'ArrowRight') { e.preventDefault(); selectTab((current + 1) % tabs.length); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); selectTab((current - 1 + tabs.length) % tabs.length); }
      });
    </script>
  </body>
</html>`;

    setOutput(html);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    alert('HTML copied! Paste into a blank file (e.g., Hello.html) and open in a browser.');
  };

  return (
    <section aria-labelledby="home-title">
      <h1 id="home-title">Tabs Generator (Assignment 1)</h1>
      <p>
        Configure tabs below, then click <strong>Generate</strong>. Copy the result and paste it into a file
        named <code>Hello.html</code>. Open it in a browser—your tabs should work.
      </p>

      <div aria-live="polite" style={{ margin: '12px 0' }}>
        <button onClick={addTab} style={{ padding: '8px 12px', marginRight: 8 }}>➕ Add Tab</button>
        {tabs.length > 1 && (
          <button onClick={() => removeTab(tabs.length - 1)} style={{ padding: '8px 12px' }}>
            ➖ Remove Last Tab
          </button>
        )}
      </div>

      {tabs.map((t, i) => (
        <fieldset key={i} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <legend>Tab {i + 1}</legend>
          <label>
            Label<br />
            <input
              value={t.label}
              onChange={(e) => updateLabel(i, e.target.value)}
              required
              aria-required="true"
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
          <label>
            Content<br />
            <textarea
              value={t.content}
              onChange={(e) => updateContent(i, e.target.value)}
              rows={4}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        </fieldset>
      ))}

      <button onClick={generate} style={{ padding: '10px 16px', marginRight: 8 }}>Generate</button>
      <button onClick={copy} disabled={!output} style={{ padding: '10px 16px' }}>Copy</button>

      <h2 style={{ marginTop: 16 }}>Output</h2>
      <textarea
        value={output}
        readOnly
        rows={16}
        style={{ width: '100%', fontFamily: 'monospace', padding: 8 }}
        aria-label="Generated HTML output"
      />
    </section>
  );
}
