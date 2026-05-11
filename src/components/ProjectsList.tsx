import React, { useEffect, useMemo, useState } from 'react';
import { SiDevpost } from 'react-icons/si';
import { Project, projects } from '../data/projects';
import AboutIntro from './AboutIntro';

interface ProjectsListProps {
  mode?: 'default' | 'all-projects';
}

type ProjectMediaItem = {
  type: 'image' | 'video';
  src: string;
};

const getProjectMedia = (project: Project): ProjectMediaItem[] => {
  const imageSources = project.images && project.images.length > 0 ? project.images : [project.image];
  const media: ProjectMediaItem[] = imageSources.map((src) => ({ type: 'image', src }));

  if (project.videoUrl) {
    media.push({ type: 'video', src: project.videoUrl });
  }

  return media;
};

const getGithubUrl = (project: Project): string | undefined => {
  return project.githubUrl ?? project.buttons?.find((button) => button.type === 'github')?.url;
};

const getDevpostUrl = (project: Project): string | undefined => {
  if (project.devpostUrl) return project.devpostUrl;
  if (project.externalUrl?.includes('devpost.com')) return project.externalUrl;

  const devpostButton = project.buttons?.find(
    (button) => button.url.includes('devpost.com') || /devpost/i.test(button.text)
  );
  return devpostButton?.url;
};

const ProjectsList: React.FC<ProjectsListProps> = ({ mode = 'default' }) => {
  const [projectsView, setProjectsView] = useState<'featured' | 'all' | 'detail'>(
    mode === 'all-projects' ? 'all' : 'featured'
  );
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [isSlideVisible, setIsSlideVisible] = useState(true);

  const experiences = [
    {
      role: 'Quality Assurance',
      org: 'Virtek Vision International',
      date: 'Jan 2026 - Present',
      location: 'Waterloo, ON',
      focus: 'Hardware / Software QA',
      tags: ['Laser Projectors', 'Camera Systems', 'Local AI Vision Models', 'Desktop App', 'Web App', 'Python', 'PowerShell'],
      bullets: [
        'Executed 1,200+ manual regression tests across laser projectors, camera systems running local AI vision models, desktop software, and web applications.',
        'Verified 90+ software and hardware defects across two full validation cycles.',
        'Built 30+ reusable Python and PowerShell automation scripts to convert manual QA workflows into repeatable internal test tools.'
      ]
    },
    {
      role: 'Humanoid Sub-team - Embedded Systems',
      org: 'Watonomous',
      date: 'Jan 2026 - Present',
      location: 'Waterloo, ON',
      focus: 'Humanoid Hand Firmware',
      tags: ['STM32 Nucleo-G474RE', 'C/C++', 'STM32 HAL', 'USART2', '115200 Baud', 'Embedded Firmware'],
      bullets: [
        'Developed STM32 firmware on a Nucleo-G474RE to support communication between actuator-related components for a humanoid hand project.',
        'Implemented HAL-based USART2 communication in C/C++ at 115200 baud as an early communication layer for the embedded system.',
        'Structured the firmware for upcoming hardware integration and actuator communication testing.'
      ]
    },
    {
      role: 'Data Management Member',
      org: 'Bluevale Electric Car Team',
      date: 'Sept 2022 - June 2025',
      location: 'Waterloo, ON',
      focus: 'Vehicle Telemetry',
      tags: ['Raspberry Pi', 'Python', 'PubNub', 'Telemetry', 'Multithreading', 'Electric Vehicle'],
      bullets: [
        'Engineered a Raspberry Pi telemetry system for a custom team-built electric car, improving communication efficiency 30x through better data handling, faster driver feedback, and tighter system integration.',
        'Built a multi-threaded Python + PubNub telemetry architecture reaching 99% data accuracy across vehicle data including battery voltage, current draw, speed, race time, amp-hours consumed, discharge data, motor power, and E-stop power state.',
        'Created a system architecture diagram to document how vehicle telemetry components worked together.'
      ]
    }
  ];

  const skillGroups = [
    {
      title: 'Programming',
      skills: ['C++', 'Python', 'PowerShell', 'Arduino']
    },
    {
      title: 'Embedded & Hardware',
      skills: ['STM32 HAL', 'USART2', 'ESP32', 'Raspberry Pi', 'Serial Communication', 'Low-level Drivers']
    },
    {
      title: 'Software & Tools',
      skills: ['Git', 'OpenCV', 'Firebase', 'React', 'SolidWorks', 'AutoCAD']
    },
    {
      title: 'Manufacturing',
      skills: ['Soldering', 'Bandsaw', 'Drill Press', 'Milling Machine', 'Lathe']
    }
  ];

  const skillHoverColors = [
    { bg: 'rgba(37, 99, 235, 0.25)', border: '#3b82f6', text: '#bfdbfe', shadow: 'rgba(59, 130, 246, 0.28)' },
    { bg: 'rgba(22, 163, 74, 0.22)', border: '#22c55e', text: '#bbf7d0', shadow: 'rgba(34, 197, 94, 0.24)' },
    { bg: 'rgba(217, 119, 6, 0.23)', border: '#f59e0b', text: '#fde68a', shadow: 'rgba(245, 158, 11, 0.24)' },
    { bg: 'rgba(124, 58, 237, 0.24)', border: '#8b5cf6', text: '#ddd6fe', shadow: 'rgba(139, 92, 246, 0.24)' },
    { bg: 'rgba(219, 39, 119, 0.22)', border: '#ec4899', text: '#fbcfe8', shadow: 'rgba(236, 72, 153, 0.22)' },
    { bg: 'rgba(14, 165, 233, 0.23)', border: '#38bdf8', text: '#bae6fd', shadow: 'rgba(56, 189, 248, 0.23)' },
    { bg: 'rgba(20, 184, 166, 0.22)', border: '#2dd4bf', text: '#99f6e4', shadow: 'rgba(45, 212, 191, 0.22)' },
    { bg: 'rgba(239, 68, 68, 0.22)', border: '#f87171', text: '#fecaca', shadow: 'rgba(248, 113, 113, 0.22)' },
    { bg: 'rgba(132, 204, 22, 0.20)', border: '#a3e635', text: '#d9f99d', shadow: 'rgba(163, 230, 53, 0.20)' },
    { bg: 'rgba(6, 182, 212, 0.22)', border: '#22d3ee', text: '#a5f3fc', shadow: 'rgba(34, 211, 238, 0.22)' },
    { bg: 'rgba(168, 85, 247, 0.22)', border: '#c084fc', text: '#e9d5ff', shadow: 'rgba(192, 132, 252, 0.22)' },
    { bg: 'rgba(244, 63, 94, 0.22)', border: '#fb7185', text: '#fecdd3', shadow: 'rgba(251, 113, 133, 0.22)' },
    { bg: 'rgba(99, 102, 241, 0.24)', border: '#818cf8', text: '#c7d2fe', shadow: 'rgba(129, 140, 248, 0.24)' },
    { bg: 'rgba(234, 88, 12, 0.22)', border: '#fb923c', text: '#fed7aa', shadow: 'rgba(251, 146, 60, 0.22)' }
  ];

  const skillHoverColorByName = new Map(
    skillGroups
      .flatMap((group) => group.skills)
      .map((skill, index) => [skill, skillHoverColors[index % skillHoverColors.length]])
  );

  const featuredStats = [
    { label: 'Project Funding Raised', value: '$10K+' },
    { label: 'QA Tests Executed', value: '1,200+' },
    { label: 'Defects Verified', value: '90+' },
    { label: 'Telemetry Efficiency Gain', value: '30x' }
  ];

  const currentMomentum = [
    'Building embedded systems experience through QA and firmware-focused work in Waterloo teams.',
    'Actively expanding robotics integration projects across sensing, control, and automation workflows.',
    'Open to co-op opportunities where hardware and software engineering intersect.'
  ];

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId]
  );

  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured !== false),
    []
  );

  const featuredProject = featuredProjects[featuredIndex] ?? featuredProjects[0];

  useEffect(() => {
    setProjectsView(mode === 'all-projects' ? 'all' : 'featured');
    if (mode === 'all-projects') {
      setSelectedProjectId(null);
      setSelectedMediaIndex(0);
    }
  }, [mode]);

  useEffect(() => {
    setIsSlideVisible(false);
    const frameId = window.requestAnimationFrame(() => {
      setIsSlideVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [featuredIndex]);

  useEffect(() => {
    if (projectsView !== 'featured' || mode === 'all-projects' || isCarouselPaused) return;

    if (featuredProjects.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [featuredProjects.length, isCarouselPaused, mode, projectsView]);

  useEffect(() => {
    if (featuredProjects.length === 0) return;
    setFeaturedIndex((prev) => prev % featuredProjects.length);
  }, [featuredProjects.length]);

  const scrollToCurrentHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (!['projects', 'experience', 'skills'].includes(hash)) return;

    window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  useEffect(() => {
    if (mode === 'all-projects') return;

    scrollToCurrentHash();
    window.addEventListener('hashchange', scrollToCurrentHash);

    return () => window.removeEventListener('hashchange', scrollToCurrentHash);
  }, [mode]);

  const openProjectDetail = (projectId: number) => {
    setSelectedProjectId(projectId);
    setSelectedMediaIndex(0);
    setProjectsView('detail');
  };

  const renderMediaByIndex = (project: Project, mediaIndex: number, withControls = true) => {
    const mediaItems = getProjectMedia(project);
    const mediaItem = mediaItems[mediaIndex] ?? mediaItems[0];

    if (!mediaItem) return null;

    if (mediaItem.type === 'video') {
      return (
        <video
          src={mediaItem.src}
          controls={withControls}
          muted={!withControls}
          playsInline
          className="w-full h-full object-cover bg-black"
        />
      );
    }

    return (
      <img
        src={mediaItem.src}
        alt={project.title}
        className="w-full h-full object-cover"
      />
    );
  };

  const renderFeaturedProjects = () => (
    <div className="mt-8">
      <div
        className="bg-dark-card/70 backdrop-blur-sm border border-dark-border rounded-2xl overflow-hidden"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 transition-all duration-500 ease-out ${
            isSlideVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          key={featuredProject.id}
        >
          <div className="relative h-64 lg:h-full min-h-[280px]">
            {renderMediaByIndex(featuredProject, 0, false)}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between">
              <p className="text-sm text-gray-200">
                Featured Project {featuredIndex + 1} / {featuredProjects.length}
              </p>
              {featuredProject.videoUrl && (
                <span className="text-xs uppercase tracking-[0.2em] text-accent">Video</span>
              )}
            </div>
          </div>

          <div className="p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
                Featured
              </p>
              <h3 className="text-2xl font-bold text-white mb-4">{featuredProject.title}</h3>
              <p className="text-gray-300 leading-relaxed mb-5">{featuredProject.description}</p>

              {featuredProject.highlights && featuredProject.highlights.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {featuredProject.highlights.slice(0, 3).map((highlight) => (
                    <li key={highlight} className="text-gray-300 text-sm lg:text-base leading-relaxed flex items-start">
                      <span className="text-accent mr-2 mt-[2px]">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-2">
                {featuredProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-dark-bg border border-dark-border text-gray-300 px-2 py-1 text-xs font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openProjectDetail(featuredProject.id)}
                className="bg-accent hover:bg-accent/80 text-white font-semibold py-2 px-4 transition-colors duration-200 cursor-target"
              >
                View Project Details
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-border p-4 flex items-center justify-between">
          <button
            onClick={() => setFeaturedIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length)}
            className="bg-dark-bg border border-dark-border hover:border-accent text-gray-200 py-2 px-3 transition-colors duration-200 cursor-target"
          >
            Prev
          </button>
          <div className="flex items-center gap-2">
            {featuredProjects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => setFeaturedIndex(index)}
                className={`h-2.5 w-8 transition-colors duration-200 ${
                  index === featuredIndex ? 'bg-accent' : 'bg-dark-border hover:bg-gray-500'
                }`}
                aria-label={`Go to featured project ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setFeaturedIndex((prev) => (prev + 1) % featuredProjects.length)}
            className="bg-dark-bg border border-dark-border hover:border-accent text-gray-200 py-2 px-3 transition-colors duration-200 cursor-target"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            window.location.hash = 'all-projects';
          }}
          className="group relative overflow-hidden bg-gradient-to-r from-accent via-blue-500 to-indigo-500 text-white font-semibold py-2.5 px-5 transition-all duration-300 cursor-target shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_24px_rgba(59,130,246,0.35)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.25),0_0_34px_rgba(59,130,246,0.55)] hover:-translate-y-0.5"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/10 via-transparent to-white/10" />
          <span className="relative z-10 inline-flex items-center gap-2">
            View More Projects
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );

  const renderProjectTiles = () => (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="text-left bg-dark-card/70 backdrop-blur-sm border border-dark-border rounded-2xl overflow-hidden hover:border-accent/50 transition-colors duration-200"
          >
            <button onClick={() => openProjectDetail(project.id)} className="w-full cursor-target">
              <div className="h-48">
                {renderMediaByIndex(project, 0, false)}
              </div>
            </button>
            <div className="p-5">
              <button onClick={() => openProjectDetail(project.id)} className="text-left cursor-target">
                <h3 className="text-lg font-bold text-white mb-3">{project.title}</h3>
              </button>
              <p className="text-sm leading-relaxed text-gray-400 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={`${project.id}-${tech}`}
                    className="bg-dark-bg border border-dark-border text-gray-300 px-2 py-1 text-xs font-mono rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    return (
      <div className="mt-8 bg-dark-card/70 backdrop-blur-sm border border-dark-border rounded-2xl overflow-hidden">
        <div className="h-64 lg:h-[420px]">
          {renderMediaByIndex(selectedProject, selectedMediaIndex)}
        </div>

        {getProjectMedia(selectedProject).length > 1 && (
          <div className="px-6 pt-4 flex flex-wrap gap-2">
            {getProjectMedia(selectedProject).map((media, index) => (
              <button
                key={`${selectedProject.id}-${media.src}-${index}`}
                onClick={() => setSelectedMediaIndex(index)}
                className={`text-xs uppercase tracking-wide px-3 py-1 border transition-colors duration-200 cursor-target ${
                  selectedMediaIndex === index
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-dark-border text-gray-300 bg-dark-bg'
                }`}
              >
                {media.type === 'video' ? `Video ${index + 1}` : `Image ${index + 1}`}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => {
                setProjectsView('all');
                setSelectedMediaIndex(0);
              }}
              className="text-sm text-accent hover:text-accent/80 transition-colors duration-200 cursor-target"
            >
              Back to All Projects
            </button>
            {mode !== 'all-projects' && (
              <>
                <span className="text-dark-border">|</span>
                <button
                  onClick={() => {
                    setProjectsView('featured');
                    setSelectedMediaIndex(0);
                  }}
                  className="text-sm text-accent hover:text-accent/80 transition-colors duration-200 cursor-target"
                >
                  Back to Featured
                </button>
              </>
            )}
          </div>

          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">{selectedProject.title}</h3>
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
              Overview
            </p>
            <p className="text-gray-300 text-base leading-relaxed">{selectedProject.description}</p>
          </div>

          {selectedProject.highlights && selectedProject.highlights.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
                What I Built
              </p>
              <ul className="space-y-2">
                {selectedProject.highlights.map((highlight) => (
                  <li key={highlight} className="text-gray-300 text-sm lg:text-base leading-relaxed flex items-start">
                    <span className="text-accent mr-2 mt-[2px]">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
              Technologies Used
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedProject.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-dark-bg border border-dark-border text-gray-300 px-2 py-1 text-xs font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getGithubUrl(selectedProject) && (
              <a
                href={getGithubUrl(selectedProject)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center bg-dark-bg border border-dark-border text-gray-300 hover:text-accent hover:border-accent transition-colors duration-200 cursor-target"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
            {getDevpostUrl(selectedProject) && (
              <a
                href={getDevpostUrl(selectedProject)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center bg-dark-bg border border-dark-border text-gray-300 hover:text-accent hover:border-accent transition-colors duration-200 cursor-target"
                title="Devpost"
              >
                <SiDevpost className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8 mt-16">
      {mode === 'all-projects' ? (
        <>
          <div id="all-projects" className="mb-12 border-b border-dark-border pb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">ALL PROJECTS</h1>
            <div className="w-20 h-1 bg-accent"></div>
          </div>

          {projectsView === 'all' && renderProjectTiles()}
          {projectsView === 'detail' && renderProjectDetail()}
        </>
      ) : (
        <>
          <section className="mb-12 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent mb-3">
              Bhavya Kurseja
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              First-year Waterloo Mechatronics student building robotics, embedded systems, and automation projects.
            </h1>
            <p className="text-lg leading-8 text-gray-300 max-w-3xl">
              I build across firmware, hardware, and software, with projects focused on real devices,
              controls, sensing, and practical hardware-software integration.
            </p>

            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {featuredStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-dark-card/70 backdrop-blur-sm border border-dark-border p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
          </section>

          <div id="projects" className="scroll-mt-8 mb-10 border-b border-dark-border pb-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">FEATURED PROJECTS</h2>
            <div className="w-20 h-1 bg-accent"></div>
          </div>

          {projectsView === 'featured' && renderFeaturedProjects()}
          {projectsView === 'detail' && renderProjectDetail()}

          <div id="experience" className="scroll-mt-8 mt-16 border-b border-dark-border pb-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">EXPERIENCE</h2>
            <div className="w-20 h-1 bg-accent"></div>
          </div>

          <div className="mt-8 relative">
            <div className="absolute left-3 top-3 bottom-3 hidden md:block w-px bg-gradient-to-b from-accent via-dark-border to-dark-border" />
            <div className="space-y-5">
            {experiences.map((experience) => (
              <article key={`${experience.org}-${experience.role}`} className="relative md:pl-10">
                <div className="absolute left-0 top-6 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-accent bg-dark-bg">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                </div>

                <div className="bg-dark-card/75 backdrop-blur-sm border border-dark-border p-5 lg:p-6 transition-colors duration-200 hover:border-accent/50">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent mb-2">
                        {experience.focus}
                      </p>
                      <h3 className="text-lg lg:text-xl font-bold text-white">{experience.role}</h3>
                      <p className="text-gray-300">{experience.org}</p>
                    </div>
                    <div className="lg:text-right">
                      <p className="text-sm font-medium text-gray-300">{experience.date}</p>
                      <p className="text-sm text-gray-500">{experience.location}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {experience.tags.map((tag) => (
                      <span
                        key={`${experience.org}-${tag}`}
                        className="bg-dark-bg border border-dark-border text-gray-300 px-2 py-1 text-xs font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-2">
                    {experience.bullets.map((bullet) => (
                      <li key={bullet} className="text-gray-300 text-sm lg:text-base leading-relaxed flex items-start">
                        <span className="text-accent mr-2 mt-[2px]">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
            </div>
          </div>

          <div id="skills" className="scroll-mt-8 mt-16 border-b border-dark-border pb-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">SKILLS</h2>
            <div className="w-20 h-1 bg-accent"></div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="bg-dark-card/70 backdrop-blur-sm border border-dark-border p-5"
              >
                <h3 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wide">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => {
                    const hoverColor = skillHoverColorByName.get(skill) ?? skillHoverColors[0];

                    return (
                      <span
                        key={skill}
                        className="skill-pill-hover inline-block bg-dark-bg border border-dark-border text-gray-300 px-2 py-1 text-xs font-mono"
                        style={{
                          '--skill-hover-bg': hoverColor.bg,
                          '--skill-hover-border': hoverColor.border,
                          '--skill-hover-text': hoverColor.text,
                          '--skill-hover-shadow': hoverColor.shadow
                        } as React.CSSProperties}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-dark-card/70 backdrop-blur-sm border border-dark-border p-6 lg:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
                Education
              </p>
              <h2 className="text-xl lg:text-2xl font-bold text-white">
                University of Waterloo
              </h2>
              <p className="text-gray-300 mt-2">
                Bachelor of Applied Science in Mechatronics Engineering (Co-op Program)
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Sept 2025 - Present | Waterloo, ON
              </p>
            </div>

            <div className="bg-dark-card/70 backdrop-blur-sm border border-dark-border p-6 lg:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
                Current Focus
              </p>
              <ul className="space-y-2">
                {currentMomentum.map((item) => (
                  <li key={item} className="text-gray-300 text-sm lg:text-base leading-relaxed flex items-start">
                    <span className="text-accent mr-2 mt-[2px]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-16 max-w-4xl">
            <AboutIntro />
          </section>
        </>
      )}
    </div>
  );
};

export default ProjectsList;
