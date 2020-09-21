import React, {Component} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import LatePaymentList from "../projects/LatePaymentList";
import {setPerformanceEnd, setPerformanceStart} from "../../store/actions/moneyAction";

setPerformanceStart();

class Late extends Component {

    render() {
        const {late, auth} = this.props;

        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            );
        }

        if (late) {
            return (
                <div className="dashboard container">
                    <div className="row">

                        <div className="col s12 m6">
                            <LatePaymentList late={late}/>
                        </div>

                    </div>
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
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        late: state.firestore.ordered.latePayment
    }
}

setPerformanceEnd('LATE_LOAD_TIME');

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'latePayment', limit: 1000, orderBy: ['amountDue', 'desc']}
    ])
)(Late)
