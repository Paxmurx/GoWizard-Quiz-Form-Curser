
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lock, ShieldCheck, Star } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import Logo from './Logo';
import { QuizQuestion, UserResponse } from '../types';

interface QuizInterfaceProps {
  questions: QuizQuestion[];
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [history, setHistory] = useState<UserResponse[]>([]);
  const currentQuestion = questions[currentQuestionIndex];

  // Helper to get category for sidebar
  const currentCategory = currentQuestion ? currentQuestion.stepCategory : 'quote';

  const handleAnswer = (answerValue: string, displayValue?: string) => {
    // Add to history
    const response: UserResponse = {
      questionId: currentQuestion.id,
      answerValue,
      displayValue: displayValue || answerValue
    };
    
    setHistory([...history, response]);

    // Move to next question after short delay
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500);
    } else {
        // End of quiz logic here (e.g. redirect)
        // For demo, we just stay on last step
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-12 min-h-screen bg-brand-bg relative"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Mobile Header (Only visible on small screens) */}
      <div className="lg:hidden absolute top-0 left-0 right-0 p-4 bg-white shadow-sm z-20 flex justify-between items-center">
         <div className="flex items-center">
            <Logo className="h-8 w-auto" />
         </div>
         <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Step {currentQuestionIndex + 1}/{questions.length}
         </span>
      </div>

      {/* LEFT PANEL: Contains Header, Sidebar, and Chat (Cols 1-9) */}
      <div className="col-span-1 lg:col-span-9 flex flex-col h-full max-h-screen relative">
        
        {/* DESKTOP HEADER (Spans Sidebar + Chat) */}
        <div className="hidden lg:grid grid-cols-9 items-center border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-30">
          {/* Logo Section - Aligned with Sidebar Content */}
          <div className="col-span-3 py-6 px-8 border-r border-gray-200">
             <div className="w-full max-w-[220px] ml-auto">
                <Logo className="h-8 w-auto" />
             </div>
          </div>
          
          {/* Header Text Section */}
          <div className="col-span-6 px-6 py-6 flex justify-end">
             <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
               Best Extended Auto Warranty in November 2025
             </span>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-9 overflow-hidden h-full">
          
          {/* Sidebar (Col 3) */}
          <Sidebar currentStepCategory={currentCategory} className="col-span-3" />

          {/* Chat Interface (Col 6) */}
          <div className="col-span-1 lg:col-span-6 flex flex-col h-full pt-16 lg:pt-0">
            {/* Chat Area */}
            <div className="flex-1 overflow-hidden relative">
              <ChatArea 
                key={currentQuestionIndex} 
                question={currentQuestion}
                onAnswer={handleAnswer}
                onBack={handleBack}
                canGoBack={currentQuestionIndex > 0}
                history={history}
                allQuestions={questions}
              />
            </div>

            {/* Bottom Trust Signals */}
            <div className="p-6 bg-brand-bg border-t border-gray-100 z-10">
              <div className="flex flex-col items-center justify-center gap-4">
                 <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-gray-400" /> A- Rated & Accredited</span>
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Trustpilot 4.8/5</span>
                 </div>
                 <p className="text-sm font-semibold text-brand-dark">Drive with Confidence. Backed by the Best in the Business.</p>
                 <div className="flex gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                   {/* Mock Logos */}
                   <div className="h-6 font-bold text-gray-400 italic">Consumer<span className="text-gray-600">Affairs</span></div>
                   <div className="h-6 font-bold text-gray-600 flex items-center gap-1"><Star className="w-4 h-4 fill-current"/>Trustpilot</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Image (Cols 10-12) */}
      <div className="hidden lg:block lg:col-span-3 relative h-full bg-gray-100 overflow-hidden border-l border-white/20">
        <img 
          src="https://images.unsplash.com/photo-1449130015084-2d48a345ae62?q=80&w=2070&auto=format&fit=crop" 
          alt="Father holding son's hand standing next to car" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

    </motion.div>
  );
};

export default QuizInterface;
