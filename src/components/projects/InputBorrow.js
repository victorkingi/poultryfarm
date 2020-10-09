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
        const load = document.getElementById("loading-borrow");
        const submit = document.getElementById("submit-btn-borrow");
        submit.style.display = 'block';
        load.style.display = 'none';

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
        const borrow = document.getElementById('borrowAmount').value;
        const load = document.getElementById("loading-borrow");
        const submit = document.getElementById("submit-btn-borrow");
        e.preventDefault();

        if (parseInt(borrow) > 0 && parseInt(borrow) < Number.MAX_SAFE_INTEGER) {
            document.getElementById('error-text').innerHTML = "";
            submit.style.display = 'none';
            load.style.display = 'block';
            props.borrowSomeMoney(state);
        } else {
            document.getElementById('error-text').innerHTML = "ERROR: Must be a number above 0";
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
            <form id="borrow-form" onSubmit={handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Input Borrowed Amount</h5>

                <select id="borrower" onChange={handleChange} className="white" defaultValue="0">
                    <option value="0" disabled="disabled">Choose Borrower</option>
                    <option value="jeffkarue@gmail.com">Jeff</option>
                    <option value="Anne">Anne</option>
                </select>
                <br/>
                <div className="input-field">
                    <label htmlFor="borrowAmount">Amount</label>
                    <input type="number" id="borrowAmount" onChange={handleChange}/>
                </div>
                <br/>
                <div className="input-field">
                    <label htmlFor="purpose">Purpose</label>
                    <input type="text" id="purpose" onChange={handleChange} required/>
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

                <div id="submit-btn-borrow">
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