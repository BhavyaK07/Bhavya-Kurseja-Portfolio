export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  images?: string[];
  technologies: string[];
  buttons?: {
    text: string;
    url: string;
    type: 'github' | 'demo' | 'external';
  }[];
  githubUrl?: string;
  demoUrl?: string;
  externalUrl?: string;
  buttonText: string;
}

// Placeholder image - you can replace this with actual project images
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9qZWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';

export const projects: Project[] = [
  {
    id: 1,
    title: "Project 1",
    description: "Your first project description here. Add your project details, technologies used, and links.",
    image: placeholderImage,
    technologies: ['React', 'TypeScript'],
    buttonText: "View Project"
  },
  {
    id: 2,
    title: "Project 2",
    description: "Your second project description here. Add your project details, technologies used, and links.",
    image: placeholderImage,
    technologies: ['Node.js', 'Express'],
    buttonText: "View Project"
  }
];

