import React from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiDevpost } from 'react-icons/si';

export const EMAIL = 'bkurseja@uwaterloo.ca';

/** Shown in the sidebar status card. Set NEXT_COOP_TERM (e.g. 'Summer 2027') to show the exact term. */
export const CURRENT_ROLE = { title: 'Product Hardware Engineer', org: 'Brickeye' };
export const NEXT_COOP_TERM: string | null = 'Summer 2027';

export const socialLinks: { name: string; url: string; icon: React.ReactNode }[] = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/bhavyakurseja/', icon: <FaLinkedin className="w-5 h-5" /> },
  { name: 'GitHub', url: 'https://github.com/BhavyaK07', icon: <FaGithub className="w-5 h-5" /> },
  { name: 'Email', url: `mailto:${EMAIL}`, icon: <FaEnvelope className="w-5 h-5" /> },
  { name: 'Devpost', url: 'https://devpost.com/bdkurseja', icon: <SiDevpost className="w-5 h-5" /> }
];

export type NavItem = { label: string; hash: string; icon: React.ReactNode };

const iconProps = { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' };
const path = (d: string) => <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />;

export const navItems: NavItem[] = [
  {
    label: 'Projects',
    hash: 'projects',
    icon: <svg {...iconProps}>{path('M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10')}</svg>
  },
  {
    label: 'Experience',
    hash: 'experience',
    icon: <svg {...iconProps}>{path('M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z')}</svg>
  },
  {
    label: 'Skills',
    hash: 'skills',
    icon: <svg {...iconProps}>{path('M9.75 17L6 20.75M6 20.75L2.25 17M6 20.75V13.5M14.25 7L18 3.25M18 3.25L21.75 7M18 3.25V10.5')}</svg>
  }
];

/** Which nav item should look active for a given section (project pages count as Projects). */
export const activeNavHash = (section: string) => (section === 'project' ? 'projects' : section);
