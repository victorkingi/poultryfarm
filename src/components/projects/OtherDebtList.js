import React from "react";
import sample from "./images/sample-1.jpg";
import OtherDebtSummary from "./OtherDebtSummary";

const OtherDebtList = ({otherDebt}) => {

    if (otherDebt) {
        if (otherDebt['length'] > 0) {

            return (
                <div className="project-list section">
                    {otherDebt && otherDebt.map(item => {
                        return (
                            <OtherDebtSummary item={item}/>
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
                                <span className="card-title">Debts</span>
                            </div>

                            <div className="card-content grey-text text-darken-3">
                                <p>We are debt free!</p>
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

export default OtherDebtList;