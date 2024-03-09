import React, { useState, useEffect, createContext } from "react";
import supabase from "./supabaseConfig";
import axios from 'axios'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [localSession, setLocalSession] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loadingState, setLoadingState] = useState(false)

  // use effect that subscribes to supabase user events such as on sign in, sign out, etc
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLocalSession(session);
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setLocalSession(null);
        setUser(null);
      } else {
        setLocalSession(session);
        setUser(
          localSession ? (localSession.user ? localSession.user : null) : null
        );
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
        alert(error);
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
        alert("Error downloading image: ", error.message);
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
      }
    }
    fetchProfile();
  }, [user]);

  // function for registering new account
  async function registerNewAccount(email, password, username) {
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
      alert("Error downloading image: ", error.message);
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
      // console.log(data, error);
    } catch (error) {
      alert(error);
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
      alert("Invalid image upload");
    }
  }

  async function createNewListing(listingInfo, imageList) {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/my-market/create-new-listing`,
        {
          listingInfo
        },
        {
          headers: {
          Authorization: localSession.token_type + ' ' + localSession.access_token
          }
        }
      )
    } catch (error) {
      alert(error)
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
        createNewListing
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
