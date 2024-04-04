//should render the navbar, marketsidebar, profile
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdContext from "../authAndContext/adProvider";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import AuthContext from "../authAndContext/contextApi";
import SearchContext from "../authAndContext/searchProvider";
import Avatar from "../components/Avatar";
import MyMarketContainer from "../components/MyMarketContainer";
import MyProfile from "../components/MyProfile";

export default function MyUserProfile() {
    const { user } = useContext(AuthContext)

    return (
        <>
            <MyMarketContainer>
                {user ?  <MyProfile forcedUsername={user.name}/> : <Loading/>}
               
            </MyMarketContainer>

        </>


    )
}