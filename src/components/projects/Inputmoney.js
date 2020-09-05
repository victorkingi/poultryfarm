import React, {Component} from "react";
import {connect} from 'react-redux';
import {sendMoney} from "../../store/actions/moneyAction";
import M from 'materialize-css';
import {Redirect} from "react-router-dom";
import * as firebase from "firebase";

class Inputmoney extends Component {
    state = {}

    handleChange = (e) => {
        const selectBox = document.getElementById("receiver");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const money = document.getElementById('money');
        const submit = document.getElementById('submit-btn');
        const amount = document.getElementById('amount').value;

        if (selectedValue !== "" || selectedValue !== firebase.auth().currentUser.email) {
            money.style.display = 'block';
            document.getElementById("error-text").innerHTML = "";
        }
        if (selectedValue === firebase.auth().currentUser.email) {
            document.getElementById("error-text").innerHTML = "ERROR: cannot send money to yourself!";
            submit.style.display = 'none';
            money.style.display = 'none';
        }

        if (amount !== "") {
            submit.style.display = 'block';
        }

        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const selectBox = document.getElementById("receiver");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const load = document.getElementById("loading");
        const submit = document.getElementById("submit-btn");

        submit.style.display = 'none';
        load.style.display = 'block';

        if (selectedValue === "0") {
            document.getElementById("error-text").innerHTML = "Error with selection";
        } else {
            document.getElementById("error-text").innerHTML = "";
            this.props.sendMoney(this.state);
        }

    }

    componentDidMount = () => {
        M.AutoInit();
    }

    render() {
        const {auth, admin} = this.props;
        const links = admin ? <option value="Bank Account">Bank</option> : null;
        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Send Money To</h5>

                    <select id="receiver" onChange={this.handleChange} className="white" defaultValue="0">
                        <option value="0" disabled="disabled">Choose User</option>
                        <option value="Victor Kingi">Victor</option>
                        <option value="Purity Mukomaua">Purity</option>
                        <option value="Jeff Karue">Jeff</option>
                        <option value="Anne Kingi">Anne</option>
                        {links}
                    </select>

                    <div style={{display: 'none'}} id="money">
                        <div className="input-field">
                            <label htmlFor="amount">Enter amount</label>
                            <input type="number" id="amount" onChange={this.handleChange} required/>
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


                    <div style={{display: 'none'}} id="submit-btn">
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
        auth: state.firebase.auth,
        admin: state.auth.admin
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendMoney: (money) => dispatch(sendMoney(money)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inputmoney)
