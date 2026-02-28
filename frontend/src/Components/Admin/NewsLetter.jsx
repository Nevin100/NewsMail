import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaHistory, FaEye, FaCalendarAlt, FaGlobe } from "react-icons/fa";
import { FaNewspaper, FaBookOpen } from "react-icons/fa6";
import axios from "axios";
import RenderNewsletter from "../RenderNewsletter.jsx";

const NewsLetter = () => {
  const [newsLetters, setNewsLetters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("https://newsmail-2s5a.onrender.com/articles/total-newsletter-formats");
        setNewsLetters(res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("Error fetching newsletters:", err);
      }
    };
    fetchArticles();
  }, []);

  const SidebarItem = ({ icon, label, route }) => (
    <button
      onClick={() => navigate(route)}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
        window.location.pathname === route ? "bg-primary text-primary-content shadow-lg shadow-primary/30" : "hover:bg-base-200 opacity-70"
      }`}
    >
      {icon} <span className="text-md">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8 mt-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8">
        
        {/* Sidebar - Branding Consistency */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="p-6 bg-primary/10 rounded-[2rem] text-center group">
            <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center text-primary-content shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
              <FaHistory size={28} />
            </div>
            <h2 className="font-black text-xl italic tracking-tighter">Archives</h2>
          </div>
          <nav className="flex flex-col gap-2">
            <SidebarItem icon={<FaNewspaper />} label="Dashboard" route="/admin-dashboard" />
            <SidebarItem icon={<FaBookOpen />} label="Articles" route="/admin/articles" />
            <SidebarItem icon={<FaEnvelope />} label="Send Mail" route="/admin/send-mail" />
            <SidebarItem icon={<FaGlobe />} label="Scrape" route="/admin/scrape" />
          </nav>
        </aside>

        {/* Newsletter Archive Main Section */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-base-200 p-8 md:p-12 rounded-[2.5rem] border border-base-content/5 shadow-xl relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
             <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">
                  Newsletter <span className="text-primary not-italic font-bold">Vault</span>
                </h1>
                <p className="text-xs uppercase font-bold tracking-[0.2em] opacity-40 mt-2">Browse and re-verify your dispatched campaigns</p>
             </div>
          </div>

          {/* Newsletter Gallery Grid */}
          <div className="grid grid-cols-1 gap-12">
            {newsLetters.map((item, index) => (
              <div key={item._id} className="group relative">
                {/* Timeline Marker (Optional sexy touch) */}
                <div className="hidden lg:flex absolute -left-16 top-0 bottom-0 items-start justify-center">
                    <div className="w-1 bg-base-300 h-full relative">
                        <div className="w-4 h-4 rounded-full bg-primary absolute -left-1.5 border-4 border-base-100 ring-2 ring-primary/20"></div>
                    </div>
                </div>

                <div className="bg-base-200 rounded-[2.5rem] border border-base-content/5 overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-primary/5">
                  {/* Card Header */}
                  <div className="px-8 py-4 bg-base-300/30 flex justify-between items-center border-b border-base-content/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 text-primary rounded-lg font-black text-xs italic">
                            #{newsLetters.length - index}
                        </div>
                        <span className="text-xs font-bold opacity-50 flex items-center gap-2">
                            <FaCalendarAlt /> {new Date(item.createdAt).toDateString()}
                        </span>
                    </div>
                    <button className="btn btn-xs btn-primary rounded-lg gap-2 text-[10px] font-black tracking-widest uppercase">
                        <FaEye /> Full View
                    </button>
                  </div>

                  {/* Newsletter Rendering Area */}
                  <div className="p-1 md:p-6 bg-white overflow-hidden max-h-[500px] relative">
                    {/* Shadow overlay to indicate more content */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
                    
                    <div className="transform scale-[0.85] origin-top">
                      <RenderNewsletter html={item.html} />
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="px-8 py-4 flex justify-between items-center italic text-[10px] font-bold opacity-30">
                    <span>NEWSMAILER ENGINE V2.0</span>
                    <span>TIMESTAMP: {new Date(item.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;