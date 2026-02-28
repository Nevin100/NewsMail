import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import { useThemeStore } from "./Context/useThemeStroe.js";
import { Toaster } from "react-hot-toast";
import Footer from "./Components/Footer.jsx";

function App() {
  const { theme } = useThemeStore();

  return (
    <>
      <Toaster />
      <div data-theme={theme}>
        <Navbar />
        <main className="min-h-screen max-w-8xl px-4 py-6 font-Montesarrat overflow-hidden  ">
          <Outlet />
        </main>
        <Footer/>
      </div>
    </>
  );
}

export default App;
