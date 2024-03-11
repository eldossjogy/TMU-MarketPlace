import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../authAndContext/contextApi'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const {signIn, user} = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get("email");
        const password = form.get("password");
        let invalid = {};

        if (email && !email.endsWith("@torontomu.ca")) {
            invalid.email = "Must use student email with domain @torontomu.ca";
        }

        if (Object.keys(invalid).length > 0) {
            setErrors(invalid);
        } else {
            // console.log(Array.from(form.entries()));
            setErrors({});
            const [data, error] = await signIn(email, password);
             
            // console.log(data);
            // console.log(error);
            if(! error && data.success === true) {
                toast.success(`Logged in ${email}`);
                navigate('/');
            }
            else{
                toast.error(`Unable to log in. ${error.error.message ?? 'Unknown reason.'}`);
                // console.log(error);
            }
        }
    }

    useEffect(() => {
        if (user != null) {
            navigate('/');
        }
    }, [user, navigate])
    
    return (
        <section className='flex justify-center items-center h-[100vh] bg-neutral-100'>
            <form onSubmit={handleSubmit} className='flex bg-white shadow-lg rounded-xl p-8 flex-wrap space-y-4'>
                <h2 className='w-full text-xl'>Log in</h2>
                <section className='w-full space-y-2'>
                    <div className='flex-col w-[80%]'>
                        <label htmlFor={"email"} className={"block mb-2 text-sm font-medium text-gray-900"}>Email <span className='text-neutral-400'>(must use TMU email)</span></label>
                        <input  type="email" name="email"
                            className={"bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"} 
                            placeholder="name@torontomu.ca" required>
                        </input>
                        {errors.email && <div className={"mb-2 text-sm font-medium text-red-600"}>{errors.email}</div>}
                    </div>
                    <div className='flex-col w-[80%]'>
                        <label htmlFor={"password"} className={"block mb-2 text-sm font-medium text-gray-900"}>Password</label>
                        <input  type="password" name="password"
                            className={"bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"} 
                            placeholder="Enter password" required minLength={6}>
                        </input>
                        {errors.password && <div className={"mb-2 text-sm font-medium text-red-600"}>{errors.password}</div>}
                    </div>
                </section>
                <section className='flex flex-col space-y-3'>
                    <button className={" bg-sky-500 rounded w-32 shadow hover:bg-sky-600 text-white py-2"} type='submit'>Submit</button>
                    <Link to={'/register'} className='hover:underline'>{'Not registered?'}</Link>
                </section>
            </form>
        </section>
    )
}

