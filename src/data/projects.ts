import autoniMakeImage from '../assets/projects/autoniMake.jpeg';
import auroraImage from '../assets/projects/aurora.png';
import botAutonomyImage from '../assets/projects/botAutonomy.png';
import pillBotImage from '../assets/projects/pillBot.png';
import healthyPandaImage from '../assets/projects/HealthyPanda.jpg';

export interface Project {
  id: number;
  title: string;
  featured?: boolean;
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
    image: autoniMakeImage,
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
    image: pillBotImage,
    technologies: ['VEX IQ', 'C++', 'Embedded Systems', 'Control Systems'],
    buttonText: "View Project"
  },
  {
    id: 3,
    title: "BotAutonomy - Smart Plant Care System",
    featured: false,
    description: "Built a smart plant care system that blends hardware, software, and AI to monitor plant health, automate watering, and provide emotional feedback tied to care quality.",
    highlights: [
      "Integrated Arduino Uno and ESP32-CAM to track soil moisture, trigger watering through a stepper motor, and capture plant images.",
      "Developed a machine learning-based plant health evaluation pipeline and a chatbot that lets users interact with their plant.",
      "Built a Firebase-powered dashboard with real-time telemetry and a points system that rewards or penalizes user care habits."
    ],
    image: botAutonomyImage,
    technologies: ['Arduino Uno', 'ESP32-CAM', 'Firebase', 'Machine Learning', 'Embedded Systems', 'Web Dashboard'],
    buttonText: "View Project"
  },
  {
    id: 4,
    title: "Aurora - Volunteer Discovery Platform",
    featured: false,
    description: "Built Aurora to make volunteering opportunities more accessible for high school students while giving organizations better candidate discovery tools.",
    highlights: [
      "Enabled students to search a large volunteering database with filters by location and topic, with visibility into popularity and volunteer reviews.",
      "Designed a gamified volunteering journey with rewards and engagement loops to encourage consistent community participation.",
      "Equipped organizations to post opportunities broadly and filter applicants by resumes and past volunteering experience on Aurora.",
      "Implemented pseudo-blockchain cloud storage for volunteer hours to support permanent record tracking, security-focused data integrity, and high-speed documentation."
    ],
    image: auroraImage,
    technologies: ['Cloud Computing', 'Pseudo-Blockchain', 'Web App', 'Search & Filtering', 'Gamification', 'Data Security'],
    buttonText: "View Project"
  },
  {
    id: 5,
    title: "HealthyPanda - Mental Health Resource Platform",
    featured: false,
    description: "A safe and secure platform for teens and people of all ages to rant and reflect on mental health, inspired by the introduction of 988 mental health hotline.",
    highlights: [
      "Built with Flask backend and HTML/CSS/JavaScript frontend to create an intuitive user interface for mental health support.",
      "Implemented a reflection and rant submission system using Python dictionaries, allowing users to 'let it out' safely.",
      "Integrated a direct link to the 988 suicide hotline website for immediate crisis support access.",
      "Overcame challenges with reflection prompt display and JavaScript button functionality through effective team collaboration.",
      "Demonstrated strong teamwork and technical problem-solving to deliver a polished project in a hackathon environment."
    ],
    image: healthyPandaImage,
    technologies: ['Flask', 'HTML', 'CSS', 'JavaScript', 'Python'],
    buttonText: "View Project"
  }
];

