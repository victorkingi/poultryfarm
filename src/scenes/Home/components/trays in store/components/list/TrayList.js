import React from "react";
import sample from "../../../../../../images/noProductBanner.jpg";
import TraySummary from "../summary/TraySummary";

const TrayList = function(trays){

    if (trays.trays) {
        if (trays.trays['length'] > 0) {
            return (
                <div className="project-list section">
                    {trays.trays && trays.trays.map(function(item) {
                        return (
                            <TraySummary item={item} key={item.id}/>
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
    } else {
        return (
            <div className="section">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">Trays In Store</span>
                        <span className="card-content">Loading data...</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default TrayList;