import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import supabase from './supabaseConfig';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    // use effect that subscribes to supabase user events such as on sign in, sign out, etc
    useEffect(() => {
      const subscription = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_OUT') {
            setUser(null)
          } else if (session) {
            setUser(session)
          }
          if (event === 'TOKEN_REFRESHED') {
            setUser(session)
          }
        })
      return () => {
        subscription.unsubscribe()
      }
    }, [])


    async function registerNewAccount(email, password) {
        try {
          let response = await supabase.auth.signUp({
            email: email,
            password: password,
          });
          setUser(response.data)
        } catch (error) {
            alert(error);
        }
    }

    async function signIn(email, password) {
      try {
        const response = await supabase.auth.signInWithPassword({
          email,
          password
        })
        setUser(response.data.session)
      }
      catch(error) {
        alert(error)
      }
    }

    async function signOut() {
      try {
        const response = await supabase.auth.signOut()
      }
      catch(error) {
        alert(error)
      }
    }

    return (
        <AuthContext.Provider value={{registerNewAccount, signIn, signOut}} >
           {children}
        </AuthContext.Provider>
    )
}

export default AuthContext