import { useEffect, useState } from "react";
import instance from "../Util/axios.js";
import { Navigate, Outlet } from "react-router-dom";

const Protectedroute = () => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await instance.get("/admin/verify-token");
        setIsAuth(true);
      } catch (error) {
        console.log(error);
        setIsAuth(false);
      }
    };

    verifyUser();
  }, []);

  if (isAuth === null) {
    return <div className="text-center mt-10">Loading .... </div>;
  }
  if (!isAuth ) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet/>;
};

export default Protectedroute;
