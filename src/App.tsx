import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiArrowDown, FiArrowUp, FiMenu, FiX } from 'react-icons/fi';

// Import sections
import HeroSection from './components/sections/HeroSection';
import ProblemSection from './components/sections/ProblemSection';
// import CompetitiveLandscapeSection from './components/sections/CompetitiveLandscapeSection';
import FeaturesSection from './components/sections/FeaturesSection';
import MarketOpportunitySection from './components/sections/MarketOpportunitySection';
import RevenueStreamsSection from './components/sections/RevenueStreamsSection';
import RoadmapSection from './components/sections/RoadmapSection';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Parallax effects
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const sections = document.querySelectorAll('section');
        const currentSection = document.elementFromPoint(
          window.innerWidth / 2,
          window.innerHeight / 2
        )?.closest('section');

        if (!currentSection) return;

        const currentIndex = Array.from(sections).indexOf(currentSection as HTMLElement);
        let targetIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
        
        if (targetIndex >= 0 && targetIndex < sections.length) {
          sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sections = [
    { id: 'home', label: 'Greetings' },
    { id: 'problem', label: 'The Problem' },
    // { id: 'competitive', label: 'Competitive Landscape' },
    { id: 'features', label: 'The Solution' },
    { id: 'market', label: 'Market Landscape' },
    { id: 'revenue', label: 'Revenue Streams' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'contact', label: 'Demo' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto scroll-smooth" ref={containerRef}>
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
       <div className="container mx-auto px-6 py-4 flex justify-between items-center">
  {/* ✅ LOGO + Text */}
  <div className="flex items-center space-x-4">   {/* increased spacing */}
    <img 
  src="/log.PNG"  
  alt="BrainBridge Logo" 
  className="w-10 h-10 rounded-md object-contain"
/>

    <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
      BrainBridge
    </span>
  </div>

  {/* ✅ Desktop Navigation with extra margin */}
  <div className="hidden md:flex items-center space-x-6 ml-12">  
    {sections.map((section) => (
      <button
        key={section.id}
        onClick={() => scrollToSection(section.id)}
        className="px-4 py-2 rounded-lg bg-white/5 text-gray-100 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
      >
        {section.label}
      </button>
    ))}
  </div>

  {/* Mobile menu button */}
  <button 
    className="md:hidden text-gray-300 hover:text-white"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  >
    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
  </button>
</div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-6 py-4 space-y-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {section.label}
                  </button>
                ))}
                <button className="w-full py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-md font-medium mt-4">
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20">
        <div id="home">
          <HeroSection />
        </div>
        <div id="problem">
          <ProblemSection />
        </div>
        <div id="competitive">
          {/* <CompetitiveLandscapeSection /> */}
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="market">
          <MarketOpportunitySection />
        </div>
        <div id="revenue">
          <RevenueStreamsSection />
        </div>
        <div id="roadmap">
          <RoadmapSection />
        </div>
      </main>
      
      {/* Scroll indicator */}
      <motion.div 
        className="fixed right-8 bottom-8 z-40 hidden md:flex flex-col items-center gap-2"
        style={{ opacity }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <FiArrowDown className="w-6 h-6 text-gray-400" />
        </motion.div>
        <span className="text-xs text-gray-400">Scroll</span>
      </motion.div>

      {/* Back to top button */}
      <motion.button
        className="fixed right-8 bottom-24 z-40 w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white transition-colors border border-gray-700 hover:border-primary-500"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowUp className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

export default App;

