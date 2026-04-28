import React, { useEffect, useState } from 'react';

const hobbies = [
  'coding',
  'learning new technologies',
  'building projects',
  'reading documentation',
  'debugging',
  'designing',
  'planning',
  'collaborating'
];

const TYPING_SPEED = 60;
const DELETING_SPEED = 30;
const PAUSE = 1200;

interface CurrentlyDoingProps {
  compact?: boolean;
}

const CurrentlyDoing: React.FC<CurrentlyDoingProps> = ({ compact = false }) => {
  const [current, setCurrent] = useState(0);
  const [display, setDisplay] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const fullText = hobbies[current];

    if (typing) {
      if (display.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplay(fullText.slice(0, display.length + 1));
        }, TYPING_SPEED);
      } else {
        timeout = setTimeout(() => setTyping(false), PAUSE);
      }
    } else {
      if (display.length > 0) {
        timeout = setTimeout(() => {
          setDisplay(fullText.slice(0, display.length - 1));
        }, DELETING_SPEED);
      } else {
        timeout = setTimeout(() => {
          setCurrent((current + 1) % hobbies.length);
          setTyping(true);
        }, 400);
      }
    }
    return () => clearTimeout(timeout);
  }, [display, typing, current]);

  if (compact) {
    return (
      <div className="w-full mt-2">
        <style>{`
          @keyframes text-glow {
            0%, 100% {
              text-shadow: 0 0 10px rgba(59, 130, 246, 0.4), 0 0 20px rgba(59, 130, 246, 0.2);
            }
            50% {
              text-shadow: 0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.3);
            }
          }
          
          @keyframes cursor-blink {
            0%, 49%, 100% {
              opacity: 1;
            }
            50%, 99% {
              opacity: 0;
            }
          }
          
          .text-glow {
            animation: text-glow 3s ease-in-out infinite;
          }
          
          .cursor-blink {
            animation: cursor-blink 1s infinite;
          }
        `}</style>
        
        <div className="bg-gradient-to-r from-accent/5 via-transparent to-accent/5 rounded-lg p-2">
          <div className="text-sm font-medium h-6 flex items-center justify-center">
            <span className="text-gray-500">I'm probably </span>
            <span className="text-glow bg-gradient-to-r from-accent via-blue-400 to-accent bg-clip-text text-transparent ml-1">
              {display}
            </span>
            <span className="cursor-blink text-accent text-xs ml-0.5">|</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.15);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.25);
          }
        }
        
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.4), 0 0 20px rgba(59, 130, 246, 0.2);
          }
          50% {
            text-shadow: 0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.3);
          }
        }
        
        @keyframes cursor-blink {
          0%, 49%, 100% {
            opacity: 1;
          }
          50%, 99% {
            opacity: 0;
          }
        }
        
        .glow-container {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        
        .text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }
        
        .cursor-blink {
          animation: cursor-blink 1s infinite;
        }
      `}</style>
      
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-accent/60">
        What's Next?
      </div>
      
      <div className="glow-container border border-accent/30 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 rounded-lg p-4 transition-all duration-300">
        <p className="text-sm text-gray-400 mb-2">Currently I am probably:</p>
        <div className="text-xl lg:text-2xl font-semibold h-8 flex items-center justify-center">
          <span className="text-glow bg-gradient-to-r from-accent via-blue-400 to-accent bg-clip-text text-transparent">
            {display}
          </span>
          <span className="cursor-blink text-accent ml-1">|</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentlyDoing;

