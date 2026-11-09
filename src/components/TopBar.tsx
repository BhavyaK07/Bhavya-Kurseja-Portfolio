import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { EMAIL } from '../data/profile';

interface TopBarProps {
  /** Which full-width page is showing, so its link can be highlighted. */
  current: 'all-projects' | 'project';
}

const links = [
  { label: 'Home', hash: 'top' },
  { label: 'All Projects', hash: 'all-projects' }
];

/** Slim header used on the full-width pages (All Projects and each project), in place of the sidebar. */
const TopBar: React.FC<TopBarProps> = ({ current }) => (
  <header className="sticky top-0 z-30 border-b border-dark-border bg-dark-bg/85 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
      <a href="#top" className="font-bold text-white hover:text-accent transition-colors duration-200 cursor-target">
        Bhavya Kurseja
      </a>

      <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
        {links.map((link) => {
          const isActive = link.hash === current;
          return (
            <a
              key={link.hash}
              href={`#${link.hash}`}
              aria-current={isActive ? 'page' : undefined}
              className={`px-3 py-2 text-sm transition-colors duration-200 cursor-target ${
                isActive ? 'text-white border-b-2 border-accent' : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          );
        })}
        <a
          href={`mailto:${EMAIL}`}
          aria-label="Email Bhavya"
          className="ml-1 inline-flex items-center gap-2 bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent/85 transition-colors duration-200 cursor-target"
        >
          <FaEnvelope className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Contact</span>
        </a>
      </nav>
    </div>
  </header>
);

export default TopBar;
