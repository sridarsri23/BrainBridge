import { motion } from 'framer-motion';
import { FiCode, FiActivity, FiTrendingUp, FiUsers, FiAward, FiTarget } from 'react-icons/fi';

const milestones = [
  {
    quarter: "Q3 2023",
    title: "Mentor Agent Launch",
    description: "AI mentor for career guidance",
    icon: <FiUsers className="w-5 h-5" />
  },
  {
    quarter: "Q4 2023",
    title: "Dynamic Assessments",
    description: "Adaptive testing platform",
    icon: <FiActivity className="w-5 h-5" />
  },
  {
    quarter: "Q1 2024",
    title: "Algorithm Refinement",
    description: "Improved matching accuracy",
    icon: <FiCode className="w-5 h-5" />
  },
  {
    quarter: "Q2 2024",
    title: "LMS Expansion",
    description: "Enhanced learning platform",
    icon: <FiTrendingUp className="w-5 h-5" />
  },
  {
    quarter: "Q3 2024",
    title: "Certification Program",
    description: "Industry-recognized credentials",
    icon: <FiAward className="w-5 h-5" />
  },
  {
    quarter: "Q4 2024",
    title: "Enterprise Partnerships",
    description: "Strategic collaborations",
    icon: <FiTarget className="w-5 h-5" />
  }
];

const FutureSection = () => {
  return (
    <section className="section bg-gray-950 relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
            Roadmap
          </span>
          <h2 className="mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">Future Plans</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A clear path to transforming neurodiversity in the workplace
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 h-full w-1 bg-gradient-to-b from-primary-500 to-secondary-500 -translate-x-1/2"></div>
          
          {/* Milestones */}
          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
              >
                {/* Content */}
                <div className={`w-1/2 p-6 ${index % 2 === 0 ? 'pr-16 text-right' : 'pl-16'}`}>
                  <div className="inline-block p-3 rounded-xl bg-gray-800 border border-gray-700">
                    <div className="text-primary-400">
                      {milestone.icon}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-primary-400 font-medium">{milestone.quarter}</div>
                    <h3 className="text-xl font-bold mt-1">{milestone.title}</h3>
                    <p className="text-gray-400">{milestone.description}</p>
                  </div>
                </div>
                
                {/* Center dot */}
                <div className="absolute left-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 -translate-x-1/2 flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                {/* Empty space */}
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold mb-6">Be Part of Our Journey</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium hover:opacity-90 transition-opacity">
              Join Our Beta
            </button>
            <button className="px-8 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FutureSection;
