import React, {useRef} from "react";
import moment from "moment";
import {payBackJeff} from "../../store/actions/moneyAction";
import {connect} from "react-redux";

const DebtSummary = (debt) => {
    const inputRef = useRef();


    const handleClick = (e) => {
        e.preventDefault();
        const load = document.getElementById(`load${debt.item.id}`);
        load.style.display = 'block';
        inputRef.current.attributes['3'].nodeValue = "display: none;";
        debt.payBackJeff(debt.item);
    }

    if (debt.item.submittedOn) {
        const time = debt.item.submittedOn.toDate() ? debt.item.submittedOn.toDate() : "No date given";


        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Debts Owing Jeff</span>
                    <p>Ksh.{debt.item.balance}</p>
                    <p className="grey-text">{moment(time).calendar()}</p>
                </div>

                <div style={{display: 'none'}} id={`load${debt.item.id}`}>
                    <div className="preloader-wrapper medium active">
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

                <button ref={inputRef} style={{display: 'block'}} id={`submit${debt.item.id}`} type="submit"
                        onClick={(e) => {
                            handleClick(e)
                        }} className="btn pink lighten-2 z-depth-0">Pay off
                </button>
            </div>
        )
    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating debts...</p>
                </div>
            </div>

        )
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        payBackJeff: (details) => dispatch(payBackJeff(details))
    }
}

export default connect(null, mapDispatchToProps)(DebtSummary);