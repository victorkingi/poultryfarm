import React from "react";
import moment from "moment";
import sample from "../../../../../../images/noProductBanner.jpg";

const TraySummary = (tray) => {
    if (tray.item.submittedOn && (parseInt(tray.item.number) > 0 || parseInt(tray.item.remainder) > 0)) {
        const time = tray.item.submittedOn.toDate() ? tray.item.submittedOn.toDate() : "No date given";

        let link = <p>{tray.item.number} Trays in Store and {tray.item.remainder} eggs</p>;

        if ((parseInt(tray.item.number) === 1 && parseInt(tray.item.remainder) > 1)) {
            link = <p>{tray.item.number} Tray in Store and {tray.item.remainder} eggs</p>;
        }
        if (parseInt(tray.item.number) > 1 && parseInt(tray.item.remainder) === 1) {
            link = <p>{tray.item.number} Trays in Store and {tray.item.remainder} egg</p>;
        }
        if (parseInt(tray.item.number) === 1 && parseInt(tray.item.remainder) === 1) {
            link = <p>{tray.item.number} Tray in Store and {tray.item.remainder} egg</p>;
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

            <div className="row">
                <div className="col s12 m7">
                    <div className="card">
                        <div className="card-image">
                            <img alt="forest" src={sample}/>
                            <span className="card-title">Trays In Store</span>
                        </div>
                        <div className="card-content">
                            <p>No Trays currently available</p>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default TraySummary;