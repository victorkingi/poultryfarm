import React from "react";
import SalesSummary from "./SalesSummary";
import {Link} from "react-router-dom";
import sample from "./images/sample-1.jpg";

const SalesList = ({sales}) => {

    if (sales) {
        if (sales['length'] > 0) {

            return (
                <div className="project-list section">
                    {sales && sales.map(item => {
                        return (
                            <Link to={'/s/' + item.id} key={item.id}>
                                <SalesSummary item={item}/>
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
                                <span className="card-title">Sales Made</span>
                            </div>

                            <div className="card-content grey-text text-darken-3">
                                <p>No sales data</p>
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

export default SalesList;