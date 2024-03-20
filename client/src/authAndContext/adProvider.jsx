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

  return (
    <AdContext.Provider value={{ fetchAdPage, fetchHomePage }}>
      {children}
    </AdContext.Provider>
  );
};
export default AdContext;
