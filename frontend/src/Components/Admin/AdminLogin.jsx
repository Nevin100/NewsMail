import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import instance from "../../Util/axios.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password)
      return toast.error("Fill all fields");

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await instance.post("/admin/admin-login", formData);
      toast.success("Login Successful!");
      navigate("/admin-dashboard"); // protected route
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-hidden">
      {/* Left Image */}
      <div className="hidden lg:block relative">
        <img
          src="https://www.shutterstock.com/image-vector/secure-login-icon-representing-privacy-260nw-2634921917.jpg"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-40" />
      </div>

      {/* Right Form */}
      <div className="flex flex-col justify-center items-center px-6 sm:px-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Admin Login</h1>
            <p className="text-gray-500 lg:mt-3 mt-4">
              Enter your credentials to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 input input-bordered"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 input input-bordered"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
