import React from "react";
import sample from "./images/sample-1.jpg";
import BorrowSummary from "./BorrowSummary";

const BorrowList = ({borrow}) => {

    if (borrow) {
        if (borrow['length'] > 0) {

            return (
                <div className="project-list section">
                    {borrow && borrow.map(item => {
                        return (
                            <BorrowSummary item={item} key={item.id}/>
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
                                <img alt="picture" src={sample}/>
                                <span className="card-title">Borrows</span>
                            </div>
                            <div className="card-content">
                                <p>No borrows</p>
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

export default BorrowList;