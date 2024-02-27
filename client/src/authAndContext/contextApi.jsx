import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import supabase from './supabaseConfig';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState({})

    async function signUp(email, password, name) {
        try {
          let response = await supabase.auth.signUp({
            email: email,
            password: password,
            name: name
          });
          console.log(response.data)
          setUser(response.data)

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{signUp}} >
           {children}
        </AuthContext.Provider>
    )
}

export default AuthContext