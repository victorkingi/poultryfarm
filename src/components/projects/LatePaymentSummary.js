import React from "react";
import moment from "moment";

const LatePaymentSummary = (late) => {

    if (late) {
        const time = late.item.submittedOn.toDate() ? late.item.submittedOn.toDate() : "No date given";
        const buy = late.item.buyer ? late.buyer : late.item.section;

        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Not yet paid</span>
                    <span style={{fontSize: "30px"}}>{buy}</span>
                    <p>Amount due: Ksh.{late.item.amountDue}</p>
                    <p className="grey-text">{moment(time).calendar()}</p>
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

export default LatePaymentSummary;