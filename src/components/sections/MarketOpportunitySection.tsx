import { motion } from 'framer-motion';

const competitors = [
  {
    name: 'Mentra',
    description: 'AI platform matching ND professionals to Fortune; profiles go beyond resumes.',
    differentiation: 'BrainBridge adds self-discovery, JD normalization, and employer certification to create a closed loop - not just matching'
  },
  {
    name: 'Specialisterne',
    description: 'Focuses on placing autistic talent in roles, but limited adaptive learning or AI-driven matching.',
    differentiation: 'BrainBridge pairs AI task-matching with self-discovery profiles and certifies employers for long-term fit.'
  },
  {
    name: 'Untapped.ai',
    description: 'Provides neurodiversity coaching for organizations, but doesn’t cover end-to-end hiring pipelines or candidate self-discovery.',
    differentiation: 'BrainBridge delivers an end-to-end pipeline: discovery → JD parser → AI cognitive-fit matching → certified employers.'
  },
  {
    name: 'HireVue',
    description: 'AI-driven interview analysis, but criticized for bias and not tailored for ND candidates.',
    differentiation: 'BrainBridge avoids interview bias by centering cognitive-fit scoring, inclusive JD rewrites, and ND-first workflows.'
  },
  {
    name: 'The Precisionists (TPI)',
    description: 'Benefit-corp outsourcing firm creating ND jobs via IT/BPO project teams.',
    differentiation: 'BrainBridge is SaaS (discovery, JD normalization, AI matching, certification) rather than a managed-services outsourcing model.'
  },
  {
    name: 'CAI',
    description: 'Global IT firm with a Neurodiverse Solutions program embedded in tech/staffing services',
    differentiation: 'BrainBridge specializes in neuro-inclusion tooling (self-discovery, JD parser, certification) and plugs into existing ATS/stacks.'
  }
];

const marketSizing = [
  {
    title: 'Total Addressable Market (TAM)',
    items: [
      'Global EdTech + HRTech intersection',
      '~1B people worldwide are neurodivergent (WHO estimates ~15% of global population)',
      'Global corporate training & DEI spend: $350B+ annually',
      'Global e-learning market: $250B+ (CAGR ~20%)',
      'TAM: $50B+ (portion of EdTech/HRTech spend relevant to neurodiversity inclusion)'
    ]
  },
  {
    title: 'Serviceable Available Market (SAM)',
    items: [
      'Focus: ND employment enablement + corporate DEI compliance',
      'North America + Europe initially: ~120M neurodivergent adults of working age',
      'Corporate DEI/Accessibility spend: $15B annually',
      'SAM: ~$5B (ND-focused job placement, LMS, employer DEI services)'
    ]
  },
  {
    title: 'Serviceable Obtainable Market (SOM)',
    items: [
      'Initial target: SMEs and forward-thinking enterprises',
      'Initial go-to-market: Pilot with 10k ND adults + 500 employers (NGO + corporate partnerships)',
      'Avg. ARPU:',
      '• Talent subscriptions: ~$100/year',
      '• Employer subs: ~$5–10k/year (LMS + certification)',
      'SOM (Year 1–2): ~$10–20M potential revenue capture with scaling'
    ]
  }
];

const MarketOpportunitySection = () => {
  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden">
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
            Competitive Landscape          </h2>
          <p className="text-xl text-gray-300">
            While there are platforms addressing employment for neurodiverse individuals or corporate DEI training, 
            none integrate talent discovery, adaptive learning, employer certification, and AI-driven job matching 
            in one ecosystem like BrainBridge does with AI
          </p>
        </motion.div>

        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Competitive Landscape</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitors.map((competitor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500 transition-colors"
              >
                <h4 className="text-xl font-bold text-white mb-2">{competitor.name}</h4>
                <p className="text-gray-400 mb-3">{competitor.description}</p>
                <p className="text-blue-400 text-sm">
                  <span className="font-semibold">Differentiation:</span> {competitor.differentiation}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Market Sizing</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {marketSizing.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800"
              >
                <h4 className="text-xl font-bold text-blue-400 mb-4">{item.title}</h4>
                <ul className="space-y-3">
                  {item.items.map((point, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start">
                      <span className="mr-2">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketOpportunitySection;
