import React, {useEffect, useMemo, useState} from "react";
import {connect} from 'react-redux';
import {inputPurchase} from "../../../../../services/actions/buyAction";
import M from 'materialize-css';
import {Redirect} from "react-router-dom";


function Inputbuy(props) {

    const [state, setState] = useState({
        category: 'buys'
    });

    useEffect(() => {
        M.AutoInit();

    }, []);

    const handleChange = (e) => {
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
            setState({
                ...state,
                [e.target.id]: JSON.parse(e.target.value)
            });
        } else if (e.target.id === "date" || e.target.id === "objectNo" || e.target.id === "objectPrice" || e.target.id === "month") {

            if (isNaN(parseInt(e.target.value))) {
                document.getElementById("error-text").innerHTML = "Error! Input needs to be a number";
            } else {
                document.getElementById("error-text").innerHTML = "";

                setState({
                    ...state,
                    [e.target.id]: parseInt(e.target.value)
                });
            }
        } else {
            setState({
                ...state,
                [e.target.id]: e.target.value
            });
        }


    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const selectBox = document.getElementById("section");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const status = document.getElementById("status");
        const vaccine = document.getElementById("vaccineName");
        const drug = document.getElementById("drugName");
        const other = document.getElementById("itemName");
        const load = document.getElementById("loading-buys");
        const submit = document.getElementById("submit-btn-buys");

        if (selectedValue === "Other" || selectedValue === "Feeds") {

            if (other.value === "" || drug.value !== "" || vaccine.value !== "" || status.value === "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            } else {
                submit.style.display = 'none';
                load.style.display = 'block';
                props.inputPurchase(state);
            }
        }
        if (selectedValue === "Drug") {

            if (drug.value === "" || other.value !== "" || vaccine.value !== "" || status.value === "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            } else {
                submit.style.display = 'none';
                load.style.display = 'block';
                props.inputPurchase(state);
            }
        }
        if (selectedValue === "Vaccines") {

            if (vaccine.value === "" || other.value !== "" || drug.value !== "" || status.value === "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            } else {
                submit.style.display = 'none';
                load.style.display = 'block';
                props.inputPurchase(state);
            }
        }
        if (selectedValue !== "Vaccine" && selectedValue !== "Drug" && selectedValue !== "Other" && selectedValue !== "Feeds") {

            if (other.value === "" || vaccine.value !== "" || drug.value !== "" || status.value === "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            } else {
                submit.style.display = 'none';
                load.style.display = 'block';
                props.inputPurchase(state);
            }
        }

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
            <form id="buys-form" onSubmit={handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Input Purchases</h5>
                <br/>
                <div className="input-field">
                    <label htmlFor="date">Select Date (range: 1 - 31)</label>
                    <input type="number" id="date" onChange={handleChange} required/>
                </div>
                <br/>
                <div className="input-field">
                    <label htmlFor="month">Select Month (range: 1 - 12)</label>
                    <input type="number" id="month" onChange={handleChange} required/>
                </div>

                <div style={{display: 'none'}} id="mySection">
                    <select style={{display: 'none'}} id="section" onChange={handleChange}
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
                        <input type="text" id="itemName" onChange={handleChange}/>
                    </div>
                </div>

                <div style={{display: 'none'}} id="labour">
                    <br/>
                    <div className="input-field">
                        <label htmlFor="labourName">Name of Person Paid</label>
                        <input type="text" id="labourName" onChange={handleChange}/>
                    </div>
                </div>

                <div style={{display: 'none'}} id="vaccine">
                    <br/>
                    <div className="input-field">
                        <label htmlFor="vaccineName">Name of Vaccine Purchased</label>
                        <input type="text" id="vaccineName" onChange={handleChange}/>
                    </div>
                </div>

                <div style={{display: 'none'}} id="drug">
                    <br/>
                    <div className="input-field">
                        <label htmlFor="drugName">Name of Drug</label>
                        <input type="text" id="drugName" onChange={handleChange}/>
                    </div>
                </div>

                <div style={{display: 'none'}} id="buy">
                    <br/>
                    <div className="input-field">
                        <label htmlFor="objectNo">Number of Objects</label>
                        <input type="number" id="objectNo" onChange={handleChange} required/>
                    </div>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="objectPrice">Price per Object</label>
                        <input type="number" id="objectPrice" onChange={handleChange} required/>
                    </div>

                    <select id="status" onChange={handleChange} className="white" defaultValue="0">
                        <option value="0" disabled="disabled">Status</option>
                        <option value={true}>Paid</option>
                        <option value={false}>Not paid</option>
                    </select>

                    <div style={{display: 'none'}} id="loading-buys">
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
                        <button type="Submit" id="submit-btn-buys"
                                className="btn pink lighten-1 z-depth-0">Submit
                        </button>
                    </div>
                </div>

                <div className="red-text center" id="error-text"/>

            </form>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        inputPurchase: (buy) => dispatch(inputPurchase(buy))
    }
}

export default connect(null, mapDispatchToProps)(Inputbuy);