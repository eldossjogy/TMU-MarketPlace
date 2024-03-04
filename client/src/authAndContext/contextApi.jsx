import React, { useState, useEffect, createContext } from 'react';
import supabase from './supabaseConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [localSession, setLocalSession] = useState(null);

    // use effect that subscribes to supabase user events such as on sign in, sign out, etc
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setLocalSession(session);
        });

        const {data} = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setLocalSession(null)
                setUser(null);
            } 
            else {
                setLocalSession(session)
                setUser(localSession ? (localSession.user ? localSession.user : null ) : null);
            }
        });

        return () => data.subscription.unsubscribe()

    }, [])

    useEffect(() => {
        setUser(localSession ? (localSession.user ? localSession.user : null ) : null);
      
    }, [localSession])
    


    async function registerNewAccount(email, password, username) {
        console.log(`${email} ${password}`);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        avatar_url: '',
                        name: username,
                        postal_code: '',
                        role_id: 1
                    },
                },
            });
            if( error ) return [null, {success: false, message:'Not Registered', error: error}];
            else {
                setLocalSession(data);
                setUser(data ? (data.user ? data.user : null ) : null);
                //console.log(data);
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
                setLocalSession(data);
                setUser(data.user ? data.user : null);
                return [{success: true, message: 'Logged in', error: null}, null];
            }
        }
        catch (error) {
            return [null, {success: false, message:'Error logging in', error: error}];
        }
    }

    async function signOut() {
        try {
            const { error } = await supabase.auth.signOut({ scope: 'local' });
            if( error ) return [null, {success: false, message:'Not logged out', error: error}];
            else {
                setLocalSession(null);
                setUser(null);
                return [{success: true, message: 'Logged out', error: null}, null];
            }
        }
        catch (error) {
            return [null, {success: false, message:'Error logging out', error: error}];
        }
    }

    return (
        <AuthContext.Provider value={{ registerNewAccount, signIn, signOut, localSession, user}} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext