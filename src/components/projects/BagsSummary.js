import React from "react";
import moment from "moment";
import sample from "./images/sample-1.jpg";

const BagsSummary = (bag) => {

    if (bag) {
        if (parseInt(bag.item.number) < 1) {
            return (

                <div className="row">
                    <div className="col s12 m7">
                        <div className="card">
                            <div className="card-image">
                                <img alt="forest" src={sample}/>
                                <span className="card-title">Feeds</span>
                            </div>
                            <div className="card-content">
                                <p>No bags of feeds currently in store</p>
                            </div>
                        </div>
                    </div>
                </div>
            );

        } else {

            var link = <p>{bag.item.number} Bags of Feeds in Store</p>
            const time = bag ? bag.item.date.toDate() : "No date given";


            if (parseInt(bag.item.number) === 1) {
                link = <p>{bag.item.number} Bag of Feeds in Store</p>
            }


            return (
                <div className="card z-depth-0 project-summary">
                    <div className="card-content grey-text text-darken-3">
                        <span className="card-title">Feeds</span>
                        {link}
                        <p className="grey-text">{moment(time).calendar()}</p>
                    </div>
                </div>
            );
        }

    } else {
        return (

            <div className="row">
                <div className="col s12 m7">
                    <div className="card">
                        <div className="card-image">
                            <img alt="forest" src={sample}/>
                            <span className="card-title">Feeds</span>
                        </div>
                        <div className="card-content">
                            <p>No bags of feeds currently in store</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BagsSummary;