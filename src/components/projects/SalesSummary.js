import React from "react";
import moment from "moment";

const SalesSummary = (sales) => {

    if(sales.item.submittedOn) {
        const total = sales.item.trayNo * sales.item.trayPrice;
        const buyer = sales.item.buyerName ? sales.item.buyerName : sales.item.section;
        const time = sales.item.submittedOn.toDate() ? sales.item.submittedOn.toDate() : "No date given";



        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{sales.item.category}: {buyer}</span>
                    <p>We earned Ksh.{total}</p>
                    <p className="grey-text">{moment(time).calendar()}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating sales made...</p>
                </div>
            </div>

        )
    }
}

export default SalesSummary;