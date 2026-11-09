import React from 'react';
import { CURRENT_ROLE, NEXT_COOP_TERM, activeNavHash, navItems, socialLinks } from '../data/profile';

interface ProfilePanelProps {
  currentSection: string;
  /** Called after a nav item is chosen (e.g. to close the mobile menu). */
  onNavigate?: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ currentSection, onNavigate }) => {
  const activeHash = activeNavHash(currentSection);

  const navigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.blur();
    onNavigate?.();
  };

  return (
    <div className="flex min-h-full flex-col justify-between gap-6">
      <div>
        <div className="flex flex-col items-center">
          <div className="w-full p-3 bg-dark-bg/70 backdrop-blur-sm text-center">
            <p className="text-2xl font-bold text-white mb-2">Bhavya Kurseja</p>
            <p className="text-white text-base">Mechatronics Engineering</p>
            <a
              href="https://uwaterloo.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 text-base hover:text-accent transition-colors duration-200 cursor-target"
            >
              @ University of Waterloo
            </a>
          </div>
        </div>

        {/* Status: what I'm doing now and when I'm available */}
        <div className="mt-3 border border-dark-border bg-dark-card/80 backdrop-blur-sm p-3 text-sm">
          <p className="flex items-center gap-2 font-semibold text-white">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            {NEXT_COOP_TERM ? `Open to ${NEXT_COOP_TERM} co-op` : 'Open to co-op opportunities'}
          </p>
          <p className="mt-1.5 text-gray-400">
            Currently <span className="text-gray-200">{CURRENT_ROLE.title}</span> @ {CURRENT_ROLE.org}
          </p>
        </div>

        <nav className="mt-4 space-y-2" aria-label="Main">
          {navItems.map((item) => {
            const isActive = item.hash === activeHash;
            return (
              <a
                key={item.hash}
                href={`#${item.hash}`}
                onClick={navigate}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center justify-center gap-2 w-full border py-2.5 px-3 text-white transition-colors duration-200 cursor-target ${
                  isActive
                    ? 'bg-accent/20 border-accent'
                    : 'bg-dark-card border-dark-border hover:bg-accent/20 hover:border-accent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="flex justify-center gap-4">
        {socialLinks.map((link) => {
          const isMail = link.url.startsWith('mailto:');
          return (
            <a
              key={link.name}
              href={link.url}
              target={isMail ? undefined : '_blank'}
              rel={isMail ? undefined : 'noopener noreferrer'}
              className="w-10 h-10 flex items-center justify-center bg-dark-card text-gray-400 hover:text-accent hover:bg-accent/20 transition-colors duration-200 cursor-target"
              title={link.name}
              aria-label={link.name}
            >
              {link.icon}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ProfilePanel;
