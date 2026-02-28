/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaTrash, FaEnvelope, FaUsers, FaCheckDouble, FaPaperPlane, FaUserShield } from "react-icons/fa";
import { FaNewspaper, FaBookOpen } from "react-icons/fa6";

const SendMail = () => {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://newsmail-2s5a.onrender.com/admin/get-mails");
        const sortedData = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setEmails(sortedData);
        setFilteredEmails(sortedData);
      } catch (err) { console.error("Error:", err); }
    };
    fetchData();
  }, []);

  
  const handleBulkSend = async () => {
    if (selectedEmails.length === 0) return toast.error("Select subscribers first! 🎯");
    const mailToast = toast.loading(`Dispatching to ${selectedEmails.length} souls...`);
    try {
      await axios.post("https://newsmail-2s5a.onrender.com/admin/send-newsletter", {
        bcc: selectedEmails,
        subject: "Your Daily Dose of NewsMail ",
      }, { withCredentials: true });
      toast.success("Newsletter Blasted Successfully! ", { id: mailToast });
      setSelectedEmails([]);
    } catch (error) { toast.error("Launch failed.", { id: mailToast }); }
  };

  const SidebarItem = ({ icon, label, route }) => (
    <button
      onClick={() => navigate(route)}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
        window.location.pathname === route ? "bg-primary text-primary-content shadow-lg shadow-primary/30" : "hover:bg-base-200 opacity-70"
      }`}
    >
      {icon} <span className="text-md">{label}</span>
    </button>
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmails = filteredEmails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8 mt-12 relative pb-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8">
        
        {/* Consistent Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="p-6 bg-primary/10 rounded-[2rem] text-center group">
            <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center text-primary-content shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
              <FaUserShield size={28} />
            </div>
            <h2 className="font-black text-xl italic tracking-tighter">Command</h2>
          </div>
          <nav className="flex flex-col gap-2">
            <SidebarItem icon={<FaNewspaper />} label="Dashboard" route="/admin-dashboard" />
            <SidebarItem icon={<FaBookOpen />} label="Articles" route="/admin/articles" />
            <SidebarItem icon={<FaEnvelope />} label="Send Mail" route="/admin/send-mail" />
            <SidebarItem icon={<FaPaperPlane />} label="Scrape" route="/admin/scrape" />
          </nav>
        </aside>

        {/* Subscriber Management Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-base-200 p-8 rounded-[2.5rem] border border-base-content/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tighter italic">Subscribers</h1>
              <p className="text-xs uppercase font-bold tracking-widest opacity-40">Direct Mail Management</p>
            </div>
            <button onClick={() => setSelectedEmails(filteredEmails.map(e => e.mail))} className="btn btn-ghost rounded-xl gap-2 text-primary font-bold">
              <FaCheckDouble /> Select All
            </button>
          </div>

          <div className="bg-base-200 rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-base-content/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.2em] opacity-40 border-none">
                    <th className="w-10">Select</th>
                    <th>User identity</th>
                    <th className="text-center">Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmails.map((email) => (
                    <tr key={email._id} className={`group bg-base-100 shadow-sm rounded-2xl transition-all hover:translate-x-1 ${selectedEmails.includes(email.mail) ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                      <td className="rounded-l-2xl border-none">
                        <input 
                          type="checkbox" 
                          className="checkbox checkbox-primary rounded-lg ml-2" 
                          checked={selectedEmails.includes(email.mail)}
                          onChange={() => setSelectedEmails(prev => prev.includes(email.mail) ? prev.filter(e => e !== email.mail) : [...prev, email.mail])}
                        />
                      </td>
                      <td className="border-none">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center font-black text-primary italic">
                            {email.mail[0].toUpperCase()}
                          </div>
                          <span className="font-bold text-sm truncate max-w-[200px]">{email.mail}</span>
                        </div>
                      </td>
                      <td className="rounded-r-2xl text-center border-none">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => {/* single send */}} className="btn btn-ghost btn-sm text-primary hover:bg-primary/10 rounded-xl"><FaEnvelope /></button>
                          <button onClick={() => {/* delete */}} className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 rounded-xl"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-10 px-4">
              <p className="text-xs font-bold opacity-30 uppercase tracking-widest">Page {currentPage} of {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="btn btn-sm rounded-xl bg-base-100 shadow-md">Back</button>
                <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="btn btn-sm rounded-xl bg-base-100 shadow-md">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sexy Floating Action Bar (Visible when emails selected) */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${selectedEmails.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="bg-neutral text-neutral-content px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-8 backdrop-blur-xl bg-opacity-90 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-primary-content animate-pulse">
              <FaUsers size={20} />
            </div>
            <div>
              <p className="text-xl font-black italic leading-none">{selectedEmails.length}</p>
              <p className="text-[10px] uppercase font-bold opacity-60">Selected</p>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-white/10"></div>
          <div className="flex gap-3">
             <button onClick={() => setSelectedEmails([])} className="btn btn-ghost btn-sm rounded-xl hover:bg-white/5 uppercase text-[10px] font-black tracking-widest">Cancel</button>
             <button onClick={handleBulkSend} className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/30 flex items-center gap-2">
                Launch Campaign <FaPaperPlane />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMail;