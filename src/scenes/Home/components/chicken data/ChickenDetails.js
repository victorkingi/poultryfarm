import React from "react";
import {connect} from "react-redux";
import numeral from "numeral";


const ChickenDetails = function(props){
    const {chicken} = props;

    if (chicken) {
        return (
            <div className="section">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">Birds' Details</span>
                        <ul className="notifications">
                            {chicken && chicken.map(
                                function(item){
                                    const weekPercent = Math
                                        .round((item.weekPercent + Number.EPSILON) * 100) / 100;
                                    const weekCagePercent = Math
                                        .round((item.weekCagePercent + Number.EPSILON) * 100) / 100;
                                    const weekHousePercent = Math
                                        .round((item.weekHousePercent + Number.EPSILON) * 100) / 100;
                                    const weekProfit = item.weekProfit < 0
                                        ? (<div><span style={{fontSize: "20px"}}>Last Week's Loss</span>
                                            <p style={{fontSize: "18px"}}>Ksh.{numeral(parseInt(item.weekProfit) * -1).format("0,0")}</p>
                                        </div>)
                                        : (<div><span style={{fontSize: "20px"}}>Last Week's Profit</span>
                                            <p style={{fontSize: "18px"}}>Ksh.{numeral(item.weekProfit).format("0,0")}</p>
                                        </div>);
                                    const monthProfit = item.monthProfit < 0
                                        ? (<div><span style={{fontSize: "20px"}}>Last Month's Loss</span>
                                            <p style={{fontSize: "18px"}}>Ksh.{numeral(parseInt(item.monthProfit) * -1).format("0,0")}</p>
                                        </div>)
                                        : (<div><span style={{fontSize: "20px"}}>Last Month's Profit</span>
                                            <p style={{fontSize: "18px"}}>Ksh.{numeral(item.monthProfit).format("0,0")}</p>
                                        </div>);
                                    const string_w = weekProfit?.props?.children[0].props?.children;
                                    const status_w = string_w.substr(string_w.lastIndexOf(" ") + 1);
                                    const string_m = monthProfit?.props?.children[0].props?.children;
                                    const status_m = string_m.substr(string_m.lastIndexOf(" ") + 1);
                                    let links;
                                    if (status_w === 'Loss' || status_m === 'Loss') {
                                        if (status_w === 'Loss') {
                                            links = <div>{weekProfit}{monthProfit}</div>;
                                        } else if (status_m === 'Loss') {
                                            links = <div>{monthProfit}{weekProfit}</div>;
                                        }
                                    }

                                    return (
                                        <li key={item.id}>
                                            {links}
                                            <span style={{fontSize: "20px"}}>Weekly laying percentage</span>
                                            <p style={{fontSize: "18px"}}>{weekPercent}%</p>
                                            <span style={{fontSize: "20px"}}>Weekly House Laying percentage</span>
                                            <p style={{fontSize: "18px"}}>{weekHousePercent}%</p>
                                            <span style={{fontSize: "20px"}}>Weekly Cage laying percentage</span>
                                            <p style={{fontSize: "18px"}}>{weekCagePercent}%</p>
                                            <span style={{fontSize: "20px"}}>No. of Months</span>
                                            <p style={{fontSize: "18px"}}>{item.monthNo}</p>
                                            <span style={{fontSize: "20px"}}>No. of weeks</span>
                                            <p style={{fontSize: "18px"}}>{item.weekNo}</p>
                                            <span style={{fontSize: "20px"}}>Total Birds</span>
                                            <p style={{fontSize: "18px"}}>{item.total}</p>
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


const mapStateToProps = function(state) {
    return {
        auth: state.firebase.auth
    }
}

export default connect(mapStateToProps)(ChickenDetails);