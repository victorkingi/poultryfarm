import React, {useEffect, useMemo, useState} from "react";
import {connect} from 'react-redux';
import {borrowSomeMoney} from "../../store/actions/moneyAction";
import M from 'materialize-css';
import {Redirect} from "react-router-dom";

function InputBorrow(props) {
    const [state, setState] = useState({category: 'borrow'});

    useEffect(() => {
        M.AutoInit();

    }, []);

    const handleChange = (e) => {
        const selectBox = document.getElementById("borrower");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const borrow = document.getElementById('borrow');
        const borrow2 = document.getElementById('borrowAmount').value;
        const submit = document.getElementById('submit-btn-borrow');

        if (selectedValue !== "") {
            borrow.style.display = 'block';
        }

        if (parseInt(borrow2) > 0 && parseInt(borrow2) < Number.MAX_SAFE_INTEGER) {
            submit.style.display = 'block';
            document.getElementById('error-text').innerHTML = "";
        } else {
            submit.style.display = 'none';
            document.getElementById('error-text').innerHTML = "ERROR: Must be a number above 0";
        }

        const myInt = parseInt(e.target.value);

        if (isNaN(myInt)) {
            setState({
                ...state,
                [e.target.id]: e.target.value
            });
        } else {
            setState({
                ...state,
                [e.target.id]: myInt
            });
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const load = document.getElementById("loading-borrow");
        const submit = document.getElementById("submit-btn-borrow");

        submit.style.display = 'none';
        load.style.display = 'block';

        props.borrowSomeMoney(state);

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
            <form id="borrow-form" onSubmit={handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Input Borrowed Amount</h5>

                <select id="borrower" onChange={handleChange} className="white" defaultValue="0">
                    <option value="0" disabled="disabled">Choose Borrower</option>
                    <option value="jeffkarue@gmail.com">Jeff</option>
                    <option value="Anne">Anne</option>
                </select>
                <br/>
                <div style={{display: 'none'}} id="borrow">
                    <div className="input-field">
                        <label htmlFor="borrowAmount">Amount</label>
                        <input type="number" id="borrowAmount" onChange={handleChange}/>
                    </div>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="purpose">Purpose</label>
                        <input type="text" id="purpose" onChange={handleChange} required/>
                    </div>

                </div>

                <div style={{display: 'none'}} id="loading-borrow">
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

                <div style={{display: 'none'}} id="submit-btn-borrow">
                    <div className="input-field">
                        <button type="Submit" className="btn pink lighten-1 z-depth-0">Submit</button>
                    </div>
                </div>
                <div className="red-text center" id="error-text"/>
            </form>
            </div>
        );
}

const mapDispatchToProps = (dispatch) => {
    return {
        borrowSomeMoney: (details) => dispatch(borrowSomeMoney(details))
    }
}

export default connect(null, mapDispatchToProps)(InputBorrow)