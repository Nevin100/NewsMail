import { useState } from "react";
import NewsLetterImage from "../Components/NewsLetterImage.jsx";
import { Mail, Sparkles, Send } from "lucide-react";
import { useAddMailMutation } from "../Redux/Features/Mail.js";
import { toast } from "react-hot-toast";

const NewsLetterPage = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [loading, setloading] = useState(false);
  const [addMail] = useAddMailMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return;
    setloading(true);
    try {
      await addMail({ mail: formData.email }).unwrap();
      setFormData({ email: "" });
      toast.success("Welcome to the inner circle! ");
    } catch (error) {
      if (error?.status === 409) toast.error("You're already on the list! ");
      else toast.error("Server had a hiccup. Try again?");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="grid lg:grid-cols-2 w-full h-full min-h-screen">
        
        {/* Left Side: Form */}
        <div className="flex flex-col justify-center items-center p-8 md:p-16 relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="w-full max-w-md space-y-10 relative z-10">
            <div className="text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} /> AI Powered Insights
              </div>
              <h1 className="text-5xl font-black tracking-tighter">
                Stay <span className="text-primary italic">Ahead.</span>
              </h1>
              <p className="text-base-content/60 text-lg leading-relaxed">
                Get an email summary of breakthrough news, models, and research. 
                Join <span className="text-base-content font-bold">the amazing circle of updated</span> developers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Mail className="h-5 w-5 opacity-40" />
                  </div>
                  <input
                    type="email"
                    className="input input-lg w-full pl-12 bg-base-200 border-none focus:ring-2 focus:ring-primary/50 transition-all rounded-2xl placeholder:text-base-content/30"
                    placeholder="Enter your best email..."
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-lg w-full rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 gap-2 ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {!loading && <Send size={18} />}
                {loading ? "Joining..." : "Subscribe Now"}
              </button>
            </form>

            <p className="text-center text-xs text-base-content/40">
              No spam. Just high-signal tech updates
            </p>
          </div>
        </div>

        {/* Right Side: Visual Section */}
        <NewsLetterImage title="The future of news is personal." />
      </div>
    </div>
  );
};

export default NewsLetterPage;