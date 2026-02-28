/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEnvelope,
  FaChartLine,
  FaUsers,
  FaDownload,
  FaSearch,
} from "react-icons/fa";
import { FaNewspaper, FaBookOpen } from "react-icons/fa6";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
} from "recharts";
import toast from "react-hot-toast";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const AdminDashboard = () => {
  const [emails, setEmails] = useState([]);
  const [articles, setArticles] = useState(0);
  const [newsLetters, setNewsLetters] = useState(0);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const COLORS = ["#3b82f6", "#fbbf24", "#10b981", "#ef4444"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://newsmail-2s5a.onrender.com/admin/get-mails",
        );
        setEmails(res.data.data);
        setFilteredEmails(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchStats = async () => {
      try {
        const resArt = await axios.get(
          "https://newsmail-2s5a.onrender.com/articles/total-articles",
        );
        const resNews = await axios.get(
          "https://newsmail-2s5a.onrender.com/articles/total-newsletter-formats",
        );
        setArticles(resArt.data.data.length);
        setNewsLetters(resNews.data.data.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://newsmail-2s5a.onrender.com/admin/admin-logout",

        {
          withCredentials: true,
        },
      );

      toast.success("Logged out successfully!");

      navigate("/admin");
    } catch (error) {
      console.log(error);

      toast.error("Logout unsuccessful!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://newsmail-2s5a.onrender.com/admin/delete-mail/${id}`,
      );

      toast.success("Mail Deleted Successfully");

      const updated = emails.filter((mail) => mail._id !== id);

      setEmails(updated);

      setFilteredEmails(updated);
    } catch (error) {
      toast.error("Mail Deletion Unsuccessful");
    }
  };

  const handleDownloadFiltered = async (days) => {
    const cutoffDate = new Date();

    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filteredData = emails.filter((email) => {
      const createdAt = new Date(email.createdAt);

      return createdAt >= cutoffDate;
    });

    if (filteredData.length === 0) {
      alert("No records in selected range.");

      return;
    }

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Filtered Emails");

    worksheet.columns = [
      { header: "#", key: "id", width: 10 },

      { header: "Email", key: "mail", width: 40 },

      { header: "Created At", key: "createdAt", width: 30 },
    ];

    filteredData.forEach((email, index) => {
      worksheet.addRow({
        id: index + 1,

        mail: email.mail,

        createdAt: new Date(email.createdAt).toLocaleString(),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Filtered_Emails_Last_${days}_Days.xlsx`);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = emails.filter((email) =>
      email.mail.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredEmails(filtered);
    setCurrentPage(1);
  };

  const SidebarItem = ({ icon, label, route }) => (
    <button
      onClick={() => navigate(route)}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
        window.location.pathname === route
          ? "bg-primary text-primary-content shadow-lg shadow-primary/30"
          : "hover:bg-base-200 opacity-70 hover:opacity-100"
      }`}
    >
      {icon} <span>{label}</span>
    </button>
  );

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-base-200 p-6 rounded-[2rem] border border-base-content/5 flex items-center justify-between group hover:border-primary/50 transition-all shadow-xl shadow-base-300/10">
      <div>
        <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-black">{value}</h3>
      </div>
      <div
        className={`p-4 rounded-2xl bg-${color}/10 text-${color} group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8 mt-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8">
        {/* Modern Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="p-6 bg-primary/10 rounded-3xl text-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center text-primary-content shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                <FaUsers size={28} />
              </div>
              <h2 className="font-black text-xl">Admin Portal</h2>
              <p className="text-[10px] uppercase font-bold tracking-tighter opacity-50">
                NewsMailer Control
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarItem
              icon={<FaChartLine />}
              label="Dashboard"
              route="/admin-dashboard"
            />
            <SidebarItem
              icon={<FaBookOpen />}
              label="Articles"
              route="/admin/articles"
            />
            <SidebarItem
              icon={<FaEnvelope />}
              label="Send Mail"
              route="/admin/send-mail"
            />
            <SidebarItem
              icon={<FaNewspaper />}
              label="Scrape"
              route="/admin/scrape"
            />
            <SidebarItem
              icon={<FaNewspaper />}
              label="NewsLetters"
              route="/admin/newsLetter"
            />
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 w-full text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut /> Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-4 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Signups"
              value={emails.length}
              icon={<FaUsers size={24} />}
              color="primary"
            />
            <StatCard
              title="Newsletters"
              value={newsLetters}
              icon={<FaEnvelope size={24} />}
              color="amber"
            />
            <StatCard
              title="Articles"
              value={articles}
              icon={<FaBookOpen size={24} />}
              color="emerald"
            />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-base-200 p-6 rounded-[2.5rem] shadow-xl border border-base-content/5">
              <h3 className="font-black text-lg mb-6 flex items-center gap-2 italic">
                <span className="w-2 h-2 bg-primary rounded-full"></span> Growth
                Analytics
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={Object.entries(
                    emails.reduce((acc, e) => {
                      const d = new Date(e.createdAt).toLocaleDateString();
                      acc[d] = (acc[d] || 0) + 1;
                      return acc;
                    }, {}),
                  ).map(([date, users]) => ({ date, users }))}
                >
                  <XAxis dataKey="date" hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "15px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={{ r: 6, fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-base-200 p-6 rounded-[2.5rem] shadow-xl border border-base-content/5">
              <h3 className="font-black text-lg mb-6 flex items-center gap-2 italic">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span> Mail
                Status
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Active", value: emails.length },
                      { name: "Pending", value: 5 },
                    ]}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {COLORS.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-base-200 rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-base-content/5">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tighter italic">
                  Records{" "}
                  <span className="text-primary text-sm not-italic font-bold">
                    ({filteredEmails.length})
                  </span>
                </h2>
                <p className="text-xs opacity-50 font-bold uppercase tracking-widest">
                  Manage your subscribers
                </p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="input input-bordered bg-base-100 border-none ring-1 ring-base-content/10 rounded-2xl pl-10 w-64 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={() => {
                    /* download logic */
                  }}
                  className="btn btn-square btn-primary rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                  <FaDownload />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-base-content/40 uppercase text-[10px] tracking-widest border-none">
                    <th>User Info</th>
                    <th>Created</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmails
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage,
                    )
                    .map((email) => (
                      <tr
                        key={email._id}
                        className="bg-base-100 shadow-sm rounded-2xl group transition-all hover:translate-x-1"
                      >
                        <td className="rounded-l-2xl border-none">
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-primary/10 text-primary rounded-xl w-10">
                                <span className="font-bold">
                                  {email.mail[0].toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-sm">
                              {email.mail}
                            </span>
                          </div>
                        </td>
                        <td className="text-xs opacity-60 font-medium border-none">
                          {new Date(email.createdAt).toLocaleDateString()}
                        </td>
                        <td className="rounded-r-2xl text-center border-none">
                          <div className="flex justify-center gap-2">
                            <button
                              className="btn btn-ghost btn-xs text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(email._id)}
                            >
                              <FaTrash />
                            </button>
                            <button className="btn btn-ghost btn-xs text-primary hover:bg-primary/10">
                              <FaEnvelope />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Sexy Pagination */}
            <div className="flex justify-center mt-10 gap-2">
              <button
                className="btn btn-sm rounded-xl px-6 bg-base-100 border-none shadow-md hover:bg-primary hover:text-white transition-all"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
              <div className="flex items-center px-4 font-black italic text-primary underline underline-offset-4">
                0{currentPage}
              </div>
              <button
                className="btn btn-sm rounded-xl px-6 bg-base-100 border-none shadow-md hover:bg-primary hover:text-white transition-all"
                disabled={
                  currentPage >= Math.ceil(filteredEmails.length / itemsPerPage)
                }
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
