/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash, FaEnvelope } from "react-icons/fa";
import { FaNewspaper } from "react-icons/fa6";

const SendMail = () => {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://newsmail-2s5a.onrender.com/admin/get-mails"
        );
        const sortedData = res.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setEmails(sortedData);
        setFilteredEmails(sortedData);

        setFilteredEmails(res.data.data);
      } catch (err) {
        console.error("Error fetching mails:", err);
      }
    };
    fetchData();
  }, []);

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
      toast.error("Logout unsuccessful!");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This email will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://newsmail-2s5a.onrender.com/admin/delete-mail/${id}`
        );
        toast.success("Mail Deleted Successfully");
        const updated = emails.filter((mail) => mail._id !== id);
        setEmails(updated);
        setFilteredEmails(updated);
        Swal.fire({
          title: "Deleted!",
          text: "The email has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        toast.error("Mail Deletion Unsuccessful");
      }
    }
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

  const handleSendMail = async (email) => {
    try {
      const res = await axios.post(
        "https://newsmail-2s5a.onrender.com/admin/send-newsletter",
        {
          to: email,
          subject: "NewsMailer Newsletter 📰",
        },
        { withCredentials: true }
      );

      if (!res.data.error) {
        toast.success("Email sent successfully!");
      } else {
        toast.error(res.data.message || "Email sending failed");
      }
    } catch (error) {
      console.error("Send Mail Error:", error);
      toast.error("Failed to send email");
    }
  };

  const handleCheckboxChange = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleBulkSend = async () => {
    if (selectedEmails.length === 0) {
      toast.error("No emails selected!");
      return;
    }

    try {
      const res = await axios.post(
        "https://newsmail-2s5a.onrender.com/admin/send-newsletter",
        {
          bcc: selectedEmails,
          subject: "NewsMailer Newsletter 📰",
        },
        { withCredentials: true }
      );

      if (!res.data.error) {
        toast.success("Bulk email sent successfully!");
      } else {
        toast.error(res.data.message || "Bulk email sending failed");
      }
    } catch (error) {
      console.error("Bulk Send Mail Error:", error);
      toast.error("Failed to send bulk email");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmails = filteredEmails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);

  return (
    <div className="p-4 md:p-6 mt-14 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
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
              className="mt-6 text-lg cursor-pointer text-red-500 font-semibold hover:text-red-700"
            >
              Logout
            </button>
          </div>

          {/* Desktop Sidebar */}
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

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-base-200 shadow-md p-6 rounded-xl">
            <h3 className="text-3xl text-center font-bold mb-4 py-3">
              @ NewsMail Records
            </h3>
            {/* Delete All Button */}

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleBulkSend}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow cursor-pointer"
              >
                Send Bulk Mail
              </button>
              {selectedEmails.length > 0 && (
                <p className="text-md mt-1">
                  {selectedEmails.length} selected for bulk email.
                </p>
              )}

              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow cursor-pointer"
              >
                Delete All
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-left border rounded-xl">
                <thead>
                  <tr>
                    <th className="border px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={() => {
                          setSelectAll((prev) => {
                            const newSelectAll = !prev;

                            if (newSelectAll) {
                              const currentPageEmails = filteredEmails
                                .slice(indexOfFirstItem, indexOfLastItem)
                                .map((email) => email.mail);
                              setSelectedEmails((prevSelected) => [
                                ...new Set([
                                  ...prevSelected,
                                  ...currentPageEmails,
                                ]),
                              ]);
                            } else {
                              const currentPageEmails = filteredEmails
                                .slice(indexOfFirstItem, indexOfLastItem)
                                .map((email) => email.mail);
                              setSelectedEmails((prevSelected) =>
                                prevSelected.filter(
                                  (email) => !currentPageEmails.includes(email)
                                )
                              );
                            }

                            return newSelectAll;
                          });
                        }}
                      />
                    </th>
                    <th className="border px-4 py-3">S. No.</th>
                    <th className="border px-4 py-3">Email</th>
                    <th className="border px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmails.map((email, index) => (
                    <tr key={email._id}>
                      <td className="border px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(email.mail)}
                          onChange={() => handleCheckboxChange(email.mail)}
                        />
                      </td>
                      <td className="border px-4 py-3">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="border px-4 py-3">{email.mail}</td>
                      <td className="border px-4 py-3 text-center space-x-4">
                        <button
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={() => handleDelete(email._id)}
                        >
                          <FaTrash />
                        </button>
                        <button
                          className="text-green-500 hover:text-green-700 cursor-pointer"
                          onClick={() => handleSendMail(email.mail)}
                        >
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
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => handleDelete(email._id)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700 cursor-pointer"
                      onClick={() => handleSendMail(email.mail)}
                    >
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

export default SendMail;
