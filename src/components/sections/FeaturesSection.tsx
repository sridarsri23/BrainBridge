import { motion } from 'framer-motion';

const features = [
  {
    title: 'Self-Discovery Engine',
    description: 'Interactive tool that helps neurodiverse talent uncover cognitive strengths and work preferences.',
    icon: '🧠',
    benefits: [
      'Gamified quizzes and cognitive pattern tests',
      'Generates a personalized Neuro Work Profile',
      'Guides learners towards tailored training and jobs'
    ]
  },
  {
    title: 'JD Normalizer',
    description: 'AI-powered engine that rewrites job descriptions to be more neuro-inclusive and accessible.',
    icon: '📄',
    benefits: [
      'Detects exclusionary or biased wording in job posts',
      'Suggests inclusive alternatives automatically',
      'Improves accessibility for neurodiverse applicants'
    ]
  },
  {
    title: 'Job Matching Engine',
    description: 'AI-driven matching system that aligns cognitive strengths of ND talent with role requirements.',
    icon: '⚡',
    benefits: [
      'Analyzes role tasks and cognitive fit profiles',
      'Recommends best-matched ND candidates',
      'Continuously learns from hiring outcomes'
    ]
  }
];

interface FeaturesSectionProps {
  id?: string;
}

const FeaturesSection = ({ id }: FeaturesSectionProps) => {
  return (
    <section id={id} className="py-20 bg-gray-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
            Our Solution
          </span>
          <h2 className="mb-6">
            Comprehensive <span className="text-primary-400">Features</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            BrainBridge empowers neurodiverse talent and inclusive employers through intelligent tools.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-primary-500/30 transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-xl bg-primary-500/10 flex items-center justify-center text-3xl mb-6 text-primary-400 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 mb-6">{feature.description}</p>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Benefits</h4>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                        <span className="text-green-400 text-xs">✓</span>
                      </div>
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-800">
                <button className="w-full py-2.5 px-4 text-sm font-medium bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white">
                  Learn more
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
