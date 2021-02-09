import React, { useRef } from "react";
import "./SignupScreen.css";
import { auth } from "../../firebase";

function SignupScreen() {
    const emailRef = useRef();
    const passRef = useRef();

    const register = (e) => {
        e.preventDefault();

        auth.createUserWithEmailAndPassword(
            emailRef.current.value,
            passRef.current.value
        )
            .then((authUser) => {
                console.log(authUser);
            })
            .catch((e) => {
                alert(e.message);
            });
    };

    const signIn = (e) => {
        e.preventDefault();

        auth.signInWithEmailAndPassword(
            emailRef.current.value,
            passRef.current.value
        )
            .then((authUser) => {
                console.log(authUser);
            })
            .catch((e) => alert(e.message));
    };

    return (
        <div className="signupScreen">
            <form>
                <h1>Sign In</h1>
                <input ref={emailRef} placeholder="Email" type="email" />
                <input ref={passRef} placeholder="Password" type="password" />
                <button onClick={signIn} type="sumit">
                    Sign In
                </button>
                <h4>
                    <span className="signupScreen__gray">New to Netflix? </span>
                    <span className="signupScreen__link" onClick={register}>
                        Sign Up now.
                    </span>
                </h4>
            </form>
        </div>
    );
}

export default SignupScreen;
