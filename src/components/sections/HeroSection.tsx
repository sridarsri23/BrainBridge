import { motion } from 'framer-motion';

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Sridar',
    role: 'Full Stack Developer, QA, Product Manager',
    description: 'Leading the technical vision and product strategy'
  },
  {
    name: 'Monika',
    role: 'Full Stack AI Engineer',
    description: 'Developing AI-driven matching algorithms'
  },
  {
    name: 'Zaidi',
    role: 'Back-end AI Engineer',
    description: 'Building scalable backend services'
  },
  {
    name: 'Noor',
    role: 'Front-end AI Engineer',
    description: 'Creating intuitive user interfaces'
  },
  {
    name: 'Bilal',
    role: 'Front-end Developer',
    description: 'Implementing responsive designs'
  }
];

interface HeroSectionProps {
  id?: string;
}

const HeroSection = ({ id }: HeroSectionProps) => {
  return (
    <section id={id} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 py-20">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 to-transparent"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse' as const
          }}
        />
      </motion.div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 [text-shadow:0_4px_8px_rgba(0,0,0,0.1)]">
            BrainBridge
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto">
            Where Unique Minds Meet Inclusive Opportunities, Employers Find Their Unicorns
          </p>
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: 0.1 * index
              }}
              whileHover={{ 
                y: -10,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-blue-400 text-sm mb-2">{member.role}</p>
              <p className="text-gray-400 text-sm">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
     <motion.div 
  className="absolute bottom-0 w-full flex flex-col items-center text-gray-400"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1 }}
>
  <span className="text-sm bg-gray-800/80 px-6 py-2.5 rounded-full backdrop-blur-sm border border-gray-700/50">
    Scroll to explore
  </span>
  <motion.div 
    animate={{ y: [0, 10, 0] }}
    transition={{ 
      repeat: Infinity, 
      duration: 2,
      ease: 'easeInOut'
    }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7"/>
    </svg>
  </motion.div>
</motion.div>
    </section>
  );
};

export default HeroSection;

