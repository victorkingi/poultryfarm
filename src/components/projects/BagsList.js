import React from "react";
import sample from "./images/sample-1.jpg";
import BagsSummary from "./BagsSummary";

const BagsList = (bags) => {

    if (bags.bags) {
        if (bags.bags['length'] > 0) {
            return (
                <div className="project-list section">
                    {bags.bags && bags.bags.map(item => {
                        return (
                            <BagsSummary item={item} key={item.id}/>
                        );
                    })}
                </div>
            );
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
    } else {
        return (
            <div className="section">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">Feeds</span>
                        <span className="card-content">Loading data...</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default BagsList;