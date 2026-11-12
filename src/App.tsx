import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Analytics } from "@vercel/analytics/react";
import Sidebar from './components/Sidebar';
import ProjectsList from './components/ProjectsList';
import MobileMenu from './components/MobileMenu';
import TopBar from './components/TopBar';
import { projects } from './data/projects';

// three.js is most of the bundle; load the background separately so text paints first.
const Dither = lazy(() => import('./components/Dither'));

type Route = { section: string; projectSlug?: string };

const SECTIONS = ['projects', 'all-projects', 'experience', 'skills'];

const parseHash = (): Route => {
  const hash = window.location.hash.replace('#', '');

  if (hash.startsWith('project-')) {
    const slug = hash.slice('project-'.length);
    if (projects.some((project) => project.slug === slug)) {
      return { section: 'project', projectSlug: slug };
    }
  }

  // Unknown or empty hashes fall back to the main page.
  return { section: SECTIONS.includes(hash) ? hash : 'projects' };
};

const HOME_SECTIONS = ['projects', 'experience', 'skills'];

/** On the main page, highlight whichever section the reader has scrolled to. */
function useScrollSpy(enabled: boolean, fallback: string) {
  const [active, setActive] = useState(fallback);

  useEffect(() => {
    if (!enabled) return;

    let frameId = 0;
    const update = () => {
      frameId = 0;
      const line = window.innerHeight * 0.4;
      let current = HOME_SECTIONS[0];
      for (const id of HOME_SECTIONS) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enabled]);

  return enabled ? active : fallback;
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const handleHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const { section, projectSlug } = route;
  const navSection = useScrollSpy(HOME_SECTIONS.includes(section), section);
  // All Projects and each project page are full width, without the sidebar.
  const isFullWidthPage = section === 'project' || section === 'all-projects';

  return (
    <div className="min-h-screen bg-dark-bg relative">
      {/* Dither Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.9 }}>
        <Suspense fallback={null}>
          <Dither
            waveColor={[0.18, 0.24, 0.34]}
            disableAnimation={false}
            enableMouseInteraction={false}
            mouseRadius={0.3}
            colorNum={4}
            waveAmplitude={0.22}
            waveFrequency={2.6}
            waveSpeed={0.012}
          />
        </Suspense>
      </div>

      <Analytics />
      <div className="relative z-10">
        {isFullWidthPage ? (
          <>
            <TopBar current={section === 'project' ? 'project' : 'all-projects'} />
            <main>
              <ProjectsList mode={section === 'project' ? 'detail' : 'all-projects'} projectSlug={projectSlug} />
            </main>
          </>
        ) : (
          <>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              className="fixed top-4 left-4 z-40 lg:hidden bg-dark-card border border-dark-border rounded-lg p-2 text-ink hover:bg-dark-elevated transition-colors duration-150 cursor-target"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <MobileMenu onClose={() => setIsMobileMenuOpen(false)} currentSection={navSection} />
            )}

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <Sidebar currentSection={navSection} />
            </div>

            {/* Main Content */}
            <main className="lg:ml-[var(--sidebar-w)]">
              <ProjectsList mode="default" />
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
