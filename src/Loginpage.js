import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage() {

    return (
        <div className='loginpage'>
            <Link><p>Log in with username</p></Link>
            <Link><p>Log in with Google</p></Link>
            <Link><p>Log in with Instagram</p></Link>
            <Link><p>Sign up</p></Link>
        </div>
    )
}