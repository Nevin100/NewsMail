import { Link } from "react-router-dom";
import { AtSign, Github, Linkedin, Heart, Mail, ChevronRight, Sparkles } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Themes", path: "/settings" },
    { name: "Admin Portal", path: "/admin" },
  ];

  return (
    <footer className="relative bg-base-200 border-t border-base-content/5 pt-20 pb-10 px-6 overflow-hidden mt-24">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Identity */}
          <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="size-11 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <AtSign className="w-6 h-6 text-primary-content" />
              </div>
              <span className="text-3xl font-black tracking-tighter italic">
                News<span className="text-primary not-italic">Mail</span>
              </span>
            </Link>
            <p className="text-base-content/60 text-sm leading-relaxed max-w-xs font-medium">
              Revolutionizing the way you consume tech. Legally scraped, AI curated, and delivered with <span className="text-primary">Precision</span>.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Github size={20} />, url: "https://github.com/Nevin100" },
                { icon: <Linkedin size={20} />, url: "https://www.linkedin.com/in/nevin-bali-aa744a2b6/" }
              ].map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" 
                   className="p-3 bg-base-300 rounded-2xl hover:bg-primary hover:text-primary-content hover:-translate-y-1 transition-all duration-300 shadow-sm">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Navigation */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8 bg-primary/10 px-3 py-1 rounded-full">Explore</h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="group flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 hover:text-primary transition-all">
                    <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8 bg-primary/10 px-3 py-1 rounded-full">Contact</h4>
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <a href="mailto:nevinbali10@gmail.com" className="group flex items-center gap-3 p-4 bg-base-100 rounded-2xl border border-base-content/5 hover:border-primary/50 transition-all shadow-sm">
                <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-black truncate max-w-[150px]">nevinbali10@gmail.com</span>
              </a>
              <div className="flex items-center gap-2 text-[10px] font-bold opacity-40 uppercase tracking-widest">
                <Sparkles size={12} /> Response time: ~24h
              </div>
            </div>
          </div>

          {/* Newsletter Badge (Sexy CTA) */}
          <div className="flex flex-col items-center md:items-start lg:pl-4">
             <div className="w-full p-8 rounded-[2.5rem] bg-gradient-to-br from-base-300 to-base-200 border border-white/5 shadow-inner relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                <h4 className="text-xl font-black italic mb-2 relative z-10">Stay Scraped</h4>
                <p className="text-xs font-medium opacity-50 mb-6 relative z-10 leading-relaxed">Get 5 stories daily. No fluff. Just hard tech news.</p>
                <Link to="/" className="btn btn-primary btn-sm rounded-xl w-full font-black shadow-lg shadow-primary/20 relative z-10">
                  Join The List
                </Link>
             </div>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div className="pt-10 border-t border-base-content/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-30">
              &copy; {currentYear} NewsMailer Hub. Built for the modern web.
            </p>
          </div>
          
          <div className="group flex items-center gap-3 px-6 py-3 bg-base-300/50 rounded-2xl border border-base-content/5 backdrop-blur-sm">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Handcrafted with</span>
            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">by</span>
            <span className="text-xs font-black italic text-primary underline underline-offset-4 decoration-primary/30">Nevin Bali</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;