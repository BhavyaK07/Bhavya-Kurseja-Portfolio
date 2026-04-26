import React, { useState } from 'react';
import { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handleButtonClick = () => {
    if (project.demoUrl) {
      window.open(project.demoUrl, '_blank');
    } else if (project.externalUrl) {
      window.open(project.externalUrl, '_blank');
    } else if (project.githubUrl) {
      window.open(project.githubUrl, '_blank');
    }
  };

  const nextImage = () => {
    if (project.images && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images!.length);
    }
  };

  const prevImage = () => {
    if (project.images && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length);
    }
  };

  const hasMultipleImages = project.images && project.images.length > 1;
  const currentImage = hasMultipleImages && project.images ? project.images[currentImageIndex] : project.image;

  return (
    <div className="bg-dark-card/70 backdrop-blur-sm border border-dark-border overflow-hidden hover:border-accent/50 transition-colors duration-300 cursor-target">
      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Text Content */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            {/* Project Title */}
            <div className="mb-4">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 tracking-tight">
                {project.title}
              </h3>
              <div className="w-16 h-0.5 bg-accent"></div>
            </div>

            {/* Project Description */}
            <p className="text-gray-300 text-sm lg:text-base leading-relaxed mb-6">
              {project.description}
            </p>

            {project.highlights && project.highlights.length > 0 && (
              <ul className="mb-6 space-y-2">
                {project.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="text-gray-300 text-sm lg:text-base leading-relaxed flex items-start"
                  >
                    <span className="text-accent mr-2 mt-[2px]">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-accent mb-2 uppercase tracking-wide">TECHNOLOGIES</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-dark-bg border border-dark-border text-gray-300 px-2 py-1 text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto">
            {project.buttons && project.buttons.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {project.buttons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (button.url.startsWith('#')) {
                        window.location.hash = button.url;
                      } else {
                        window.open(button.url, '_blank');
                      }
                    }}
                    className="bg-accent hover:bg-accent/80 text-white font-semibold py-2 px-4 transition-colors duration-200 flex items-center space-x-2 group cursor-target"
                  >
                    <span>{button.text}</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                ))}
              </div>
            ) : project.buttonText ? (
              <button
                onClick={handleButtonClick}
                className="bg-accent hover:bg-accent/80 text-white font-semibold py-2 px-4 transition-colors duration-200 flex items-center space-x-2 group cursor-target"
              >
                <span>{project.buttonText}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="lg:w-1/2 relative">
          <div className="relative overflow-hidden h-48 lg:h-80">
            <img
              src={currentImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            
            {/* Carousel Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 transition-colors duration-200 z-10 cursor-target"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 transition-colors duration-200 z-10 cursor-target"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 font-mono">
                  {currentImageIndex + 1} / {project.images!.length}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

