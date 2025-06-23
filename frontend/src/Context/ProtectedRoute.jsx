import { Navigate, Outlet } from "react-router-dom";

// Cookie check function
const getCookie = (name) => {
  const cookieArr = document.cookie.split(";");
  for (let cookie of cookieArr) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) return value;
  }
  return null;
};

const ProtectedRoute = ({ cookieName = "token", redirectPath = "/admin" }) => {
  const token = getCookie(cookieName);

  if (!token) {
    // Cookie/token not found, redirect to login
    return <Navigate to={redirectPath} replace />;
  }

  // Cookie/token exists, render the child routes/components
  return <Outlet />;
};

export default ProtectedRoute;
