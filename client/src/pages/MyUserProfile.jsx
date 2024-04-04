//should render the navbar, marketsidebar, profile
import React, { useContext} from "react";
import Loading from "../components/Loading";
import AuthContext from "../authAndContext/contextApi";
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