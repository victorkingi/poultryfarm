import React, { Component } from "react";
import { connect } from 'react-redux';
import { inputBuys } from "../../store/actions/buyAction";
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
        if(selectedValue !== "") {
            const buys = document.getElementById("buy");
            buys.style.display = 'block';
        }

        if(selectedValue === "Other") {
            const buys = document.getElementById("other");
            buys.style.display = 'block';
        }
        if(selectedValue === "Vaccines") {
            const buys = document.getElementById("vaccine");
            buys.style.display = 'block';
        }
        if(selectedValue === "Drug") {
            const buys = document.getElementById("drug");
            buys.style.display = 'block';
        }
        if (selectedValue !== "Other" && selectedValue !== "Vaccine" && selectedValue !== "Drug" && selectedValue !== "") {
            const vaccine = document.getElementById("vaccine");
            const buysDrug = document.getElementById("drug");
            const buysItem = document.getElementById("other");
            buysDrug.style.display = 'none';
            buysItem.style.display = 'none';
            vaccine.style.display = 'none';
        }


        this.setState({
            [e.target.id]: e.target.value
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const selectBox = document.getElementById("section");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;

        if(selectedValue === "Other") {
            const buys = document.getElementById("itemName");
            const drug = document.getElementById("drugName");
            const vaccine = document.getElementById("vaccineName");

            if(buys.value === "" || drug.value !== "" || vaccine.value !== "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            }
            else {
                this.props.inputBuys(this.state);
                this.props.history.push('/');
            }
        }
        if (selectedValue === "Drug") {
            const buys = document.getElementById("drugName");
            const other = document.getElementById("itemName");
            const vaccine = document.getElementById("vaccineName");
            if(buys.value === "" || other.value !== "" || vaccine.value !== "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            }
            else {
                this.props.inputBuys(this.state);
                this.props.history.push('/');
            }
        }
        if (selectedValue === "Vaccines") {
            const buys = document.getElementById("vaccineName");
            const drug = document.getElementById("drugName");
            const other = document.getElementById("itemName");
            if(buys.value === "" || other.value !== "" || drug.value !== "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            }
            else {
                this.props.inputBuys(this.state);
                this.props.history.push('/');
            }
        }
        if (selectedValue !== "Vaccine" && selectedValue !== "Drug" && selectedValue !== "Other") {
            const drug = document.getElementById("drugName");
            const vaccine = document.getElementById("vaccineName");
            const item = document.getElementById("itemName");

            if(item.value !== "" || vaccine.value !== "" || drug.value !== "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            }
            else {
                this.props.inputBuys(this.state);
                this.props.history.push('/');
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

                        <select id="section" onChange={this.handleChange} className="white" defaultValue="0" >
                            <option value="0" disabled="disabled">Choose Section</option>
                            <option value="Feeds">Feeds</option>
                            <option value="Vaccines">Vaccines</option>
                            <option value="Drug">Drug</option>
                            <option value="Equipment">Equipment</option>
                            <option value="Other">Other</option>
                            <option value="Labour Payment">Labour Payment</option>
                        </select>

                        <div style={{display: 'none' }} id="other" >
                            <div className="input-field">
                                <label htmlFor="itemName">Name of Item Purchased</label>
                                <input type="text" id="itemName" onChange={this.handleChange} />
                            </div>
                        </div>

                        <div style={{display: 'none' }} id="vaccine" >
                            <div className="input-field">
                                <label htmlFor="vaccineName">Name of Vaccine Purchased</label>
                                <input type="text" id="vaccineName" onChange={this.handleChange} />
                            </div>
                        </div>

                        <div style={{display: 'none' }} id="drug" >
                            <div className="input-field">
                                <label htmlFor="drugName">Name of Drug</label>
                                <input type="text" id="drugName" onChange={this.handleChange} />
                            </div>
                        </div>

                        <div style={{display: 'none' }} id="buy" >
                            <div className="input-field">
                                <label htmlFor="objectNo">Number of Objects</label>
                                <input type="number" id="objectNo" onChange={this.handleChange} required/>
                            </div>

                            <div className="input-field">
                                <label htmlFor="objectPrice">Price per Object</label>
                                <input type="number" id="objectPrice" onChange={this.handleChange} required/>
                            </div>

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
        inputBuys: (buy) => dispatch(inputBuys(buy))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inputbuy);