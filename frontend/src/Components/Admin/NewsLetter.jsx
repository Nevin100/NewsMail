import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import RenderNewsletter from "../RenderNewsletter.jsx";

const NewsLetter = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [newsLetters, setNewsLetters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/articles/total-newsletter-formats"
        );
        setNewsLetters(res.data.data);
        console.log("Response : html", newsLetters);
      } catch (err) {
        console.error("Error fetching mails:", err);
      }
    };
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <span className="text-lg">{label}</span>
      </button>
    );
  };

  return (
    <div className="p-4 md:p-6 mt-14 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:cols-span-1">
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Menu</h3>
            <button
              className="text-2xl font-bold bg-base-200 px-3 py-1 rounded"
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
                <h1 className="text-lg font-medium text-center mt-2">
                  Admin 🛡️
                </h1>
              </div>
              {[
                { label: "Dashboard", path: "/admin-dashboard" },
                { label: "About", path: "/admin/about" },
                { label: "Articles", path: "/admin/articles" },
                { label: "Newsletters ", path: "/admin/newsLetter" },
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
                className="w-24 h-10 object-contain"
              />
              <h3 className="text-center text-2xl font-semibold">Admin</h3>
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
              <span className="text-lg font-semibold">Logout</span>
            </button>
          </aside>
        </div>

        {/* newsLetter Section */}
        <div className="lg:col-span-3 bg-base-200 p-6 md:p-10 rounded-xl shadow-md">
          <h1 className="lg:text-5xl text-xl font-bold mb-10 text-center text-primary">
            NewsLetters 📚
          </h1>
          {newsLetters.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl overflow-hidden shadow-md p-4 border border-base-300"
            >
              <div className="text-sm text-gray-500 mb-2 text-right">
                {new Date(item.createdAt).toLocaleString()}
              </div>
              <RenderNewsletter html={item.html} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
