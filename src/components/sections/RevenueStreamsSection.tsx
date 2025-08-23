import { motion } from 'framer-motion';

const revenueStreams = [
  {
    title: 'Talent Portal Monetization',
    items: [
      'Premium microlearning access',
      'AI Task Coach',
      'Mentorship Match',
      'Corporate sponsorship (e.g., SAP sponsors 500 learners)',
      'Government/NGO grants'
    ]
  },
  {
    title: 'AI Mentor Support',
    items: [
      'Premium AI mentor features',
      'Personalized career coaching',
      'Interview preparation modules',
      'Skill development tracking'
    ]
  },
  {
    title: 'Corporate Certification Program',
    items: [
      'DEI certification for employers',
      'Neurodiversity inclusion training',
      'Workplace accommodation guidance',
      'Ongoing support and resources'
    ]
  },
  {
    title: 'Job Funnel + ATS Plugin',
    items: [
      'Tailored job board',
      'Resume ranking for neurodiverse applicants',
      'Pattern-matching algorithm',
      'Integration with existing ATS systems'
    ]
  },
  {
    title: 'Government Subsidy Gateway',
    items: [
      'Automated documentation',
      'EU/US workforce grant applications',
      'Compliance tracking',
      'Subsidy optimization'
    ]
  },
  {
    title: 'Multi-Domain Applicability',
    items: [
      'Expansion to different industries',
      'Custom solutions for various neurotypes',
      'Scalable platform for global reach',
      'Partnership opportunities'
    ]
  }
];

const RevenueStreamsSection = () => {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
            Revenue Streams
          </h2>
          <p className="text-xl text-gray-300">
            Multiple monetization channels to ensure sustainable growth and impact
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {revenueStreams.map((stream, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <h3 className="text-xl font-bold text-white mb-4">{stream.title}</h3>
              <ul className="space-y-2">
                {stream.items.map((item, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="mr-2 text-blue-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RevenueStreamsSection;
