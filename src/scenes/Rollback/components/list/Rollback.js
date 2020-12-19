import React from "react";
import RollbackSummary from "../summary/RollbackSummary";

const Rollback = ({roll}) => {

    if (roll['length'] > 0) {
        return (
            <div className="project-list section">
                {roll && roll.map(item => {
                    return (
                        <li key={item.id}>
                            <RollbackSummary item={item}/>
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
}

export default Rollback;