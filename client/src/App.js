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
import ErrorPage from "./pages/ErrorPage";
import Adpage from "./pages/AdPage";
import EditListingPage from "./pages/EditListingPage";
import InboxPage from './pages/InboxPage';
import CreateListings from "./pages/CreateListings";
import { Toaster } from "react-hot-toast";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import HistoryPage from "./pages/HistoryPage";
import SavedPage from "./pages/SavedPage";

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
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route element={<PrivateRoutes loggedIn={false} />}>
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
                <Route path="inbox" element={<InboxPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="saved" element={<SavedPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
