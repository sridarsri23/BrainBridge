import { motion } from 'framer-motion';
import { FiDollarSign, FiCreditCard, FiGlobe, FiShield, FiUsers } from 'react-icons/fi';

const revenueStreams = [
  {
    icon: <FiDollarSign className="w-6 h-6" />,
    title: "Premium Microlearning",
    potential: "$5-10/user/month"
  },
  {
    icon: <FiCreditCard className="w-6 h-6" />,
    title: "AI Mentor",
    potential: "$20-50/user/month"
  },
  {
    icon: <FiGlobe className="w-6 h-6" />,
    title: "Corporate Certification",
    potential: "$5,000-20,000/year"
  },
  {
    icon: <FiShield className="w-6 h-6" />,
    title: "ATS Plugin",
    potential: "$10,000-50,000/year"
  },
  {
    icon: <FiUsers className="w-6 h-6" />,
    title: "Govt. Subsidy Gateway",
    potential: "Commission-based"
  }
];

const RevenueSection = () => {
  return (
    <section className="section bg-gray-900 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
            Business Model
          </span>
          <h2 className="mb-6">
            Multiple <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">Revenue Streams</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {revenueStreams.map((stream, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center text-primary-400 mb-4">
                {stream.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{stream.title}</h3>
              <div className="text-sm text-primary-400">
                {stream.potential}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RevenueSection;
