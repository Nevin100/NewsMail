import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const ScrapWebsite = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [articles, setArticles] = useState([]);
  const [newsletterHTML, setNewsletterHTML] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/admin/admin-logout", {
        withCredentials: true,
      });
      toast.success("Logged out successfully!");
      navigate("/admin");
    } catch (error) {
      console.log(error);
      toast.error("Logout unsuccessful!");
    }
  };

  const SidebarItem = ({ icon, label, route }) => {
    const isActive = window.location.pathname.includes(route);
    return (
      <button
        onClick={() => navigate(route)}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
          isActive ? "bg-base-200 shadow" : "hover:bg-base-100"
        }`}
      >
        {icon}
        <span className="text-lg lg:text-xl">{label}</span>
      </button>
    );
  };

  const handleScrape = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/articles/scrape", {
        url,
      });
      setArticles(res.data.data || []);
    } catch (err) {
      console.error("Scrape failed:", err);
    }
    setLoading(false);
  };

  const handleGenerate = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/admin/generate-newsletter",
        {},
        { withCredentials: true }
      );
      setNewsletterHTML(res.data.html);
    } catch (err) {
      console.error("Generation failed:", err);
    }
  };

  return (
    <div className="p-4 md:p-6 mt-16 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Menu</h3>
            <button
              className="text-3xl font-bold bg-base-200 px-4 py-2 rounded"
              onClick={() => setShowSidebar((prev) => !prev)}
            >
              ☰
            </button>
          </div>

          {showSidebar && (
            <div className="lg:hidden bg-base-200 p-6 rounded-xl">
              <div className="flex flex-col items-center mb-6">
                <img
                  src="https://t4.ftcdn.net/jpg/02/27/45/09/360_F_227450952_KQCMShHPOPebUXklULsKsROk5AvN6H1H.jpg"
                  alt="Admin Avatar"
                  className="w-20 h-20 rounded-full mb-2"
                />
                <h1 className="text-xl font-semibold text-center mt-2">
                  Admin 🛡️
                </h1>
              </div>
              {[
                { label: "Dashboard", path: "/admin-dashboard" },
                { label: "About", path: "/admin/about" },
                { label: "Articles", path: "/admin/articles" },
                { label: "Newsletters", path: "/admin/newsLetter" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`w-full text-left p-3 rounded-xl text-lg font-medium cursor-pointer ${
                    window.location.pathname.includes(item.path)
                      ? "bg-base-100"
                      : "hover:bg-base-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="mt-6 text-lg text-red-500 font-semibold hover:text-red-700"
              >
                Logout
              </button>
            </div>
          )}

          <aside className="hidden lg:flex flex-col bg-base-300 rounded-xl py-8 px-6 shadow-md h-full min-h-[calc(100vh-8rem)]">
            <div className="mb-10 flex flex-col gap-4 items-center bg-base-200 px-6 py-4 rounded-xl">
              <img
                src="/newsMailer.svg"
                alt="Admin"
                className="w-28 h-12 object-contain"
              />
              <h3 className="text-center text-3xl font-semibold">Admin</h3>
            </div>
            <nav className="flex flex-col gap-5">
              <SidebarItem
                icon={<span>📊</span>}
                label="Dashboard"
                route="/admin-dashboard"
              />
              <SidebarItem
                icon={<span>ℹ️</span>}
                label="About"
                route="/admin/about"
              />
              <SidebarItem
                icon={<span>📝</span>}
                label="Articles"
                route="/admin/articles"
              />
              <SidebarItem
                icon={<FaEnvelope />}
                label="Send Mail"
                route="/admin/send-mail"
              />
              <SidebarItem
                icon={<FaEnvelope />}
                label="NewsLetters"
                route="/admin/newsLetter"
              />
            </nav>
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 text-red-500 hover:text-red-700 px-4 py-3 hover:bg-base-100 rounded-xl transition-all duration-200"
            >
              <span>🚪</span>
              <span className="text-lg lg:text-xl font-semibold">Logout</span>
            </button>
          </aside>
        </div>

        {/* Scrape Section */}
        <div className="lg:col-span-3 bg-base-200 p-6 md:p-10 rounded-xl shadow-md">
          <h1 className="text-3xl lg:text-5xl font-bold mb-10 text-center text-primary">
            Scrape Website 📰
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <input
              type="text"
              placeholder="Enter URL to scrape..."
              className="input input-bordered w-full sm:w-2/3 text-base lg:text-lg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={handleScrape}
              className="btn btn-primary text-base lg:text-lg"
              disabled={!url || loading}
            >
              {loading ? "Scraping..." : "Scrape"}
            </button>
          </div>

          {articles.length > 0 && (
            <>
              <div className="bg-base-300 p-6 rounded-xl shadow mb-6">
                <h2 className="text-2xl lg:text-4xl font-semibold mb-6">
                  Scraped Articles
                </h2>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {articles.map((item) => (
                    <div
                      key={item._id}
                      className="bg-base-100 p-4 rounded-xl shadow border border-base-300"
                    >
                      <h3 className="font-bold text-lg lg:text-xl mb-1">
                        {item.title.length > 70
                          ? item.title.slice(0, 67) + "..."
                          : item.title}
                      </h3>
                      <p className="text-sm lg:text-base">{item.summary}</p>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 mt-2 inline-block text-sm"
                      >
                        🔗 View Full
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    onClick={handleGenerate}
                    className="btn text-base-content text-base lg:text-lg"
                  >
                    ✨ Generate Newsletter
                  </button>
                  {newsletterHTML && (
                    <button
                      className="btn btn-success text-base lg:text-lg"
                      onClick={() => navigate("/admin/send-mail")}
                    >
                      📤 Send Mail
                    </button>
                  )}
                </div>
              </div>

              {newsletterHTML && (
                <div className="mt-10 bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow">
                  <h3 className="text-xl lg:text-2xl font-bold px-6 pt-6">
                    📬 Newsletter Preview
                  </h3>
                  <iframe
                    title="newsletter-preview"
                    className="w-full h-[700px] mt-4"
                    srcDoc={newsletterHTML}
                    sandbox=""
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrapWebsite;
