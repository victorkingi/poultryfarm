import React from "react";
import EggsSummary from "./EggsSummary";
import {Link} from "react-router-dom";
import sample from "./images/sample-1.jpg";

const EggsList = ({eggs}) => {

    if (eggs) {
        if (eggs['length'] > 0) {

            return (
                <div className="project-list section">
                    {eggs && eggs.map(egg => {
                        return (
                            <Link to={'/e/' + egg.id} key={egg.id}>
                                <EggsSummary egg={egg}/>
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
                                <span className="card-title">Eggs Collected</span>
                            </div>

                            <div className="card-content grey-text text-darken-3">
                                <p>No eggs collected data</p>
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

export default EggsList;