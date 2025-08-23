import { motion } from 'framer-motion';

const roadmapItems = [
  {
    phase: 'Phase 1',
    title: 'Foundation & MVP',
    items: [
      'Agentize Mentor Role',
      'Basic employer evaluation framework',
      'Core LMS functionality',
      'Initial self-assessment modules',
      'Basic matching algorithm'
    ]
  },
  {
    phase: 'Phase 2',
    title: 'Enhancement',
    items: [
      'Employer Certification Program',
      'ND-LMS skill modules',
      'Dynamic self-assessments',
      'Algorithm refinement with real-world data',
      'Content library expansion',
      'UI Enhancements/Fixes',
      'Add email verification during signup',
      'Place proper privacy aggreements',
      'Display notifications based progress (%) in profile dash board area to complete profile'
    ]
  },
  {
    phase: 'Phase 3',
    title: 'Expansion',
    items: [
      'Full certification platform',
      'Comprehensive employer portal',
      'Advanced analytics',
      'Multi-language support',
      'Global partnership program',
      'Implement MFA',
      'Guardian ↔ ND-Mind Control'
    ]
  },
  {
    phase: 'Phase 4',
    title: 'Maturity',
    items: [
      'Industry-specific solutions',
      'Government integration',
      'Research partnerships',
      'Global scale operations',
      'Continuous improvement cycle'
    ]
  }
];

const RoadmapSection = () => {
  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      <div className="container relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            Our Roadmap
          </h2>
          <p className="text-xl text-gray-300">
            Strategic development phases to ensure impactful and sustainable growth
          </p>
        </motion.div>

        {/* Roadmap timeline */}
        <div className="relative">
          {/* Center timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 transform -translate-x-1/2"></div>
          
          {/* Roadmap items */}
          <div className="space-y-4 md:space-y-8">
            {roadmapItems.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
              >
                <div className="md:w-1/2 px-4 mb-4 md:mb-0">
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-xl border border-gray-800 h-full">
                    {/* Phase badge + title */}
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <span className="text-sm font-semibold text-blue-400">{phase.phase}</span>
                        <h3 className="text-2xl font-bold text-white">{phase.title}</h3>
                      </div>
                    </div>
                    {/* Phase items */}
                    <ul className="space-y-1 mt-3">
                      {phase.items.map((item, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start">
                          <span className="mr-2 text-blue-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="hidden md:block md:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;