import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./supabaseConfig";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingScreen from "../components/LoadingScreen";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [localSession, setLocalSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState(null);
  const [userListings, setUserListings] = useState([])

  // loading useState. set it true before api req, and at the end of server req function set it to false
  const [loadingState, setLoadingState] = useState(false);

  //caching/performance useStates:
  const [fetchedUserListings, setFetchedUserListings] = useState(false)
  

  // use effect that subscribes to supabase user events such as on sign in, sign out, etc
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        // if not logged in
        if (session == null) {
          setIsLoading(false);
        }
        setLocalSession(session);
        setIsLoading(false)
      } 
      else if (event === "SIGNED_OUT") {
        console.log(3)
        setLocalSession(null);
        setIsLoading(false)
      } 
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // use effect that updates the user state when local session exists
  useEffect(() => {
    setUser(
      localSession ? (localSession.user ? localSession.user : null) : null
    );
  }, [localSession]);

  // use effect that updates the profileData with data from profile db and pfp link
  useEffect(() => {
    async function getProfile(userID) {
      try {
        let { data: profile, error } = await supabase
          .from("profile")
          .select("*")
          .eq("id", userID);
        return profile;
      } catch (error) {
        toast.error(error);
        return null;
      }
    }
    async function downloadImage(avatar_url) {
      try {
        const timestamp = new Date().getTime();
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(`${avatar_url}?timestamp=${timestamp}`);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        return url;
      } catch (error) {
        toast.error("Error downloading image: ", error);
      }
    }
    async function fetchProfile() {
      if (user) {
        const profileData = await getProfile(user.id);
        const profileImage = await downloadImage(profileData[0].avatar_url);
        let combinedDict = {
          ...user,
          ...profileData[0],
          avatar_url: profileImage,
        };
        setProfileData(combinedDict);
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  // use effect for when profileData changes
  // useEffect(() => {
  // 	console.log(profileData);
  // }, [profileData]);

  // function for registering new account
  async function registerNewAccount(email, password, username) {
    console.log(`${email} ${password}`);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            avatar_url: "",
            name: username,
            postal_code: "",
            role_id: 1,
          },
        },
      });
      if (error)
        return [
          null,
          { success: false, message: "Not Registered", error: error },
        ];
      else {
        setLocalSession(data);
        setUser(data ? (data.user ? data.user : null) : null);
        return [{ success: true, message: "Registered", error: null }, null];
      }
    } catch (error) {
      return [null, { success: false, message: null, error: error }];
    }
  }

  // function for sign in to account
  async function signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error)
        return [
          null,
          { success: false, message: "Not logged in", error: error },
        ];
      else {
        setLocalSession(data);
        setUser(data.user ? data.user : null);
        return [{ success: true, message: "Logged in", error: null }, null];
      }
    } catch (error) {
      return [
        null,
        { success: false, message: "Error logging in", error: error },
      ];
    }
  }

  // function for signing out of account
  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error)
        return [
          null,
          { success: false, message: "Not logged out", error: error },
        ];
      else {
        setLocalSession(null);
        setUser(null);
        setProfileData(null);
        return [{ success: true, message: "Logged out", error: null }, null];
      }
    } catch (error) {
      return [
        null,
        { success: false, message: "Error logging out", error: error },
      ];
    }
  }

  // function that returns link for pfp from supabase bucket
  async function downloadImage(filePath) {
    try {
      const timestamp = new Date().getTime();
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(`${filePath}?timestamp=${timestamp}`);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      return url;
    } catch (error) {
      toast.error("Error downloading image: ", error.message);
    }
  }

  // function that updates the pfp link in profile db
  async function updateProfile(value, userID) {
    try {
      const { data, error } = await supabase
        .from("profile")
        .update({ avatar_url: value })
        .eq("id", userID)
        .select();
    } catch (error) {
      toast.error(error);
    }
  }

  // function that uploads pfp to supbase and updates db and useStates
  async function uploadProfilePicture(file) {
    const fileExt = file.name.split(".").pop().toLowerCase();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload or update file in Supabase storage
    if (file !== undefined) {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) {
        throw uploadError;
      }

      // Update profile db with file path
      updateProfile(filePath, user.id);

      // // Download uploaded image to get its URL
      downloadImage(filePath).then((res) => {
        const currentDate = new Date();
        const dateString = currentDate.toISOString();

        // Update profile and user state
        setProfileData((prev) => ({
          ...prev,
          avatar_url: res,
          updated_at: dateString,
        }));
        setUser((prev) => ({
          ...prev,
          avatar_url: res,
          updated_at: dateString,
        }));
      });
    } else {
      toast.error("Invalid image upload");
    }
  }

  async function uploadImageToBucket(files, bucketName) {
    let imagesPaths = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop().toLowerCase();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload or update file in Supabase storage
      if (file !== undefined) {
        const { data, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, { upsert: true });
        if (uploadError) {
          throw uploadError;
        } else {
          imagesPaths.push(data.fullPath);
        }
      }
    }
    return imagesPaths;
  }

  async function createNewListing(listingInfo, imageList) {
    const checkUser = await supabase.auth.getUser();
    try {
      if (checkUser.data.user !== null) {
        const listOfImages = await uploadImageToBucket(
          imageList,
          "ad-listings"
        );
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_API_URL}/my-market/create-new-listing`,
          {
            ...listingInfo,
            images: listOfImages,
          },
          {
            headers: {
              Authorization: "Bearer " + localSession.access_token,
            },
          }
        );
        navigate("/my-market");
      } else {
        const error = new Error("Unauthorized access!! not a logged in user!!");
        error.status = 403;
        throw error;
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoadingState(false);
  }

  async function fetchMyPostings() {
    try{
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/my-market/my-listings`,
        {
          headers: {
            Authorization: "Bearer " + localSession.access_token,
          },
        }
      )
      setUserListings(response.data)
    }
    catch(error) {
      toast.error(error.message + ". Can't get user listings from db");
    }
    setLoadingState(false)
  }

  // fetch profile picture link from user id
  //  param: userid
  async function fetchAvatar(userID) {
    try {
      const { data: tempData, error:tempError } = await supabase
        .from("profile")
        .select("avatar_url")
        .eq("id", userID);
        let filePath = tempData[0].avatar_url
        if (tempError != null) {
        throw tempError;
      }
      const timestamp = new Date().getTime();
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(`${filePath}?timestamp=${timestamp}`);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        return url;
    } catch (error) {
      toast.error("Error downloading image: ", JSON.stringify(error));
      return "error";
    }
  }
  

  return (
    <AuthContext.Provider
      value={{
        registerNewAccount,
        signIn,
        signOut,
        localSession,
        user: profileData,
        uploadProfilePicture,
        loadingState,
        setLoadingState,
        createNewListing,
        fetchAvatar,
        setFetchedUserListings,
        fetchedUserListings,
        fetchMyPostings,
        userListings,
        localSession
      }}
    >
       {isLoading ? <LoadingScreen /> : children}

    </AuthContext.Provider>
  );
};

export default AuthContext;
