/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaExternalLinkAlt, FaRegCalendarAlt, FaGlobe } from "react-icons/fa";
import { FaNewspaper, FaBookOpen} from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";

const Articles = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("https://newsmail-2s5a.onrender.com/articles/total-articles");
        setArticles(res.data.data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };
    fetchArticles();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("https://newsmail-2s5a.onrender.com/admin/admin-logout", { withCredentials: true });
      toast.success("Logged out successfully!");
      navigate("/admin");
    } catch (error) {
      toast.error("Logout unsuccessful!");
    }
  };

  const SidebarItem = ({ icon, label, route }) => (
    <button
      onClick={() => navigate(route)}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
        window.location.pathname === route 
          ? "bg-primary text-primary-content shadow-lg shadow-primary/30" 
          : "hover:bg-base-200 opacity-70 hover:opacity-100"
      }`}
    >
      {icon} <span className="text-md">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8 mt-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8">
        
        {/* Sidebar - Consistent with Dashboard */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="p-6 bg-primary/10 rounded-[2rem] text-center group">
            <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center text-primary-content shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
              <FaBookOpen size={28} />
            </div>
            <h2 className="font-black text-xl italic tracking-tighter">Content Hub</h2>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarItem icon={<FaNewspaper />} label="Dashboard" route="/admin-dashboard" />
            <SidebarItem icon={<FaBookOpen />} label="Articles" route="/admin/articles" />
            <SidebarItem icon={<FaEnvelope />} label="Send Mail" route="/admin/send-mail" />
            <SidebarItem icon={<FaGlobe />} label="Scrape" route="/admin/scrape" />
          </nav>
        </aside>

        {/* Articles Main Section */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center bg-base-200 p-8 rounded-[2.5rem] border border-base-content/5 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <FaBookOpen size={120} />
             </div>
             <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">
                  Library <span className="text-primary not-italic text-sm font-medium tracking-wide"> Total Articles : ({articles.length})</span>
                </h1>
                <p className="text-xs uppercase font-bold tracking-[0.2em] opacity-40 mt-2">Manage your curated knowledge base</p>
             </div>
             <button onClick={() => navigate('/admin/scrape')} className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20 mt-4 md:mt-0">
                Scrape More
             </button>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
            {articles.map((item) => (
              <div
                key={item._id}
                className="group bg-base-200 p-6 rounded-[2rem] border border-base-content/5 hover:border-primary/40 transition-all duration-300 shadow-xl hover:shadow-primary/5 flex flex-col justify-between"
              >
                <div>
                   <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg tracking-widest">
                        {new URL(item.sourceUrl).hostname.replace('www.', '')}
                      </div>
                      <span className="flex items-center gap-1 text-[10px] opacity-40 font-bold">
                        <FaRegCalendarAlt /> {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                   </div>
                   
                   <h3 className="text-xl font-black mb-3 leading-tight group-hover:text-primary transition-colors">
                     {item.title.length > 80 ? item.title.slice(0, 77) + "..." : item.title}
                   </h3>
                   
                   <p className="text-sm opacity-60 leading-relaxed font-medium mb-6">
                     {item.summary.length > 150 ? item.summary.slice(0, 150) + "..." : item.summary}
                   </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-base-content/5 mt-auto">
                   <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <FaGlobe /> Source
                  </a>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2 bg-base-100 rounded-xl text-xs font-black shadow-sm group-hover:bg-primary group-hover:text-primary-content transition-all"
                  >
                    Read Full <FaExternalLinkAlt size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;