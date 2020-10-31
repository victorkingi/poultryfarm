import React from "react";
import BuySummary from "../summary/BuySummary";
import {Link} from "react-router-dom";
import sample from "../../../../images/noProductBanner.jpg";

const BuyList = ({buys}) => {

    if (buys) {
        if (buys['length'] > 0) {

            return (
                <div className="project-list section">
                    {buys && buys.map(buy => {
                        return (
                            <Link to={'/b/' + buy.id} key={buy.id}>
                                <BuySummary buy={buy}/>
                            </Link>
                        )
                    })}
                </div>
            );
        } else {
            return (

                <div className="row">
                    <div className="col s12 m7">
                        <div className="card">
                            <div className="card-image">
                                <img alt="pic" src={sample}/>
                                <span className="card-title">Purchases Made</span>
                            </div>

                            <div className="card-content grey-text text-darken-3">
                                <p>No purchase data</p>
                            </div>

                            <div className="card-action">
                                <a href="/">Go to Dashboard</a>
                            </div>

                        </div>
                    </div>
                </div>

            );
        }
    } else {
        return (
            <div className="progress">
                <div className="indeterminate"/>
            </div>

        );
    }
}

export default BuyList;