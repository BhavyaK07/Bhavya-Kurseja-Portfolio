import autoniMakeImage from '../assets/projects/autoniMake.jpeg';
import auroraImage from '../assets/projects/aurora.png';
import botAutonomyImage from '../assets/projects/botAutonomy.png';
import pillBotImage from '../assets/projects/pillBot.jpg';
import taqaVisionImage from '../assets/projects/taqaVision.jpg';

export interface Project {
  id: number;
  /** URL-safe id used in links like #project-<slug> */
  slug: string;
  title: string;
  featured?: boolean;
  description: string;
  highlights?: string[];
  image: string;
  images?: string[];
  /** 'cover' fills the frame (photos); 'contain' shows the whole image on imageBg (logos). Default: cover. */
  imageFit?: 'cover' | 'contain';
  imageBg?: string;
  /** Short award line shown as a badge, e.g. on featured cards. */
  award?: string;
  /** Steps for the "How It Works" system diagram on the project page. */
  pipeline?: { label: string; detail?: string }[];
  /**
   * Optional 3D model shown in a "3D Model" tab on the project page.
   * Put the file in public/models/ (STL from SolidWorks: File > Save As > STL, or GLB).
   * Keep it under ~5 MB.
   */
  model?: { url: string; format: 'stl' | 'glb'; color?: string; caption?: string };
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
    slug: 'taqa-vision',
    title: "TAQA Vision - AI Hard Hat QA System",
    featured: true,
    description: "Built an AI-powered hard hat QA system for Toyota manufacturing that lets workers verbally flag defective parts, triggering automatic database updates and robotic removal from the line.",
    highlights: [
      "Awarded 1st place in the Safety category at the Toyota Innovation Challenge.",
      "Built an onboard voice assistant that activates on a custom wake word and transcribes worker speech using Whisper STT to flag defect keywords.",
      "Triggered an onboard camera to scan part QR codes and instantly update a live Flask database over WiFi.",
      "Integrated a 5-DOF robotic arm that autonomously removes flagged parts from the assembly line in under 3 seconds, eliminating manual handling and logging every defect with full traceability."
    ],
    image: taqaVisionImage,
    award: '1st Place, Safety - Toyota Innovation Challenge',
    pipeline: [
      { label: 'Wake word', detail: 'OpenWakeWord' },
      { label: 'Speech to text', detail: 'Whisper STT' },
      { label: 'Defect keyword flagged' },
      { label: 'QR scan of part', detail: 'Onboard camera' },
      { label: 'Database updated', detail: 'Flask over WiFi' },
      { label: 'Part removed', detail: '5-DOF arm, < 3 s' }
    ],
    technologies: ['Python', 'Raspberry Pi', 'Flask', 'OpenWakeWord', 'Whisper'],
    githubUrl: 'https://github.com/BhavyaK07/toyota-innovation-challenge',
    buttonText: "View Project"
  },
  {
    id: 2,
    slug: 'autonimake',
    title: "AutoniMake - Code-Free AI Robotics Platform",
    description: "Built a code-free AI robotics platform that lets users connect computer vision model outputs to real hardware actions through a web interface.",
    highlights: [
      "Trained custom PyTorch CNNs for gesture and object recognition from just 30 seconds of video per class (~900 frames), reaching ~99% accuracy in live OpenCV camera inference mapped to hardware actions.",
      "Designed a modular hub-and-peripheral architecture using Raspberry Pi and ESP32, enabling AI-triggered control of motors, sensors, and robotic systems over serial communication.",
      "Implemented low-latency command mapping from model output to robotic actions for rapid prototyping."
    ],
    image: autoniMakeImage,
    pipeline: [
      { label: 'Camera feed', detail: 'OpenCV' },
      { label: 'Custom CNN', detail: 'PyTorch' },
      { label: 'Output mapped to action', detail: 'Web interface' },
      { label: 'Hub', detail: 'Raspberry Pi' },
      { label: 'Peripherals', detail: 'ESP32 over serial' },
      { label: 'Motors, sensors, displays' }
    ],
    technologies: ['Python', 'OpenCV', 'PyTorch', 'ESP32', 'Raspberry Pi'],
    githubUrl: 'https://github.com/BhavyaK07/Autonimake',
    devpostUrl: 'https://devpost.com/software/autonimake',
    buttonText: "View Project"
  },
  {
    id: 3,
    slug: 'pillbot',
    title: "PillBot - Autonomous Medicine Delivery Robot",
    featured: false,
    description: "Engineered an autonomous medicine dispensing robot that lets a user choose pill quantity and destination room, then follows a matching color-coded route to deliver medication.",
    highlights: [
      "Integrated a touch LED sensor, color/optical sensor, distance sensor, inertial sensor, funnel, and conveyor belt into the delivery workflow.",
      "Built remote-control room and pill-count selection, mapping each destination room to a corresponding colored route.",
      "Implemented embedded C++ color-line following with a sway-style correction pattern to work around the constraint of having only one color sensor.",
      "Used touch LED confirmation before departure and return, so a nurse or doctor controls when the robot leaves the hub and when it returns.",
      "Used distance sensing to dispense the selected number of pills from the conveyor belt reliably at the destination."
    ],
    image: pillBotImage,
    // PLACEHOLDER: demo shape so the 3D viewer can be previewed. Replace with the real CAD export
    // (or delete this line) before merging to main.
    model: {
      url: '/models/placeholder-robot.stl',
      format: 'stl',
      caption: 'Placeholder model - real CAD coming soon'
    },
    pipeline: [
      { label: 'Room + pill count chosen', detail: 'Remote control' },
      { label: 'Departure confirmed', detail: 'Touch LED' },
      { label: 'Color-line following', detail: 'Sway correction' },
      { label: 'Arrives at room', detail: 'Distance sensor' },
      { label: 'Pills dispensed', detail: 'Conveyor belt' },
      { label: 'Return confirmed', detail: 'Touch LED' }
    ],
    technologies: ['VEX IQ', 'C++', 'Touch LED Sensor', 'Color Sensor', 'Distance Sensor', 'Inertial Sensor', 'Control Systems'],
    githubUrl: 'https://github.com/BhavyaK07/MTE100-VEXROBOT-PROJECT',
    buttonText: "View Project"
  },
  {
    id: 4,
    slug: 'botautonomy',
    title: "BotAutonomy - Smart Plant Care System",
    featured: false,
    description: "Built a smart plant care system that blends hardware, software, and AI to monitor plant health, automate watering, and provide emotional feedback tied to care quality.",
    highlights: [
      "Integrated Arduino Uno and ESP32-CAM to track soil moisture, trigger watering through a stepper motor, and capture plant images.",
      "Developed a machine learning-based plant health evaluation pipeline and a chatbot that lets users interact with their plant.",
      "Built a Firebase-powered dashboard with real-time telemetry and a points system that rewards or penalizes user care habits."
    ],
    image: botAutonomyImage,
    imageFit: 'contain',
    imageBg: '#fdf6e6',
    pipeline: [
      { label: 'Soil moisture + images', detail: 'Arduino Uno, ESP32-CAM' },
      { label: 'Automatic watering', detail: 'Stepper motor' },
      { label: 'Plant health evaluated', detail: 'ML pipeline' },
      { label: 'Live dashboard', detail: 'Firebase' },
      { label: 'Points + plant chatbot' }
    ],
    technologies: ['Arduino Uno', 'ESP32-CAM', 'Firebase', 'Machine Learning', 'Embedded Systems', 'Web Dashboard'],
    githubUrl: 'https://github.com/BhavyaK07/BotAutonomy',
    devpostUrl: 'https://dorahacks.io/buidl/26416/',
    buttonText: "View Project"
  },
  {
    id: 5,
    slug: 'aurora',
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
    imageFit: 'contain',
    imageBg: '#ffffff',
    pipeline: [
      { label: 'Organization posts role' },
      { label: 'Students search + filter', detail: 'Location, topic' },
      { label: 'Student applies' },
      { label: 'Applicants filtered', detail: 'Resume, past hours' },
      { label: 'Hours recorded', detail: 'Pseudo-blockchain' }
    ],
    technologies: ['Cloud Computing', 'Pseudo-Blockchain', 'Web App', 'Search & Filtering', 'Gamification', 'Data Security'],
    githubUrl: 'https://github.com/BhavyaK07/Aurora',
    devpostUrl: 'https://dorahacks.io/buidl/13404',
    buttonText: "View Project"
  }
];
