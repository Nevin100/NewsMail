import { createBrowserRouter } from "react-router-dom";
import HomePage from "../Pages/HomePage.jsx";
import CalendlyPage from "../Pages/CalendlyPage.jsx";
import GoalsExtensionPage from "../Pages/GoalsExtensionPage.jsx";
import LifeCookbook from "../Pages/LifeCookbook.jsx";
import NewsLetterPage from "../Pages/NewsLetterPage.jsx";
import RedPillPage from "../Pages/RedPillPage.jsx";
import StatisticsPage from "../Pages/StatisticsPage.jsx";
import App from "../App.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/Calendly-Page",
        element: <CalendlyPage />,
      },
      {
        path: "/GoalsExtensionPage",
        element: <GoalsExtensionPage />,
      },
      {
        path: "/LifeCookbook",
        element: <LifeCookbook />,
      },
      {
        path: "/NewsLetterPage",
        element: <NewsLetterPage />,
      },
      {
        path: "/RedPillPage",
        element: <RedPillPage />,
      },
      {
        path: "/StatisticsPage",
        element: <StatisticsPage />,
      },
    ],
  },
]);

export default router;
