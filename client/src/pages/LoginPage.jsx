import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../authAndContext/contextApi'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import transparentLogo from "../assets/logo-transparent.png";

export default function LoginPage() {
    const {signIn, user} = useContext(AuthContext); //Signin function
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
    
    return (
        <section className='flex justify-center items-center h-[100vh] bg-neutral-100'>
            <form onSubmit={handleSubmit} className='flex bg-amber-50 shadow-lg rounded-xl border-2 border-amber-200 w-[70%] sm:w-[55%] md:w-[45%] lg:w-[30%] px-8 py-4 m-4 flex-wrap space-y-4 justify-center'>
                <section className="h-12 w-auto md:w-64 xl:w-80 m-auto">
                    <img src={transparentLogo} alt="Logo" className="h-full w-auto m-auto"></img>
                </section>
                <section className='w-[90%] space-y-2 m-auto'>
                    <div className='flex-col'>
                        <label htmlFor={"email"} className={"block mb-2 text-sm font-medium text-gray-900"}>Email <span className='text-neutral-400 text-xs'>(Must use TMU Email)</span></label>
                        <input  type="email" name="email"
                            className={"bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"} 
                            placeholder="name@torontomu.ca" required>
                        </input>
                        {errors.email && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-600 text-wrap"}>{errors.email}</div>}
                    </div>
                    <div className='flex-col'>
                        <label htmlFor={"password"} className={"block mb-2 text-sm font-medium text-gray-900"}>Password</label>
                        <input  type="password" name="password"
                            className={"bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"} 
                            placeholder="Enter password" required minLength={6}>
                        </input>
                        {errors.password && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-600 text-wrap"}>{errors.password}</div>}
                    </div>
                </section>
                <section className='flex flex-col text-center space-y-1.5'>
                    <button className={" bg-sky-500 rounded text-sm sm:text-base w-32 shadow hover:bg-sky-600 text-white py-2"} type='submit'>Log in</button>
                    <Link to={'/register'} className='text-sm sm:text-base hover:underline'>{'Not registered?'}</Link>
                </section>
            </form>
        </section>
    )
}

