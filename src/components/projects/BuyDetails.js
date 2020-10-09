import React, {useMemo} from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import {Redirect} from "react-router-dom";
import moment from "moment";
import numeral from "numeral";

const BuyDetails = (props) => {
    const {buy} = props;
    const user = useMemo(() => {
        const __user = localStorage.getItem('user') || false;

        return {__user};
    }, []);

    if (!user.__user) {
        return (
            <Redirect to='/signin'/>
        );
    }

    if (buy) {
        const total = buy.objectNo * buy.objectPrice;
        const time = buy.submittedOn.toDate() ? buy.submittedOn.toDate() : "No date given";

        if (buy.itemName) {
            return (
                <div className="container section project-details">
                    <div className="card z-depth-0">
                        <div className="card-content">
                            <span className="card-title">{buy.category}: {buy.section}</span>
                            <p>We bought {numeral(buy.objectNo).format("0,0")} {buy.itemName} that costed
                                Ksh.{numeral(buy.objectPrice).format("0,0")} per item,
                                hence, spent Ksh.{numeral(total).format("0,0")} in total.</p>
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
                            <p>We bought {numeral(buy.objectNo).format("0,0")} items that costed
                                Ksh.{numeral(buy.objectPrice).format("0,0")} per item,
                                hence, spent Ksh.{numeral(total).format("0,0")} in total.</p>
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
        buy: buy
    }
}

export default compose(
    firestoreConnect(() => ['buys']),
    connect(mapStateToProps)
)(BuyDetails)