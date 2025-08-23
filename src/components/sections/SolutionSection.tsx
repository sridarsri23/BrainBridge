import { motion } from 'framer-motion';
import { FiZap, FiTarget, FiBarChart2, FiUsers } from 'react-icons/fi';

const features = [
  {
    icon: <FiZap className="w-8 h-8 text-primary-400" />,
    title: "Gamified Quizzes",
    description: "Interactive assessments that accurately measure skills and potential in an engaging way"
  },
  {
    icon: <FiTarget className="w-8 h-8 text-secondary-400" />,
    title: "Adaptive Learning",
    description: "Personalized learning paths that adapt to individual strengths and challenges"
  },
  {
    icon: <FiBarChart2 className="w-8 h-8 text-accent-400" />,
    title: "AI-Powered Matching",
    description: "Advanced algorithms that connect neurodiverse talent with the right opportunities"
  },
  {
    icon: <FiUsers className="w-8 h-8 text-purple-400" />,
    title: "Inclusive Hiring",
    description: "Tools and resources to help employers build more inclusive workplaces"
  }
];

const SolutionSection = () => {
  return (
    <section className="section bg-gradient-to-br from-gray-950 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_center,rgba(99,102,241,0.3),transparent_70%)]"></div>
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
            Our Solution
          </span>
          <h2 className="mb-6">
            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">Neurodiverse Talent</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            BrainBridge bridges the gap between neurodiverse talent and inclusive employers through innovative technology and personalized support.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gradient-to-br from-gray-900/50 to-gray-800/20 p-6 rounded-2xl border border-gray-800 hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Transforming the Future of Work
            </h3>
            <p className="text-lg text-gray-300 max-w-3xl">
              By leveraging AI and behavioral science, we're creating a more inclusive workforce where everyone has the opportunity to thrive.
            </p>
            <button className="mt-6 px-6 py-3 rounded-full bg-white text-gray-900 font-medium hover:bg-opacity-90 transition-all">
              Learn How It Works
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary-500/20 rounded-full filter blur-3xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
