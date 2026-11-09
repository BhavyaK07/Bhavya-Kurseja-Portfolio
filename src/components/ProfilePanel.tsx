import React from 'react';
import profileImg from '../assets/bhav.jpeg';
import { activeNavHash, navItems, socialLinks } from '../data/profile';

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
          <a
            href="#about"
            onClick={navigate}
            aria-label="About Bhavya"
            className="w-36 h-36 rounded-full overflow-hidden border-4 border-accent/20 hover:border-accent/40 transition-colors duration-200 cursor-target"
          >
            <img src={profileImg} alt="Bhavya Kurseja" className="w-full h-full object-cover" />
          </a>

          <div className="w-full mt-3 p-3 rounded-lg bg-dark-bg/70 backdrop-blur-sm text-center">
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
              className="w-10 h-10 flex items-center justify-center bg-dark-card rounded-lg text-gray-400 hover:text-accent hover:bg-accent/20 transition-colors duration-200 cursor-target"
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
