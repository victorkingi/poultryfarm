import React, {useRef} from "react";
import moment from "moment";
import {clearedDebt} from "../../store/actions/moneyAction";
import {connect} from 'react-redux';

const OtherDebtSummary = (otherDebt) => {
    const inputRef = useRef();


    const handleClick = (e) => {
        e.preventDefault();
        const load = document.getElementById(`load${otherDebt.item.id}`);
        load.style.display = 'block';
        inputRef.current.attributes['3'].nodeValue = "display: none;";

        otherDebt.clearedDebt(otherDebt.item);
    }

    if (otherDebt.item.submittedOn) {
        const time = otherDebt.item.submittedOn.toDate() ? otherDebt.item.submittedOn.toDate() : "No date given";


        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Other Debt: {otherDebt.item.debter}</span>
                    <p>Amount we owe them is Ksh.{otherDebt.item.balance}</p>
                    <p className="grey-text">{moment(time).calendar()}</p>

                    <div style={{display: 'none'}} id={`load${otherDebt.item.id}`}>
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

                    <button ref={inputRef} style={{display: 'block'}} type="submit" onClick={(e) => {
                        handleClick(e)
                    }} className="btn pink lighten-2 z-depth-0" id={`submit${otherDebt.item.id}`}>Cleared
                    </button>

                </div>
            </div>
        )
    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating debt...</p>
                </div>
            </div>

        )
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        clearedDebt: (details) => dispatch(clearedDebt(details))
    }
}


export default connect(null, mapDispatchToProps)(OtherDebtSummary);