import { motion } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub, FiTwitter } from 'react-icons/fi';

const teamMembers = [
  {
    name: "John Doe",
    role: "CEO & Founder",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    name: "Jane Smith",
    role: "CTO",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    name: "Alex Johnson",
    role: "Head of Product",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    name: "Maria Garcia",
    role: "Lead Developer",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  }
];

const ClosingSection = () => {
  return (
    <section className="section bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)]"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
              Get In Touch
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Let's Build an <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">Inclusive Future</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
              Join us in creating a world where neurodiversity is celebrated and everyone has the opportunity to thrive.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium hover:opacity-90 transition-opacity text-lg">
              Request a Demo
            </button>
            <button className="px-8 py-4 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors text-lg">
              Contact Our Team
            </button>
          </motion.div>
        </div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Meet Our Team</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 p-1">
                  <div className="w-full h-full rounded-full bg-gray-800 overflow-hidden">
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <h4 className="text-lg font-bold">{member.name}</h4>
                <p className="text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          className="pt-12 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl mr-3">
                BB
              </div>
              <span className="text-xl font-bold">BrainBridge</span>
            </div>
            
            <div className="flex space-x-6 mb-6 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiMail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
            </div>
            
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} BrainBridge. All rights reserved.
            </p>
          </div>
        </motion.footer>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-primary-500/10 filter blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-secondary-500/10 filter blur-3xl"></div>
    </section>
  );
};

export default ClosingSection;
