import { useContext, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../authAndContext/contextApi";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";

const PrivateRoutes = ({loggedIn}) => {
  const { localSession, isLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    );
  }
  if (loggedIn) {
    return localSession ? <Outlet /> : <Navigate to="/login" />;
  }
  else {
    return !localSession ? <Outlet /> : <Navigate to="/" />;
  }
};

export default PrivateRoutes;
