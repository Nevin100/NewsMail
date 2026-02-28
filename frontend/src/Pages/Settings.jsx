import { THEMES } from "../Constants/index.js";
import { useThemeStore } from "../Context/useThemeStroe.js";
import { Palette, CheckCircle2 } from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-100 transition-all duration-300 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary animate-bounce-slow">
            <Palette size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-base-content">
            Personalize Your <span className="text-primary italic">Vibe</span>
          </h1>
          <p className="text-base-content/60 max-w-md">
            With 32 custom themes, make @NewsMail look exactly how you feel today.
          </p>
        </div>

        {/* Live Preview Section (The "Sexy" Part) */}
        <div className="rounded-[2.5rem] bg-base-200 border border-base-content/5 p-6 md:p-8 shadow-2xl overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Palette size={120} />
           </div>
           
           <h3 className="text-sm font-bold uppercase tracking-widest text-base-content/40 mb-6">Live Preview</h3>
           
           <div className="grid md:grid-cols-2 gap-8 items-center" data-theme={theme}>
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-base-100 shadow-sm border border-base-content/5">
                    <div className="flex gap-2 mb-3">
                       <div className="w-8 h-2 rounded-full bg-primary"></div>
                       <div className="w-4 h-2 rounded-full bg-secondary opacity-50"></div>
                    </div>
                    <h4 className="font-bold text-xl mb-1">Modern NewsMailer</h4>
                    <p className="text-sm text-base-content/70">Building the future of curated newsletters.</p>
                 </div>
                 <div className="flex gap-3">
                    <button className="btn btn-primary btn-sm rounded-xl px-6">Action</button>
                    <button className="btn btn-outline btn-sm rounded-xl">Secondary</button>
                 </div>
              </div>

              {/* Theme Stats Showcase */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                    <div className="text-primary font-black text-2xl">32</div>
                    <div className="text-[10px] uppercase font-bold opacity-60">Total Themes</div>
                 </div>
                 <div className="bg-base-100 p-4 rounded-2xl border border-base-content/5">
                    <div className="text-base-content font-black text-2xl">Active</div>
                    <div className="text-[10px] uppercase font-bold text-primary truncate">{theme}</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Theme Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-base-content/10 pb-4">
             <h2 className="text-xl font-bold">Select Theme</h2>
             <span className="badge badge-primary badge-outline font-bold uppercase py-3">{theme}</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`
                  relative group flex flex-col gap-3 p-3 rounded-2xl transition-all duration-300 border-2
                  ${theme === t 
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-105" 
                    : "border-transparent bg-base-200 hover:border-base-content/20 hover:scale-105"}
                `}
                onClick={() => setTheme(t)}
              >
                {/* Active Checkmark */}
                {theme === t && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-content rounded-full p-0.5 z-10 shadow-md">
                    <CheckCircle2 size={16} />
                  </div>
                )}

                <div className="h-12 w-full rounded-xl overflow-hidden shadow-inner" data-theme={t}>
                  <div className="flex h-full w-full">
                    <div className="w-1/4 bg-primary"></div>
                    <div className="w-1/4 bg-secondary"></div>
                    <div className="w-1/4 bg-accent"></div>
                    <div className="w-1/4 bg-neutral"></div>
                  </div>
                </div>
                
                <span className="text-[10px] font-black uppercase tracking-wider truncate w-full text-center group-hover:text-primary transition-colors">
                  {t}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;