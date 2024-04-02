import { Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

const SuspenseRoutes = () => {
    <Suspense fallback={<LoadingScreen message={"Loading Page..."} />}>
        //put route component here
    </Suspense>
};

export default SuspenseRoutes;
