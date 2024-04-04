import React, { useContext, useEffect } from 'react';
import MyMarketContainer from '../components/MyMarketContainer';
import AuthContext from '../authAndContext/contextApi';
import ChatContext from "../authAndContext/chatProvider";
import ChatList from '../components/ChatList';

export default function CreateListings() {
    const { user } = useContext(AuthContext);
    const { getInbox, inbox } = useContext(ChatContext);

    useEffect(() => {
        if(user) getInbox();
    }, [user])

    return (
        <MyMarketContainer title={"Your Inbox"}>
            <h1 className='hidden md:block w-full shrink-0 text-5xl p-4'>Inbox</h1>
            <ChatList list={inbox} inbox={1}/>
        </MyMarketContainer>
    );
}