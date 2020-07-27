import React from "react";
import EggsSummary from "./EggsSummary";
import { Link } from "react-router-dom";

const EggsList = ({eggs}) => {
    return (
        <div className="project-list section">
            { eggs && eggs.map(egg => {
                return (
                    <Link to={'/e/' + egg.id} key={egg.id} >
                    <EggsSummary egg={egg}  />
                    </Link>
                )
            })}
        </div>
    )
}

export default EggsList;