import React from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import {Redirect} from "react-router-dom";
import moment from "moment";
import {latePays} from "../../store/actions/moneyAction";


const LatePaymentDetails = (props) => {
    const {late, auth} = props;
    var state = {
        submittedOn: '',
        amount: 0
    }
    if (!auth.uid) {
        return (
            <Redirect to="/signin"/>
        )
    }

    const handlePayment = (e) => {
        e.preventDefault();
        state = {
            submittedOn: late.submittedOn,
            amount: late.amountDue,
            section: late.section,
            trayNo: late.trayNo,
            trayPrice: late.trayPrice,
            buyer: late.buyer,
            saleKey: late.saleKey
        }
        props.latePays(state);
        props.history.push('/');
    }

    if (late) {
        const time = late.submittedOn.toDate() ? late.submittedOn.toDate() : "No date given";

        const buy = late.buyer ? late.buyer : late.section;

        if (late.amountDue) {
            return (
                <div className="container section project-details">
                    <div className="card z-depth-0">
                        <div className="card-content">
                            <span className="card-title">{buy}</span>
                            <p>Amount due: {late.amountDue}</p>
                            <p>Sold {late.trayNo} trays at a price of Ksh.{late.trayPrice}</p>
                        </div>
                        <div className="card-action grey lighten-4 grey-text">
                            <div>Posted by {late.submittedBy}</div>
                            <div>{moment(time).calendar()}</div>
                            <button onClick={handlePayment} className="btn pink lighten-2 z-depth-0">Payment Received
                            </button>
                        </div>
                    </div>
                </div>
            )

        }
    } else {
        return (
            <div className="container center">
                <p>Loading late payments...</p>
            </div>

        );
    }
}

const mapStateToProps = (state, ownProps) => {

    const id = ownProps.match.params.id;
    const late = state.firestore.data.latePayment;
    const oneLate = late ? late[id] : null;

    return {
        late: oneLate,
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        latePays: (details) => dispatch(latePays(details))
    }
}


export default compose(
    firestoreConnect(() => ['latePayment']),
    connect(mapStateToProps, mapDispatchToProps)
)(LatePaymentDetails)