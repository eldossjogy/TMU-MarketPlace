import "./index.css";
import React, {lazy, Suspense} from "react";
import { Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import LoadingScreen from "./components/LoadingScreen";

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
    <div id="app" class="min-h-screen flex flex-col">
      <main class="flex-grow">
      <Toaster position="bottom-right" reverseOrder={true} toastOptions={{ duration: 5000 }} />
      <Routes>
        <Route path="/">
          <Route index element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><HomePage /></Suspense>} />
          <Route path="/search" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><SearchPage /></Suspense>} />
          <Route path="/ad/:slug" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><AdvertisementPages /></Suspense>} />
          <Route path="/u/:username" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><UserPage /></Suspense>} />
          <Route element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><PrivateRoutes loggedIn={false}/></Suspense>}>
            <Route path="/login" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><LoginPage /></Suspense>} />
            <Route path="/register" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><RegisterPage /></Suspense>} />
          </Route>
          <Route element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><PrivateRoutes loggedIn={true}/></Suspense>}>
            <Route path="/logout" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><LogoutPage /></Suspense>} />
            <Route path="/my-market">
                <Route index element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><MyMarketPage /></Suspense>} />
                <Route path="sold-listings" element={<HomePage />} />
                <Route path="create-listing" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><CreateListings /></Suspense>} />
                <Route path="edit-listing/:id" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><EditListingPage /></Suspense>} />
                <Route path="repost-listings" element={<HomePage />} />
                <Route path="profile" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><MyUserProfile /></Suspense>} />
                <Route path="edit-profile" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><EditProfile /></Suspense>} />
                <Route path="inbox" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><InboxPage /></Suspense>} />
                <Route path="outbox" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><OutboxPage /></Suspense>} />
                <Route path="history" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><HistoryPage /></Suspense>} />
                <Route path="saved" element={<SavedPage />} />
            </Route>
          </Route>
          <Route element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><AdminRoutes/></Suspense>}>
            <Route path="admin-dashboard" element={<Suspense fallback={<LoadingScreen message={'Loading...'}/>}><AdminDashboard /></Suspense>} />
          </Route>
        </Route>
        <Route path="*" element={<ErrorPage />} />
        <Route path="unauthorized" element={<ErrorPage />} />
      </Routes> 
      </main>
      <footer className="text-center py-4">
        <div className="mx-auto text-gray-600">
                <h4 >Made with ❤️ by <a href="https://github.com/aminnausin" target="_blank" rel="noreferrer">Amin Nausin</a>,{" "}
                <a href="https://github.com/muyeed10" target="_blank" rel="noreferrer">Muyeed Hossain,{" "}
                  </a> 
                <a href="https://github.com/eldossjogy" target="_blank" rel="noreferrer">Eldoss Jogy,{" "}
                  </a>
                <a href="https://github.com/Emil-mm" target="_blank" rel="noreferrer">Emily mm,{" "}
                  </a>
                <a href="https://github.com/jasminejj08" target="_blank" rel="noreferrer">Jasmine jj,{" "}
                  </a> </h4>
                <p >&copy; 2024 TMU MarketPlace. All rights reserved.</p>
        </div>
    </footer>
    </div>
  );
}

export default App;
