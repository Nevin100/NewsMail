import { useState } from "react";
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import instance from "../../Util/axios.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await instance.post(
        "https://newsmail-2s5a.onrender.com/admin/admin-login",
        formData
      );
      toast.success("Welcome back, Commander! 🫡");
      navigate("/admin-dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen mt-4 flex items-center justify-center bg-base-100 relative overflow-hidden px-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-base-200/50 backdrop-blur-xl border border-base-content/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-base-content">
              Admin <span className="text-primary italic">Portal</span>
            </h1>
            <p className="text-base-content/50 mt-2 font-medium">
              Access the NewsMail nerve center
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-bold opacity-70">Email Address</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="admin@newsmail.com"
                  className="input input-bordered w-full pl-12 bg-base-100 border-none ring-1 ring-base-content/10 focus:ring-2 focus:ring-primary/50 transition-all rounded-xl h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-bold opacity-70">Security Key</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-12 pr-12 bg-base-100 border-none ring-1 ring-base-content/10 focus:ring-2 focus:ring-primary/50 transition-all rounded-xl h-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/30 hover:text-base-content transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary w-full h-12 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group mt-4"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <div className="flex items-center gap-2 font-bold tracking-wide">
                  Authorize Access <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <p className="mt-8 text-center text-xs font-medium text-base-content/30 uppercase tracking-[0.2em]">
            Restricted Area • Auth Req.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;