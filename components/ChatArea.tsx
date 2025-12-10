
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { QuizQuestion, UserResponse } from '../types';

interface ChatAreaProps {
  question: QuizQuestion;
  onAnswer: (value: string, displayValue?: string) => void;
  onBack: () => void;
  canGoBack: boolean;
  history: UserResponse[];
  allQuestions: QuizQuestion[];
}

const VEHICLE_DATA: Record<string, string[]> = {
  "Acura": ["ILX", "Integra", "MDX", "RDX", "TLX"],
  "Audi": ["A3", "A4", "A5", "A6", "Q3", "Q5", "Q7", "Q8"],
  "BMW": ["3 Series", "4 Series", "5 Series", "X3", "X5", "X7"],
  "Buick": ["Enclave", "Encore", "Envision"],
  "Cadillac": ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6"],
  "Chevrolet": ["Blazer", "Bolt", "Camaro", "Colorado", "Corvette", "Equinox", "Malibu", "Silverado 1500", "Suburban", "Tahoe", "Traverse", "Trax"],
  "Chrysler": ["300", "Pacifica"],
  "Dodge": ["Challenger", "Charger", "Durango", "Hornet"],
  "Ford": ["Bronco", "Bronco Sport", "Edge", "Escape", "Expedition", "Explorer", "F-150", "Maverick", "Mustang", "Ranger"],
  "GMC": ["Acadia", "Canyon", "Sierra 1500", "Terrain", "Yukon"],
  "Honda": ["Accord", "Civic", "CR-V", "HR-V", "Odyssey", "Passport", "Pilot", "Ridgeline"],
  "Hyundai": ["Elantra", "Kona", "Palisade", "Santa Cruz", "Santa Fe", "Sonata", "Tucson", "Venue"],
  "Jeep": ["Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Wrangler"],
  "Kia": ["Forte", "K5", "Seltos", "Sorento", "Soul", "Sportage", "Telluride"],
  "Lexus": ["ES", "GX", "IS", "NX", "RX", "UX"],
  "Lincoln": ["Aviator", "Corsair", "Nautilus", "Navigator"],
  "Mazda": ["CX-30", "CX-5", "CX-50", "CX-90", "Mazda3"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLA", "GLB", "GLC", "GLE", "GLS"],
  "Nissan": ["Altima", "Frontier", "Kicks", "Murano", "Pathfinder", "Rogue", "Sentra", "Titan", "Versa"],
  "Ram": ["1500", "2500", "3500"],
  "Subaru": ["Ascent", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
  "Toyota": ["4Runner", "Camry", "Corolla", "Crown", "Highlander", "Prius", "RAV4", "Sequoia", "Sienna", "Tacoma", "Tundra", "Venza"],
  "Volkswagen": ["Atlas", "Golf", "Jetta", "Taos", "Tiguan"],
  "Volvo": ["S60", "XC40", "XC60", "XC90"]
};

const ChatArea: React.FC<ChatAreaProps> = ({ question, onAnswer, onBack, canGoBack, history, allQuestions }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeQuestionRef = useRef<HTMLDivElement>(null);
  const [aiState, setAiState] = useState<'thinking' | 'typing' | 'idle'>('thinking');
  const [displayedText, setDisplayedText] = useState('');
  
  // Form States
  const [formValues, setFormValues] = useState<{
    year?: string;
    make?: string;
    model?: string;
    zip?: string;
    state?: string;
    email?: string;
    fullName?: string;
    phone?: string;
  }>({});

  // Reset form on new question and handle AI animation
  useEffect(() => {
    setFormValues({});
    setAiState('thinking');
    setDisplayedText('');

    // Simulate Thinking Time (Speed up: 600ms)
    const thinkingTimer = setTimeout(() => {
      setAiState('typing');
    }, 600);

    return () => clearTimeout(thinkingTimer);
  }, [question.id]);

  // Handle Typewriter Effect (Speed up: 10ms)
  useEffect(() => {
    if (aiState === 'typing') {
      let i = 0;
      const textToType = question.text;
      
      const typingInterval = setInterval(() => {
        setDisplayedText(textToType.substring(0, i + 1));
        i++;
        if (i === textToType.length) {
          clearInterval(typingInterval);
          setAiState('idle');
        }
      }, 10);

      return () => clearInterval(typingInterval);
    }
  }, [aiState, question.text]);

  // Auto-scroll logic helper
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Scroll triggers
  useEffect(() => {
    scrollToBottom();
  }, [history.length, question.id]);

  useEffect(() => {
    if (aiState === 'typing') {
      scrollToBottom();
    }
  }, [displayedText, aiState]);

  useEffect(() => {
    // Specific scroll handling for when the form appears (idle state)
    // Pull the question to the top of the view
    if (aiState === 'idle') {
      const timer = setTimeout(() => {
        activeQuestionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }, 300); // Reduce delay slightly for snappier feel
      
      return () => clearTimeout(timer);
    }
  }, [aiState]);

  const handleInputChange = (field: string, value: string) => {
    setFormValues(prev => {
      const newValues = { ...prev, [field]: value };
      if (field === 'make') {
        newValues.model = '';
      }
      return newValues;
    });
  };

  const handlePhoneChange = (value: string) => {
    const input = value.replace(/\D/g, '').substring(0, 10);
    let formatted = input;
    if (input.length > 0) {
      if (input.length < 4) {
        formatted = `(${input}`;
      } else if (input.length < 7) {
        formatted = `(${input.slice(0, 3)}) ${input.slice(3)}`;
      } else {
        formatted = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
      }
    }
    setFormValues(prev => ({ ...prev, phone: formatted }));
  };

  const handleOptionSelect = (value: string, label: string) => {
    onAnswer(value, label);
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFormSubmit = () => {
    if (question.type === 'vehicle-form') {
      if (formValues.year && formValues.make && formValues.model) {
        onAnswer(
          JSON.stringify({ year: formValues.year, make: formValues.make, model: formValues.model }),
          `${formValues.year} ${formValues.make} ${formValues.model}`
        );
      }
    } else if (question.type === 'location-form') {
      if (formValues.state && formValues.zip) {
        onAnswer(
          JSON.stringify({ state: formValues.state, zip: formValues.zip }),
          `${formValues.state}, ${formValues.zip}`
        );
      }
    } else if (question.type === 'email-input') {
      if (formValues.email && isValidEmail(formValues.email)) {
        onAnswer(formValues.email, formValues.email);
      }
    } else if (question.type === 'name-input') {
      if (formValues.fullName && formValues.fullName.length > 2) {
        onAnswer(formValues.fullName, formValues.fullName);
      }
    } else if (question.type === 'phone-input') {
      if (formValues.phone && formValues.phone.length >= 14) {
        onAnswer(formValues.phone, formValues.phone);
      }
    }
  };

  // Render History
  const renderHistory = () => {
    return history.map((h, idx) => {
      const q = allQuestions.find(q => q.id === h.questionId);
      if (!q) return null;

      return (
        <div key={`${h.questionId}-${idx}`} className="flex flex-col gap-4 mb-8 opacity-60">
           <div className="flex items-end gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=agent" alt="Agent" className="w-full h-full object-cover" />
             </div>
             <div className="bg-brand-bubble px-5 py-3 rounded-2xl rounded-bl-none text-brand-dark max-w-[80%]">
               <p>{q.text}</p>
             </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-[#5621aa] text-white px-5 py-3 rounded-2xl rounded-br-none max-w-[80%] shadow-sm">
              {h.displayValue || h.answerValue}
            </div>
          </div>
        </div>
      );
    });
  };

  // Render Input Area based on Type
  const renderInput = () => {
    if (question.type === 'options') {
      return (
        <div className="flex flex-col gap-3 w-full">
            {question.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.value, option.label)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-[#5621aa]/30 hover:bg-[#5621aa]/5 transition-all text-lg font-medium text-gray-700 flex items-center justify-between group"
              >
                {option.label}
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-[#5621aa] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5621aa] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
            
            {canGoBack && (
              <button 
                onClick={onBack}
                className="mt-1 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors self-start px-2 py-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back to previous
              </button>
            )}
        </div>
      );
    }

    if (question.type === 'vehicle-form') {
      return (
        <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
           <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Year</label>
                <select 
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#5621aa] focus:ring-2 focus:ring-[#5621aa]/20 outline-none transition-all text-gray-800 font-medium cursor-pointer"
                  value={formValues.year || ''}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 30 }, (_, i) => 2025 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Make</label>
                 <select
                   className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#5621aa] focus:ring-2 focus:ring-[#5621aa]/20 outline-none transition-all text-gray-800 font-medium cursor-pointer"
                   value={formValues.make || ''}
                   onChange={(e) => handleInputChange('make', e.target.value)}
                 >
                   <option value="">Select Make</option>
                   {Object.keys(VEHICLE_DATA).map(make => (
                     <option key={make} value={make}>{make}</option>
                   ))}
                 </select>
              </div>

              <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Model</label>
                 <select
                   className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#5621aa] focus:ring-2 focus:ring-[#5621aa]/20 outline-none transition-all text-gray-800 font-medium disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
                   value={formValues.model || ''}
                   onChange={(e) => handleInputChange('model', e.target.value)}
                   disabled={!formValues.make}
                 >
                   <option value="">Select Model</option>
                   {formValues.make && VEHICLE_DATA[formValues.make]?.map(model => (
                     <option key={model} value={model}>{model}</option>
                   ))}
                 </select>
              </div>
           </div>

           <div className="flex items-center gap-3 mt-2">
            {canGoBack && (
              <button 
                onClick={onBack}
                className="px-6 py-4 rounded-full border-2 border-gray-200 text-gray-500 font-bold hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={handleFormSubmit}
              disabled={!formValues.year || !formValues.make || !formValues.model}
              className="flex-1 bg-[#DB0064] text-white text-lg font-bold py-4 rounded-full shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
           </div>
        </div>
      );
    }

    if (question.type === 'location-form') {
      return (
        <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">State</label>
                <select 
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#5621aa] focus:ring-2 focus:ring-[#5621aa]/20 outline-none transition-all text-gray-800 font-medium cursor-pointer"
                  value={formValues.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                >
                  <option value="">Select</option>
                  {['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'].map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                  <option value="OT">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Zip Code</label>
                  <input 
                    type="text"
                    placeholder="12345"
                    maxLength={5}
                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#5621aa] focus:ring-2 focus:ring-[#5621aa]/20 outline-none transition-all text-gray-800 font-medium placeholder:font-normal"
                    value={formValues.zip || ''}
                    onChange={(e) => handleInputChange('zip', e.target.value.replace(/\D/g,''))}
                  />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              {canGoBack && (
                <button 
                  onClick={onBack}
                  className="px-6 py-4 rounded-full border-2 border-gray-200 text-gray-500 font-bold hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleFormSubmit}
                disabled={!formValues.state || !formValues.zip || formValues.zip.length < 5}
                className="flex-1 bg-[#DB0064] text-white text-lg font-bold py-4 rounded-full shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </div>
        </div>
      );
    }

    if (question.type === 'email-input') {
      return (
        <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
           <input 
             type="email"
             placeholder={question.placeholder || "name@example.com"}
             className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#5621aa] focus:ring-2 focus:ring-[#5621aa]/20 outline-none transition-all text-gray-800 font-medium placeholder:text-gray-400 placeholder:font-normal"
             value={formValues.email || ''}
             onChange={(e) => handleInputChange('email', e.target.value)}
             onKeyDown={(e) => {
               if (e.key === 'Enter' && isValidEmail(formValues.email || '')) {
                 handleFormSubmit();
               }
             }}
           />
           <div className="flex items-center gap-3 mt-2">
            {canGoBack && (
              <button 
                onClick={onBack}
                className="px-6 py-4 rounded-full border-2 border-gray-200 text-gray-500 font-bold hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={handleFormSubmit}
              disabled={!formValues.email || !isValidEmail(formValues.email)}
              className="flex-1 bg-[#DB0064] text-white text-lg font-bold py-4 rounded-full shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
           </div>
        </div>
      );
    }

    if (question.type === 'name-input') {
      return (
        <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
           <input 
             type="text"
             placeholder={question.placeholder || "John Doe"}
             className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#5621aa] focus:ring-2 focus:ring-[#5621aa]/20 outline-none transition-all text-gray-800 font-medium placeholder:text-gray-400 placeholder:font-normal"
             value={formValues.fullName || ''}
             onChange={(e) => handleInputChange('fullName', e.target.value)}
             onKeyDown={(e) => {
               if (e.key === 'Enter' && formValues.fullName && formValues.fullName.length > 2) {
                 handleFormSubmit();
               }
             }}
           />
           <div className="flex items-center gap-3 mt-2">
            {canGoBack && (
              <button 
                onClick={onBack}
                className="px-6 py-4 rounded-full border-2 border-gray-200 text-gray-500 font-bold hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={handleFormSubmit}
              disabled={!formValues.fullName || formValues.fullName.length < 2}
              className="flex-1 bg-[#DB0064] text-white text-lg font-bold py-4 rounded-full shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
           </div>
        </div>
      );
    }

    if (question.type === 'phone-input') {
      return (
        <div className="w-full flex flex-col gap-4">
          <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <input 
              type="tel"
              placeholder={question.placeholder || "(555) 555-5555"}
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#5621aa] focus:ring-2 focus:ring-[#5621aa]/20 outline-none transition-all text-gray-800 font-medium placeholder:text-gray-400 placeholder:font-normal"
              value={formValues.phone || ''}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && formValues.phone && formValues.phone.length >= 14) {
                  handleFormSubmit();
                }
              }}
            />
            <div className="flex items-center gap-3 mt-2">
              {canGoBack && (
                <button 
                  onClick={onBack}
                  className="px-6 py-4 rounded-full border-2 border-gray-200 text-gray-500 font-bold hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleFormSubmit}
                disabled={!formValues.phone || formValues.phone.length < 14}
                className="flex-1 bg-[#DB0064] text-white text-lg font-bold py-4 rounded-full shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {question.disclaimer && (
            <div 
              className="px-4 mt-2 text-[10px] text-gray-400 leading-relaxed text-center [&_a]:underline [&_a]:text-gray-500 hover:[&_a]:text-gray-700 transition-colors"
              dangerouslySetInnerHTML={{ __html: question.disclaimer }}
            />
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-8 scroll-pt-8 no-scrollbar scroll-smooth" ref={scrollRef}>
      <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-32">

        {renderHistory()}

        {/* Current Active Question */}
        <div className="flex flex-col gap-6" ref={activeQuestionRef}>
          
          {/* Bot Question Bubble (Thinking or Typed) */}
          <div className="flex items-end gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-indigo-50">
                <img src="https://i.pravatar.cc/150?u=agent" alt="Agent" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            
            <AnimatePresence mode="wait">
              {aiState === 'thinking' ? (
                <motion.div 
                  key="thinking"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-brand-bubble px-5 py-4 rounded-2xl rounded-bl-none text-brand-dark shadow-sm"
                >
                  <div className="flex gap-1 h-3 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="question"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-brand-bubble px-6 py-4 rounded-2xl rounded-bl-none text-brand-dark text-lg shadow-sm max-w-[85%]"
                >
                  <p className="font-medium whitespace-pre-wrap">{displayedText}</p>
                  {aiState === 'idle' && question.subText && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-gray-500 mt-2 border-t border-gray-200 pt-2"
                      >
                        {question.subText}
                      </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Input Area */}
          {aiState === 'idle' && (
            <motion.div 
              className="pl-12 flex flex-col gap-4 w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {renderInput()}
            </motion.div>
          )}

          {/* Trust Footer */}
          {aiState === 'idle' && (
            <motion.div 
              className="pl-12 mt-2 flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
               <div className="flex items-center justify-between text-xs text-gray-400 px-2">
                  <span className="flex items-center gap-1">⏱ It only takes a minute!</span>
                  <span className="flex items-center gap-1 cursor-pointer hover:text-gray-600"><Lock className="w-3 h-3" /> Privacy Policy</span>
               </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ChatArea;
