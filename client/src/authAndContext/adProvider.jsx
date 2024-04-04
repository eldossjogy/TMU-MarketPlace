import axios from "axios";
import React, { useState, useEffect, createContext } from "react";
import toast from "react-hot-toast";

const AdContext = createContext();

export const AdProvider = ({ children }) => {
  // fetch ads for homepage
  async function fetchHomePage() {
    try {
      const reponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/ad/homepage`
      );
      return reponse.data;
    } catch (error) {
      toast.error("Error fetching ads: ", JSON.stringify(error));
      return null;
    }
  }

  // fetch ad for ad page
  async function fetchAdPage(slug) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/ad`,
        { params: { id: slug } }
      );
      return response.data[0];
    } catch (error) {
      toast.error("Error fetching ads: ", JSON.stringify(error));
      return false;
    }
  }
  ////get3ListingsByID
  async function fetch3ListingsForAdPage(userID) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/ad/similarListings`,
        { params: { get_by_user_id: userID } }
      );
      return response.data;
    } catch (error) {
      toast.error("Error fetching ads: ", JSON.stringify(error));
      return false;
    }
  }

  async function fetchUserAds(userID){
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/ad/user`,
        { params: { user_id: userID } }
      );
      return response.data
    } catch (error) {
      toast.error("Error fetching ads: ", JSON.stringify(error));
      return null;
    }
  }

  async function fetchUserProfile(userName){
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/user`,
        { params: { user_name: userName } }
      );
      if (response.data.error) {
        throw new Error(response.error);
      }
      if (response.data.length === 0) {
        throw new Error(response.error);
      }
      return response.data[0]
    } catch (error) {
      toast.error("Error fetching ads: ", JSON.stringify(error));
      return false;
    }
  }


  return (
    <AdContext.Provider value={{ fetchAdPage, fetchHomePage, fetch3ListingsForAdPage, fetchUserProfile, fetchUserAds}}>
      {children}
    </AdContext.Provider>
  );
};
export default AdContext;
