import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    //const { setAuth } = useContext(AuthContext);
    const userRef = useRef(null); // Initialize the useRef with null
    const errRef = useRef(null);

    const [email, setEmail] = useState(''); // Changed setUser to setEmail for consistency
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password])
// const roles =["ROLE_USER"];
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            console.log(data);
            console.log(JSON.stringify(data));
        
            
                const accessToken = data?.token;
                const roles = response?.data?.roles;
                 localStorage.setItem('access_token', accessToken);
                // setAuth({ email, password, roles, accessToken });
                // setEmail('');
                // setPassword('');
                setSuccess(true);
                navigate('/dashboard');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }
    
    return (
        <>
            {success ? (
                <p>Redirecting...</p>
            ) : (
                <section className="container mx-auto px-20">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className='text-center text-white text-2xl'><strong>Sign In</strong></h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email:</label>
                        <input className='text-black-600'
                            type="email"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input className='text-black-600'
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                        <button className='text-white'>Sign In</button>
                    </form>
                    <p className='text-white'>
                        Need an Account?<br />
                        <span className="line">
                            <a href="/register">Sign Up</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login;