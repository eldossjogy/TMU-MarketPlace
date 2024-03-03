import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from './supabaseConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)

    // use effect that subscribes to supabase user events such as on sign in, sign out, etc
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const subscription = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null)
                setSession(null)
            } else if (session) {
                setUser(session)
                setSession(session)
            }
            if (event === 'TOKEN_REFRESHED') {
                setUser(session)
                setSession(session)
            }
        });

        return () => subscription.unsubscribe()

    }, [])


    async function registerNewAccount(email, password) {
        // console.log(`${email} ${password}`);
        try {
            let response = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            setUser(response.data)

            return {success: true, message: 'Registered', error: null};
        } catch (error) {
            return {success: false, message:null, error: error};
        }
    }

    async function signIn(email, password) {
        try {
            const response = await supabase.auth.signInWithPassword({
                email,
                password
            })
            setUser(response.data.session)
            setSession(user);
            return {success: true, message: 'Registered', error: null};
        }
        catch (error) {
            return {success: false, message:null, error: error};
        }
    }

    async function signOut() {
        try {
            const response = await supabase.auth.signOut({ scope: 'local' })
        }
        catch (error) {
            alert(error)
        }
    }

    return (
        <AuthContext.Provider value={{ registerNewAccount, signIn, signOut, user, session}} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext