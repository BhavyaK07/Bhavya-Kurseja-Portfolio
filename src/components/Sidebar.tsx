import React from 'react';
import ProfilePanel from './ProfilePanel';

interface SidebarProps {
  currentSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection }) => (
  <aside className="fixed left-0 top-0 h-screen w-[var(--sidebar-w)] overflow-y-auto px-4 py-6 xl:px-6 xl:py-8 2xl:px-8 2xl:py-10" style={{ zIndex: 10 }}>
    <ProfilePanel currentSection={currentSection} />
  </aside>
);

export default Sidebar;
