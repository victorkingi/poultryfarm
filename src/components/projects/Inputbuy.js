import React, {Component} from "react";
import {connect} from 'react-redux';
import {inputPurchase} from "../../store/actions/buyAction";
import M from 'materialize-css';
import {Redirect} from "react-router-dom";


class Inputbuy extends Component {
    state = {
        category: 'buys',
        section: '',
    }

    handleChange = (e) => {
        const selectBox = document.getElementById("section");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const date = document.getElementById('date').value;
        const month = document.getElementById('month').value;
        const checks = parseInt(date) > 0 && parseInt(date) < 32 && date !== "" && parseInt(month) > 0 && parseInt(month) < 13;

        if (checks) {
            const section = document.getElementById('mySection');
            section.style.display = 'block';
        } else {
            const section = document.getElementById('mySection');
            const buys = document.getElementById("buy");
            buys.style.display = 'none';
            section.style.display = 'none';
        }

        if (selectedValue !== "0") {
            const buys = document.getElementById("buy");
            buys.style.display = 'block';
        } else {
            const buys = document.getElementById("buy");
            buys.style.display = 'none';
        }

        if (selectedValue === "Labour Payment") {
            const buys = document.getElementById("labour");
            buys.style.display = 'block';
        } else {
            const buys = document.getElementById("labour");
            buys.style.display = 'none';
        }

        if (selectedValue === "Other" || selectedValue === "Feeds" || selectedValue === "Equipment") {
            const buys = document.getElementById("other");
            buys.style.display = 'block';
        } else {
            const buys = document.getElementById("other");
            buys.style.display = 'none';
        }

        if (selectedValue === "Drug") {
            const buys = document.getElementById("drug");
            buys.style.display = 'block';
        } else {
            const buys = document.getElementById("drug");
            buys.style.display = 'none';
        }

        if (selectedValue === "Vaccines") {
            const vac = document.getElementById("vaccine");
            vac.style.display = 'block';

        } else {
            const vac = document.getElementById("vaccine");
            vac.style.display = 'none';
        }

        if (e.target.id === "status") {
            this.setState({
                [e.target.id]: JSON.parse(e.target.value)
            });
        } else if (e.target.id === "date" || e.target.id === "objectNo" || e.target.id === "objectPrice" || e.target.id === "month") {

            if (isNaN(parseInt(e.target.value))) {
                document.getElementById("error-text").innerHTML = "Error! Input needs to be a number";
            } else {
                document.getElementById("error-text").innerHTML = "";

                this.setState({
                    [e.target.id]: parseInt(e.target.value)
                });
            }
        } else {
            this.setState({
                [e.target.id]: e.target.value
            });
        }


    }
    handleSubmit = (e) => {
        e.preventDefault();
        const selectBox = document.getElementById("section");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const status = document.getElementById("status");
        const vaccine = document.getElementById("vaccineName");
        const drug = document.getElementById("drugName");
        const other = document.getElementById("itemName");
        const load = document.getElementById("loading");
        const submit = document.getElementById("submit-btn");

        submit.style.display = 'none';
        load.style.display = 'block';

        if (selectedValue === "Other" || selectedValue === "Feeds") {

            if (other.value === "" || drug.value !== "" || vaccine.value !== "" || status.value === "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            } else {
                this.props.inputPurchase(this.state);
            }
        }
        if (selectedValue === "Drug") {

            if (drug.value === "" || other.value !== "" || vaccine.value !== "" || status.value === "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            } else {
                this.props.inputPurchase(this.state);
            }
        }
        if (selectedValue === "Vaccines") {

            if (vaccine.value === "" || other.value !== "" || drug.value !== "" || status.value === "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            } else {
                this.props.inputPurchase(this.state);
            }
        }
        if (selectedValue !== "Vaccine" && selectedValue !== "Drug" && selectedValue !== "Other" && selectedValue !== "Feeds") {

            if (other.value === "" || vaccine.value !== "" || drug.value !== "" || status.value === "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            } else {
                this.props.inputPurchase(this.state);
            }
        }

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
                        <h5 className="grey-text text-darken-3">Input Purchases</h5>
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

                        <div style={{display: 'none'}} id="mySection">
                            <select style={{display: 'none'}} id="section" onChange={this.handleChange}
                                    className="white" defaultValue="0">
                                <option value="0" disabled="disabled">Choose Section</option>
                                <option value="Feeds">Feeds</option>
                                <option value="Vaccines">Vaccines</option>
                                <option value="Drug">Drug</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Other">Other</option>
                                <option value="Labour Payment">Labour Payment</option>
                            </select>
                        </div>

                        <div style={{display: 'none'}} id="other">
                            <br/>
                            <div className="input-field">
                                <label htmlFor="itemName">Name of Item Purchased</label>
                                <input type="text" id="itemName" onChange={this.handleChange}/>
                            </div>
                        </div>

                        <div style={{display: 'none'}} id="labour">
                            <br/>
                            <div className="input-field">
                                <label htmlFor="labourName">Name of Person Paid</label>
                                <input type="text" id="labourName" onChange={this.handleChange}/>
                            </div>
                        </div>

                        <div style={{display: 'none'}} id="vaccine">
                            <br/>
                            <div className="input-field">
                                <label htmlFor="vaccineName">Name of Vaccine Purchased</label>
                                <input type="text" id="vaccineName" onChange={this.handleChange}/>
                            </div>
                        </div>

                        <div style={{display: 'none'}} id="drug">
                            <br/>
                            <div className="input-field">
                                <label htmlFor="drugName">Name of Drug</label>
                                <input type="text" id="drugName" onChange={this.handleChange}/>
                            </div>
                        </div>

                        <div style={{display: 'none'}} id="buy">
                            <br/>
                            <div className="input-field">
                                <label htmlFor="objectNo">Number of Objects</label>
                                <input type="number" id="objectNo" onChange={this.handleChange} required/>
                            </div>
                            <br/>
                            <div className="input-field">
                                <label htmlFor="objectPrice">Price per Object</label>
                                <input type="number" id="objectPrice" onChange={this.handleChange} required/>
                            </div>

                            <select id="status" onChange={this.handleChange} className="white" defaultValue="0">
                                <option value="0" disabled="disabled">Status</option>
                                <option value={true}>Paid</option>
                                <option value={false}>Not paid</option>
                            </select>

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

                            <div className="input-field">
                                <button type="Submit" id="submit-btn" className="btn pink lighten-1 z-depth-0">Submit
                                </button>
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
        inputPurchase: (buy) => dispatch(inputPurchase(buy))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inputbuy);