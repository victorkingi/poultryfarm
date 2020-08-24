import React from "react";
import {Link} from "react-router-dom";
import sample from "./images/sample-1.jpg";
import SickDeadSummary from "./SickDeadSummary";

const SickDeadList = ({deadSick}) => {

    if (deadSick) {
        if (deadSick['length'] > 0) {

            return (
                <div className="project-list section">
                    {deadSick && deadSick.map(item => {
                        return (
                            <Link to={'/sd/' + item.id} key={item.id}>
                                <SickDeadSummary item={item}/>
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
                                <span className="card-title">Dead/Sick Chickens</span>
                            </div>

                            <div className="card-content grey-text text-darken-3">
                                <p>No dead/sick chickens</p>
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

export default SickDeadList;