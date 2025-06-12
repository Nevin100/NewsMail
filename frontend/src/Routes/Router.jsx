import { createBrowserRouter } from "react-router-dom";
import NewsLetterPage from "../Pages/NewsLetterPage.jsx";
import App from "../App.jsx";
import Settings from "../Pages/Settings.jsx";
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
    ],
  },
]);

export default router;
