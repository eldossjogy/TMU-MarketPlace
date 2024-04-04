import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../authAndContext/contextApi'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import transparentLogo from "../assets/logo-transparent.png";
import eyeOpened from "../assets/eye.png";
import eyeCrossed from "../assets/eye-crossed.png";

export default function RegisterPage() {

    const {registerNewAccount, user} = useContext(AuthContext)
    const [errors, setErrors] = useState({})
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        let invalid = {};

        //Name validation
        const first = form.get("fname");
        const last = form.get("lname");
        if(!(/^[A-Za-z]+$/.test(first) || !(/^[A-Za-z]+$/.test(last)))){
            invalid.name = "First and last name must only contain letters";
        }

        //Username Validation
        const username = form.get("username")
        if(!(/^[0-9A-Za-z_]{4,16}$/.test(username))){
            invalid.username = "Username may only contain 4 to 16 letters, numbers or _";
        }

        //Student number validation
        const studentNum = form.get("student-number");
        if(!(/^[0-9]{9}$/.test(studentNum))){
            invalid.studNum = "Student number must be 9 digits, no spaces";
        }

        const email = form.get("email");
        if (email && !email.endsWith("@torontomu.ca")) {
            invalid.email = "Must use student email with domain @torontomu.ca";
        }

        const password = form.get("password");
        if(password.length < 6){
            invalid.password = "Password must be at least 6 characters";
        }

        //Only checks if the password format is correct
        if (!invalid.password && password !== form.get("confirm-password")) {
            document.getElementById('eye-div').classList.add("mb-5");
            invalid.confirm = "Passwords do not match";
        }

        if (Object.keys(invalid).length > 0) {
            setErrors(invalid);
        } 
        else {
            // console.log(Array.from(form.entries()));
            setErrors({});
            const [data, error] = await registerNewAccount(email, password, username, studentNum, first, last);

            // console.log(data);
            // console.log(error);
            if(! error && data.success === true) {
                toast.success(`Successfully registered as ${email}`);
                navigate('/');
            }
            else{
                toast.error(`Unable to register. ${error.error.message ?? 'Unknown reason.'}`)
            }
        }
    }

    useEffect(() => {
        if (user != null) {
            navigate('/');
        }
    }, [user, navigate])

    function togglePassword(){
        let password = document.getElementById("confirm-password");
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
            <div className="w-full h-full sm:h-auto bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <section className="h-16 w-auto md:w-64 xl:w-80 m-auto">
                        <img src={transparentLogo} alt="Logo" className="h-full w-auto m-auto"></img>
                    </section>
                    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5">
                                <input type="text" name="fname" id="fname" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-nonefocus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " minLength={2} maxLength={50} required />
                                <label htmlFor="fname" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name <span className='text-red-500'>*</span></label>
                            </div>
                            <div className="relative z-0 w-full mb-5">
                                <input type="text" name="lname" id="lname" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " minLength={2} maxLength={50} required />
                                <label htmlFor="lname" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name <span className='text-red-500'>*</span></label>
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-5">
                            <input type="text" name="student-number" id="student-number" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " maxLength={9} required />
                            <label htmlFor="student-number" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Student Number <span className='text-red-500'>*</span></label>
                            <p className="mt-1 text-sm">
                                {errors.studNum && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-500 text-wrap"}>{errors.studNum}</div>}
                            </p>
                        </div>
                        <div className="relative z-0 w-full mb-5">
                            <input type="text" name="username" id="username" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="username" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username <span className='text-red-500'>*</span></label>
                            <p className="mt-1 text-sm">
                                {errors.username && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-500 text-wrap"}>{errors.username}</div>}
                            </p>
                        </div>
                        <div className="relative z-0 w-full mb-5">
                            <input type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " maxLength={100} required />
                            <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">TMU Email Address <span className='text-red-500'>*</span></label>
                            <p className="mt-2 text-sm">
                                {errors.email && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-500 text-wrap"}>{errors.email}</div>}
                            </p>
                        </div>
                        <div className="relative z-0 w-full mb-5">
                            <input type="password" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password <span className='text-red-500'>*</span></label>
                            <p className="mt-2 text-sm">
                                {errors.password && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-500 text-wrap"}>{errors.password}</div>}
                            </p>
                        </div>
                        <div className="relative z-0 w-full mb-5">
                            <input type="password" name="confirm-password" id="confirm-password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="confirm-password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Re-enter password <span className='text-red-500'>*</span></label>
                            <span id="eye-div" className="absolute inset-y-0 right-0 flex items-center pl-2">
                                <button type='button' className="h-8 p-1 focus:outline-none focus:shadow-outline hover:bg-gray-200 rounded-full">
                                    <img id="eye-icon" src={eyeCrossed} onClick={togglePassword} alt="Logo" className="h-full w-auto m-auto"></img>
                                </button>
                            </span>
                            <p className="mt-2 text-sm">
                                {errors.confirm && <div className={"mb-1 text-xs sm:text-sm font-medium text-red-500 text-wrap"}>{errors.confirm}</div>}
                            </p>
                        </div>
                        <div className='space-y-4 md:space-y-6'>
                            <button type="submit" className="w-full rounded-full text-white bg-sky-500 hover:bg-sky-600 font-medium text-sm px-5 py-2.5 text-center">Register</button>
                            <p className="text-sm text-center font-light text-gray-500">
                                Already have an account? <Link to={'/login'} className='font-medium text-primary-600 hover:underline'>{'Login'}</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
