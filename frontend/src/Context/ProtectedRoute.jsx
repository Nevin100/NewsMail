/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import instance from "../Util/axios.js";
import { Navigate, Outlet } from "react-router-dom";

const Protectedroute = () => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await instance.get(
          "https://newsmail-2s5a.onrender.com/admin/verify-token"
        );
        setIsAuth(true);
      } catch (error) {
        console.log(error);
        setIsAuth(false);
      }
    };

    verifyUser();
  }, []);

  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="animate-spin h-12 w-12 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default Protectedroute;
