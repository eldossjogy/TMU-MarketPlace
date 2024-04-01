import "./index.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyMarketPage from "./pages/MyMarketPage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import EditProfile from "./pages/EditProfile";
import PrivateRoutes from "./util/PrivateRoutes";
import AdminRoutes from "./util/AdminRoutes";
import ErrorPage from "./pages/ErrorPage";
import Adpage from "./pages/AdPage";
import EditListingPage from "./pages/EditListingPage";
import CreateListings from "./pages/CreateListings";
import { Toaster } from "react-hot-toast";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

function App() {
  return (
    <div id="app" className="">
      <Toaster position="bottom-right" reverseOrder={true} toastOptions={{duration: 5000}} />
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/ad/:slug" element={<Adpage />} />
          <Route element={<PrivateRoutes loggedIn={false}/>}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<PrivateRoutes loggedIn={true} />}>
            <Route path="/logout" element={<LogoutPage />} />
            {/* <Route path="/settings" element={<Profile />} /> */}
            <Route path="/my-market">
                <Route index element={<MyMarketPage />} />
                <Route path="sold-listings" element={<HomePage />} />
                <Route path="create-listing" element={<CreateListings />} />
                <Route path="edit-listing/:id" element={<EditListingPage />} />
                <Route path="repost-listings" element={<HomePage />} />
                <Route path="profile" element={<EditProfile />} />
            </Route>
          </Route>
          <Route element={<AdminRoutes/>}>
            <Route path="admin-dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<ErrorPage />} />
        <Route path="unauthorized" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
