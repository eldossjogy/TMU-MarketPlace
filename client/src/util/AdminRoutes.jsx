import { useContext, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../authAndContext/contextApi";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";

const AdminRoutes = () => {
  const { localSession, isLoading, checkIfAdmin } = useContext(AuthContext);

  const [localLoading, setLocalLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
        console.log("came here")
      try {
        const adminBool = await checkIfAdmin();
        setIsAdmin(adminBool);
        setLocalLoading(false)
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    setLocalLoading(true)
    fetchData()
  }, [isLoading]);

  if (isLoading || localLoading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    );
  }
  
  return localSession ? (
    isAdmin ? <Outlet /> : <Navigate to="/unauthorized" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoutes;
