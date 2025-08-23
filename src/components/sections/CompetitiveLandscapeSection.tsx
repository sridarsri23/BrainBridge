// import { motion } from 'framer-motion';

// const competitors = [
//   {
//     name: 'Traditional Job Boards',
//     description: 'Generic job portals focusing only on resumes and keywords',
//     limitations: [
//       'No understanding of neurodiverse strengths',
//       'Bias in traditional resume-based filtering',
//       'No tailored support for inclusive hiring'
//     ]
//   },
//   {
//     name: 'Generic ATS Systems',
//     description: 'Standard applicant tracking systems used by companies',
//     limitations: [
//       'Rely heavily on rigid keyword filters',
//       'Often screen out neurodiverse candidates',
//       'Lack of bias-free or cognitive-fit scoring'
//     ]
//   },
//   {
//     name: 'Disability-Focused Recruiters',
//     description: 'Agencies that assist in disability employment',
//     limitations: [
//       'Limited scalability for large ecosystems',
//       'High cost for employers',
//       'Do not provide AI-driven matching or inclusion certification'
//     ]
//   }
// ];

// interface CompetitiveLandscapeSectionProps {
//   id?: string;
// }

// const CompetitiveLandscapeSection = ({ id }: CompetitiveLandscapeSectionProps) => {
//   return (
//     <section id={id} className="py-20 bg-gray-900 relative overflow-hidden">
//       {/* Background pattern */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
//       </div>

//       <div className="container relative z-10">
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-24"
//         >
//           <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
//             Competitive Landscape
//           </span>
//           <h2 className="mb-6">
//             Why <span className="text-primary-400">BrainBridge</span> Stands Out
//           </h2>
//           <p className="text-xl text-gray-400 max-w-3xl mx-auto">
//             Existing tools fail to address the full journey of neurodiverse talent and the compliance needs of employers.
//           </p>
//         </motion.div>

//         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {competitors.map((competitor, index) => (
//             <motion.div
//               key={competitor.name}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, margin: "-50px" }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-primary-500/30 transition-colors"
//             >
//               <div className="w-16 h-16 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-6 mx-auto">
//                 <span className="text-2xl">
//                   {index === 0 ? '📋' : index === 1 ? '🔍' : '👔'}
//                 </span>
//               </div>
//               <h3 className="text-xl font-bold mb-2 text-center">{competitor.name}</h3>
//               <p className="text-gray-400 text-center mb-6">{competitor.description}</p>
              
//               <div className="space-y-4 mt-6">
//                 <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Limitations</h4>
//                 <ul className="space-y-3">
//                   {competitor.limitations.map((limitation, i) => (
//                     <li key={i} className="flex items-start gap-3">
//                       <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center mt-0.5">
//                         <span className="text-red-400 text-xs">✗</span>
//                       </div>
//                       <span className="text-gray-300">{limitation}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
              
//               <div className="mt-8 pt-6 border-t border-gray-800 text-center">
//                 <span className="inline-flex items-center gap-2 text-sm text-blue-400">
//                   <span>BrainBridge solves this</span>
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </span>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           className="mt-20 p-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl border border-primary-500/20 relative overflow-hidden"
//         >
//           <div className="relative z-10 max-w-4xl mx-auto text-center">
//             <h3 className="text-2xl font-bold mb-4">The BrainBridge Difference</h3>
//             <p className="text-gray-300 mb-6">
//               Unlike traditional solutions, BrainBridge delivers an end-to-end ecosystem with talent self-discovery, 
//               AI-driven job matching, and employer neuro-inclusion certification.
//             </p>
//             <div className="grid md:grid-cols-3 gap-6 mt-8">
//               {[
//                 '🧠 Self-Discovery Engine for ND Adults',
//                 '🤖 AI JD Normalizer & Task Matcher',
//                 '🏢 Employer Certification & Compliance'
//               ].map((item, i) => (
//                 <div key={i} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
//                   <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 mb-3 mx-auto">
//                     <span className="text-lg">✓</span>
//                   </div>
//                   <span className="text-gray-200 font-medium">{item}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Decorative elements */}
//           <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-500/5 rounded-full filter blur-3xl"></div>
//           <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-500/5 rounded-full filter blur-3xl"></div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default CompetitiveLandscapeSection;
