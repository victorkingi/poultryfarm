import React from "react";
import moment from "moment";
import {connect} from "react-redux";
import {latePays} from "../../store/actions/moneyAction";

const LatePaymentSummary = (late) => {

    const handleClick = (e) => {
        e.preventDefault();
        late.latePays(late.item);

    }

    if (late) {
        const time = late.item.date.toDate() ? late.item.date.toDate() : "No date given";
        const buy = late.item.buyer ? late.item.buyer : late.item.section;

        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Not yet paid</span>
                    <span style={{fontSize: "30px"}}>{buy}</span>
                    <p>Amount due: Ksh.{late.item.amountDue}</p>
                    <p className="grey-text">{moment(time).calendar()}</p>

                    <button id="mySubmit" type="submit" onClick={(e) => {
                        handleClick(e)
                    }} className="btn pink lighten-2 z-depth-0">Payment received
                    </button>

                </div>
            </div>
        )

    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating late payments...</p>
                </div>
            </div>

        )
    }
}


const mapDispatchToProps = (dispatch) => {

    return {
        latePays: (details) => dispatch(latePays(details))
    }
}

export default connect(null, mapDispatchToProps)(LatePaymentSummary);