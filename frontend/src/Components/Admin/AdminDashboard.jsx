/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEnvelope } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaNewspaper } from "react-icons/fa6";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
} from "recharts";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [emails, setEmails] = useState([]);
  const [articles, setArticles] = useState([]);
  const [NewsLetters, setNewsLetters] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [totalSignups, setTotalSignups] = useState(0);
  const [activeTab, setActiveTab] = useState("About");
  const [showSidebar, setShowSidebar] = useState(false);

  const navigate = useNavigate();
  const filterOptions = [30, 45, 60, 120, 180, 365];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://newsmail-2s5a.onrender.com/admin/get-mails"
        );
        setEmails(res.data.data);
        setFilteredEmails(res.data.data);
        setTotalSignups(res.data.data.length);
      } catch (err) {
        console.error("Error fetching mails:", err);
      }
    };

    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          "https://newsmail-2s5a.onrender.com/total-articles"
        );
        setArticles(res.data.data.length);
      } catch (err) {
        console.error("Error fetching mails:", err);
      }
    };
    const fetchNewsLetters = async () => {
      try {
        const res = await axios.get(
          "https://newsmail-2s5a.onrender.com/articles/total-newsletter-formats"
        );
        setNewsLetters(res.data.data.length);
      } catch (err) {
        console.error("Error fetching mails:", err);
      }
    };

    fetchData();
    fetchArticles();
    fetchNewsLetters();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://newsmail-2s5a.onrender.com/admin/admin-logout",
        {
          withCredentials: true,
        }
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
        `https://newsmail-2s5a.onrender.com/admin/delete-mail/${id}`
      );
      toast.success("Mail Deleted Successfully");
      const updated = emails.filter((mail) => mail._id !== id);
      setEmails(updated);
      setFilteredEmails(updated);
      setTotalSignups(updated.length);
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
      email.mail.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmails(filtered);
    setCurrentPage(1);
  };

  const handleDeleteAll = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "All emails will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          "https://newsmail-2s5a.onrender.com/admin/delete-all-mails"
        );
        toast.success("All mails deleted successfully");
        setEmails([]);
        setFilteredEmails([]);
        setTotalSignups(0);

        Swal.fire({
          title: "Deleted!",
          text: "All emails have been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        toast.error("Bulk deletion failed");
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmails = filteredEmails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);

  const groupedByDate = emails.reduce((acc, email) => {
    const date = new Date(email.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(groupedByDate).map(([date, users]) => ({
    date,
    users,
  }));

  const SidebarItem = ({ icon, label, route }) => {
    const isActive = window.location.pathname.includes(route);
    return (
      <button
        onClick={() => navigate(route)}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
          isActive ? "bg-base-200 shadow" : " hover:bg-base-100"
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
          {/* 🍔 Mobile Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Menu</h3>
            <button
              className="text-2xl font-bold bg-base-200 px-3 py-1 rounded"
              onClick={() => setShowSidebar((prev) => !prev)}
            >
              ☰
            </button>
          </div>
          {/* 📱 Mobile Sidebar */}
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
              {[
                "Dashboard",
                "Articles",
                "Send Mail",
                "NewsLetter",
                "Scrape Website",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    navigate(
                      tab === "Dashboard"
                        ? "/"
                        : tab === "Articles"
                        ? "/admin/articles"
                        : tab === "NewsLetter"
                        ? "/admin/newsletter"
                        : tab === "Scrape Website"
                        ? "/admin/scrape"
                        : "/admin/send-mail"
                    )
                  }
                  className={`w-full text-left p-3 rounded-xl text-lg font-medium cursor-pointer ${
                    window.location.pathname.includes(
                      tab.toLowerCase().replace(" ", "-")
                    )
                      ? "bg-base-100"
                      : "hover:bg-base-300 hover:text-white-100"
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
          {/* 💻 Desktop Sidebar */}
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

        {/* Right Side */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          {/* Charts Section on Desktop Only */}
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="bg-base-200 shadow-md p-2 lg:p-7 rounded-xl flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 bg-base-300  rounded-full">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <div>
                <h3 className="lg:text-lg text-sm font-semibold">
                  Total Signups
                </h3>
                <p className="lg:text-xl text-sm mt-2">{totalSignups}</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-base-200 shadow-md p-2 lg:p-7 rounded-xl flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 bg-base-300  rounded-full">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <div>
                <h3 className="lg:text-sm text-sm font-semibold">
                  All Rights Reserved
                </h3>
                <p className="text-sm lg:text-sm text-muted">
                  © 2025 Nevin Bali
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-base-200 shadow-md p-2 lg:p-7 rounded-xl flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 bg-base-300 rounded-full">
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
              </div>
              <div>
                <h3 className="lg:text-lg text-sm font-semibold">
                  News Letters
                </h3>
                <p className="lg:text-xl text-sm mt-2">{NewsLetters}</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-base-200 shadow-md p-2 lg:p-7 rounded-xl flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 bg-base-300  rounded-full">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h4l3 10 4-18 3 8h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="lg:text-lg text-sm font-semibold">Articles</h3>
                <p className="lg:text-xl text-sm mt-2">{articles}</p>
              </div>
            </div>
          </div>

          {/* Charts Container */}
          <div className="flex flex-col lg:flex-row lg:gap-6 gap-6">
            {/* Line Chart */}
            <div className="flex-1 bg-base-200 rounded-xl p-4">
              <h3 className="font-bold text-xl text-center mb-2">
                User Growth 📈
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="flex-1 bg-base-200 rounded-xl p-4">
              <h3 className="font-bold text-xl text-center mb-2">
                Signup Distribution 🥧
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="users"
                    nameKey="date"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#fbbf27"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-wrap gap-4 items-center justify-between lg:m-1 m-3">
            <input
              type="text"
              placeholder="Search email..."
              value={searchQuery}
              onChange={handleSearch}
              className="px-4 py-2 border rounded-md shadow-sm w-full sm:w-1/2 text-md"
            />
            <button
              onClick={handleDeleteAll}
              className="px-5 py-2 cursor-pointer bg-base-300 text-white font-semibold rounded-md hover:bg-red-600 w-full sm:w-auto"
            >
              Delete All
            </button>

            <select
              onChange={(e) => handleDownloadFiltered(e.target.value)}
              className="border px-5 py-2 rounded-md text-lg bg-base-200 shadow-sm"
              defaultValue=""
            >
              <option disabled value="">
                Filter & Download
              </option>
              {filterOptions.map((day) => (
                <option key={day} value={day}>
                  Last {day} days
                </option>
              ))}
            </select>
          </div>

          {/* Email Table */}
          <div className="bg-base-200 shadow-md p-6 rounded-xl">
            <h3 className="text-3xl text-center font-bold mb-4 py-3">
              @ NewsMail Records
            </h3>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-left border rounded-xl">
                <thead>
                  <tr>
                    <th className="border px-4 py-3">S. No.</th>
                    <th className="border px-4 py-3">Email</th>
                    <th className="border px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmails.map((email, index) => (
                    <tr key={email._id}>
                      <td className="border px-4 py-3">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="border px-4 py-3">{email.mail}</td>
                      <td className="border px-4 py-3 text-center space-x-4">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(email._id)}
                        >
                          <FaTrash />
                        </button>
                        <button className="text-green-500 hover:text-green-700">
                          <FaEnvelope />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4 mt-4">
              {currentEmails.map((email, index) => (
                <div
                  key={email._id}
                  className="bg-base-100 p-4 rounded-xl shadow"
                >
                  <h4 className="font-semibold text-lg">
                    #{(currentPage - 1) * itemsPerPage + index + 1}
                  </h4>
                  <p className="text-sm mt-1 break-all">📧 {email.mail}</p>
                  <div className="flex gap-4 mt-3">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(email._id)}
                    >
                      <FaTrash />
                    </button>
                    <button className="text-green-500 hover:text-green-700">
                      <FaEnvelope />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 bg-base-300 hover:bg-base-100 rounded cursor-pointer"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="text-lg font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
                className="px-3 py-1 bg-base-300 hover:bg-base-100 rounded cursor-pointer"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
