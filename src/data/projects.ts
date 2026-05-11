import autoniMakeImage from '../assets/projects/autoniMake.jpeg';
import auroraImage from '../assets/projects/aurora.png';
import botAutonomyImage from '../assets/projects/botAutonomy.png';
import pillBotImage from '../assets/projects/pillBot.png';

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
    description: "Built a robotics prototyping platform that lets users connect computer vision model outputs to real hardware actions through a web interface.",
    highlights: [
      "Developed a real-time OpenCV pipeline using a custom PyTorch CNN model that reached 99% accuracy.",
      "Designed a modular Raspberry Pi + ESP32 architecture for AI-triggered control of motors, sensors, and displays.",
      "Implemented low-latency command mapping from model output to robotic actions for rapid prototyping."
    ],
    image: autoniMakeImage,
    technologies: ['Python', 'OpenCV', 'PyTorch', 'ESP32', 'Raspberry Pi'],
    githubUrl: 'https://github.com/BhavyaK07/Autonimake',
    devpostUrl: 'https://devpost.com/software/autonimake',
    buttonText: "View Project"
  },
  {
    id: 2,
    title: "PillBot - Autonomous Medicine Delivery Robot",
    description: "Engineered an autonomous medicine dispensing robot that lets a user choose pill quantity and destination room, then follows a matching color-coded route to deliver medication.",
    highlights: [
      "Integrated a touch LED sensor, color/optical sensor, distance sensor, inertial sensor, funnel, and conveyor belt into the delivery workflow.",
      "Built remote-control room and pill-count selection, mapping each destination room to a corresponding colored route.",
      "Implemented embedded C++ color-line following with a sway-style correction pattern to work around the constraint of having only one color sensor.",
      "Used touch LED confirmation before departure and return, so a nurse or doctor controls when the robot leaves the hub and when it returns.",
      "Used distance sensing to dispense the selected number of pills from the conveyor belt reliably at the destination."
    ],
    image: pillBotImage,
    technologies: ['VEX IQ', 'C++', 'Touch LED Sensor', 'Color Sensor', 'Distance Sensor', 'Inertial Sensor', 'Control Systems'],
    githubUrl: 'https://github.com/BhavyaK07/MTE100-VEXROBOT-PROJECT',
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
    githubUrl: 'https://github.com/BhavyaK07/BotAutonomy',
    devpostUrl: 'https://dorahacks.io/buidl/26416/',
    buttonText: "View Project"
  },
  {
    id: 4,
    title: "Aurora - Volunteer Discovery Platform",
    featured: false,
    description: "Built Aurora to help high school students find volunteering opportunities while giving organizations tools to post roles and review applicants.",
    highlights: [
      "Enabled students to search a large volunteering database with filters by location and topic, with visibility into popularity and volunteer reviews.",
      "Designed a gamified volunteering journey with rewards and engagement loops to encourage consistent community participation.",
      "Equipped organizations to post opportunities broadly and filter applicants by resumes and past volunteering experience on Aurora.",
      "Explored a pseudo-blockchain-style storage approach for volunteer hour records with a focus on data integrity and documentation speed."
    ],
    image: auroraImage,
    technologies: ['Cloud Computing', 'Pseudo-Blockchain', 'Web App', 'Search & Filtering', 'Gamification', 'Data Security'],
    githubUrl: 'https://github.com/BhavyaK07/Aurora',
    devpostUrl: 'https://dorahacks.io/buidl/13404',
    buttonText: "View Project"
  }
];
