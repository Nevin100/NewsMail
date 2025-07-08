import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const About = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

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
        {/* Sidebar Section */}
        <div className="lg:cols-span-1">
          {/* Mobile Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Menu</h3>
            <button
              className="text-2xl font-bold bg-base-200 px-3 py-1 rounded"
              onClick={() => setShowSidebar((prev) => !prev)}
            >
              ☰
            </button>
          </div>

          {/* Mobile Sidebar */}
          <div
            className={`${
              showSidebar ? "block" : "hidden"
            } lg:hidden bg-base-200 p-6 rounded-xl`}
          >
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://t4.ftcdn.net/jpg/02/27/45/09/360_F_227450952_KQCMShHPOPebUXklULsKsROk5AvN6H1H.jpg"
                alt="Admin Avatar"
                className="w-20 h-20 rounded-full mb-2"
              />
              <h1 className="text-lg font-medium text-center mt-2">Admin 🛡️</h1>
            </div>

            <div className="flex flex-col gap-3 mt-6 text-md">
              {["Dashboard", "About", "Articles", "Send Mail"].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    navigate(
                      tab === "Dashboard"
                        ? "/admin-dashboard"
                        : `/admin/${tab.toLowerCase().replace(" ", "-")}`
                    )
                  }
                  className={`w-full text-left p-3 rounded-xl text-lg font-medium cursor-pointer ${
                    window.location.pathname.includes(
                      tab.toLowerCase().replace(" ", "-")
                    )
                      ? "bg-base-100"
                      : "hover:bg-base-300 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 text-lg cursor-pointer text-red-500 font-semibold hover:text-red-700 "
            >
              Logout
            </button>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col bg-base-300 rounded-xl py-8 px-6 shadow-md h-full min-h-[calc(100vh-8rem)]">
            <div className="mb-10 flex flex-col gap-4 items-center bg-base-200 px-6 py-4 rounded-xl">
              <img
                src="/newsMailer.svg"
                alt="Admin"
                className="w-24 h-10 object-contain"
              />
              <h3 className="text-center text-2xl font-semibold ">Admin</h3>
            </div>

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
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                    />
                  </svg>
                }
                label="About"
                route="/admin/about"
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
                icon={<FaEnvelope className="w-6 h-6" />}
                label="Send Mail"
                route="/admin/send-mail"
              />
            </nav>

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

        {/* About Content Section */}
        <div className="lg:col-span-3 bg-base-200 p-6 md:p-10 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-10 text-center text-primary">
            About NewsMailer 📬
          </h1>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-amber-500">
              Our Mission 🚀
            </h2>
            <p className="text-lg md:text-xl leading-relaxed">
              <strong>NewsMailer</strong> is your personalized newsletter
              platform that scrapes online news legally and emails you 5
              handpicked stories – daily or weekly. Clean. Smart. Custom.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-amber-500">
              Why NewsMailer? 💡
            </h2>
            <p className="text-lg md:text-xl leading-relaxed">
              Most newsletters are generic. <strong>NewsMailer</strong> changes
              that. Every user receives{" "}
              <span className="font-bold text-amber-600">
                5 curated news stories
              </span>
              tailored just for them. Simple, fresh, and spam-free.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-amber-500">
              Meet the Creator 👨‍💻
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src="https://avatars.githubusercontent.com/u/146621784?v=4"
                alt="Nevin Bali"
                className="w-36 h-36 rounded-full shadow"
              />
              <p className="text-xl leading-relaxed text-center sm:text-left">
                Hey! I’m <strong className="text-primary">Nevin Bali</strong>, a
                developer & design enthusiast 👨‍💻.
                <br />
                NewsMailer is a product of my curiosity, caffeine, and code ☕.
              </p>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-2 text-amber-500">
              Let’s Connect 🤝
            </h2>
            <p className="text-md sm:text-lg text-gray-700">
              Reach out via email or check out my GitHub to explore more tools.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <a
                href="mailto:nevintestmail@gmail.com"
                className="px-5 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
              >
                ✉️ Email
              </a>
              <a
                href="https://github.com/NevinBali"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
              >
                🔗 GitHub
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
