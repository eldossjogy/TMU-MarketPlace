import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../authAndContext/contextApi'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import transparentLogo from "../assets/logo-transparent.png";
import eyeOpened from "../assets/eye.png";
import eyeCrossed from "../assets/eye-crossed.png";

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
        } 
        else {
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

    function togglePassword(){
        let password = document.getElementById("password");
        let eyeIcon = document.getElementById("eye-icon");

        if(password.type ==="password"){
            password.type = "text";
            eyeIcon.src = eyeOpened;
        }
        else{
            password.type = "password";
            eyeIcon.src = eyeCrossed;
        }
    }

    return (
        <div className="bg-gray-50 h-auto min-h-[100vh] flex items-center justify-center p-0 sm:px-6 sm:py-8 mx-auto lg:py-3">
            <div className="w-full h-[100vh] sm:h-auto bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <section className="h-16 w-auto md:w-64 xl:w-80 m-auto">
                        <img src={transparentLogo} alt="Logo" className="h-full w-auto m-auto"></img>
                    </section>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl">Welcome</h1>
                    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                        <div className="relative z-0 w-full mb-5">
                            <input type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " maxLength={100} required />
                            <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">TMU Email Address</label>
                            <p className="mt-2 text-sm">
                                {errors.email && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-500 text-wrap"}>{errors.email}</div>}
                            </p>
                        </div>
                        <div className="relative z-0 w-full mb-5">
                            <input type="password" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                            <span className="absolute inset-y-0 right-0 flex items-center pl-2">
                                <button type='button' className="h-8 p-1 focus:outline-none focus:shadow-outline hover:bg-gray-200 rounded-full">
                                    <img id="eye-icon" src={eyeCrossed} onClick={togglePassword} alt="Logo" className="h-full w-auto m-auto"></img>
                                </button>
                            </span>
                        </div>
                        <div className='space-y-4 md:space-y-6'>
                            <button type="submit" className="w-full rounded-full text-white bg-sky-500 hover:bg-sky-600 font-medium text-sm px-5 py-2.5 text-center">Login</button>
                            <p className="text-sm text-center font-light text-gray-500">
                                Don't have an account yet? <Link to={'/register'} className='font-medium text-primary-600 hover:underline'>{'Register'}</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

