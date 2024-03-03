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

    // use effect that subscribes to supabase user events such as on sign in, sign out, etc
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session);
        });

        const subscription = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null)
            } else if (session) {
                setUser(session)
            }
            if (event === 'TOKEN_REFRESHED') {
                setUser(session)
            }
        });

        return () => subscription.unsubscribe()

    }, [])


    async function registerNewAccount(email, password) {
        console.log(`${email} ${password}`);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            if( error ) return [null, {success: false, message:'Not Registered', error: error}];
            else {
                setUser(data);
                console.log(data);
                return [{success: true, message: 'Registered', error: null}, null];
            }
        } catch (error) {
            return [null, {success: false, message:null, error: error}];
        }
    }

    async function signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if( error ) return [null, {success: false, message:'Not logged in', error: error}];
            else {
                setUser(data);
                console.log(data);
                return [{success: true, message: 'Logged in', error: null}, null];
            }
        }
        catch (error) {
            return {success: false, message:'Error logging in', error: error};
        }
    }

    async function signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if( error ) return [null, {success: false, message:'Not logged out', error: error}];
            else {
                setUser(null);
                return [{success: true, message: 'Logged out', error: null}, null];
            }
        }
        catch (error) {
            return {success: false, message:'Error logging out', error: error};
        }
    }

    return (
        <AuthContext.Provider value={{ registerNewAccount, signIn, signOut, user}} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext