import React, {useContext, useEffect} from 'react'
import AuthContext from '../authAndContext/contextApi'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function LoginPage() {

    const {signOut} = useContext(AuthContext)
    const navigate = useNavigate();

    const logOut = async () => {
        const [data, error] = await signOut();
            
        // console.log(data);
        
        if(!error && data.success === true) {
            toast.success(`Logged out`);
        }
        else{
            toast.error(`Unable to log out. ${error.error.message ?? 'Unknown reason.'}`);
            console.log(error);
        }
            //navigate('/');
    }

    useEffect(() => {
        const fn = async () => {
            const [data, error] = await signOut();
            
            if(!error && data.success === true) {
                toast.success(`Logged out`);
            }
            else{
                toast.error(`Unable to log out. ${error.error.message ?? 'Unknown reason.'}`)
            }
            navigate('/');
        }
        fn();
    }, []);

    return (
        <div>
            Logout
            <button onClick={logOut}>Click me</button>
        </div>
    )
}