'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { setCookie } from '@/lib/cookies';

const MENU_KEY = 'lastMenuPath';

export default function Header() {
  const [open, setOpen] = useState(false);

  const remember = (path: string) => {
    setCookie(MENU_KEY, path, 30);
    setOpen(false);
  };

  return (
    <header
      role="banner"
      aria-label="Site header"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderBottom: '1px solid #ddd',
        position: 'sticky',
        top: 0,
        background: 'var(--bg, #fff)',
        zIndex: 50,
      }}
    >
      {/* Replace with your real student number */}
      <span aria-label="Student number" style={{ fontWeight: 700 }}>
        Student No: 12345678
      </span>

      <button
        aria-expanded={open}
        aria-controls="main-menu"
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
        style={{
          marginLeft: 'auto',
          padding: '8px 12px',
          border: '1px solid #ccc',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        ☰
      </button>

      <nav
        id="main-menu"
        role="navigation"
        aria-label="Main menu"
        style={{
          position: 'absolute',
          right: 16,
          top: 56,
          display: open ? 'block' : 'none',
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            ['/', 'Home'],
            ['/about', 'About'],
            ['/escape-room', 'Escape Room'],
            ['/coding-races', 'Coding Races'],
            ['/court-room', 'Court Room'],
          ].map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => remember(href)}
                style={{ display: 'block', padding: '8px 12px' }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ marginLeft: open ? 0 : 'auto' }}>
        <ThemeToggle />
      </div>
    </header>
  );
}
