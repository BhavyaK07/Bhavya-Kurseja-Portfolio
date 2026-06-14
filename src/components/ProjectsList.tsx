import React, { useEffect, useMemo, useState } from 'react';
import { FaEnvelope, FaFileAlt, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiDevpost } from 'react-icons/si';
import { Project, projects } from '../data/projects';

interface ProjectsListProps {
  mode?: 'default' | 'all-projects';
}

type ProjectMediaItem = {
  type: 'image' | 'video';
  src: string;
};

type ProjectMediaFit = 'cover' | 'contain' | 'natural';

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

const ProjectExternalLinks: React.FC<{ project: Project; className?: string }> = ({ project, className = '' }) => {
  const links = [
    {
      name: 'GitHub',
      url: getGithubUrl(project),
      icon: <FaGithub className="w-5 h-5" />
    },
    {
      name: 'Devpost',
      url: getDevpostUrl(project),
      icon: <SiDevpost className="w-5 h-5" />
    }
  ].filter((link): link is { name: string; url: string; icon: JSX.Element } => Boolean(link.url));

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 flex items-center justify-center bg-dark-bg border border-dark-border text-gray-300 hover:text-accent hover:border-accent transition-colors duration-200 cursor-target"
          title={link.name}
          aria-label={`Open ${project.title} on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
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
      date: 'Jan 2026 - Apr 2026',
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
      role: 'Humanoid Perception & Embedded Systems Team',
      org: 'Watonomous',
      date: 'Jan 2026 - Present',
      location: 'Waterloo, ON',
      focus: 'Robotics Perception / Embedded Systems',
      tags: ['ROS2', 'VSLAM', 'Intel RealSense D435i', 'RGB-D', 'IMU', 'IR Sensors', 'STM32', 'C/C++', 'STM32 HAL', 'USART2'],
      bullets: [
        'Implementing VSLAM with an Intel RealSense D435i using ROS2, utilizing RGB-D and IMU data streams for localization and 3D map generation.',
        'Integrating camera and IR sensor fusion pipelines to enhance obstacle detection, navigation accuracy, and robustness in complex environments.',
        'Developed embedded firmware on STM32 microcontrollers, implementing HAL-based USART2 communication in C/C++ for reliable inter-device data exchange and robotic subsystem coordination.'
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

  const focusTiles = [
    { title: 'Embedded Robotics', detail: 'Physical systems, sensors, and control' },
    { title: 'Computer Vision', detail: 'AI models connected to real hardware' },
    { title: 'Firmware + Control', detail: 'C/C++, serial comms, and device logic' },
    { title: 'Hardware Integration', detail: 'Mechanical, electrical, and software builds' }
  ];

  const currentMomentum = [
    'Building embedded systems experience through QA and firmware-focused work in Waterloo teams.',
    'Actively expanding robotics integration projects across sensing, control, and automation workflows.',
    'Open to co-op opportunities where hardware and software engineering intersect.'
  ];

  const contactLinks = [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/bhavyakurseja/',
      icon: <FaLinkedin className="w-4 h-4" />
    },
    {
      label: 'GitHub',
      href: 'https://github.com/BhavyaK07',
      icon: <FaGithub className="w-4 h-4" />
    },
    {
      label: 'Resume',
      href: 'https://drive.google.com/file/d/12_EKJfEjW6Z0IJVDUpoY6-5avS1odiMw/view?usp=sharing',
      icon: <FaFileAlt className="w-4 h-4" />
    }
  ];

  const emailHref = 'mailto:bdkurseja@gmail.com?subject=Embedded%20Robotics%20%2F%20Computer%20Vision%20Opportunity&body=Hi%20Bhavya%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20wanted%20to%20reach%20out%20about...';

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

  const renderMediaByIndex = (
    project: Project,
    mediaIndex: number,
    withControls = true,
    fit: ProjectMediaFit = 'cover'
  ) => {
    const mediaItems = getProjectMedia(project);
    const mediaItem = mediaItems[mediaIndex] ?? mediaItems[0];

    if (!mediaItem) return null;

    const mediaClassName =
      fit === 'cover'
        ? 'w-full h-full object-cover'
        : fit === 'contain'
          ? 'w-full h-full object-contain'
          : 'max-w-full h-auto max-h-[520px] object-contain mx-auto';

    if (mediaItem.type === 'video') {
      return (
        <video
          src={mediaItem.src}
          controls={withControls}
          muted={!withControls}
          playsInline
          className={`${mediaClassName} bg-black`}
        />
      );
    }

    return (
      <img
        src={mediaItem.src}
        alt={project.title}
        className={mediaClassName}
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
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[280px] bg-dark-bg flex items-center justify-center overflow-hidden p-4">
            {renderMediaByIndex(featuredProject, 0, false, 'contain')}
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

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openProjectDetail(featuredProject.id)}
                className="bg-accent hover:bg-accent/80 text-white font-semibold py-2 px-4 transition-colors duration-200 cursor-target"
              >
                View Project Details
              </button>
              <ProjectExternalLinks project={featuredProject} />
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
              <div className="aspect-[4/3] bg-dark-bg flex items-center justify-center p-4 overflow-hidden">
                {renderMediaByIndex(project, 0, false, 'contain')}
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
              <ProjectExternalLinks project={project} className="mt-5" />
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
        <div className="min-h-64 lg:min-h-[420px] bg-dark-bg flex items-center justify-center p-4 overflow-hidden">
          {renderMediaByIndex(selectedProject, selectedMediaIndex, true, 'contain')}
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

          <ProjectExternalLinks project={selectedProject} />
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
              Mechatronics student building robotics and embedded systems.
            </h1>
            <p className="text-lg leading-8 text-gray-300 max-w-3xl">
              I build across firmware, hardware, and software, with projects focused on real devices,
              controls, sensing, and practical hardware-software integration.
            </p>

            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {focusTiles.map((tile) => (
                <div
                  key={tile.title}
                  className="focus-tile-hover group bg-dark-card/70 backdrop-blur-sm border border-dark-border p-4"
                >
                  <p className="text-sm font-semibold text-white transition-colors duration-300 group-hover:text-blue-100">
                    {tile.title}
                  </p>
                  <p className="text-xs leading-5 text-gray-400 mt-2 transition-colors duration-300 group-hover:text-gray-300">
                    {tile.detail}
                  </p>
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

          <section id="contact" className="scroll-mt-8 mt-16 pb-4">
            <div className="relative overflow-hidden border border-accent/35 bg-dark-card/85 p-6 lg:p-8 shadow-[0_0_40px_rgba(59,130,246,0.12)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
                    Contact
                  </p>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                    Let&apos;s build real systems.
                  </h2>
                  <p className="text-lg leading-8 text-gray-300">
                    I&apos;m looking for embedded robotics, computer vision, and hardware-software
                    integration opportunities.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {focusTiles.map((tile) => (
                      <span
                        key={`contact-${tile.title}`}
                        className="border border-dark-border bg-dark-bg/70 px-3 py-1.5 text-xs font-semibold text-gray-300"
                      >
                        {tile.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-dark-border bg-dark-bg/80 p-4 lg:p-5">
                  <div className="mb-4 border-b border-dark-border pb-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Message</p>
                    <p className="mt-2 text-sm text-gray-300">
                      Have an embedded robotics, firmware, or computer vision opportunity?
                    </p>
                  </div>

                  <a
                    href={emailHref}
                    className="group mb-3 inline-flex w-full items-center justify-center gap-2 bg-accent px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/85 hover:shadow-lg hover:shadow-accent/25 cursor-target"
                  >
                    <FaEnvelope className="w-4 h-4" />
                    Email Me
                  </a>

                  <div className="grid grid-cols-3 gap-2">
                    {contactLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2 border border-dark-border bg-dark-card/80 px-3 py-2.5 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-accent hover:bg-accent/15 hover:text-white cursor-target"
                      >
                        <span className="text-gray-500 transition-colors duration-200 group-hover:text-accent">
                          {link.icon}
                        </span>
                        <span className="hidden sm:inline">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ProjectsList;
