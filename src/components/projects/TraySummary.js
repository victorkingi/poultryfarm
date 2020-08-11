import React from "react";
import moment from "moment";

const TraySummary = (tray) => {
    if (tray.item.submittedOn) {
        const time = tray.item.submittedOn.toDate() ? tray.item.submittedOn.toDate() : "No date given";
        var link = <p>{tray.item.number} Trays in Store</p>;
        if (parseInt(tray.item.number) === 1) {
            link = <p>{tray.item.number} Tray in Store</p>;
        }

        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Trays In Store</span>
                    {link}
                    <p className="grey-text">{moment(time).calendar()}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating trays...</p>
                </div>
            </div>

        )
    }
}

export default TraySummary;