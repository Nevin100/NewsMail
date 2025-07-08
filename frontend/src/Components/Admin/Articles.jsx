import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const Articles = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/articles/total-articles"
        );
        setArticles(res.data.data);
      } catch (err) {
        console.error("Error fetching mails:", err);
      }
    };
    fetchArticles();
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
                { label: "Create Mail", path: "/admin/create-mail" },
                { label: "Send Mail", path: "/admin/send-mail" },
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

        {/* Articles Section */}
        <div className="lg:col-span-3 bg-base-200 p-6 md:p-10 rounded-xl shadow-md">
          <h1 className="lg:text-5xl text-xl font-bold mb-10 text-center text-primary">
            Articles 📚
          </h1>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {articles.map((item) => (
              <div
                key={item._id}
                className="bg-base-100 p-5 rounded-xl shadow hover:shadow-lg transition duration-300"
              >
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3">
                  {item.title.length > 80
                    ? item.title.slice(0, 77) + "..."
                    : item.title}
                </h3>
                <p className="text-sm sm:text-base mb-1">
                  <strong>Source:</strong>{" "}
                  <a
                    href={item.sourceUrl}
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.sourceUrl}
                  </a>
                </p>
                <p className="text-sm sm:text-base mt-3 mb-2">
                  <strong>Description:</strong>{" "}
                  {item.summary.length > 100
                    ? item.summary.slice(0, 100) + "..."
                    : item.summary}
                </p>
                <p className="text-sm sm:text-base mt-2">
                  <strong>Created:</strong>{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-blue-600 hover:underline text-sm sm:text-base font-medium"
                >
                  🔗 Read full article
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
