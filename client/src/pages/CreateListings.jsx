import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen'
import MyProfileContainer from '../components/MyProfileContainer';
import ListingForm from '../components/ListingForm';

export default function CreateListings() {

    return (
        <div>
            <Navbar />
            <MyProfileContainer>
                <ListingForm/>
            </MyProfileContainer>
        </div>
    );
}
