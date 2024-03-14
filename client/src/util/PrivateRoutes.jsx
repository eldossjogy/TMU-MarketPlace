import { useContext, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../authAndContext/contextApi";
import Loading from "./Loading";

const PrivateRoutes = ({loggedIn}) => {
  const { user, isLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);
  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }
  if (loggedIn) {
    return user ? <Outlet /> : <Navigate to="/login" />;
  }
  else {
    return !user ? <Outlet /> : <Navigate to="/" />;
  }
};

export default PrivateRoutes;
