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
          <div className="w-full p-3 text-center">
            <p className="text-2xl xl:text-3xl 2xl:text-4xl font-medium tracking-tight text-ink mb-2 xl:mb-3">Bhavya Kurseja</p>
            <p className="text-body text-base 2xl:text-lg">Mechatronics Engineering</p>
            <a
              href="https://uwaterloo.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted text-base 2xl:text-lg hover:text-ink transition-colors duration-150 cursor-target"
            >
              @ University of Waterloo
            </a>
          </div>
        </div>

        {/* Status: what I'm doing now and when I'm available */}
        <div className="card mt-3 xl:mt-5 p-4 2xl:p-5 text-sm 2xl:text-base">
          <p className="flex items-center gap-2 font-medium text-ink">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            {NEXT_COOP_TERM ? `Open to ${NEXT_COOP_TERM} co-op` : 'Open to co-op opportunities'}
          </p>
          <p className="mt-1.5 text-muted">
            Currently <span className="text-ink">{CURRENT_ROLE.title}</span> @ {CURRENT_ROLE.org}
          </p>
        </div>

        <nav className="mt-4 xl:mt-6 space-y-1 xl:space-y-1.5" aria-label="Main">
          {navItems.map((item) => {
            const isActive = item.hash === activeHash;
            return (
              <a
                key={item.hash}
                href={`#${item.hash}`}
                onClick={navigate}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 w-full rounded-lg py-2.5 xl:py-3 px-4 text-sm 2xl:text-base font-medium transition-colors duration-150 cursor-target ${
                  isActive ? 'bg-dark-elevated text-ink' : 'bg-dark-card/60 text-muted hover:text-ink'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="flex justify-center gap-4 2xl:gap-5">
        {socialLinks.map((link) => {
          const isMail = link.url.startsWith('mailto:');
          return (
            <a
              key={link.name}
              href={link.url}
              target={isMail ? undefined : '_blank'}
              rel={isMail ? undefined : 'noopener noreferrer'}
              className="icon-btn cursor-target"
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
