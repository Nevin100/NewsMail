import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, AtSign, Info, ShieldCheck, Menu, X, Rocket } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "About", path: "/about", icon: <Info size={18} /> },
    { name: "Admin", path: "/admin", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <header className="bg-base-100/80 border-b border-base-content/5 fixed w-full top-0 z-50 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <AtSign className="w-6 h-6 text-primary-content" />
          </div>
          <h1 className="text-xl font-black tracking-tighter">
            News<span className="text-primary italic">Mail</span>
          </h1>
        </Link>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-1 bg-base-200/50 p-1 rounded-2xl border border-base-content/5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive(link.path)
                    ? "bg-base-100 text-primary shadow-sm"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-100/50"
                }`}
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </nav>
          <Link
            to="/settings"
            className={`btn btn-sm h-10 rounded-xl gap-2 ${
              isActive("/settings") ? "btn-primary shadow-lg shadow-primary/20" : "btn-ghost bg-base-200"
            }`}
          >
            <Settings size={18} className={isActive("/settings") ? "animate-spin-slow" : ""} />
            <span className="font-bold">Settings</span>
          </Link>
        </div>

        {/* Mobile Toggle Button (Visible only on Phone) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl bg-base-200 text-base-content active:scale-95 transition-all"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MOBILE SIDEBAR (Drawer) --- */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${isOpen ? "visible" : "invisible"}`}>
        {/* Backdrop overlay */}
        <div 
          className={`absolute inset-0 bg-base-300/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Sidebar Content */}
        <nav className={`absolute top-0 right-0 h-full w-[280px] bg-base-100 shadow-2xl p-6 flex flex-col gap-6 transition-transform duration-500 ease-out border-l border-base-content/5 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between mb-4">
             <span className="text-xs font-black uppercase tracking-widest opacity-40">Menu</span>
             <button onClick={() => setIsOpen(false)} className="p-2 bg-base-200 rounded-lg"><X size={20}/></button>
          </div>

          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${
                  isActive(link.path)
                    ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                    : "bg-base-200/50 text-base-content/70 hover:bg-base-200"
                }`}
              >
                <div className={`${isActive(link.path) ? "text-primary-content" : "text-primary"}`}>{link.icon}</div>
                {link.name}
              </Link>
            ))}
            
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${
                isActive("/settings")
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                  : "bg-base-200/50 text-base-content/70 hover:bg-base-200"
              }`}
            >
              <Settings className={`${isActive("/settings") ? "animate-spin-slow text-primary-content" : "text-primary"}`} size={18} />
              Settings
            </Link>
          </div>

          {/* Sexy Bottom Badge in Mobile Menu */}
          <div className="mt-auto p-5 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl border border-primary/5">
             <div className="flex items-center gap-2 text-primary font-black italic mb-2">
                <Rocket size={16}/> NewsMailer Pro
             </div>
             <p className="text-[10px] font-medium opacity-50 uppercase tracking-widest">v2.0 Beta • Crafted with Heart</p>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;