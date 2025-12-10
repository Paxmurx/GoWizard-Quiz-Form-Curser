
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <motion.div 
      className="flex flex-col lg:flex-row flex-grow h-full"
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <div className="flex items-center mb-10">
            <Logo className="h-8 w-auto" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-brand-dark mb-8 leading-[1.1] tracking-tight">
            Ready to start<br />your journey?
          </h1>

          <p className="text-lg text-brand-muted mb-10 max-w-md leading-relaxed">
            Continue our short quiz to <span className="font-bold text-brand-dark">get matched</span> to an Auto Warranty provider that's suited to you.
          </p>

          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2 bg-[#DB0064] text-white px-8 py-4 rounded-lg text-lg font-bold shadow-lg hover:brightness-110 transition-all w-full md:w-auto justify-center md:justify-start"
          >
            Start the quiz
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      {/* Right Panel (Image) */}
      <motion.div 
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent z-10 pointer-events-none" />
        <img 
          src="https://images.unsplash.com/photo-1449130015084-2d48a345ae62?q=80&w=2070&auto=format&fit=crop" 
          alt="Father holding son's hand standing next to car" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
