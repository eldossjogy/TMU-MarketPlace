import React, {useContext} from 'react'
import AuthContext from '../authAndContext/contextApi'

export default function LoginPage() {

    const {registerNewAccount, signIn, signOut } = useContext(AuthContext)

    return (
        <div>
            <h2>Login page</h2>
        </div>
  )
}
