import React, {useEffect, useMemo, useState} from "react";
import {connect} from 'react-redux';
import {inputNews} from "../../store/actions/chickenAction";
import M from 'materialize-css';
import {Redirect} from "react-router-dom";

function InputNews(props) {
    const [state, setState] = useState({});

    useEffect(() => {
        M.AutoInit();

    }, []);

    const handleChange = (e) => {
        setState({
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const load = document.getElementById("loading-news");
        const submit = document.getElementById("submit-btn-news");

        submit.style.display = 'none';
        load.style.display = 'block';

        props.inputNews(state);
    }

    const user = useMemo(() => {
        const __user = localStorage.getItem('user') || false;

        return {__user};
    }, []);

    if (!user.__user) {
        return (
            <Redirect to="/signin"/>
        )
    }

    return (
        <div className="container">
            <form id="news-form" onSubmit={handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">What's happening bro!</h5>

                <br/>
                <div>
                    <div className="input-field">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" onChange={handleChange} required/>
                    </div>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="content">Content</label>
                        <input type="text" id="content" onChange={handleChange} required/>
                    </div>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="link">Link</label>
                        <input type="text" id="link" onChange={handleChange} required/>
                    </div>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="provider">Provider</label>
                        <input type="text" id="provider" onChange={handleChange} required/>
                    </div>

                </div>

                <div style={{display: 'none'}} id="loading-news">
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

                <div style={{display: 'block'}} id="submit-btn-news">
                    <div className="input-field">
                        <button type="Submit" className="btn pink lighten-1 z-depth-0">Submit</button>
                    </div>
                </div>
                <div className="red-text center" id="error-text"/>
            </form>
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        inputNews: (details) => dispatch(inputNews(details))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputNews)