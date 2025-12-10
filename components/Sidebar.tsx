
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface SidebarProps {
  currentStepCategory: string;
  className?: string; // Allow passing external classes
}

const STEPS = [
  { id: 'vehicle', label: 'Vehicle' },
  { id: 'coverage', label: 'Coverage' },
  { id: 'location', label: 'Location' },
  { id: 'quote', label: 'Your Quote' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentStepCategory, className = '' }) => {
  const getCurrentStepIndex = () => STEPS.findIndex(s => s.id === currentStepCategory);
  const currentIndex = getCurrentStepIndex();

  return (
    <div className={`hidden lg:flex flex-col pt-12 px-8 border-r border-gray-200 bg-white h-full ${className}`}>
       {/* Content aligned to the right to hug the main section */}
       <div className="w-full max-w-[220px] ml-auto">
          <nav className="space-y-8 relative">
             {/* Vertical Line */}
             <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100 -z-10" />

            {STEPS.map((step, idx) => {
              const isActive = idx === currentIndex;
              const isCompleted = idx < currentIndex;

              return (
                <div key={step.id} className="flex items-center gap-4">
                  <div className={`relative z-10 bg-white transition-all duration-300`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50" />
                    ) : isActive ? (
                      <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <span className={`font-medium transition-colors duration-300 ${isActive || isCompleted ? 'text-[#5621aa]' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </nav>
      </div>
    </div>
  );
};

export default Sidebar;
