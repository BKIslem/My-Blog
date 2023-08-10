import React, { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/AuthProvider";

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef(null); // Initialize the useRef with null
    const errRef = useRef(null);

    const [email, setEmail] = useState(''); // Changed setUser to setEmail for consistency
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password])
const roles =["ROLE_USER"];
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });
        
            const data = await response.json();
            console.log(JSON.stringify(data));
        
            if (response.ok) {
                const accessToken = data?.accessToken;
                const roles = data?.roles;
                setAuth({ email, password, accessToken });
                setEmail('');
                setPassword('');
                setSuccess(true);
            } else if (response.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (response.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        } catch (err) {
            setErrMsg('No Server Response');
            if (errRef.current) {
                errRef.current.focus();
            }
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="/">Go to Home</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
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