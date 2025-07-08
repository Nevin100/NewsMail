import { createBrowserRouter } from "react-router-dom";
import NewsLetterPage from "../Pages/NewsLetterPage.jsx";
import App from "../App.jsx";
import Settings from "../Pages/Settings.jsx";
import ProtectedRoute from "../Context/Protectedroute.jsx";
import AdminDashboard from "../Components/Admin/AdminDashboard.jsx";
import AdminLogin from "../Components/Admin/AdminLogin.jsx";
import About from "../Components/Admin/About.jsx";
import Articles from "../Components/Admin/Articles.jsx";
import SendMail from "../Components/Admin/SendMail.jsx";
import NewsLetter from "../Components/Admin/NewsLetter.jsx";
import ScrapeWebsite from "../Components/Admin/ScrapeWebsite.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <NewsLetterPage /> },
      { path: "/settings", element: <Settings /> },
      { path: "/admin", element: <AdminLogin /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "/admin-dashboard", element: <AdminDashboard /> },
          { path: "/admin/about", element: <About /> },
          { path: "/admin/articles", element: <Articles /> },
          { path: "/admin/send-mail", element: <SendMail /> },
          { path: "/admin/newsLetter", element: <NewsLetter /> },
          { path: "/admin/scrape", element: <ScrapeWebsite /> },
        ],
      },
    ],
  },
]);

export default router;
