import React from "react";
import RollbackSummary from "../summary/RollbackSummary";

const Rollback = ({roll}) => {
    if (roll['length'] > 0) {
        return (
            <div className="project-list section">
                {roll && roll.slice(0, 10).map(item => {
                    const user = item.docId?.substring(0, 8);
                    const res = user
                    === "userLogs" ? item.docId?.substring(9,
                        item.docId?.lastIndexOf("/")) : null;
                    const uid = res !== null ? res.substring(0, res.lastIndexOf("/")) : null;
                    let name;
                    if (uid === "1vMGrBhcwPXj2b4k2BlpAPyHAtc2") {
                        name = "Babra";
                    } else if (uid === "cMxQ5l47KmVackqSRBpaM3ieVCX2") {
                        name = "Victor";
                    } else if (uid === "jj9uon3O9LOaM6k5wtkeVUAy5wi2") {
                        name = "Purity"
                    } else if (uid === "uM7j65iqBzQmU5vJZCzAsOibba53") {
                        name = "Jeff";
                    }
                    return (
                        <li key={item.id}>
                            <RollbackSummary item={item} name={name}/>
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