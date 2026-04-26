import React from 'react';

type AboutIntroProps = {
  variant?: 'card' | 'plain';
};

const AboutIntro: React.FC<AboutIntroProps> = ({ variant = 'card' }) => {
  const focusAreas = [
    'Robotics Integration',
    'Embedded Systems',
    'Automation',
    'Mechatronics Design'
  ];

  const strengths = [
    {
      title: 'Build Across Stack',
      description: 'I connect firmware, hardware, and software into one reliable system.'
    },
    {
      title: 'Move From Idea to Demo',
      description: 'I prototype quickly, validate behavior, and iterate with real-world constraints.'
    },
    {
      title: 'Engineer for Impact',
      description: 'I focus on practical solutions that improve reliability, speed, and usability.'
    }
  ];

  const content = (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent mb-3">
        Overview
      </p>
      <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
        About Me
      </h1>

      <div className="space-y-6 text-lg leading-8 text-gray-300">
        <p>
          I am a Mechatronics Engineering student at the University of Waterloo,
          focused on robotics, hardware-software integration, and automation.
        </p>

        <p>
          My projects combine mechanical systems, embedded electronics, and
          software controls to build practical, high-impact engineering solutions.
        </p>
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
          Core Focus
        </p>
        <div className="flex flex-wrap gap-2">
          {focusAreas.map((focus) => (
            <span
              key={focus}
              className="bg-dark-bg border border-dark-border text-gray-200 px-3 py-1 text-xs font-semibold tracking-wide"
            >
              {focus}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
        {strengths.map((strength) => (
          <div
            key={strength.title}
            className="bg-dark-bg/70 border border-dark-border rounded-xl p-4"
          >
            <h3 className="text-sm font-semibold text-white mb-2">{strength.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{strength.description}</p>
          </div>
        ))}
      </div>
    </>
  );

  if (variant === 'plain') return content;

  return (
    <div className="bg-dark-card/90 border border-dark-border p-8 lg:p-12 rounded-2xl backdrop-blur-sm">
      {content}
    </div>
  );
};

export default AboutIntro;

