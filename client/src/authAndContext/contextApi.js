import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
