import React from 'react';
import { Mail, Github, Rocket, Lightbulb, User } from 'lucide-react'; // Icons ke liye

const About = () => {
  return (
    <div className="p-4 md:p-8 mt-16 min-h-screen max-w-6xl mx-auto">
      {/* Header Section with Neon Glow */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-primary rounded-full"></div>
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight text-base-content relative">
          About <span className="text-primary italic">NewsMailer</span> 
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Elevating your daily news experience with precision, design, and simplicity.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Mission Card */}
        <div className="group p-8 rounded-3xl bg-base-200 border border-base-content/5 hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-primary/10">
          <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Rocket className="text-amber-500" size={28} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-base-content/80 leading-relaxed text-lg">
            <strong>NewsMailer</strong> is a personalized newsletter platform that scrapes online news legally and delivers <span className="text-primary font-semibold">5 handpicked stories</span> daily or weekly. No noise, just news.
          </p>
        </div>

        {/* Innovation Card */}
        <div className="group p-8 rounded-3xl bg-base-200 border border-base-content/5 hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-primary/10">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Lightbulb className="text-primary" size={28} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Why NewsMailer?</h2>
          <p className="text-base-content/80 leading-relaxed text-lg">
            Generic newsletters are boring. We provide <span className="bg-amber-500/10 text-amber-600 px-2 py-1 rounded-lg font-bold">Curated Intelligence</span>. Every email is uniquely tailored to keep you ahead of the curve.
          </p>
        </div>

        {/* Creator Section - Full Width */}
        <div className="md:col-span-2 relative overflow-hidden p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-base-200 to-base-300 border border-white/5 shadow-2xl">
            {/* Background Decorative Circle */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-lg opacity-40 rounded-full animate-pulse"></div>
                <img
                  src="https://avatars.githubusercontent.com/u/146621784?v=4"
                  alt="Nevin Bali"
                  className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover border-4 border-base-100 shadow-2xl relative"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-2 flex items-center justify-center md:justify-start gap-2">
                   <User size={16}/> Meet the Creator
                </h3>
                <h2 className="text-4xl font-black mb-4">Nevin Bali</h2>
                <p className="text-xl text-base-content/70 leading-relaxed max-w-xl">
                  A developer & design enthusiast who believes that code should be as beautiful as it is functional. NewsMailer is a product of 
                  <span className="italic text-base-content font-medium"> curiosity, chai, and clean code.</span>
                </p>
                
                {/* Social Buttons */}
                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                  <a
                    href="mailto:nevinbali10@gmail.com"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-content font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-primary/40"
                  >
                    <Mail size={20} /> Let's Talk
                  </a>
                  <a
                    href="https://github.com/Nevin100"
                    target="_blank"
                    className="flex items-center gap-2 px-6 py-3 bg-base-content text-base-100 font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
                  >
                    <Github size={20} /> GitHub
                  </a>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Footer Quote */}
      <p className="text-center mt-12 text-base-content/40 font-medium tracking-widest uppercase text-xs">
        Crafted with ❤️ for the Modern Web
      </p>
    </div>
  );
};

export default About;