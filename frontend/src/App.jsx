import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import { useThemeStore } from "./Context/useThemeStroe.js";

function App() {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme}>
      <Navbar />
      <main className="min-h-screen max-w-8xl px-4 py-6 font-Montesarrat overflow-hidden  ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
