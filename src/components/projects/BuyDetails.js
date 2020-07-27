import React from "react";
import { connect } from 'react-redux';
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import moment from "moment";

const BuyDetails = (props) => {
    const { buy, auth } = props;

    if (!auth.uid) return <Redirect to='/signin' />

    if (buy) {
        const total = buy.objectNo * buy.objectPrice;
        const time = buy.submittedOn.toDate() ? buy.submittedOn.toDate() : "No date given";

        if(buy.itemName) {
            return (
                <div className="container section project-details">
                    <div className="card z-depth-0">
                        <div className="card-content">
                            <span className="card-title">{buy.category}: {buy.section}</span>
                            <p>We bought {buy.objectNo} {buy.itemName} that costed Ksh.{buy.objectPrice} per item,
                                hence, spent Ksh.{total} in total.</p>
                        </div>
                        <div className="card-action grey lighten-4 grey-text">
                            <div>Posted by {buy.submittedBy}</div>
                            <div>{moment(time).calendar()}</div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="container section project-details">
                    <div className="card z-depth-0">
                        <div className="card-content">
                            <span className="card-title">{buy.category}: {buy.section}</span>
                            <p>We bought {buy.objectNo} items that costed Ksh.{buy.objectPrice} per item,
                                hence, spent Ksh.{total} in total.</p>
                        </div>
                        <div className="card-action grey lighten-4 grey-text">
                            <div>Posted by {buy.submittedBy}</div>
                            <div>{moment(time).calendar()}</div>
                        </div>
                    </div>
                </div>
            )
        }
    } else {
        return (
            <div className="container center">
                <p>Loading purchases...</p>
            </div>

        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const buys = state.firestore.data.buys;
    const buy = buys ? buys[id] : null;

    return {
        buy: buy,
        auth: state.firebase.auth
    }
}

export default compose(
    firestoreConnect(() => ['buys']),
    connect(mapStateToProps)
)(BuyDetails)