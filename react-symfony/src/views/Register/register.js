import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './register.css';


const USER_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
//const REGISTER_URL = '/register';
const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [email, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === matchPwd);
    }, [password, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [email, password, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Valider les champs du formulaire
        const isValidEmail = USER_REGEX.test(email);
        const isValidPassword = PWD_REGEX.test(password);
    
        if (!isValidEmail || !isValidPassword) {
            setErrMsg("Invalid Entry");
            return;
        }
        console.log(email);
        console.log(password);
    
        try {
            const newUser = {
                email: email,
                password: password,
                roles: ["ROLE_USER"],// Valeur par défaut
                comments: [],
                posts: [],
                name: email
            };
    
            const response = await fetch('http://localhost:8000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
    
            if (!response.ok) {
                throw new Error('Registration Failed');
            }
    
            const responseData = await response.json();
            console.log(responseData);
            setSuccess(true);
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (err.message === 'email Taken') {
                setErrMsg('Email Taken');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    };
    

    return (
        <>
            {success ? (
                <section>
                    <h1 className="text-center text-white text-2xl">Success!</h1>
                    <p>
                        <a href="http://localhost:3000/login" >Log In</a>
                    </p>
                </section>
            ) : (
                <section className="container mx-auto px-20">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className="text-center text-white text-2xl">Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="Email">
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !email ? "hide" : "invalid"} />
                        </label>
                        <input className='text-black-600'
                            type="email"
                            id="Email"
                            ref={userRef}
                            placeholder="example@gmail.com"
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && email && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            The email address must be valid.<br />
                    
                        </p>


                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? "hide" : "invalid"} />
                        </label>
                        <input className='text-black-600'
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input className='text-black-600'
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button disabled={!validName || !validPwd || !validMatch ? true : false} className="text-white">Create an account</button>
                    </form>
                    <p className="text-white">
                        Already registered?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="http://localhost:3000/login" >Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}


export default Register