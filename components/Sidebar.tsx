
import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

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
    <aside className={`hidden lg:flex flex-col pt-12 pl-10 pr-6 border-r border-gray-200 bg-white h-full ${className}`}>
        <nav className="relative w-full max-w-xs">
            {/* Vertical Line */}
            {/* Centered on the 24px icon (12px center). Line is 2px wide, so left should be 11px. */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />

            <div className="space-y-10">
              {STEPS.map((step, idx) => {
                const isActive = idx === currentIndex;
                const isCompleted = idx < currentIndex;

                return (
                  <div key={step.id} className="flex items-center gap-4 group relative">
                    {/* Icon Container with background to mask the line behind it */}
                    <div className="relative bg-white z-10 p-1 -m-1 rounded-full">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-500 fill-green-50" />
                      ) : isActive ? (
                        <div className="w-6 h-6 rounded-full border-[2.5px] border-[#5621aa] flex items-center justify-center bg-white shadow-sm">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#5621aa]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-white group-hover:border-gray-300 transition-colors" />
                      )}
                    </div>
                    <span 
                      className={`text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                        isActive ? 'text-[#5621aa]' : 
                        isCompleted ? 'text-gray-900' : 
                        'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
        </nav>
    </aside>
  );
};

export default Sidebar;
