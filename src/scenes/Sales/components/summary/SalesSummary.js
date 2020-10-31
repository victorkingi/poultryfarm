import React from "react";
import moment from "moment";
import numeral from "numeral";

const SalesSummary = (sales) => {

    if (sales.item) {
        const total = sales.item.chickenNo ? (sales.item.chickenNo * sales.item.chickenPrice) : (sales.item.trayNo * sales.item.trayPrice);
        const buyer = sales.item.buyerName ? sales.item.buyerName : sales.item.section;
        const time = sales.item.date ? sales.item.date.toDate() : "No date given";


        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{sales.item.category}: {buyer}</span>
                    <p>We earned Ksh.{numeral(total).format("0,0")}</p>
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