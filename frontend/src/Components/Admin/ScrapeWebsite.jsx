/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaGlobe, FaMagic, FaPaperPlane, FaLaptop, FaMobileAlt, FaTrash } from "react-icons/fa";
import { FaNewspaper, FaBookOpen, FaChevronRight } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";

const ScrapWebsite = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [articles, setArticles] = useState([]);
  const [newsletterHTML, setNewsletterHTML] = useState("");
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop"); 

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

  const handleScrape = async () => {
    setScrapeLoading(true);
    const loadingToast = toast.loading("Scraping knowledge from the web...");
    try {
      const res = await axios.post("https://newsmail-2s5a.onrender.com/articles/scrape", { url });
      setArticles(res.data.data || []);
      toast.success("Scraping completed!", { id: loadingToast });
    } catch (err) {
      toast.error("Scraping failed. Check URL.", { id: loadingToast });
    } finally { setScrapeLoading(false); }
  };

  const handleGenerate = async () => {
    setGenerateLoading(true);
    const genToast = toast.loading("AI is crafting your newsletter...");
    try {
      const res = await axios.post("https://newsmail-2s5a.onrender.com/admin/generate-newsletter", {}, { timeout: 60000 });
      setNewsletterHTML(res.data.html);
      toast.success("Newsletter ready for takeoff! 🚀", { id: genToast });
    } catch (err) {
      toast.error("Generation failed.", { id: genToast });
    } finally { setGenerateLoading(false); }
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8 mt-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8">
        
        {/* Sidebar - Consistent Branding */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="p-6 bg-primary/10 rounded-[2rem] text-center group">
            <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center text-primary-content shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
              <FaGlobe size={28} />
            </div>
            <h2 className="font-black text-xl italic tracking-tighter text-base-content">Engine Room</h2>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarItem icon={<FaNewspaper />} label="Dashboard" route="/admin-dashboard" />
            <SidebarItem icon={<FaBookOpen />} label="Articles" route="/admin/articles" />
            <SidebarItem icon={<FaEnvelope />} label="Send Mail" route="/admin/send-mail" />
            <SidebarItem icon={<FaGlobe />} label="Scrape" route="/admin/scrape" />
          </nav>

        </aside>

        {/* Main Content */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Scrape Input Section */}
          <section className="bg-base-200 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-base-content/5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic mb-4">
                Web <span className="text-primary not-italic font-bold">Scraper</span>
              </h1>
              <p className="text-sm font-bold opacity-40 uppercase tracking-[0.2em] mb-10">Inject a URL to extract intelligence</p>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-30">
                    <FaGlobe />
                  </div>
                  <input
                    type="text"
                    placeholder="https://techcrunch.com/latest"
                    className="input input-lg w-full pl-12 bg-base-100 border-none ring-1 ring-base-content/10 focus:ring-2 focus:ring-primary rounded-2xl"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleScrape}
                  disabled={!url || scrapeLoading}
                  className="btn btn-primary btn-lg rounded-2xl px-10 shadow-xl shadow-primary/20 gap-2 transition-all hover:scale-105"
                >
                  {scrapeLoading ? <span className="loading loading-spinner"></span> : <FaMagic />}
                  {scrapeLoading ? "Mining..." : "Scrape"}
                </button>
              </div>
            </div>
          </section>

          {/* Scraped Articles Bento Grid */}
          {articles.length > 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-black italic">Recent Extractions</h2>
                <button onClick={() => setArticles([])} className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 rounded-xl">
                  <FaTrash /> Clear All
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((item) => (
                  <div key={item._id} className="bg-base-200 p-5 rounded-[2rem] border border-base-content/5 shadow-md flex flex-col justify-between group">
                    <div>
                      <h3 className="font-bold text-lg mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2 italic">
                        {item.title}
                      </h3>
                      <p className="text-xs opacity-50 line-clamp-3 leading-relaxed font-medium">{item.summary}</p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-base-content/5 flex justify-end">
                      <a href={item.link} target="_blank" rel="noreferrer" className="text-xs font-black uppercase text-primary flex items-center gap-1 hover:gap-2 transition-all">
                        Link <FaChevronRight size={10} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="bg-base-300/50 backdrop-blur-md p-6 rounded-[2.5rem] flex flex-wrap gap-4 items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                <button
                  onClick={handleGenerate}
                  disabled={generateLoading}
                  className="btn btn-primary rounded-2xl px-8 gap-2 shadow-lg shadow-primary/20"
                >
                  {generateLoading ? <span className="loading loading-spinner"></span> : <FaMagic />}
                  Generate AI Newsletter
                </button>
                {newsletterHTML && (
                  <button
                    onClick={() => navigate("/admin/send-mail")}
                    className="btn btn-secondary rounded-2xl px-8 gap-2 shadow-lg shadow-secondary/20"
                  >
                    <FaPaperPlane /> Ready to Dispatch
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Newsletter Previewer 2.0 */}
          {newsletterHTML && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-black italic">Email Preview</h2>
                <div className="flex bg-base-200 p-1 rounded-xl gap-1">
                  <button 
                    onClick={() => setPreviewMode("desktop")}
                    className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-primary text-primary-content shadow-md' : 'opacity-40 hover:opacity-100'}`}
                  >
                    <FaLaptop />
                  </button>
                  <button 
                    onClick={() => setPreviewMode("mobile")}
                    className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-primary text-primary-content shadow-md' : 'opacity-40 hover:opacity-100'}`}
                  >
                    <FaMobileAlt />
                  </button>
                </div>
              </div>

              <div className="bg-base-200 rounded-[2.5rem] p-4 flex justify-center shadow-2xl border border-base-content/5">
                <div 
                  className={`transition-all duration-500 bg-white shadow-inner overflow-hidden border-[12px] border-base-300 
                  ${previewMode === 'desktop' ? 'w-full h-[700px] rounded-[1.5rem]' : 'w-[375px] h-[667px] rounded-[3rem]'}`}
                >
                  <iframe
                    title="newsletter-preview"
                    className="w-full h-full"
                    srcDoc={newsletterHTML}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrapWebsite;