import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8 px-6 mt-auto w-full z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Your Privacy Choices</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
        </div>
        <div className="text-center md:text-right">
          <p>&copy; 2025 Marketing VF Ltd. All Rights Reserved.</p>
          <p className="text-xs mt-1 text-gray-500">US Office: WeWork 801 Barton Springs Austin TX 78704 United States</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;