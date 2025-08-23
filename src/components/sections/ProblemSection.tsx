import { motion } from "framer-motion";

interface ProblemSectionProps {
  id?: string;
}

const ProblemSection = ({ id }: ProblemSectionProps) => {
  const problems = [
    "The Paradox: Solutions only reach a few. The vast majority of neurodivergent talent is left behind.",
    "The Skills Gap: Demand for focused jobs is rising, yet 75% of neurodivergent people are unemployed globally.",
    "The Waste: Late diagnosis leads to wasted time, stress, and misaligned careers.",
    "The Barrier: Companies want DEI, but high costs and poor guidance from consultants make it hard to achieve.",
  ];

  return (
    <section
      id={id}
      className="section bg-gray-950 relative overflow-hidden py-20"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
              The Challenge
            </span>
            <h2 className="mb-6 text-3xl md:text-4xl font-bold text-white">
              Untapped Neurodivergent Potential{" "}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              While rare skill demands are rising, more than 0.75 Billion high skill
              neuro divergents are job less”
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Problem List */}
            <div className="space-y-6">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-primary-500/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <p className="text-lg text-gray-300">{problem}</p>
                </motion.div>
              ))}
            </div>

            {/* Core Problem Card */}
            <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-gray-900/50 border border-gray-800 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">💡</span>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">
                  Core Problem
                </h3>
                <ul className="space-y-4 text-left text-lg text-gray-300">
                  <li>
                    <span className="font-semibold text-primary-400">
                      1. Complications on ND Strengths-JD Matching:
                    </span>{" "}
                    It's not enough to just know the theory behind matching
                    neurodivergent strengths to job roles.
                  </li>
                  <li>
                    <span className="font-semibold text-primary-400">
                      2. A Deeper Gap, not diving deep:
                    </span>{" "}
                    The real challenge lies in accurately evaluating an
                    individual's unique neurodivergent profile and precisely
                    interpreting a job description to ensure a confident and
                    accurate match.
                  </li>
                </ul>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full filter blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-secondary-500/10 rounded-full filter blur-3xl -z-10"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
