import React, {Component} from "react";
import Notifications from "./Notifications";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase';
import {Redirect} from 'react-router-dom';
import SalesList from "../projects/SalesList";
import EggsList from "../projects/EggsList";
import BuyList from "../projects/BuyList";
import {checkClaims} from "../../store/actions/authActions";
import Current from "./Current";

class Dashboard extends Component {


    render() {
        const {sales, balance, auth, admin, profile, notifications, eggs, buys} = this.props;
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
                            <Current balance={balance}/>
                        </div>

                        <div className="col s12 m5 offset-m1">
                            <Notifications notifications={notifications}/>
                        </div>

                        <div className="col s12 m6">
                            <SalesList sales={sales}/>
                        </div>

                        <div className="col s12 m6">
                            <BuyList buys={buys}/>
                        </div>

                        <div className="col s12 m6">
                            <EggsList eggs={eggs}/>
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
        sales: state.firestore.ordered.sales,
        balance: state.firestore.ordered.balanceNotification,
        buys: state.firestore.ordered.buys,
        eggs: state.firestore.ordered.eggs,
        auth: state.firebase.auth,
        admin: state.auth.admin,
        profile: state.firebase.profile,
        notifications: state.firestore.ordered.notifications
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkClaims: () => dispatch(checkClaims())
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'sales', limit: 2, orderBy:['submittedOn', 'desc'] },
        { collection: 'notifications', limit: 3, orderBy:['time', 'desc']},
        { collection: 'buys', limit: 2, orderBy:['submittedOn', 'desc']},
        { collection: 'eggs', limit: 2, orderBy:['submittedOn', 'desc']},
        {collection: 'balanceNotification', limit: 2, orderBy: ['time', 'desc']}
    ])
)(Dashboard)
