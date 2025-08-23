import { motion } from 'framer-motion';
import { FiBarChart2, FiTrendingUp, FiPieChart } from 'react-icons/fi';

const competitors = [
  {
    name: "Specialisterne",
    focus: "Autism employment",
    difference: "Limited to specific conditions, smaller scale"
  },
  {
    name: "Untapped.ai",
    focus: "Diversity hiring platform",
    difference: "Not neurodiversity-specific, lacks specialized assessments"
  },
  {
    name: "HireVue",
    focus: "Video interviewing",
    difference: "Traditional approach, not designed for neurodiverse candidates"
  },
  {
    name: "Coursera/LinkedIn",
    focus: "General upskilling",
    difference: "No specialized support for neurodiverse learners"
  }
];

const marketData = [
  {
    label: "TAM",
    value: "$50B+",
    description: "Total Addressable Market",
    icon: <FiBarChart2 className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-400"
  },
  {
    label: "SAM",
    value: "$5B+",
    description: "Serviceable Available Market",
    icon: <FiTrendingUp className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    label: "SOM",
    value: "$10-20M",
    description: "Serviceable Obtainable Market (Y1-3)",
    icon: <FiPieChart className="w-6 h-6" />,
    color: "from-green-500 to-teal-400"
  }
];

const MarketSection = () => {
  return (
    <section className="section bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)]"></div>
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
            Market Opportunity
          </span>
          <h2 className="mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">Significant</span> and Growing Market
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The demand for neurodiversity inclusion solutions is rapidly increasing as companies recognize the value of diverse talent.
          </p>
        </motion.div>

        {/* Market Sizing */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {marketData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 p-8 rounded-2xl border border-gray-800 hover:border-primary-500/30 transition-colors"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6`}>
                {item.icon}
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${item.color}">
                {item.value}
              </div>
              <div className="text-lg font-semibold mb-2">{item.label}</div>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Competitor Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden"
        >
          <div className="p-8 border-b border-gray-800">
            <h3 className="text-2xl font-bold mb-2">Competitive Landscape</h3>
            <p className="text-gray-400">How BrainBridge stands out in the market</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4">Competitor</th>
                  <th className="text-left p-4">Focus</th>
                  <th className="text-left p-4">How We're Different</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((competitor, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="p-4 font-medium">{competitor.name}</td>
                    <td className="p-4 text-gray-400">{competitor.focus}</td>
                    <td className="p-4 text-gray-400">{competitor.difference}</td>
                  </motion.tr>
                ))}
                {/* BrainBridge row */}
                <motion.tr
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-primary-500/5 to-secondary-500/5"
                >
                  <td className="p-4 font-bold">BrainBridge</td>
                  <td className="p-4 font-medium">Comprehensive Neurodiversity Platform</td>
                  <td className="p-4 font-medium text-primary-400">
                    End-to-end solution combining assessment, training, and matching
                  </td>
                </motion.tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Market Trends */}
        <motion.div 
          className="mt-16 p-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Market Trends</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="text-3xl font-bold text-primary-400 mb-2">15-20%</div>
                <p className="text-gray-300">of the global population is neurodivergent</p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="text-3xl font-bold text-secondary-400 mb-2">30-40%</div>
                <p className="text-gray-300">unemployment rate among neurodivergent adults</p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="text-3xl font-bold text-accent-400 mb-2">90%</div>
                <p className="text-gray-300">of companies prioritize diversity but lack neurodiversity programs</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary-500/10 rounded-full filter blur-3xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketSection;
