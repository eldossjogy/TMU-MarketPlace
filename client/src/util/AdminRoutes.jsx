import { useContext, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../authAndContext/contextApi";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";

const AdminRoutes = () => {
  const { localSession, isLoading, checkIfAdmin } = useContext(AuthContext);

  const [localLoading, setLocalLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminBool = await checkIfAdmin();
        setIsAdmin(adminBool);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }

      setLocalLoading(false)
    };

    fetchData()
  }, [isLoading]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    );
  } else {
    return !localLoading && (
      localSession ? (
        isAdmin ? <Outlet /> : <Navigate to="/unauthorized" replace />
      ) : (
        <Navigate to="/login" replace />
      )
    );
  }
  }
  

export default AdminRoutes;
