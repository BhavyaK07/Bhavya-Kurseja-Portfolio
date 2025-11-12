import React, { useState, useEffect, useRef, useMemo } from 'react';

interface TerminalProps {
  onExit: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onExit }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const commands = {
    'help': 'Available commands: help, about, projects, skills, contact, clear, exit',
    'about': 'Bhavya Kurseja - Mechatronics Engineer at University of Waterloo. Passionate about robotics, quantum computing, and software engineering.',
    'projects': 'Current projects: BotAutonomy (smart plant care), Sumo Bot (Arduino-driven), Robot Ping Pong Opponent (ball launcher), TasteR (food discovery app)',
    'skills': 'Technologies: Arduino, React, TypeScript, Tailwind CSS, Python, CAD, 3D Printing, Electronics, Machine Learning',
    'contact': 'Email: bdkurseja@gmail.com | LinkedIn: linkedin.com/in/bhavyakurseja/',
    'clear': () => setOutput([]),
    'exit': () => onExit()
  };

  const welcomeMessages = useMemo(() => [
    'Terminal v2.1.4 - Portfolio Access System',
    'Initializing neural interface...',
    'Loading portfolio data...',
    'Establishing secure connection...',
    'Welcome to Bhavya Kurseja\'s Portfolio Terminal',
    '',
    'Type "help" for available commands',
    'Type "exit" to return to main interface',
    '',
    '> '
  ], []);

  useEffect(() => {
    // Typewriter effect for welcome messages
    if (currentMessageIndex < welcomeMessages.length) {
      const currentMessage = welcomeMessages[currentMessageIndex];
      
      if (typingIndex < currentMessage.length) {
        const timer = setTimeout(() => {
          setTypingIndex(typingIndex + 1);
        }, 50); // Adjust speed here
        return () => clearTimeout(timer);
      } else {
        // Move to next message
        const timer = setTimeout(() => {
          setOutput(prev => [...prev, currentMessage]);
          setCurrentMessageIndex(currentMessageIndex + 1);
          setTypingIndex(0);
        }, 200); // Pause between messages
        return () => clearTimeout(timer);
      }
    }
  }, [typingIndex, currentMessageIndex, welcomeMessages]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Add global event listener for exit shortcut
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      if ((isMac && e.metaKey && e.shiftKey && e.key === 'm') || 
          (!isMac && e.ctrlKey && e.shiftKey && e.key === 'm')) {
        e.preventDefault();
        onExit();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [onExit]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (trimmedCmd === '') return;

    const newOutput = [...output, `> ${cmd}`];
    
    if (trimmedCmd in commands) {
      const result = commands[trimmedCmd as keyof typeof commands];
      if (typeof result === 'function') {
        result();
        setOutput(newOutput);
      } else {
        setOutput([...newOutput, result, '', '> ']);
      }
    } else {
      setOutput([...newOutput, `Command not found: ${trimmedCmd}`, 'Type "help" for available commands', '', '> ']);
    }
    
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };



  return (
    <div className="fixed inset-0 bg-black text-purple-400 font-mono text-sm overflow-hidden z-50">
      {/* Terminal Header */}
      <div className="bg-gray-900 p-2 border-b border-purple-500 flex justify-between items-center">
        <span className="text-purple-400">Secret Portfolio Terminal</span>
        <span className="text-purple-400">
          {navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘+⇧+M' : 'Ctrl+Shift+M'} to exit
        </span>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="p-4 h-full overflow-y-auto"
        style={{ 
          background: 'linear-gradient(180deg, #000000 0%, #1a001a 100%)',
          textShadow: '0 0 10px #a855f7'
        }}
      >


        {/* Output */}
        {output.map((line, index) => (
          <div key={index} className="text-purple-400 mb-1">
            {line}
          </div>
        ))}

        {/* Currently typing line */}
        {currentMessageIndex < welcomeMessages.length && (
          <div className="text-purple-400 mb-1">
            {welcomeMessages[currentMessageIndex].substring(0, typingIndex)}
            <span className="animate-pulse">|</span>
          </div>
        )}

        {/* Input line - only show after all welcome messages are typed */}
        {currentMessageIndex >= welcomeMessages.length && (
          <>
            <div className="flex items-center">
              <span className="text-purple-400 mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-transparent text-purple-400 outline-none flex-1"
                placeholder="Enter command..."
                autoFocus
              />
            </div>

            {/* Blinking cursor */}
            <span className="text-purple-400 animate-pulse">|</span>
          </>
        )}
      </div>

      {/* Status bar */}
      <div className="bg-gray-900 p-2 border-t border-purple-500 flex justify-between text-purple-400 text-xs">
        <span>READY</span>
        <span>Connected to Portfolio Database</span>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default Terminal;
