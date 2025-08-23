import { motion } from 'framer-motion';
import { FiLayers, FiSearch, FiBookOpen, FiAward, FiTarget } from 'react-icons/fi';

const components = [
  {
    icon: <FiLayers className="w-8 h-8" />,
    title: "Self Discovery Engine",
    description: "Helps individuals identify their unique strengths and work preferences"
  },
  {
    icon: <FiSearch className="w-8 h-8" />,
    title: "JD Normalizer",
    description: "Standardizes job descriptions to highlight essential skills and requirements"
  },
  {
    icon: <FiBookOpen className="w-8 h-8" />,
    title: "Adaptive Micro Learning",
    description: "Personalized learning modules tailored to individual needs"
  },
  {
    icon: <FiAward className="w-8 h-8" />,
    title: "Employer LMS/Certification",
    description: "Training for employers on neurodiversity and inclusive practices"
  },
  {
    icon: <FiTarget className="w-8 h-8" />,
    title: "Job Matching Engine",
    description: "AI-powered matching of candidates with suitable roles"
  }
];

const ComponentsSection = () => {
  return (
    <section className="section bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_center,rgba(99,102,241,0.2),transparent_70%)]"></div>
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
            Key Components
          </span>
          <h2 className="mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">BrainBridge</span> Platform
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our comprehensive solution combines multiple innovative components to create a seamless experience for both candidates and employers.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main circle */}
          <div className="relative w-full aspect-square max-w-2xl mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-gray-800">
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-gray-800/50"></div>
            </div>
            
            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-4xl font-bold">
                BB
              </div>
            </div>

            {/* Component items */}
            {components.map((component, index) => {
              const angle = (index * (360 / components.length) - 90) * (Math.PI / 180);
              const radius = 140; // Adjust based on your needs
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="absolute w-48 md:w-56 p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center text-primary-400 mb-4 mx-auto">
                    {component.icon}
                  </div>
                  <h3 className="text-lg font-bold text-center mb-2">{component.title}</h3>
                  <p className="text-sm text-gray-400 text-center">{component.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to experience the future of inclusive hiring?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium hover:opacity-90 transition-opacity">
              Get Started for Free
            </button>
            <button className="px-8 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
              Request Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComponentsSection;
