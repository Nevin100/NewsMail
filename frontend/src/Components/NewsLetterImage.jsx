import { Mail } from "lucide-react";

const NewsLetterImage = ({ title }) => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-base-200 relative overflow-hidden p-12">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full"></div>

      <div className="relative w-full max-w-lg">
        {/* Sexy Grid Layout */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-[2rem] shadow-inner transition-all duration-700
                ${i % 2 === 0 ? "bg-primary/20 animate-pulse" : "bg-base-300"}
                ${i === 4 ? "bg-primary scale-110 shadow-2xl shadow-primary/40" : ""}
                hover:scale-105 hover:rotate-3
              `}
              style={{
                animationDelay: `${i * 150}ms`,
              }}
            >
              {i === 4 && (
                <div className="w-full h-full flex items-center justify-center text-primary-content">
                   <Mail size={40} strokeWidth={2.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center space-y-4 relative">
          <h2 className="text-4xl font-black leading-tight text-base-content">
            {title}
          </h2>
          <div className="flex justify-center gap-2">
            <span className="h-1.5 w-12 rounded-full bg-primary"></span>
            <span className="h-1.5 w-4 rounded-full bg-primary/30"></span>
            <span className="h-1.5 w-4 rounded-full bg-primary/30"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetterImage;