import React, { useEffect, useMemo, useState } from 'react';
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
      bullets: [
        'Executed 1,200+ regression tests across two full validation cycles and verified 90+ software/hardware defects.',
        'Built 30+ reusable QA automation scripts in Python and PowerShell, saving an estimated 8-12 hours per regression cycle.'
      ]
    },
    {
      role: 'Humanoid Sub-team - Embedded Systems',
      org: 'Watonomous',
      date: 'Jan 2026 - Present',
      location: 'Waterloo, ON',
      bullets: [
        'Developed STM32 firmware to support deterministic communication across distributed humanoid robotic subsystems.',
        'Implemented HAL-based USART2 communication in C/C++ for robust real-time diagnostics and control data exchange.'
      ]
    },
    {
      role: 'Data Management Member',
      org: 'Bluevale Electric Car Team',
      date: 'Sept 2022 - June 2025',
      location: 'Waterloo, ON',
      bullets: [
        'Engineered a Raspberry Pi telemetry system with a custom buffer protocol, increasing communication efficiency 30x and reducing latency by 95%.',
        'Built a multi-threaded Python + PubNub telemetry architecture reaching 99% data accuracy across 15+ vehicle parameters.'
      ]
    }
  ];

  const skillGroups = [
    {
      title: 'Programming',
      skills: ['C++', 'Python', 'Arduino']
    },
    {
      title: 'Embedded & Hardware',
      skills: ['STM32', 'ESP32', 'Raspberry Pi', 'Serial Communication', 'Low-level Drivers']
    },
    {
      title: 'Software & Tools',
      skills: ['Git', 'SolidWorks', 'AutoCAD']
    },
    {
      title: 'Manufacturing',
      skills: ['Soldering', 'Bandsaw', 'Drill Press', 'Milling Machine', 'Lathe']
    }
  ];

  const featuredStats = [
    { label: 'Projects Built', value: '10+' },
    { label: 'Hackathons', value: '9' },
    { label: 'Experience Roles', value: `${experiences.length}` },
    {
      label: 'Project Technologies',
      value: `${new Set(projects.flatMap((project) => project.technologies)).size}+`
    }
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

  const featuredProject = projects[featuredIndex] ?? projects[0];

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

    const intervalId = window.setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isCarouselPaused, mode, projectsView]);

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
                Featured Project {featuredIndex + 1} / {projects.length}
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
            onClick={() => setFeaturedIndex((prev) => (prev - 1 + projects.length) % projects.length)}
            className="bg-dark-bg border border-dark-border hover:border-accent text-gray-200 py-2 px-3 transition-colors duration-200 cursor-target"
          >
            Prev
          </button>
          <div className="flex items-center gap-2">
            {projects.map((project, index) => (
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
            onClick={() => setFeaturedIndex((prev) => (prev + 1) % projects.length)}
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
          <p className="text-gray-300 text-base leading-relaxed mb-6">{selectedProject.description}</p>

          {selectedProject.highlights && selectedProject.highlights.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
                Project Highlights
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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3h10.2c.96 0 1.86.48 2.39 1.28l4.2 6.27c.55.82.55 1.88 0 2.7l-4.2 6.27A2.87 2.87 0 0 1 15.2 21H5V3zm3 3v12h6.6c.32 0 .62-.16.8-.43l3.54-5.29a.94.94 0 0 0 0-1.06L15.4 5.93a.95.95 0 0 0-.8-.43H8z" />
                </svg>
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
      {/* About Section (main page) */}
      <div className="mb-16">
        <div className="max-w-4xl">
          <AboutIntro />
          <div className="mt-6 bg-dark-card/70 backdrop-blur-sm border border-dark-border p-6 lg:p-8 rounded-2xl">
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

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featuredStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-dark-card/70 backdrop-blur-sm border border-dark-border p-4 rounded-xl"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-dark-card/70 backdrop-blur-sm border border-dark-border p-6 rounded-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
              Current Momentum
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
        </div>
      </div>

      {/* Header */}
      <div id="projects" className="mb-12 border-b border-dark-border pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">PROJECTS</h1>
        <div className="w-20 h-1 bg-accent"></div>
      </div>

      {projectsView === 'featured' && renderFeaturedProjects()}
      {projectsView === 'detail' && renderProjectDetail()}

      {/* Experience Section */}
      <div id="experience" className="mt-16 border-b border-dark-border pb-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">EXPERIENCE</h2>
        <div className="w-20 h-1 bg-accent"></div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4">
        {experiences.map((experience) => (
          <div
            key={`${experience.org}-${experience.role}`}
            className="bg-dark-card/70 backdrop-blur-sm border border-dark-border p-6 rounded-2xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-white">{experience.role}</h3>
                <p className="text-gray-300">{experience.org}</p>
              </div>
              <p className="text-sm text-gray-400">
                {experience.date} | {experience.location}
              </p>
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
        ))}
      </div>

      {/* Skills Section */}
      <div id="skills" className="mt-16 border-b border-dark-border pb-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">SKILLS</h2>
        <div className="w-20 h-1 bg-accent"></div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillGroups.map((group) => (
          <div
            key={group.title}
            className="bg-dark-card/70 backdrop-blur-sm border border-dark-border p-5 rounded-xl"
          >
            <h3 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wide">
              {group.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-dark-bg border border-dark-border text-gray-300 px-2 py-1 text-xs font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div id="contact" className="mt-16 border-b border-dark-border pb-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">CONTACT</h2>
        <div className="w-20 h-1 bg-accent"></div>
      </div>

      <div className="mt-8 mb-4 bg-dark-card/70 backdrop-blur-sm border border-dark-border p-6 lg:p-8 rounded-2xl">
        <p className="text-gray-300 mb-6">
          Open to co-op opportunities in robotics, embedded systems, and automation.
        </p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <a
            href="mailto:bkurseja@uwaterloo.ca"
            className="bg-accent hover:bg-accent/80 text-white font-semibold py-2 px-4 transition-colors duration-200 inline-flex items-center justify-center"
          >
            bkurseja@uwaterloo.ca
          </a>
          <a
            href="https://www.linkedin.com/in/bhavyakurseja/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-dark-bg border border-dark-border hover:border-accent text-gray-200 font-semibold py-2 px-4 transition-colors duration-200 inline-flex items-center justify-center"
          >
            LinkedIn
          </a>
          <a
            href="https://devpost.com/bdkurseja"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-dark-bg border border-dark-border hover:border-accent text-gray-200 font-semibold py-2 px-4 transition-colors duration-200 inline-flex items-center justify-center"
          >
            Devpost
          </a>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default ProjectsList;

