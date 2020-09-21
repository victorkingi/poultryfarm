import React, {Component} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import OtherDebtList from "../projects/OtherDebtList";
import {setPerformanceEnd, setPerformanceStart} from "../../store/actions/moneyAction";

setPerformanceStart();

class OtherDebts extends Component {

    render() {
        const {otherDebt, auth} = this.props;

        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }
        return (
            <div className="dashboard container">
                <div className="row">

                    <div className="col s12 m6">
                        <OtherDebtList otherDebt={otherDebt}/>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        otherDebt: state.firestore.ordered.otherDebt
    }
}

setPerformanceEnd('DEBT_LOAD_TIME');

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'otherDebt', limit: 1000, orderBy: ['order', 'asc']}
    ])
)(OtherDebts)
