import React, { useEffect } from 'react';
import ProfilePanel from './ProfilePanel';

interface MobileMenuProps {
  onClose: () => void;
  currentSection: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose, currentSection }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-dark-bg px-6 pt-12 pb-6 overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <ProfilePanel currentSection={currentSection} onNavigate={onClose} />
      </div>
    </div>
  );
};

export default MobileMenu;
