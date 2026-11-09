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

  const content = (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent mb-3">
        Overview
      </p>
      <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
        First-year Waterloo Mechatronics student building across hardware and software.
      </h1>

      <div className="space-y-6 text-lg leading-8 text-gray-300">
        <p>
          I am focused on robotics, embedded systems, automation, and practical
          hardware-software integration.
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
              className="info-tile-hover inline-block bg-dark-bg border border-dark-border text-gray-200 px-3 py-1 text-xs font-semibold tracking-wide"
            >
              {focus}
            </span>
          ))}
        </div>
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
