import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { routeGroups } from '../routes';

const editoraLogoUrl = new URL('../assets/editora_logo_blocks.svg', import.meta.url).href;

const sidebarStyle: React.CSSProperties = {
  width: 220,
  minWidth: 220,
  height: '100vh',
  overflowY: 'auto',
  background: '#f8fafc',
  borderRight: '1px solid #e2e8f0',
  padding: '16px 0',
  position: 'sticky',
  top: 0,
  flexShrink: 0,
};

const logoStyle: React.CSSProperties = {
  padding: '0 16px 16px',
  borderBottom: '1px solid #e2e8f0',
  marginBottom: 8,
};

const logoImageStyle: React.CSSProperties = {
  display: 'block',
  height: 30,
  width: 'auto',
};

const groupLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#94a3b8',
  padding: '10px 16px 4px',
};

const linkStyle: React.CSSProperties = {
  display: 'block',
  padding: '5px 16px',
  fontSize: 13,
  color: '#475569',
  textDecoration: 'none',
  borderRadius: 6,
  margin: '1px 6px',
};

const activeLinkStyle: React.CSSProperties = {
  ...linkStyle,
  background: '#e0e7ff',
  color: '#2563eb',
  fontWeight: 600,
};

export function NavSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (label: string) =>
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <nav style={sidebarStyle}>
      <div style={logoStyle}>
        <img src={editoraLogoUrl} alt="Editora" style={logoImageStyle} />
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Component Demos</div>
      </div>

      {routeGroups.map((group) => (
        <div key={group.label}>
          <div
            style={{ ...groupLabelStyle, cursor: 'pointer', userSelect: 'none' }}
            onClick={() => toggle(group.label)}
          >
            {collapsed[group.label] ? '▶' : '▼'} {group.label}
          </div>
          {!collapsed[group.label] &&
            group.routes.map((route) => (
              <NavLink
                key={route.path + route.label}
                to={route.path}
                style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
              >
                {route.label}
              </NavLink>
            ))}
        </div>
      ))}
    </nav>
  );
}
