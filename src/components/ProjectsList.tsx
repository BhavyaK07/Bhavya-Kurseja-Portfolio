import React from 'react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';

const ProjectsList: React.FC = () => {
  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8 mt-16">
      {/* Header */}
      <div className="mb-12 border-b border-dark-border pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">PROJECTS</h1>
        <div className="w-20 h-1 bg-accent"></div>
      </div>

      {/* Projects List - One per row */}
      <div className="space-y-0">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center border-t border-dark-border pt-8">
        <p className="text-gray-500 text-sm font-mono">
          [ MORE_PROJECTS_IN_DEVELOPMENT ]
        </p>
      </div>
    </div>
  );
};

export default ProjectsList;

