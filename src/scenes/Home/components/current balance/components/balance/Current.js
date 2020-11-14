import React from "react";
import moment from "moment";
import {Redirect} from "react-router-dom";
import {connect} from 'react-redux';
import numeral from "numeral";

const Current = function(props) {
    const {balance} = props;
    const {auth, admin} = props;

    if (!auth.uid) {
        return (
            <Redirect to="/signin"/>
        )
    }

    if (balance) {

        return (
            <div className="section">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">Current Balance</span>
                        <ul className="notifications">
                            {balance && balance.map(
                                function(item) {
                                    if (admin) {
                                        return (
                                            <li key={item.id}>
                                        <span className="pink-text">
                                            {item.fullName}
                                        </span>
                                                <span> Ksh.{numeral(item.balance).format("0,0")}</span>
                                                <div className="grey-text note-date">
                                                    {item.submittedOn && moment(item.submittedOn.toDate()).fromNow()}
                                                </div>
                                            </li>
                                        )
                                    } else {

                                        if (item.fullName === "Bank Account") {
                                            return (
                                                <div key={item.id}>

                                                </div>
                                            )
                                        } else {
                                            return (
                                                <li key={item.id}>
                                                    <span className="pink-text">
                                                        {item.fullName}
                                                    </span>
                                                    <span> Ksh.{numeral(item.balance).format("0,0")}</span>
                                                    <div className="grey-text note-date">
                                                        {item.submittedOn && moment(item.submittedOn.toDate()).fromNow()}
                                                    </div>
                                                </li>
                                            )
                                        }
                                    }
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


const mapStateToProps = function(state){
    return {
        auth: state.firebase.auth,
        admin: state.auth.admin,
    }
}

export default connect(mapStateToProps)(Current);