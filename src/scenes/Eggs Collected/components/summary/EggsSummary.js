import React from "react";
import moment from "moment";

const EggsSummary = ({egg}) => {

    if (egg.submittedOn) {
        const time = egg.date.toDate() ? egg.date.toDate() : "No date given";
        const a1 = parseInt(egg['A 1']);
        const a2 = parseInt(egg['A 2']);
        const b1 = parseInt(egg['B 1']);
        const b2 = parseInt(egg['B 2']);
        const c1 = parseInt(egg['C 1']);
        const c2 = parseInt(egg['C 2']);
        const house = parseInt(egg['house']);
        const total = a1 + a2 + b1 + b2 + c1 + c2 + house;

        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{egg.category}: {total} eggs were collected </span>
                    <p>Posted by {egg.submittedBy}</p>
                    <p className="grey-text">{moment(time).calendar()}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating eggs collected...</p>
                </div>
            </div>

        )
    }
}

export default EggsSummary;