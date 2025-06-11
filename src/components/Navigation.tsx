'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/tickets', label: 'Tickets', icon: '🎫' },
    { href: '/calendar', label: 'Calendar', icon: '📅' },
    { href: '/projects', label: 'Projects', icon: '📁' },
    { href: '/team', label: 'Team', icon: '👥' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="nav">
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4 text-xl font-bold text-primary">
              🚀 LunarFlow
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <button className="btn btn-secondary">
              👤 Profile
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 