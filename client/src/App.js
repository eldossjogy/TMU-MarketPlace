import "./index.css";
import React, {lazy, Suspense} from "react";
import { Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

const HomePage = lazy(() => import("./pages/HomePage"));
const MyMarketPage = lazy(() => import('./pages/MyMarketPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const LogoutPage = lazy(() => import('./pages/LogoutPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const InboxPage = lazy(() => import('./pages/InboxPage'));
const OutboxPage = lazy(() => import('./pages/OutboxPage'));
const PrivateRoutes = lazy(() => import('./util/PrivateRoutes'));
const AdminRoutes = lazy(() => import('./util/AdminRoutes'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const AdvertisementPages = lazy(() => import('./pages/AdvertisementPages'));
const EditListingPage = lazy(() => import('./pages/EditListingPage'));
const CreateListings = lazy(() => import('./pages/CreateListings'));
const SavedPage = lazy(() => import('./pages/SavedPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const UserPage = lazy(() => import('./pages/UserPage'))
const MyUserProfile = lazy(() => import('./pages/MyUserProfile'))


library.add(fas);

function App() {
  return (
    <div id="app" className="">
      <Toaster position="bottom-right" reverseOrder={true} toastOptions={{ duration: 5000 }} />
      <Routes>
        <Route path="/">
          <Route index element={<Suspense fallback={<h1>Loading...</h1>}><HomePage /></Suspense>} />
          <Route path="/search" element={<Suspense fallback={<h1>Loading...</h1>}><SearchPage /></Suspense>} />
          <Route path="/ad/:slug" element={<Suspense fallback={<h1>Loading...</h1>}><AdvertisementPages /></Suspense>} />
          <Route path="/u/:username" element={<Suspense fallback={<h1>Loading...</h1>}><UserPage /></Suspense>} />
          <Route element={<Suspense fallback={<h1>Loading...</h1>}><PrivateRoutes loggedIn={false}/></Suspense>}>
            <Route path="/login" element={<Suspense fallback={<h1>Loading...</h1>}><LoginPage /></Suspense>} />
            <Route path="/register" element={<Suspense fallback={<h1>Loading...</h1>}><RegisterPage /></Suspense>} />
          </Route>
          <Route element={<Suspense fallback={<h1>Loading...</h1>}><PrivateRoutes loggedIn={true}/></Suspense>}>
            <Route path="/logout" element={<Suspense fallback={<h1>Loading...</h1>}><LogoutPage /></Suspense>} />
            <Route path="/my-market">
                <Route index element={<Suspense fallback={<h1>Loading...</h1>}><MyMarketPage /></Suspense>} />
                <Route path="sold-listings" element={<HomePage />} />
                <Route path="create-listing" element={<Suspense fallback={<h1>Loading...</h1>}><CreateListings /></Suspense>} />
                <Route path="edit-listing/:id" element={<Suspense fallback={<h1>Loading...</h1>}><EditListingPage /></Suspense>} />
                <Route path="repost-listings" element={<HomePage />} />
                <Route path="profile" element={<Suspense fallback={<h1>Loading...</h1>}><MyUserProfile /></Suspense>} />
                <Route path="edit-profile" element={<Suspense fallback={<h1>Loading...</h1>}><EditProfile /></Suspense>} />
                <Route path="inbox" element={<Suspense fallback={<h1>Loading...</h1>}><InboxPage /></Suspense>} />
                <Route path="outbox" element={<Suspense fallback={<h1>Loading...</h1>}><OutboxPage /></Suspense>} />
                <Route path="history" element={<Suspense fallback={<h1>Loading...</h1>}><HistoryPage /></Suspense>} />
                <Route path="saved" element={<SavedPage />} />
            </Route>
          </Route>
          <Route element={<Suspense fallback={<h1>Loading...</h1>}><AdminRoutes/></Suspense>}>
            <Route path="admin-dashboard" element={<Suspense fallback={<h1>Loading...</h1>}><AdminDashboard /></Suspense>} />
          </Route>
        </Route>
        <Route path="*" element={<ErrorPage />} />
        <Route path="unauthorized" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
