/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEnvelope } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [totalSignups, setTotalSignups] = useState(0);
  const [views, setViews] = useState(0);
  const [activeTab, setActiveTab] = useState("About");
  const [showSidebar, setShowSidebar] = useState(false);

  const navigate = useNavigate();
  const filterOptions = [30, 45, 60, 120, 180, 365];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/get-mails");
        setEmails(res.data.data);
        setFilteredEmails(res.data.data);
        setTotalSignups(res.data.data.length);
      } catch (err) {
        console.error("Error fetching mails:", err);
      }
    };

    fetchData();
    setViews(127);
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/admin/delete-mail/${id}`);
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
        await axios.delete("http://localhost:8000/admin/delete-all-mails");
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

  return (
    <div className="p-4 md:p-6 mt-14 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Hamburger Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Menu</h3>
            <button
              className="text-2xl font-bold bg-base-200 px-3 py-1 rounded"
              onClick={() => setShowSidebar((prev) => !prev)}
            >
              ☰
            </button>
          </div>

          <div
            className={`${
              showSidebar ? "block" : "hidden"
            } lg:block bg-base-200 p-6 rounded-xl`}
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
              {["Dashboard", "About", "Create Mail", "Send Mail"].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    navigate(
                      tab === "Dashboard"
                        ? "/admin/dashboard"
                        : tab === "About"
                        ? "/admin/about"
                        : tab === "Create Mail"
                        ? "/admin/create-mail"
                        : "/admin/send-mail"
                    )
                  }
                  className={`w-full text-left p-3 rounded-xl text-lg font-medium cursor-pointer ${
                    window.location.pathname.includes(
                      tab.toLowerCase().replace(" ", "-")
                    )
                      ? "bg-base-100 "
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

            {/* Line Chart only on desktop */}
          </div>
          <div className="mt-5 hidden lg:block bg-base-200 p-4 rounded-xl shadow-md">
            <h3 className="font-bold text-center mb-4">User Growth 📈</h3>
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
        </div>

        {/* Right Side */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-base-200 shadow-md p-4 lg:p-14 rounded-xl">
              <h3 className="lg:text-2xl text-xl font-semibold">
                Total Signups
              </h3>
              <p className="lg:text-4xl text-xl mt-2">{totalSignups}</p>
            </div>
            <div className="bg-base-200 shadow-md  p-4 lg:p-14 flex justify-center items-center rounded-xl">
              <h3 className="lg:text-3xl text-xl font-semibold">
                2025 All Rights Reserved @Nevin Bali
              </h3>
            </div>
          </div>

          {/* Line chart on mobile (after cards) */}
          <div className="lg:hidden bg-base-200 rounded-xl p-4">
            <h3 className="font-bold lg:text-3xl text-xl text-center mb-2">
              User Growth
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-wrap gap-4 items-center justify-between lg:m-7 m-3">
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
