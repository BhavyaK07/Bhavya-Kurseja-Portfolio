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
// Hero figure (three.js + a ~1 MB mesh); only loaded on screens wide enough to show it.
const DitherHumanoid = lazy(() => import('./DitherHumanoid'));

const WIDE_QUERY = '(min-width: 1280px)';
function useIsWide() {
  const [isWide, setIsWide] = useState(() => window.matchMedia(WIDE_QUERY).matches);
  useEffect(() => {
    const query = window.matchMedia(WIDE_QUERY);
    const onChange = () => setIsWide(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return isWide;
}

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
          className="icon-btn cursor-target"
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
      <li key={item} className="text-body text-sm lg:text-base leading-relaxed flex items-start">
        <span className="text-muted-soft mr-2.5 mt-[2px]">•</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const TagList: React.FC<{ tags: string[]; className?: string }> = ({ tags, className = '' }) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {tags.map((tag) => (
      <span key={tag} className="pill">
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
  <div id={id} className={`scroll-mt-8 border-b border-dark-border pb-5 ${className}`}>
    <Tag className="text-display-sm lg:text-display-md font-medium text-ink">{children}</Tag>
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
      style={{ backgroundColor: contain ? project.imageBg ?? '#000000' : '#000000' }}
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
  const isWide = useIsWide();
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
          className="card card-hover overflow-hidden"
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
                className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[340px]"
              />
            </a>

            <div className="p-6 lg:p-8 flex flex-col">
              {project.award && (
                <p className="award-pill mb-4">
                  <FaTrophy className="h-3 w-3" aria-hidden="true" />
                  {project.award}
                </p>
              )}
              <a href={projectHref(project)} className="cursor-target">
                <h3 className="text-2xl font-medium tracking-tight text-ink mb-3 hover:text-accent transition-colors duration-150">
                  {project.title}
                </h3>
              </a>
              <p className="text-body leading-relaxed mb-5">{project.description}</p>

              {project.highlights && project.highlights.length > 0 && (
                <BulletList
                  items={project.highlights.filter((highlight) => !highlight.startsWith('Awarded')).slice(0, 2)}
                  className="space-y-2 mb-6"
                />
              )}

              <TagList tags={project.technologies.slice(0, 6)} />

              <div className="mt-auto pt-6 flex flex-wrap items-center gap-3">
                <a href={projectHref(project)} className="btn-primary cursor-target">
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
        <a href="#all-projects" className="btn-secondary cursor-target">
          View all {projects.length} projects
          <svg
            className="w-4 h-4"
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
          className="card card-hover flex flex-col overflow-hidden"
        >
          <a href={projectHref(project)} className="block cursor-target overflow-hidden" tabIndex={-1} aria-hidden="true">
            <ProjectImage project={project} lazy className="aspect-[16/10]" />
          </a>
          <div className="p-6 flex flex-1 flex-col">
            {project.award && (
              <p className="award-pill mb-3">
                <FaTrophy className="h-3 w-3" aria-hidden="true" />
                {project.award}
              </p>
            )}
            <a href={projectHref(project)} className="block cursor-target">
              <h3 className="text-lg font-medium tracking-tight text-ink mb-3 hover:text-accent transition-colors duration-150">
                {project.title}
              </h3>
            </a>
            <p className="text-sm leading-relaxed text-muted mb-4">{project.description}</p>
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
        <article className="card rounded-2xl overflow-hidden">
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
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150 cursor-target ${
                    mediaTab === tab.key ? 'bg-dark-elevated text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="p-6 lg:p-8">
            {project.award && (
              <p className="award-pill mb-4">
                <FaTrophy className="h-3 w-3" aria-hidden="true" />
                {project.award}
              </p>
            )}
            <h1 className="text-display-sm lg:text-display-md font-medium text-ink mb-8">{project.title}</h1>
            <div className="mb-8">
              <p className="eyebrow mb-3">Overview</p>
              <p className="text-body text-base leading-relaxed">{project.description}</p>
            </div>

            {project.pipeline && project.pipeline.length > 0 && (
              <div className="mb-8">
                <p className="eyebrow mb-3">How It Works</p>
                <SystemDiagram steps={project.pipeline} />
              </div>
            )}

            {project.highlights && project.highlights.length > 0 && (
              <div className="mb-8">
                <p className="eyebrow mb-3">What I Built</p>
                <BulletList
                  items={project.award ? project.highlights.filter((h) => !h.startsWith('Awarded')) : project.highlights}
                />
              </div>
            )}

            <div className="mb-6">
              <p className="eyebrow mb-3">Technologies Used</p>
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
              className={`group card card-hover p-5 lg:p-6 cursor-target ${item.align}`}
            >
              <span className={`eyebrow flex items-center gap-1 ${item.label === 'Next' ? 'justify-end' : ''}`}>
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
              <span className="mt-2 block text-sm lg:text-base font-medium text-ink group-hover:text-accent transition-colors duration-150">
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
          className="text-link inline-flex items-center gap-1 text-sm cursor-target"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </a>
        <SectionHeading id="all-projects" as="h1" className="mt-6">All projects</SectionHeading>
        {renderProjectTiles()}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8 mt-16">
      <section className="mb-24 max-w-4xl xl:max-w-6xl">
        <div className="xl:flex xl:items-center xl:gap-4">
          <div className="max-w-4xl xl:flex-1">
            <p className="eyebrow mb-4">Bhavya Kurseja</p>
            <h1 className="text-4xl leading-[1.1] tracking-[-0.02em] lg:text-display-lg font-medium text-ink mb-6">
              Mechatronics student building robot perception and embedded systems.
            </h1>
            <p className="text-lg leading-8 text-body max-w-3xl">
              I build across firmware, hardware, and software, with projects focused on real devices,
              controls, sensing, and practical hardware-software integration.
            </p>

            {/* Phones have no sidebar, so show availability here. */}
            <p className="lg:hidden mt-6 inline-flex items-center gap-2 rounded-full border border-dark-border bg-dark-card/80 px-3.5 py-1.5 text-sm text-ink">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              {NEXT_COOP_TERM ? `Open to ${NEXT_COOP_TERM} co-op` : 'Open to co-op opportunities'}
            </p>
          </div>

          {/* Dithered Unitree G1 that turns toward the cursor; wide screens only, where there is room beside the text. */}
          {isWide && (
            <Suspense fallback={<div className="shrink-0 w-[340px] h-[400px] -my-12" />}>
              <DitherHumanoid className="shrink-0 w-[340px] h-[400px] -my-12" />
            </Suspense>
          )}
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {focusTiles.map((tile) => (
            <div key={tile.title} className="card card-hover p-5">
              <p className="text-sm font-medium text-ink">{tile.title}</p>
              <p className="text-xs leading-5 text-muted mt-2">{tile.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionHeading id="projects" className="mb-2">Featured projects</SectionHeading>
      {renderFeaturedProjects()}

      <SectionHeading id="experience" className="mt-24">Experience</SectionHeading>

      <div className="mt-8 relative">
        <div className="absolute left-3 top-3 bottom-3 hidden md:block w-px bg-dark-border" />
        <div className="space-y-6">
          {experiences.map((experience) => (
            <article key={`${experience.org}-${experience.role}`} className="relative md:pl-10">
              <div className="absolute left-0 top-7 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-dark-border bg-dark-bg">
                <span className="h-2 w-2 rounded-full bg-muted" />
              </div>

              <div className="card card-hover p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={experience.logo}
                      alt={`${experience.org} logo`}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 lg:h-14 lg:w-14 shrink-0 rounded-lg object-contain bg-white"
                    />
                    <div>
                      <p className="eyebrow mb-2">{experience.focus}</p>
                      <h3 className="text-lg lg:text-xl font-medium tracking-tight text-ink">{experience.role}</h3>
                      <p className="text-body">{experience.org}</p>
                    </div>
                  </div>
                  <div className="lg:text-right">
                    <p className="text-sm font-medium text-body">{experience.date}</p>
                    <p className="text-sm text-muted-soft">{experience.location}</p>
                  </div>
                </div>

                <TagList tags={experience.tags} className="mb-5" />
                <BulletList items={experience.bullets} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <SectionHeading id="skills" className="mt-24">Skills</SectionHeading>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillGroups.map((group, index) => (
          <div
            key={group.title}
            className={`card card-hover p-6 ${
              skillGroups.length % 2 === 1 && index === skillGroups.length - 1 ? 'md:col-span-2' : ''
            }`}
          >
            <h3 className="eyebrow mb-4">{group.title}</h3>
            <TagList tags={group.skills} />
          </div>
        ))}
      </div>

      <section className="card mt-24 p-6 lg:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <p className="eyebrow mb-3">Education</p>
          <h2 className="text-xl lg:text-2xl font-medium tracking-tight text-ink">University of Waterloo</h2>
          <p className="text-body mt-2">
            Bachelor of Applied Science in Honours Mechatronics Engineering (Co-op Program)
          </p>
        </div>
        <p className="text-muted text-sm md:text-right shrink-0">
          Sept 2025 - Present
          <br className="hidden md:block" />
          <span className="md:hidden"> | </span>
          Waterloo, ON
        </p>
      </section>

      {/* Contact card: dark surface with a faint accent wash */}
      <section id="contact" className="scroll-mt-8 mt-24 pb-4">
        <div className="card border-accent/25 bg-gradient-to-br from-accent/[0.08] via-dark-card/80 to-dark-card/80 p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:items-center">
            <div>
              <p className="eyebrow mb-3">Contact</p>
              <h2 className="text-display-sm lg:text-display-md font-medium text-ink mb-4">Let&apos;s build real systems.</h2>
              <p className="text-lg leading-8 text-body">
                I&apos;m open to co-op opportunities in embedded robotics, computer vision, and
                hardware-software integration.
              </p>
            </div>

            <div>
              <a
                href={emailHref}
                className="btn-primary mb-3 h-11 w-full cursor-target"
              >
                <FaEnvelope className="w-4 h-4" />
                Email me
              </a>
              <p className="mb-4 text-center text-xs text-muted-soft font-mono select-all">{EMAIL}</p>

              <div className="grid grid-cols-2 gap-2">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary h-11 cursor-target"
                  >
                    {link.icon}
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
