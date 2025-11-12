import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react";
import Sidebar from './components/Sidebar';
import ProjectsList from './components/ProjectsList';
import About from './components/About';
import MobileMenu from './components/MobileMenu';
import Dither from './components/Dither';
import './App.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('projects');

  // Detect operating system
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isMobile = window.innerWidth < 1024; // lg breakpoint

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#projects' || hash === '#about') {
        setCurrentSection(hash.slice(1));
      }
      // If navigating away from detail pages, set section to projects
      if (hash === '' || hash === '#projects') {
        setCurrentSection('projects');
      }
    };

    // Set initial section based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcuts for desktop users
  useEffect(() => {
    if (isMobile) return; // Don't add keyboard shortcuts on mobile

    const handleKeyDown = (event: KeyboardEvent) => {
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;
      
      if (modifierKey && event.key === 'k') {
        event.preventDefault();
        setCurrentSection('projects');
        window.location.hash = 'projects';
      }

      // Resume shortcut: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
      if ((isMac && event.metaKey && event.shiftKey && event.key === 'r') || 
          (!isMac && event.ctrlKey && event.shiftKey && event.key === 'r')) {
        event.preventDefault();
        window.open('https://drive.google.com/file/d/1ZFIeIdncx69nHE8jEKPviROorDF3z03T/view?usp=sharing', '_blank');
      }
    };

    // Use capture phase to ensure the event is caught
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [currentSection, isMac, isMobile]);

  return (
    <div className="min-h-screen bg-dark-bg relative">
      {/* Dither Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Dither
          waveColor={[0.2, 0.4, 0.8]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.2}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
      
      <Analytics />
      <div className="relative z-10">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-40 lg:hidden bg-dark-card border border-dark-border rounded-lg p-2 text-white hover:bg-dark-border transition-colors duration-200 cursor-target"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <MobileMenu onClose={() => setIsMobileMenuOpen(false)} currentSection={currentSection} />
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar currentSection={currentSection} />
        </div>
        
        {/* Main Content */}
        <div className="lg:ml-[30vw]">
          {currentSection === 'about' ? <About /> : <ProjectsList />}
        </div>
      </div>
    </div>
  );
}

export default App;
