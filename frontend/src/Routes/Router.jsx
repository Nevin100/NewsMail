import { createBrowserRouter } from "react-router-dom";
import NewsLetterPage from "../Pages/NewsLetterPage.jsx";
import App from "../App.jsx";
import Settings from "../Pages/Settings.jsx";
import ProtectedRoute from "../Context/Protectedroute.jsx";
import AdminDashboard from "../Components/Admin/AdminDashboard.jsx";
import AdminLogin from "../Components/Admin/AdminLogin.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <NewsLetterPage />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/admin",
        element: <AdminLogin />,
      },
      {
        path: "/admin-dashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
