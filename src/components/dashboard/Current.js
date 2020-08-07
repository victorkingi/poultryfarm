import React from "react";
import moment from "moment";

const Current = (props) => {
    const {balance} = props;

    if (balance) {
        return (
            <div className="section">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">Current Balance</span>
                        <ul className="notifications">
                            {balance && balance.map(
                                item => {
                                    return (
                                        <li key={item.id}>
                                        <span className="pink-text">
                                            {item.fullName}
                                        </span>
                                            <span> Ksh.{item.balance}</span>
                                            <div className="grey-text note-date">
                                                {item.submittedOn && moment(item.submittedOn.toDate()).fromNow()}
                                            </div>
                                        </li>
                                    )
                                }
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="section">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">Current Balance</span>
                        <span className="card-content">Loading data...</span>
                    </div>
                </div>
            </div>
        );

    }
}

export default Current