import { useState } from "react";
import NewsLetterImage from "../Components/NewsLetterImage.jsx";
import { Mail } from "lucide-react";
import { useAddMailMutation } from "../Redux/Features/Mail.js";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const NewsLetterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [loading, setloading] = useState(false);

  const [addMail] = useAddMailMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return;

    setloading(true);
    try {
      await addMail({ mail: formData.email }).unwrap();
      setFormData({ email: "" });
      toast.success("Successfully Submitted");
    } catch (error) {
      console.error("Failed to subscribe:", error);

      if (error?.status === 409) {
        toast.error("Email already subscribed.");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <div>
      <div className="h-screen grid lg:grid-cols-2">
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <h1 className="text-3xl font-bold mt-4">@NewsMail</h1>
                <h2 className=" text-xl text-base-content/60 mt-4">
                  Get AI tips and drop your email!
                </h2>
                <p className="text-base-content/60">
                  Get an email summary of the latest breakthrough news, models,
                  research, and repos and much more..
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium pb-3">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className={`input input-bordered w-full pl-5`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <NewsLetterImage
          title={"Get tech related news, Just drop your email!"}
        />
      </div>
    </div>
  );
};
export default NewsLetterPage;
