import React, { Suspense, lazy, useEffect, useState } from 'react';
import { FaEnvelope, FaGithub, FaLinkedin, FaTrophy } from 'react-icons/fa';
import { SiDevpost } from 'react-icons/si';
import { Project, projects } from '../data/projects';
import { EMAIL, NEXT_COOP_TERM } from '../data/profile';
import SystemDiagram from './SystemDiagram';
import brickeyeLogo from '../assets/logos/brickeye.png';
import watonomousLogo from '../assets/logos/watonomous.jpg';
import virtekLogo from '../assets/logos/virtek.png';

// The 3D viewer is only needed on project pages that have a model.
const ModelViewer = lazy(() => import('./ModelViewer'));

interface ProjectsListProps {
  /** default = main page, all-projects = full-width tile grid, detail = one project's full-width page */
  mode?: 'default' | 'all-projects' | 'detail';
  projectSlug?: string;
}

const projectHref = (project: Project) => `#project-${project.slug}`;

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

const BulletList: React.FC<{ items: string[]; className?: string }> = ({ items, className = 'space-y-2' }) => (
  <ul className={className}>
    {items.map((item) => (
      <li key={item} className="text-gray-300 text-sm lg:text-base leading-relaxed flex items-start">
        <span className="text-accent mr-2 mt-[2px]">•</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const TagList: React.FC<{ tags: string[]; className?: string }> = ({ tags, className = '' }) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {tags.map((tag) => (
      <span key={tag} className="bg-dark-bg border border-dark-border text-gray-300 px-2 py-1 text-xs font-mono">
        {tag}
      </span>
    ))}
  </div>
);

const SectionHeading: React.FC<{ id?: string; as?: 'h1' | 'h2'; children: React.ReactNode; className?: string }> = ({
  id,
  as: Tag = 'h2',
  children,
  className = ''
}) => (
  <div id={id} className={`scroll-mt-8 border-b border-dark-border pb-4 ${className}`}>
    <Tag className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">{children}</Tag>
    <div className="w-20 h-1 bg-accent"></div>
  </div>
);

const experiences = [
  {
    role: 'Product Hardware Engineer',
    org: 'Brickeye',
    logo: brickeyeLogo,
    date: 'Sept 2026 - Dec 2026',
    location: 'North York, ON',
    focus: 'IoT Hardware / Firmware',
    tags: ['SolidWorks', 'KiCAD', 'PCB Design', 'Firmware', 'LoRaWAN', 'ThingsBoard'],
    bullets: [
      'Developing and validating IoT sensor systems through mechanical prototyping, electrical schematics, PCB design, firmware development, and sensor characterization using SolidWorks and KiCAD.',
      'Built a proof-of-concept sensor-monitoring system ingesting live telemetry from LoRaWAN sensors and gateways (ChirpStack to ThingsBoard) across 3 modeled buildings and 170 suites.'
    ]
  },
  {
    role: 'Humanoid Perception and Firmware Developer',
    org: 'Watonomous',
    logo: watonomousLogo,
    date: 'Jan 2026 - Present',
    location: 'Waterloo, ON',
    focus: 'Robotics Perception / Firmware',
    tags: ['ROS2', 'VSLAM', 'RTAB-Map', 'GTSAM', 'Isaac Sim', 'C/C++'],
    bullets: [
      'Built a wearable 6-DOF leader arm and developed firmware to read joint angles from STS3215 serial-bus servos over half-duplex UART, collecting data to train a humanoid in Isaac Sim.',
      'Leading VSLAM development using RTAB-Map, an Intel RealSense D435i, and ROS2 for RGB-D localization and 3D mapping, and developing IMU fusion on a GTSAM factor-graph backend.',
      'Developed embedded firmware on STM32 microcontrollers, implementing HAL-based USART communication in C/C++ for reliable inter-device data exchange and robotic subsystem coordination.'
    ]
  },
  {
    role: 'Quality Assurance',
    org: 'Virtek Vision International',
    logo: virtekLogo,
    date: 'Jan 2026 - Apr 2026',
    location: 'Waterloo, ON',
    focus: 'Hardware / Software QA',
    tags: ['Laser Projectors', 'AI Vision Systems', 'Python', 'PowerShell', 'JIRA', 'Bitbucket'],
    bullets: [
      'Executed 1,200+ regression tests across laser projectors, camera systems running local AI vision models, desktop software, and web applications over two full validation cycles.',
      'Identified 90+ software and hardware defects in collaboration with developers using JIRA, Git, and Bitbucket.',
      'Developed 30+ reusable Python and PowerShell QA automation scripts for regression and validation testing, reducing human error and saving an estimated 8-12 hours per regression cycle.'
    ]
  }
];

const skillGroups = [
  {
    title: 'Programming',
    skills: ['C/C++', 'Python', 'JavaScript', 'PowerShell']
  },
  {
    title: 'Embedded & Hardware',
    skills: ['STM32 HAL', 'ESP32', 'Arduino', 'Raspberry Pi', 'UART / Serial', 'PCB Design', 'LoRaWAN']
  },
  {
    title: 'Robotics & Vision',
    skills: ['ROS2', 'RTAB-Map', 'GTSAM', 'Isaac Sim', 'Foxglove', 'OpenCV', 'MediaPipe', 'YOLOv8', 'PyTorch']
  },
  {
    title: 'CAD & Tools',
    skills: ['SolidWorks', 'KiCAD', 'AutoCAD', 'Git', 'Docker', 'JIRA']
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
  { title: 'Perception & SLAM', detail: 'RTAB-Map VSLAM, RealSense D435i, GTSAM IMU fusion' },
  { title: 'Computer Vision', detail: 'PyTorch CNNs, OpenCV, YOLOv8, MediaPipe' },
  { title: 'Robot Integration', detail: '5-DOF arm, 6-DOF leader arm, Isaac Sim' },
  { title: 'Embedded Firmware', detail: 'STM32 HAL, half-duplex UART servo bus, ESP32' }
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
  }
];

const emailHref = `mailto:${EMAIL}?subject=Embedded%20Robotics%20%2F%20Computer%20Vision%20Opportunity&body=Hi%20Bhavya%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20wanted%20to%20reach%20out%20about...`;

const featuredProjects = projects.filter((project) => project.featured !== false);
const cardId = (project: Project) => `project-card-${project.slug}`;

// Remembers the last project page opened, so going back to All Projects lands on that tile.
let lastViewedProjectSlug: string | null = null;

/** Project image framed per its type: photos fill the frame, logos sit on their own background. */
const ProjectImage: React.FC<{ project: Project; src?: string; lazy?: boolean; className?: string }> = ({
  project,
  src = project.image,
  lazy = false,
  className = ''
}) => {
  const contain = project.imageFit === 'contain';
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${contain ? 'p-6' : ''} ${className}`}
      style={{ backgroundColor: contain ? project.imageBg ?? '#0a0a0a' : '#0a0a0a' }}
    >
      <img
        src={src}
        alt={project.title}
        loading={lazy ? 'lazy' : undefined}
        decoding="async"
        className={contain ? 'max-h-full max-w-full object-contain' : 'h-full w-full object-cover'}
      />
    </div>
  );
};

const ProjectsList: React.FC<ProjectsListProps> = ({ mode = 'default', projectSlug }) => {
  const [mediaTab, setMediaTab] = useState<number | 'model'>(0);

  const selectedProject = projects.find((project) => project.slug === projectSlug) ?? null;

  // Full-width pages start at the top (the browser can't do this itself because the
  // hash target doesn't exist until after render). Returning to All Projects from a
  // project lands on that project's tile instead.
  useEffect(() => {
    setMediaTab(0);
    if (mode === 'detail') {
      window.scrollTo(0, 0);
      lastViewedProjectSlug = projectSlug ?? null;
    } else if (mode === 'all-projects') {
      const returnTile = lastViewedProjectSlug ? document.getElementById(`project-card-${lastViewedProjectSlug}`) : null;
      lastViewedProjectSlug = null;
      if (returnTile) {
        returnTile.scrollIntoView({ block: 'center' });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [mode, projectSlug]);

  useEffect(() => {
    if (mode !== 'default') return;

    const scrollToCurrentHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'top') {
        window.scrollTo(0, 0);
        return;
      }
      if (!['projects', 'experience', 'skills'].includes(hash)) return;

      window.requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };

    scrollToCurrentHash();
    window.addEventListener('hashchange', scrollToCurrentHash);
    return () => window.removeEventListener('hashchange', scrollToCurrentHash);
  }, [mode]);

  const renderFeaturedProjects = () => (
    <div className="mt-8 space-y-6">
      {featuredProjects.map((project, index) => (
        <article
          key={project.id}
          className="group bg-dark-card/70 backdrop-blur-sm border border-dark-border hover:border-accent/50 transition-colors duration-300 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <a
              href={projectHref(project)}
              tabIndex={-1}
              aria-hidden="true"
              className={`block cursor-target ${index % 2 === 1 ? 'lg:order-2' : ''}`}
            >
              <ProjectImage
                project={project}
                lazy={index > 0}
                className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[340px] transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </a>

            <div className="p-6 lg:p-8 flex flex-col">
              {project.award && (
                <p className="mb-3 inline-flex w-fit items-center gap-2 border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
                  <FaTrophy className="h-3 w-3 text-amber-400" aria-hidden="true" />
                  {project.award}
                </p>
              )}
              <a href={projectHref(project)} className="cursor-target">
                <h3 className="text-2xl font-bold text-white mb-3 hover:text-accent transition-colors duration-200">
                  {project.title}
                </h3>
              </a>
              <p className="text-gray-300 leading-relaxed mb-5">{project.description}</p>

              {project.highlights && project.highlights.length > 0 && (
                <BulletList
                  items={project.highlights.filter((highlight) => !highlight.startsWith('Awarded')).slice(0, 2)}
                  className="space-y-2 mb-6"
                />
              )}

              <TagList tags={project.technologies.slice(0, 6)} />

              <div className="mt-auto pt-6 flex flex-wrap items-center gap-3">
                <a
                  href={projectHref(project)}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/80 text-white font-semibold py-2 px-4 transition-colors duration-200 cursor-target"
                >
                  How it works
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <ProjectExternalLinks project={project} />
              </div>
            </div>
          </div>
        </article>
      ))}

      <div className="flex justify-end">
        <a
          href="#all-projects"
          className="group/all inline-flex items-center gap-2 border border-accent/60 bg-accent/10 text-white font-semibold py-2.5 px-5 transition-colors duration-200 hover:bg-accent/20 hover:border-accent cursor-target"
        >
          View All {projects.length} Projects
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover/all:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );

  const renderProjectTiles = () => (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          id={cardId(project)}
          className="group flex flex-col bg-dark-card/70 backdrop-blur-sm border border-dark-border overflow-hidden hover:border-accent/50 transition-colors duration-200"
        >
          <a href={projectHref(project)} className="block cursor-target overflow-hidden" tabIndex={-1} aria-hidden="true">
            <ProjectImage
              project={project}
              lazy
              className="aspect-[16/10] transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </a>
          <div className="p-5 flex flex-1 flex-col">
            {project.award && (
              <p className="mb-2 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-amber-300">
                <FaTrophy className="h-3 w-3" aria-hidden="true" />
                {project.award}
              </p>
            )}
            <a href={projectHref(project)} className="block cursor-target">
              <h3 className="text-lg font-bold text-white mb-3 hover:text-accent transition-colors duration-200">
                {project.title}
              </h3>
            </a>
            <p className="text-sm leading-relaxed text-gray-400 mb-4">{project.description}</p>
            <TagList tags={project.technologies.slice(0, 5)} />
            <ProjectExternalLinks project={project} className="mt-auto pt-5" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjectDetail = (project: Project) => {
    const images = project.images && project.images.length > 0 ? project.images : [project.image];
    const tabs: { key: number | 'model'; label: string }[] = [
      ...images.map((_, index) => ({ key: index, label: images.length > 1 ? `Photo ${index + 1}` : 'Photo' })),
      ...(project.videoUrl ? [{ key: images.length, label: 'Video' }] : []),
      ...(project.model ? [{ key: 'model' as const, label: '3D Model' }] : [])
    ];
    const isVideo = project.videoUrl && mediaTab === images.length;

    const position = projects.findIndex((p) => p.slug === project.slug);
    const previous = projects[(position - 1 + projects.length) % projects.length];
    const next = projects[(position + 1) % projects.length];

    return (
      <>
        <article className="bg-dark-card/70 backdrop-blur-sm border border-dark-border overflow-hidden">
          <div className="bg-dark-bg">
            {mediaTab === 'model' && project.model ? (
              <Suspense fallback={<div className="h-72 lg:h-[420px]" />}>
                <ModelViewer
                  url={project.model.url}
                  format={project.model.format}
                  color={project.model.color}
                  caption={project.model.caption}
                  title={project.title}
                />
              </Suspense>
            ) : isVideo ? (
              <video src={project.videoUrl} controls playsInline className="w-full max-h-[520px] bg-black" />
            ) : (
              <ProjectImage
                project={project}
                src={images[typeof mediaTab === 'number' ? mediaTab : 0] ?? project.image}
                className="h-72 lg:h-[420px]"
              />
            )}
          </div>

          {tabs.length > 1 && (
            <div className="px-6 pt-4 flex flex-wrap gap-2" role="tablist" aria-label="Project media">
              {tabs.map((tab) => (
                <button
                  key={String(tab.key)}
                  role="tab"
                  aria-selected={mediaTab === tab.key}
                  onClick={() => setMediaTab(tab.key)}
                  className={`text-xs uppercase tracking-wide px-3 py-1 border transition-colors duration-200 cursor-target ${
                    mediaTab === tab.key
                      ? 'border-accent text-accent bg-accent/10'
                      : 'border-dark-border text-gray-300 bg-dark-bg hover:border-accent/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="p-6 lg:p-8">
            {project.award && (
              <p className="mb-3 inline-flex items-center gap-2 border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
                <FaTrophy className="h-3 w-3 text-amber-400" aria-hidden="true" />
                {project.award}
              </p>
            )}
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">{project.title}</h1>
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">Overview</p>
              <p className="text-gray-300 text-base leading-relaxed">{project.description}</p>
            </div>

            {project.pipeline && project.pipeline.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">How It Works</p>
                <SystemDiagram steps={project.pipeline} />
              </div>
            )}

            {project.highlights && project.highlights.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">What I Built</p>
                <BulletList
                  items={project.award ? project.highlights.filter((h) => !h.startsWith('Awarded')) : project.highlights}
                />
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">Technologies Used</p>
              <TagList tags={project.technologies} />
            </div>

            <ProjectExternalLinks project={project} />
          </div>
        </article>

        {/* Browse between projects without going back to the list */}
        <nav className="mt-6 grid grid-cols-2 gap-4" aria-label="More projects">
          {[
            { label: 'Previous', project: previous, align: 'text-left', arrow: 'M15 19l-7-7 7-7' },
            { label: 'Next', project: next, align: 'text-right', arrow: 'M9 5l7 7-7 7' }
          ].map((item) => (
            <a
              key={item.label}
              href={projectHref(item.project)}
              className={`group border border-dark-border bg-dark-card/70 backdrop-blur-sm p-4 lg:p-5 hover:border-accent/60 transition-colors duration-200 cursor-target ${item.align}`}
            >
              <span className={`flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-accent ${item.label === 'Next' ? 'justify-end' : ''}`}>
                {item.label === 'Previous' && (
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.arrow} />
                  </svg>
                )}
                {item.label} project
                {item.label === 'Next' && (
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.arrow} />
                  </svg>
                )}
              </span>
              <span className="mt-1 block text-sm lg:text-base font-semibold text-white group-hover:text-accent transition-colors duration-200">
                {item.project.title.split(' - ')[0]}
              </span>
            </a>
          ))}
        </nav>
      </>
    );
  };

  if (mode === 'detail' && selectedProject) {
    return <div className="mx-auto max-w-6xl px-4 lg:px-8 py-8 lg:py-12">{renderProjectDetail(selectedProject)}</div>;
  }

  if (mode === 'all-projects') {
    return (
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-8 lg:py-12">
        <a
          href="#projects"
          className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors duration-200 cursor-target"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </a>
        <SectionHeading id="all-projects" as="h1" className="mt-4">ALL PROJECTS</SectionHeading>
        {renderProjectTiles()}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8 mt-16">
      <section className="mb-12 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent mb-3">Bhavya Kurseja</p>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
          Mechatronics student building robot perception and embedded systems.
        </h1>
        <p className="text-lg leading-8 text-gray-300 max-w-3xl">
          I build across firmware, hardware, and software, with projects focused on real devices,
          controls, sensing, and practical hardware-software integration.
        </p>

        {/* Phones have no sidebar, so show availability here. */}
        <p className="lg:hidden mt-5 inline-flex items-center gap-2 border border-dark-border bg-dark-card/80 px-3 py-1.5 text-sm text-gray-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
          {NEXT_COOP_TERM ? `Open to ${NEXT_COOP_TERM} co-op` : 'Open to co-op opportunities'}
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

      <SectionHeading id="projects" className="mb-2">FEATURED PROJECTS</SectionHeading>
      {renderFeaturedProjects()}

      <SectionHeading id="experience" className="mt-16">EXPERIENCE</SectionHeading>

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
                  <div className="flex items-start gap-4">
                    <img
                      src={experience.logo}
                      alt={`${experience.org} logo`}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 lg:h-14 lg:w-14 shrink-0 object-contain bg-white"
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent mb-2">
                        {experience.focus}
                      </p>
                      <h3 className="text-lg lg:text-xl font-bold text-white">{experience.role}</h3>
                      <p className="text-gray-300">{experience.org}</p>
                    </div>
                  </div>
                  <div className="lg:text-right">
                    <p className="text-sm font-medium text-gray-300">{experience.date}</p>
                    <p className="text-sm text-gray-500">{experience.location}</p>
                  </div>
                </div>

                <TagList tags={experience.tags} className="mb-5" />
                <BulletList items={experience.bullets} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <SectionHeading id="skills" className="mt-16">SKILLS</SectionHeading>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillGroups.map((group, index) => (
          <div
            key={group.title}
            className={`bg-dark-card/70 backdrop-blur-sm border border-dark-border p-5 ${
              skillGroups.length % 2 === 1 && index === skillGroups.length - 1 ? 'md:col-span-2' : ''
            }`}
          >
            <h3 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wide">{group.title}</h3>
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

      <section className="mt-16 bg-dark-card/70 backdrop-blur-sm border border-dark-border p-6 lg:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">Education</p>
          <h2 className="text-xl lg:text-2xl font-bold text-white">University of Waterloo</h2>
          <p className="text-gray-300 mt-2">
            Bachelor of Applied Science in Honours Mechatronics Engineering (Co-op Program)
          </p>
        </div>
        <p className="text-gray-400 text-sm md:text-right shrink-0">
          Sept 2025 - Present
          <br className="hidden md:block" />
          <span className="md:hidden"> | </span>
          Waterloo, ON
        </p>
      </section>

      <section id="contact" className="scroll-mt-8 mt-16 pb-4">
        <div className="relative overflow-hidden border border-accent/35 bg-dark-card/85 p-6 lg:p-8 shadow-[0_0_40px_rgba(59,130,246,0.12)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">Contact</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                Let&apos;s build real systems.
              </h2>
              <p className="text-lg leading-8 text-gray-300">
                I&apos;m open to co-op opportunities in embedded robotics, computer vision, and
                hardware-software integration.
              </p>
            </div>

            <div className="border border-dark-border bg-dark-bg/80 p-4 lg:p-5">
              <a
                href={emailHref}
                className="group mb-3 inline-flex w-full items-center justify-center gap-2 bg-accent px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/85 hover:shadow-lg hover:shadow-accent/25 cursor-target"
              >
                <FaEnvelope className="w-4 h-4" />
                Email Me
              </a>
              <p className="mb-3 text-center text-xs text-gray-500 font-mono select-all">{EMAIL}</p>

              <div className="grid grid-cols-2 gap-2">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-2 border border-dark-border bg-dark-card/80 px-4 py-3 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-accent hover:bg-accent/15 hover:text-white cursor-target"
                  >
                    <span className="text-gray-500 transition-colors duration-200 group-hover:text-accent">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsList;
