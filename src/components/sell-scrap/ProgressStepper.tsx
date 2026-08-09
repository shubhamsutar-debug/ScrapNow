import React from 'react';

interface ProgressStepperProps {
  currentStep: number; // 1 to 6
  onStepClick?: (step: number) => void;
}

const steps = [
  { id: 1, label: 'Add Scrap', shortLabel: 'Add Scrap' },
  { id: 2, label: 'Detected Items', shortLabel: 'Items' },
  { id: 3, label: 'Get Quotes', shortLabel: 'Quotes' },
  { id: 4, label: 'Choose Collector', shortLabel: 'Collector' },
  { id: 5, label: 'Pickup', shortLabel: 'Pickup' },
  { id: 6, label: 'Get Paid', shortLabel: 'Get Paid' },
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full bg-brand-card border-b border-brand-border py-4 px-4 sm:px-8 shadow-xs">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between relative">
          
          {/* Background Connecting Bar */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-brand-border -translate-y-1/2 z-0" />
          
          {/* Active Connecting Bar */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-brand-primary -translate-y-1/2 transition-all duration-500 z-0" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {/* Stepper Nodes */}
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div 
                key={step.id} 
                className={`relative z-10 flex flex-col items-center group ${
                  step.id <= currentStep && onStepClick ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => {
                  if (step.id <= currentStep && onStepClick) {
                    onStepClick(step.id);
                  }
                }}
              >
                {/* Circle Badge */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-brand-primary text-white shadow-md'
                      : isCurrent
                      ? 'bg-brand-primary text-white ring-4 ring-brand-light shadow-lg scale-110'
                      : 'bg-brand-card border-2 border-brand-border text-brand-text-secondary'
                  }`}
                >
                  {isCompleted ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-xs font-semibold whitespace-nowrap transition-colors hidden sm:block ${
                    isCurrent
                      ? 'text-brand-primary font-bold'
                      : isCompleted
                      ? 'text-brand-text'
                      : 'text-brand-text-secondary'
                  }`}
                >
                  {step.label}
                </span>

                {/* Mobile Short Label */}
                <span
                  className={`mt-1.5 text-[10px] font-medium whitespace-nowrap sm:hidden ${
                    isCurrent
                      ? 'text-brand-primary font-bold'
                      : isCompleted
                      ? 'text-brand-text'
                      : 'text-brand-text-secondary'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};
