import React, {useRef} from "react";
import moment from "moment";
import {connect} from 'react-redux';
import numeral from "numeral";
import {weClearedOurDebt} from "../../../../services/actions/moneyAction";

const OtherDebtSummary = (otherDebt) => {
    const inputRef = useRef();


    const handleClick = (e) => {
        e.preventDefault();
        const load = document.getElementById(`load${otherDebt.item.id}`);
        load.style.display = 'block';
        inputRef.current.attributes['3'].nodeValue = "display: none;";

        otherDebt.weClearedOurDebt(otherDebt.item);
    }

    if (otherDebt.item.id === "TotalThikaFarmers") {
        const time = otherDebt.item.submittedOn.toDate()
            ? otherDebt.item.submittedOn.toDate() : "No date given";

        if (parseInt(otherDebt.item.total) < 0) {
            const amount = parseInt(otherDebt.item.total) * -1;

            return (
                <div className="card z-depth-0 project-summary">
                    <div className="card-content grey-text text-darken-3">
                    <span
                        className="card-title">Thika Farmers Owe us Ksh.{numeral(amount).format("0,0")}</span>
                        <p className="grey-text">{moment(time).calendar()}</p>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="card z-depth-0 project-summary">
                    <div className="card-content grey-text text-darken-3">
                    <span
                        className="card-title">Thika Farmers Total Debt: Ksh.{numeral(otherDebt.item.total).format("0,0")}</span>
                        <p className="grey-text">{moment(time).calendar()}</p>
                    </div>
                </div>
            )
        }

    } else if (otherDebt.item.balance) {
        const time = otherDebt.item.submittedOn.toDate() ? otherDebt.item.submittedOn.toDate() : "No date given";


        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Other Debt: {otherDebt.item.debtor}</span>
                    <p>Amount we owe them is Ksh.{numeral(otherDebt.item.balance).format("0,0")}</p>
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
        weClearedOurDebt: (details) => dispatch(weClearedOurDebt(details))
    }
}


export default connect(null, mapDispatchToProps)(OtherDebtSummary);