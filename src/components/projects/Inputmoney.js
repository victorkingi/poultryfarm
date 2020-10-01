import React, {useEffect, useMemo, useState} from "react";
import {connect} from 'react-redux';
import {sendMoney} from "../../store/actions/moneyAction";
import M from 'materialize-css';
import {Redirect} from "react-router-dom";

function Inputmoney(props) {
    const [state, setState] = useState({});
    const {auth} = props;

    useEffect(() => {
        M.AutoInit();

    }, []);

    const handleChange = (e) => {
        const selectBox = document.getElementById("receiver");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const money = document.getElementById('money');
        const submit = document.getElementById('submit-btn-send-money');
        const amount = document.getElementById('amount').value;

        if (selectedValue !== "" || selectedValue !== '0') {
            money.style.display = 'block';
            document.getElementById("error-text").innerHTML = "";
        }
        if (selectedValue === auth.displayName) {
            document.getElementById("error-text").innerHTML = "ERROR: cannot send money to yourself!";
            submit.style.display = 'none';
            money.style.display = 'none';
        }

        if (amount !== "") {
            submit.style.display = 'block';
        }

        setState({
            ...state,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectBox = document.getElementById("receiver");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const load = document.getElementById("loading-send-money");
        const submit = document.getElementById("submit-btn-send-money");

        if (selectedValue === "0") {
            document.getElementById("error-text").innerHTML = "Error with selection";
        } else {
            document.getElementById("error-text").innerHTML = "";
            submit.style.display = 'none';
            load.style.display = 'block';
            props.sendMoney(state);
        }
    }

    const user = useMemo(() => {
        const __user = localStorage.getItem('user') || null;

        return {__user};
    }, []);

    if (!user) {
        return (
            <Redirect to="/signin"/>
        )
    }

    return (
        <div className="container">
            <form id="send-money-form" onSubmit={handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Send Money To</h5>

                <select id="receiver" onChange={handleChange} className="white" defaultValue="0">
                    <option value="0" disabled="disabled">Choose User</option>
                    <option value="Victor Kingi">Victor</option>
                    <option value="Purity Mukomaua">Purity</option>
                    <option value="Jeff Karue">Jeff</option>
                    <option value="Anne Kingi">Anne</option>
                    <option value="Bank Account">Bank</option>
                </select>

                <div style={{display: 'none'}} id="money">
                    <div className="input-field">
                        <label htmlFor="amount">Enter amount</label>
                        <input type="number" id="amount" onChange={handleChange} required/>
                    </div>
                </div>

                <div style={{display: 'none'}} id="loading-send-money">
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

                <div style={{display: 'none'}} id="submit-btn-send-money">
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
        sendMoney: (money) => dispatch(sendMoney(money)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inputmoney)
