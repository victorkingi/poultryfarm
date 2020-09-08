import React, {Component} from "react";
import {connect} from 'react-redux';
import {inputNews} from "../../store/actions/chickenAction";
import M from 'materialize-css';
import {Redirect} from "react-router-dom";

class InputNews extends Component {
    state = {}

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const load = document.getElementById("loading");
        const submit = document.getElementById("submit-btn");

        submit.style.display = 'none';
        load.style.display = 'block';

        this.props.inputNews(this.state);

    }

    componentDidMount = () => {
        M.AutoInit();
    }

    render() {
        const {auth} = this.props;

        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">What's happening bro!</h5>

                    <br/>
                    <div>
                        <div className="input-field">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" onChange={this.handleChange} required/>
                        </div>
                        <br/>
                        <div className="input-field">
                            <label htmlFor="content">Content</label>
                            <input type="text" id="content" onChange={this.handleChange} required/>
                        </div>
                        <br/>
                        <div className="input-field">
                            <label htmlFor="link">Link</label>
                            <input type="text" id="link" onChange={this.handleChange} required/>
                        </div>
                        <br/>
                        <div className="input-field">
                            <label htmlFor="provider">Provider</label>
                            <input type="text" id="provider" onChange={this.handleChange} required/>
                        </div>

                    </div>

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

                    <div style={{display: 'block'}} id="submit-btn">
                        <div className="input-field">
                            <button type="Submit" className="btn pink lighten-1 z-depth-0">Submit</button>
                        </div>
                    </div>
                    <div className="red-text center" id="error-text"/>
                </form>
            </div>
        );
    }
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