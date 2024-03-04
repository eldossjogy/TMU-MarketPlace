import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../authAndContext/contextApi'

export default function ProfilePicture() {

    const [url, setURL] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if(user) setURL('./assets/avatars/12345.jpg')
        else setURL(null)
    }, [user])
    
    if(url){
        return (
            <img src={`${url}`} className="h-6 w-6 rounded-full ring-2 ring-orange-600/60 shadow-lg shrink-0" alt='profile picture'></img>
        )
    }
    else{
        return (
            <></>
        )
    }
}