import React from "react";

const CloudCost = (props) => {
    const { billing } = props;

    if (billing) {
        return (
            <div className="section">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">Cloud Storage Total Cost</span>
                        <ul className="notifications">
                            {billing && billing.map((item) => {
                                    return (
                                        <li key={item.id}>
                                            <p style={{fontSize: "18px"}}>£. {item.total}</p>
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
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

}

export default CloudCost;