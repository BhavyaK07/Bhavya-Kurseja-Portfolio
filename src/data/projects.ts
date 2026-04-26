export interface Project {
  id: number;
  title: string;
  description: string;
  highlights?: string[];
  image: string;
  images?: string[];
  videoUrl?: string;
  technologies: string[];
  buttons?: {
    text: string;
    url: string;
    type: 'github' | 'demo' | 'external';
  }[];
  githubUrl?: string;
  devpostUrl?: string;
  demoUrl?: string;
  externalUrl?: string;
  buttonText?: string;
}

// Placeholder image - you can replace this with actual project images
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9qZWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';

export const projects: Project[] = [
  {
    id: 1,
    title: "AutoniMake - Code-Free AI Robotics Platform",
    description: "Built a code-free robotics platform that lets users train vision models and map predictions to real hardware actions through a web interface.",
    highlights: [
      "Developed a real-time OpenCV + CNN inference pipeline for gesture and object recognition.",
      "Designed a modular Raspberry Pi + ESP32 architecture for AI-triggered control of motors, sensors, and displays.",
      "Implemented low-latency command mapping from model output to robotic actions for rapid prototyping."
    ],
    image: placeholderImage,
    technologies: ['Python', 'OpenCV', 'PyTorch', 'ESP32', 'Raspberry Pi'],
    buttonText: "View Project"
  },
  {
    id: 2,
    title: "PillBot - Autonomous Medicine Delivery Robot",
    description: "Engineered an autonomous medicine dispensing robot that follows color-coded routes to deliver medication to assigned patient rooms.",
    highlights: [
      "Implemented embedded C++ closed-loop line following with real-time sensor feedback and adaptive motor control.",
      "Built modular room-routing logic by mapping room selection to hue detection, enabling scalable multi-room navigation."
    ],
    image: placeholderImage,
    technologies: ['VEX IQ', 'C++', 'Embedded Systems', 'Control Systems'],
    buttonText: "View Project"
  }
];

