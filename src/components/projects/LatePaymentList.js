import React from "react";
import {Link} from "react-router-dom";
import LatePaymentSummary from "./LatePaymentSummary";
import sample from './images/sample-1.jpg';

const LatePaymentList = ({late}) => {

    if (late) {
        if (late['length'] > 0) {
            return (
                <div className="project-list section">
                    {late && late.map(item => {
                        return (
                            <Link to={'/l/' + item.id} key={item.id}>
                                <LatePaymentSummary item={item}/>
                            </Link>
                        )
                    })}
                </div>
            );
        } else {
            return (

                <div className="card z-depth-0 project-summary">
                    <div className="col s12 m7 large">
                        <div className="card large">

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
    } else {
        return (
            <div className="row">
                <div className="col s12 m7">
                    <div className="card">
                        <div className="card-image">
                            <img alt="pic" src={require('./images/sample-1.jpg')}/>
                            <span className="card-title">Late Payments</span>
                        </div>
                        <div className="card-content">
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