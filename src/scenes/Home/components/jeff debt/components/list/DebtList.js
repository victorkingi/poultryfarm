import React from "react";
import sample from "../../../../../../images/noProductBanner.jpg";
import DebtSummary from "../summary/DebtSummary";

const DebtList = ({debt}) => {

    if (debt) {
        if (debt['length'] > 0) {

            return (
                <div className="project-list section">
                    {debt && debt.map(item => {
                        return (
                            <DebtSummary item={item} key={item.id}/>
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
                                <span className="card-title">Debts Owing Jeff</span>
                            </div>
                            <div className="card-content">
                                <p>No debts</p>
                            </div>
                        </div>
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
                            <span className="card-title">Debts Owing Jeff</span>
                        </div>
                        <div className="card-content">
                            <p>No debts</p>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}

export default DebtList;