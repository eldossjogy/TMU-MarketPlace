import React, { useContext, useEffect } from 'react';
import MyMarketContainer from '../components/MyMarketContainer';
import AuthContext from '../authAndContext/contextApi';
import ChatContext from "../authAndContext/chatProvider";
import ChatList from '../components/ChatList';

export default function CreateListings() {
    const { user } = useContext(AuthContext);
    const { getInbox, inbox } = useContext(ChatContext);

    useEffect(() => {
        if(user) getInbox(2);
    }, [user])

    return (
        <MyMarketContainer title={"Your Outbox"}>
            <h1 className='hidden md:block w-full shrink-0 text-5xl p-4'>Outbox</h1>
            <ChatList list={inbox} inbox={2}/>
        </MyMarketContainer>
    );
}