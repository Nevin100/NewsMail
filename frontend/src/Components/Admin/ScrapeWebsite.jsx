import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { FaNewspaper } from "react-icons/fa";
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
                { label: "Articles", path: "/admin/articles" },
                { label: "News Letter", path: "/admin/newsletter" },
                { label: "Send Mail", path: "/admin/send-mail" },
                { label: "Scrape Website", path: "/admin/scrape" },
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
            {/* Logo */}
            <div className="mb-10 flex flex-col gap-4 items-center bg-base-200 px-6 py-4 rounded-xl">
              <img
                src="/newsMailer.svg"
                alt="Admin"
                className="w-24 h-10 object-contain"
              />
              <h3 className="text-center text-2xl font-semibold ">Admin</h3>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col gap-5">
              <SidebarItem
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
                label="Dashboard"
                route="/admin-dashboard"
              />

              <SidebarItem
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                }
                label="Articles"
                route="/admin/articles"
              />
              <SidebarItem
                icon={
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                }
                label="NewsLetter"
                route="/admin/newsLetter"
              />
              <SidebarItem
                icon={<FaEnvelope className="w-6 h-6" />}
                label="Send Mail"
                route="/admin/send-mail"
              />
              <SidebarItem
                icon={<FaNewspaper className="w-6 h-6" />}
                label="Scrape Website"
                route="/admin/scrape"
              />
            </nav>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 text-red-500 hover:text-red-700 px-4 py-3 hover:bg-base-100 rounded-xl transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-lg font-semibold">Logout</span>
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
                    disabled={!url || loading}
                  >
                    {loading ? "Generating..." : "Generate NewsLetter ⭐"}
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
