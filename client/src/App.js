import "./index.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyProfile from "./pages/MyProfile";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import AccountSettings from "./pages/AccountSettings";
import CreateListings from "./pages/CreateListings";
import PrivateRoutes from "./util/PrivateRoutes";
import ErrorPage from "./pages/ErrorPage";


import { Toaster } from "react-hot-toast";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

function App() {
  return (
    <div id="app" className="">
      <Toaster position="bottom-right" reverseOrder={true} />
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="/my-market">
              <Route index element={<MyProfile />} />
              <Route path="sold-listings" element={<HomePage />} />
              <Route path="create-listing" element={<CreateListings />} />
              <Route path="repost-listings" element={<HomePage />} />
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<ErrorPage />}/>
      </Routes>
    </div>
  );
}

export default App;
