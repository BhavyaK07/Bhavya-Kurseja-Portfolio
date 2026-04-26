import React from 'react';
import AboutIntro from './AboutIntro';

const About: React.FC = () => {
  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <AboutIntro />
      </div>
    </div>
  );
};

export default About;

