import React, {Component} from "react";
import Notifications from "./Notifications";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase';
import {Redirect} from 'react-router-dom';
import {checkClaims} from "../../store/actions/authActions";
import Current from "./Current";
import DebtList from "../projects/DebtList";
import TrayList from "../projects/TrayList";
import BagsList from "../projects/BagsList";


class Dashboard extends Component {

    render() {
        const {balance, bags, trays, debt, auth, admin, profile, notifications} = this.props;
        this.props.checkClaims();

        if (!auth.uid) {
            return (
                <Redirect to="/signin" />
            )
        }

        if (admin) {
            return (
                <div className="dashboard container">
                    <div className="row">

                        <div className="col s12 m5 offset-m1">
                            <Notifications notifications={notifications}/>
                        </div>

                        <div className="col s12 m5 offset-m1">
                            <Current balance={balance}/>
                        </div>

                        <div className="col s12 m5 offset-m1">
                            <TrayList trays={trays}/>
                        </div>

                        <div className="col s12 m5 offset-m1">
                            <BagsList bags={bags}/>
                        </div>

                        <div className="col s12 m5 offset-m1">
                            <DebtList debt={debt}/>
                        </div>

                    </div>
                </div>
            )
        } else {

            if(profile.firstName) {
                return (
                    <div className="dashboard container">

                        <div className="center-align">
                            <h3 className="spinner-blue"> Welcome {profile.firstName}</h3>
                        </div>

                    </div>
                )
            }
            else {
                return (
                    <div className="dashboard container">

                    </div>
                )
            }
        }

    }
}

const mapStateToProps = (state) => {
    return {
        debt: state.firestore.ordered.oweJeff,
        balance: state.firestore.ordered.current,
        auth: state.firebase.auth,
        admin: state.auth.admin,
        profile: state.firebase.profile,
        notifications: state.firestore.ordered.notifications,
        trays: state.firestore.ordered.trays,
        bags: state.firestore.ordered.bags
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkClaims: () => dispatch(checkClaims()),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        {collection: 'notifications', limit: 4, orderBy: ['time', 'desc']},
        {collection: 'current', limit: 10, orderBy: ['balance', 'desc']},
        {collection: 'oweJeff', limit: 4, orderBy: ['balance', 'desc']},
        {collection: 'trays', limit: 1, orderBy: ['number', 'desc']},
        {collection: 'bags', limit: 1, orderBy: ['number', 'desc']}
    ])
)(Dashboard)
