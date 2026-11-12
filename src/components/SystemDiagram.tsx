import React from 'react';

interface SystemDiagramProps {
  steps: { label: string; detail?: string }[];
}

const Arrow: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`shrink-0 text-muted-soft ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** A step-by-step flow: one row on wide screens, stacked top-to-bottom on narrower ones. */
const SystemDiagram: React.FC<SystemDiagramProps> = ({ steps }) => (
  <ol className="flex flex-col lg:flex-row items-stretch gap-2" aria-label="System flow">
    {steps.map((step, index) => (
      <li key={step.label} className="flex flex-col lg:flex-row items-center gap-2 lg:flex-1 lg:min-w-0">
        <div className="w-full lg:h-full lg:min-w-0 rounded-lg border border-dark-border bg-dark-elevated/60 px-4 py-3">
          <span className="block font-mono text-[11px] text-muted-soft">{String(index + 1).padStart(2, '0')}</span>
          <span className="mt-1 block text-sm font-medium leading-snug text-ink">{step.label}</span>
          {step.detail && <span className="mt-0.5 block text-xs text-muted">{step.detail}</span>}
        </div>
        {index < steps.length - 1 && <Arrow className="rotate-90 lg:rotate-0" />}
      </li>
    ))}
  </ol>
);

export default SystemDiagram;
