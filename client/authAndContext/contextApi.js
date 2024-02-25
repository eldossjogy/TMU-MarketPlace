import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, storage } from "./base"
import { v4 } from 'uuid'
import axios from 'axios'
import { toast } from 'react-toastify';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


    return (
        <AuthContext.Provider value={{}} >
           {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
