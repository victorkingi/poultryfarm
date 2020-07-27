import React from "react";
import moment from "moment";

const BuySummary = ({buy}) => {

    if(buy.submittedOn) {
        const total = buy.objectNo * buy.objectPrice;
        const object = buy.itemName ? buy.itemName : buy.section;
        const time = buy.submittedOn.toDate() ? buy.submittedOn.toDate() : "No date given";

        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{buy.category}: { object }</span>
                    <p>We spent Ksh.{ total }</p>
                    <p>Posted by { buy.submittedBy }</p>
                    <p className="grey-text">{moment(time).calendar()}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating purchases made...</p>
                </div>
            </div>

        )
    }
}

export default BuySummary;