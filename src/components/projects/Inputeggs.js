import React, {Component} from "react";
import {connect} from 'react-redux';
import {inputTray} from "../../store/actions/eggsAction";
import M from 'materialize-css';
import {Redirect} from "react-router-dom";

class Inputeggs extends Component {
    state = {
        category: 'eggs',
    }


    handleChange = (e) => {
        const date = document.getElementById("date").value;
        const month = document.getElementById("month").value;
        const a1 = parseInt(document.getElementById("A 1").value);
        const a2 = parseInt(document.getElementById("A 2").value);
        const b1 = parseInt(document.getElementById("B 1").value);
        const b2 = parseInt(document.getElementById("B 2").value);
        const c1 = parseInt(document.getElementById("C 1").value);
        const c2 = parseInt(document.getElementById("C 2").value);
        const house = parseInt(document.getElementById("house").value);
        const broken = parseInt(document.getElementById("broken").value);
        const egg0 = document.getElementById("egg0");
        const egg = document.getElementById("egg");
        const egg1 = document.getElementById("egg1");
        const egg2 = document.getElementById("egg2");
        const egg3 = document.getElementById("egg3");
        const egg4 = document.getElementById("egg4");
        const egg5 = document.getElementById("egg5");
        const egg6 = document.getElementById("egg6");
        const egg7 = document.getElementById("egg7");
        const checks = parseInt(date) > 0 && parseInt(date) < 32 && date !== "" && parseInt(month) > 0 && parseInt(month) < 13;


        if (checks) {
            document.getElementById("error-text").innerHTML = "";
            egg0.style.display = 'block';
        } else {
            egg0.style.display = 'none';
        }

        if (parseInt(date) <= 0 || parseInt(date) >= 32 || date === "") {
            egg0.style.display = 'none';
        }

        if (a1 !== "" && a1 >= 0 && a1 <= Number.MAX_SAFE_INTEGER) {
            egg.style.display = 'block';
            document.getElementById("error-text").innerHTML = "";
        } else {
            egg.style.display = 'none';
        }

        if (b1 !== "" && b1 >= 0 && b1 <= Number.MAX_SAFE_INTEGER) {
            egg1.style.display = 'block';
            document.getElementById("error-text").innerHTML = "";
        } else {
            egg1.style.display = 'none';
        }

        if (c1 !== "" && c1 >= 0 && c1 <= Number.MAX_SAFE_INTEGER) {
            egg2.style.display = 'block';
            document.getElementById("error-text").innerHTML = "";
        } else {
            egg2.style.display = 'none';

        }
        if (a2 !== "" && a2 >= 0 && a2 <= Number.MAX_SAFE_INTEGER) {
            egg3.style.display = 'block';
            document.getElementById("error-text").innerHTML = "";
        } else {
            egg3.style.display = 'none';
        }
        if (b2 !== "" && b2 >= 0 && b2 <= Number.MAX_SAFE_INTEGER) {
            document.getElementById("error-text").innerHTML = "";
            egg4.style.display = 'block';
        } else {
            egg4.style.display = 'none';

        }
        if (c2 !== "" && c2 >= 0 && c2 <= Number.MAX_SAFE_INTEGER) {
            egg5.style.display = 'block';
            document.getElementById("error-text").innerHTML = "";
        } else {
            egg5.style.display = 'none';
        }

        if (house !== "" && house >= 0 && house <= Number.MAX_SAFE_INTEGER) {
            egg6.style.display = 'block';
            document.getElementById("error-text").innerHTML = "";
        } else {
            egg6.style.display = 'none';
        }

        if (broken !== "" && broken >= 0 && broken <= Number.MAX_SAFE_INTEGER) {
            egg7.style.display = 'block';
            document.getElementById("error-text").innerHTML = "";
        } else {
            egg7.style.display = 'none';
        }

        const myInt = parseInt(e.target.value);

        if (isNaN(myInt)) {
            document.getElementById("error-text").innerHTML = "Error! Input needs to be a number";

        } else {
            document.getElementById("error-text").innerHTML = "";

            this.setState({
                [e.target.id]: myInt
            });
        }

    }


    handleSubmit = (e) => {
        e.preventDefault();
        const load = document.getElementById("loading");
        const submit = document.getElementById("egg7");

        submit.style.display = 'none';
        load.style.display = 'block';

        this.props.inputTray(this.state);
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
                        <br/>
                        <div className="input-field">
                            <label htmlFor="date">Select Date (range: 1 - 31)</label>
                            <input type="number" id="date" onChange={this.handleChange} required/>
                        </div>
                        <br/>
                        <div className="input-field">
                            <label htmlFor="month">Select Month (range: 1 - 12)</label>
                            <input type="number" id="month" onChange={this.handleChange} required/>
                        </div>

                        <div className="input-field" style={{display: 'none'}} id="egg0">
                            <label htmlFor="A 1">A 1 Eggs</label>
                            <input type="number" id="A 1" onChange={this.handleChange} required/>

                            <div style={{display: 'none'}} id="egg">
                                <div className="input-field">
                                    <label htmlFor="B 1">B 1 Eggs</label>
                                    <input type="number" id="B 1" onChange={this.handleChange} required/>
                                </div>
                            </div>
                            <div style={{display: 'none'}} id="egg1">
                                <div className="input-field">
                                    <label htmlFor="C 1">C 1 Eggs</label>
                                    <input type="number" id="C 1" onChange={this.handleChange} required/>
                                </div>
                            </div>

                            <div style={{display: 'none' }} id="egg2" >
                                <div className="input-field">
                                    <label htmlFor="A 2">A 2 Eggs</label>
                                    <input type="number" id="A 2" onChange={this.handleChange} required/>
                                </div>
                            </div>

                            <div style={{display: 'none' }} id="egg3" >
                                <div className="input-field">
                                    <label htmlFor="B 2">B 2 Eggs</label>
                                    <input type="number" id="B 2" onChange={this.handleChange} required/>
                                </div>
                            </div>

                            <div style={{display: 'none'}} id="egg4">
                                <div className="input-field">
                                    <label htmlFor="C 2">C 2 Eggs</label>
                                    <input type="number" id="C 2" onChange={this.handleChange} required/>
                                </div>
                            </div>

                            <div style={{display: 'none'}} id="egg5">
                                <div className="input-field">
                                    <label htmlFor="house">House Eggs</label>
                                    <input type="number" id="house" onChange={this.handleChange} required/>
                                </div>
                            </div>

                            <div style={{display: 'none'}} id="egg6">
                                <div className="input-field">
                                    <label htmlFor="broken">Eggs broken</label>
                                    <input type="number" id="broken" onChange={this.handleChange} required/>
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

                            <div style={{display: 'none'}} id="egg7">
                                <div className="input-field">
                                    <button type="Submit" className="btn pink lighten-1 z-depth-0">Submit</button>
                                </div>
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
        inputTray: (egg) => dispatch(inputTray(egg))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inputeggs);