import React from 'react';
import ProfilePanel from './ProfilePanel';

interface SidebarProps {
  currentSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection }) => (
  <aside className="fixed left-0 top-0 h-screen w-[300px] overflow-y-auto px-4 py-6" style={{ zIndex: 10 }}>
    <ProfilePanel currentSection={currentSection} />
  </aside>
);

export default Sidebar;
