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
    
    // return (
    //     <section className='flex justify-center items-center min-h-[100vh] bg-neutral-100'>
    //         <form onSubmit={handleSubmit} className='flex bg-amber-50 shadow-lg rounded-xl border-2 border-amber-200 w-[70%] sm:w-[55%] md:w-[45%] lg:w-[30%] px-8 py-4 m-4 flex-wrap space-y-4 justify-center'>
    //             <section className="h-12 w-auto md:w-64 xl:w-80 m-auto">
    //                 <img src={transparentLogo} alt="Logo" className="h-full w-auto m-auto"></img>
    //             </section>
    //             <section className='w-[90%] space-y-2 m-auto'>
    //                 <div className='flex-col'>
    //                     <label htmlFor={"email"} className={"block mb-2 text-sm font-medium text-gray-900"}>Email <span className='text-neutral-400 text-xs'>(Must use TMU Email)</span></label>
    //                     <input  type="email" name="email"
    //                         className={"bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"} 
    //                         placeholder="name@torontomu.ca" required>
    //                     </input>
    //                     {errors.email && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-600 text-wrap"}>{errors.email}</div>}
    //                 </div>
    //                 <div className='flex-col'>
    //                     <label htmlFor={"password"} className={"block mb-2 text-sm font-medium text-gray-900"}>Password</label>
    //                     <input  type="password" name="password"
    //                         className={"bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"} 
    //                         placeholder="Enter password" required minLength={6}>
    //                     </input>
    //                     {errors.password && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-600 text-wrap"}>{errors.password}</div>}
    //                 </div>
    //             </section>
    //             <section className='flex flex-col text-center space-y-1.5'>
    //                 <button className={" bg-sky-500 rounded text-sm sm:text-base w-32 shadow hover:bg-sky-600 text-white py-2"} type='submit'>Log in</button>
    //                 <Link to={'/register'} className='text-sm sm:text-base hover:underline'>{'Not registered?'}</Link>
    //             </section>
    //         </form>
    //     </section>
    // )

    return (
        <div className="bg-gray-50 min-h-[100vh] flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <section className="h-12 w-auto md:w-64 xl:w-80 m-auto">
                        <img src={transparentLogo} alt="Logo" className="h-full w-auto m-auto"></img>
                    </section>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl">Welcome</h1>
                    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                        <div className="relative z-0 w-full mb-5">
                            <input type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">TMU Email Address</label>
                            <p class="mt-2 text-sm">
                                {errors.email && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-600 text-wrap"}>{errors.email}</div>}
                            </p>
                        </div>
                        <div className="relative z-0 w-full mb-5">
                            <input type="password" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                            <span className="absolute inset-y-0 right-0 flex items-center pl-2">
                                <button type='button' className="h-8 p-1 focus:outline-none focus:shadow-outline hover:bg-gray-200 rounded-full">
                                    <img id="eye-icon" src={eyeCrossed} onClick={togglePassword} alt="Logo" className="h-full w-auto m-auto"></img>
                                </button>
                            </span>
                            <p class="mt-2 text-sm">
                            {errors.password && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-600 text-wrap"}>{errors.password}</div>}
                            </p>
                        </div>
                        <div className='space-y-4 md:space-y-6'>
                            <button type="submit" className="w-full rounded-full text-white bg-blue-600 hover:bg-blue-700 font-medium text-sm px-5 py-2.5 text-center">Login</button>
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

