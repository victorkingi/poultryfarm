import React, { Component } from "react";
import { connect } from 'react-redux';
import { inputEggs } from "../../store/actions/eggsAction";
import M from 'materialize-css';
import {Redirect} from "react-router-dom";

class Inputeggs extends Component {
    state = {
        category: 'eggs',
    }

    handleChange = (e) => {
        const a1 = document.getElementById("A 1").value;
        const a2 = document.getElementById("A 2").value;
        const  b1 = document.getElementById("B 1").value;
        const  b2 = document.getElementById("B 2").value;
        const  c1 = document.getElementById("C 1").value;
        const  c2 = document.getElementById("C 2").value;
        const egg = document.getElementById("egg");
        const egg1 = document.getElementById("egg1");
        const  egg2 = document.getElementById("egg2");
        const  egg3 = document.getElementById("egg3");
        const  egg4 = document.getElementById("egg4");
        const  egg5 = document.getElementById("egg5");

        if(a1 !== "") {
          egg.style.display = 'block';
        }
        if (a2 !== "") {
            egg1.style.display = 'block';
        }
        if(b1 !== "") {
            egg2.style.display = 'block';
        }
        if (b2 !== "") {
            egg3.style.display = 'block';
        }
        if(c1 !== "") {
            egg4.style.display = 'block';
        }
        if(c2 !== "") {
            egg5.style.display = 'block';
        }


        this.setState({
                [e.target.id]: e.target.value
            });
    }
    handleSubmit = (e) => {
        e.preventDefault();

        this.props.inputEggs(this.state);
        this.props.history.push('/');
    }

    componentDidMount = () => {
        M.AutoInit();
    }

    render() {

        const { auth } = this.props;

        if(!auth.uid) {
            return (
                <Redirect to="/signin" />
            )
        }

            return (
                <div className="container">
                    <form onSubmit={this.handleSubmit} className="white">
                        <h5 className="grey-text text-darken-3">Input Eggs</h5>

                        <div className="input-field">
                            <label htmlFor="A 1">A 1 Eggs</label>
                            <input type="number" id="A 1" onChange={this.handleChange} required/>
                        </div>

                        <div style={{display: 'none' }} id="egg" >
                            <div className="input-field">
                                <label htmlFor="A 2">A 2 Eggs</label>
                                <input type="number" id="A 2" onChange={this.handleChange} required/>
                            </div>
                        </div>
                                <div style={{display: 'none' }} id="egg1" >
                                    <div className="input-field">
                                        <label htmlFor="B 1">B 1 Eggs</label>
                                        <input type="number" id="B 1" onChange={this.handleChange} required/>
                                    </div>
                                </div>

                                    <div style={{display: 'none' }} id="egg2" >
                                        <div className="input-field">
                                            <label htmlFor="B 2">B 2 Eggs</label>
                                            <input type="number" id="B 2" onChange={this.handleChange} required/>
                                        </div>
                                    </div>

                                    <div style={{display: 'none' }} id="egg3" >
                                        <div className="input-field">
                                            <label htmlFor="C 1">C 1 Eggs</label>
                                            <input type="number" id="C 1" onChange={this.handleChange} required/>
                                        </div>
                                    </div>

                                    <div style={{display: 'none' }} id="egg4" >
                                        <div className="input-field">
                                            <label htmlFor="C 2">C 2 Eggs</label>
                                            <input type="number" id="C 2" onChange={this.handleChange} required/>
                                        </div>
                                    </div>

                                    <div style={{display: 'none'}} id="egg5">
                                        <div className="input-field">
                                            <button type="Submit" className="btn pink lighten-1 z-depth-0">Submit</button>
                                            <div className="red-text center" id="error-text"/>
                                        </div>
                                    </div>

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
        inputEggs: (egg) => dispatch(inputEggs(egg))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inputeggs);