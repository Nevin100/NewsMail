import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { AtSign } from "lucide-react";
import { FcAbout } from "react-icons/fc";

const Navbar = () => {
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <AtSign className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">NewsMail</h1>
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <Link
              to="/admin"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <AtSign className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Admin</h1>
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <Link
              to="/about"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FcAbout className="w-5 h-5 text-primary" />
              </div>
              <span className="hidden sm:inline">About</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
