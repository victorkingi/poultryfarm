import React, {useEffect, useMemo, useState} from "react";
import {connect} from 'react-redux';
import {signIn} from "../../services/actions/authActions";
import {Redirect} from 'react-router-dom';
import M from "materialize-css";
import {handleToken} from "../../services/actions/utilAction";
import {sendTokenToServer} from "../../services/actions/chickenAction";
import {myFirebase} from "../../services/api/firebase configurations/fbConfig";
import "./SignIn.css";

let renderCount = 0;

function ValidateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return true
    }
    alert("Please enter user email to send reset prompt to");
    return false
}

function SignIn(props) {
    const [state, setState] = useState({});
    const load = document.getElementById("loading");
    const submit = document.getElementById("login");

    useEffect(() => {
        M.AutoInit();

    }, []);

    const handleChange = (e) => {
        if (e.target.id === 'notify') {
            renderCount += 1;
        }
        setState({
            ...state,
            [e.target.id]: e.target.value
        });
    }

    const handleForgotPass = (e) => {
        e.preventDefault();
        const auth = myFirebase.auth();
        if (ValidateEmail(state.email)) {
            submit.style.display = 'none';
            load.style.display = 'block';
            auth.sendPasswordResetEmail(state.email).then(function () {
                alert("Reset email Sent, check your email.");
                submit.style.display = 'block';
                load.style.display = 'none';
            }).catch(function (error) {
                submit.style.display = 'block';
                load.style.display = 'none';
                alert("ERROR: ", error);
            });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (state.email && state.password) {
            submit.style.display = 'none';
            load.style.display = 'block';
            myFirebase.auth().signInWithEmailAndPassword(
                state.email,
                state.password
            ).then((user) => {
                props.signIn(user);
                handleToken(props.sendTokenToServer, renderCount);

            }).catch((err) => {
                props.signIn(null, err);
                submit.style.display = 'block';
                load.style.display = 'none';
            });
        }

    }
    const {authError} = props;

    const user = useMemo(() => {
        const __user = localStorage.getItem('user') || false;

        return {__user};
    }, []);

    if (user.__user) {
        return (
            <Redirect to="/"/>
        )
    }

    if (authError) {
        submit.style.display = 'block';
        load.style.display = 'none';
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Sign In</h5>

                <div className="input-field admin-actions">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" onChange={handleChange} required/>
                </div>

                <div className="input-field">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={handleChange} required/>
                </div>
                <p>
                    <label>
                        <input id="notify" type="checkbox" onChange={handleChange}/>
                        <span>I want to receive notifications</span>
                    </label>
                </p>
                <a href='/' className="forgot-tag" onClick={handleForgotPass}>Forgot Password?</a>

                <div style={{display: 'none'}} id="loading">
                    <div className="preloader-wrapper small active">
                        <div className="spinner-layer spinner-blue">
                            <div className="circle-clipper left">
                                <div className="circle"/>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"/>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"/>
                            </div>
                        </div>

                        <div className="spinner-layer spinner-red">
                            <div className="circle-clipper left">
                                <div className="circle"/>
                            </div>
                            <div className="gap-patch">
                                    <div className="circle"/>
                                </div>
                                <div className="circle-clipper right">
                                    <div className="circle"/>
                                </div>
                            </div>

                            <div className="spinner-layer spinner-yellow">
                                <div className="circle-clipper left">
                                    <div className="circle"/>
                                </div>
                                <div className="gap-patch">
                                    <div className="circle"/>
                                </div>
                                <div className="circle-clipper right">
                                    <div className="circle"/>
                                </div>
                            </div>

                            <div className="spinner-layer spinner-green">
                                <div className="circle-clipper left">
                                    <div className="circle"/>
                                </div>
                                <div className="gap-patch">
                                    <div className="circle"/>
                                </div>
                                <div className="circle-clipper right">
                                    <div className="circle"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="input-field" id="login" style={{display: 'block'}}>
                        <button className="btn pink lighten-1 z-depth-0">Login</button>
                        <div className="red-text center">
                            {authError ? <p>{authError}</p> : null}
                        </div>
                    </div>
                </form>
            </div>
        )
}

const mapStateToProps = (state) => {
    return {
        authError: state.auth.authError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (creds) => dispatch(signIn(creds)),
        sendTokenToServer: (token) => dispatch(sendTokenToServer(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)