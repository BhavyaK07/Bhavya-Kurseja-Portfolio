import React from 'react';
import profileImg from '../assets/bhav.jpeg';
import CurrentlyDoing from './CurrentlyDoing';

interface SidebarProps {
  currentSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection }) => {
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/bhavyakurseja/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'Email',
      url: 'mailto:bdkurseja@gmail.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.682L12 10.875l9.682-7.054h.682c.904 0 1.636.732 1.636 1.636z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-[30vw] min-w-[320px] bg-transparent px-5 py-4 flex flex-col justify-between" style={{zIndex: 10}}>
      <div className="pl-12">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-5 mt-8 relative" style={{marginTop: '40px'}}>
          <div className="relative">
            <button
              onClick={() => window.location.href = '#about'}
              className="w-44 h-44 rounded-full overflow-hidden border-4 border-accent/20 flex items-center justify-center hover:border-accent/40 transition-colors duration-200 cursor-target"
            >
              <img
                src={profileImg}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
          {/* Translucent box behind text */}
          <div className="w-full mt-3 p-3 rounded-lg bg-dark-bg/70 backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-white mb-2 w-full text-center">Bhavya Kurseja</h1>
            <div className="w-full text-center">
              <div className="text-white text-base block">
                Mechatronics Engineer
              </div>
              <div 
                onClick={() => window.open('https://uwaterloo.ca/', '_blank')}
                className="text-gray-400 text-base hover:text-accent transition-colors duration-200 cursor-pointer block cursor-target"
              >
                @ University of Waterloo
              </div>
            </div>
            <CurrentlyDoing compact={true} />
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="mb-3" style={{marginTop: '6px'}}>
          <button
            onClick={() => window.location.href = '#projects'}
            className={`w-full border py-2.5 px-3 text-white transition-colors duration-200 mb-2 cursor-target ${
              currentSection === 'projects'
                ? 'bg-accent/20 border-accent' 
                : 'bg-dark-card border-dark-border hover:bg-accent/20 hover:border-accent'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Projects</span>
            </div>
          </button>

          <button
            onClick={() => window.location.href = '#skills'}
            className={`w-full border py-2.5 px-3 text-white transition-colors duration-200 mb-2 cursor-target ${
              currentSection === 'skills'
                ? 'bg-accent/20 border-accent'
                : 'bg-dark-card border-dark-border hover:bg-accent/20 hover:border-accent'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L6 20.75M6 20.75L2.25 17M6 20.75V13.5M14.25 7L18 3.25M18 3.25L21.75 7M18 3.25V10.5" />
              </svg>
              <span>Skills</span>
            </div>
          </button>

          <button
            onClick={() => window.location.href = '#experience'}
            className={`w-full border py-2.5 px-3 text-white transition-colors duration-200 mb-2 cursor-target ${
              currentSection === 'experience'
                ? 'bg-accent/20 border-accent'
                : 'bg-dark-card border-dark-border hover:bg-accent/20 hover:border-accent'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Experience</span>
            </div>
          </button>

          <button
            onClick={() => window.location.href = '#contact'}
            className={`w-full border py-2.5 px-3 text-white transition-colors duration-200 mb-2 cursor-target ${
              currentSection === 'contact'
                ? 'bg-accent/20 border-accent'
                : 'bg-dark-card border-dark-border hover:bg-accent/20 hover:border-accent'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact</span>
            </div>
          </button>
          
          <button
            onClick={() => window.open('https://drive.google.com/file/d/1ZFIeIdncx69nHE8jEKPviROorDF3z03T/view?usp=sharing', '_blank')}
            className="w-full border py-2.5 px-3 text-white transition-colors duration-200 cursor-target bg-dark-card border-dark-border hover:bg-accent/20 hover:border-accent"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Resume</span>
            </div>
          </button>
        </div>
      </div>
      {/* Social Links */}
      <div className="flex justify-center space-x-4 mt-3 mb-1 pl-12">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target={link.url === '#' ? undefined : "_blank"}
            rel={link.url === '#' ? undefined : "noopener noreferrer"}
            onClick={link.url === '#' ? (e) => e.preventDefault() : undefined}
            className="w-10 h-10 flex items-center justify-center bg-dark-card rounded-lg text-gray-400 hover:text-accent hover:bg-accent/20 transition-colors duration-200 cursor-target"
            title={link.name}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

