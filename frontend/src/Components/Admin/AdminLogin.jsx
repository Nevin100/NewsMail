import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import instance from "../../Util/axios.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  // Form state to handle email and password
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // Make API call to login admin
      await instance.post(
        "https://newsmail-2s5a.onrender.com/admin/admin-login",
        formData
      );

      toast.success("Login Successful!");
      navigate("/admin-dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-1 ">
      <div className="flex flex-col justify-center items-center px-6 sm:px-12 bg-base-500">
        <div className="w-full max-w-md space-y-8 bg-neutral-800 m-4 p-10 rounded-2xl">
          <div className="text-center">
            <h1 className="lg:text-6xl md:text-4xl text-3xl mb-8 font-bold  ">
              Admin{" "}
            </h1>
            <p className=" lg:mt-3 mt-4 text-md">
              Enter your credentials to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block mb-2 font-medium ">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="w-full pl-10 input input-bordered text-md"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label htmlFor="password" className="block mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="w-full pl-10 input input-bordered text-md"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full my-4">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
