import React from "react";
import LatePaymentSummary from "../summary/LatePaymentSummary";
import sample from "../../../../images/noProductBanner.jpg";

const LatePaymentList = ({late}) => {

    if (late) {
        if (late['length'] > 0) {
            return (
                <div className="project-list section">
                    {late && late.map(item => {
                        return (
                            <li key={item.id}>
                                <LatePaymentSummary item={item}/>
                            </li>
                        )
                    })}
                </div>
            );
        } else {
            return (


                <div className="progress">
                    <div className="indeterminate"/>
                </div>

            );
        }
    } else {
        return (
            <div className="row">
                <div className="col s12 m7">
                    <div className="card">

                        <div className="card-image">
                            <img alt="pic" src={sample}/>
                            <span className="card-title">Late Payments</span>
                        </div>

                        <div className="card-content grey-text text-darken-3">
                            <p>No late payments available</p>
                        </div>
                        <div className="card-action">
                            <a href="/">Go to Dashboard</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LatePaymentList;