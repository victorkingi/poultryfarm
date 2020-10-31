import React, {useMemo, useState} from "react";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {signUp} from "../../store/actions/authActions";
import {sendTokenToServer} from "../../store/actions/chickenAction";
import {handleToken} from "../dashboard/Dashboard";


function SignUp(props) {
    const [state, setState] = useState({});
    const load = document.getElementById("loading");
    const submit = document.getElementById("signup");

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submit.style.display = 'none';
        load.style.display = 'block';
        props.signUp(state);
        const renderCount = 1;
        handleToken(props.sendTokenToServer, renderCount);
        //window.alert("PERMISSION DENIED!");
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

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Sign Up</h5>

                <div className="input-field">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" onChange={handleChange}/>
                </div>

                <div className="input-field">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" onChange={handleChange}/>
                </div>

                <div className="input-field">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" onChange={handleChange}/>
                </div>

                <div className="input-field">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={handleChange}/>
                </div>
                <select id="level" onChange={handleChange}
                        className="white" defaultValue="0">
                    <option value="0" disabled="disabled">Choose Access Level</option>
                    <option value="SuperAdmin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Changer">Changer</option>
                    <option value="Moderator">Moderator</option>
                </select>
                <p>
                    <label>
                        <span>Notifications are automatically enabled only for sign up, when your request
                        is approved, they will be turned off automatically and you can choose if you still want
                        to receive them on log in</span>
                    </label>
                </p>

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

                <div className="input-field" id="signup">
                    <button className="btn pink lighten-1 z-depth-0">Sign Up</button>
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
        signUp: (newUser) => dispatch(signUp(newUser)),
        sendTokenToServer: (token) => dispatch(sendTokenToServer(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)