import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../authAndContext/contextApi'

export default function LoginPage() {

    const {registerNewAccount, signIn, signOut , session} = useContext(AuthContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signInAttempt = async () => {
        const response = await signIn(email, 'passwoird12324');

        alert(session)
    }

    const registerAttempt = async () => {
        const response = await registerNewAccount(email, 'passwoird12324');
        alert(session);
    }

    return (
        <div>
            <h2>Login page</h2>
            <div>
                <label htmlFor={"email"} className={"block mb-2 text-sm font-medium text-gray-900 dark:text-white"}>Your email</label>
                <input type="email" name="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value)}} className={"bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} placeholder="name@company.com" required=""></input>
            </div>
            <div>
                <label htmlFor={"password"} className={"block mb-2 text-sm font-medium text-gray-900 dark:text-white"}>Password</label>
                <input type="password" name="password" id="password" value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="••••••••" className={"bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} required=""></input>
            </div>
            <button className={"bg-neutral-400 rounded w-32 shadow hover:bg-neutral-500"} onClick={() => {signInAttempt()}}>Submit</button>
        </div>
  )
}
