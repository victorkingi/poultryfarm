import React, {useEffect, useMemo} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase';
import {Redirect} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import DebtList from "../jeff debt/components/list/DebtList";
import BagsList from "../bags in store/components/list/BagsList";
import TrayList from "../trays in store/components/list/TrayList";
import Current from "../current balance/components/balance/Current";
import ChickenDetails from "../chicken data/ChickenDetails";
import Notifications from "../notifications/components/notifications/Notifications";
import {setPerformanceEnd, setPerformanceStart} from "../../../../services/actions/moneyAction";
import CloudCost from "../cloud costs/CloudCost";


setPerformanceStart();

let todayInMillis = new Date().getTime();
let period = "";

function time() {
    let sunrise = null;
    let sunset = null;
    try {
        sunrise = localStorage.getItem('sunrise');
        sunset = localStorage.getItem('sunset');
    } catch (e) {
        console.log(e);
    }

    if (todayInMillis > parseInt(sunrise) && todayInMillis < parseInt(sunset)) {
        period = "Good Morning";
    } else {
        period = "Good Evening";
    }
}

function Dashboard(props) {
    const {auth, admin, changer, balance, notifications, billing } = props;
    const firstName = auth?.displayName?.substring(0, auth?.displayName?.lastIndexOf(' '));

    const user = useMemo(function() {
        const __user = localStorage.getItem('user') || false;

        return {__user};
    }, []);

    useEffect(function(){
        time();

    }, [props]);

    if (!user.__user) {
        return (
            <Redirect to="/signin"/>
        )
    } else {
        if (admin) {
            const {
                chicken, bags,
                trays, debt
            } = props;

            if (bags) {
                return (
                    <div className="dashboard container">
                        <div className="row">
                            <div className="center-align">
                                <h3 className="spinner-blue" id="details"> {period} {firstName}</h3>
                            </div>

                            <div className="col s12 m5 offset-m1">
                                <BagsList bags={bags}/>
                            </div>

                            <div className="col s12 m5 offset-m1">
                                <CloudCost billing={billing}/>
                            </div>

                            <div className="col s12 m5 offset-m1">
                                <Notifications notifications={notifications}/>
                            </div>

                            <div className="col s12 m5 offset-m1">
                                <ChickenDetails chicken={chicken}/>
                            </div>

                            <div className="col s12 m5 offset-m1">
                                <Current balance={balance}/>
                            </div>

                            <div className="col s12 m5 offset-m1">
                                <TrayList trays={trays}/>
                            </div>

                            <div className="col s12 m5 offset-m1">
                                <DebtList debt={debt}/>
                            </div>

                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="progress">
                        <div className="indeterminate"/>
                    </div>
                );
            }
        } else if (changer) {
            if (balance) {
                return (
                    <div className="dashboard container">

                        <div className="center-align">
                            <h3 className="spinner-blue"> {period} {firstName}</h3>
                        </div>

                        <div className="col s12 m5 offset-m1">
                            <Notifications notifications={notifications}/>
                        </div>

                        <div className="col s12 m5 offset-m1">
                            <Current balance={balance}/>
                        </div>

                    </div>
                )
            } else {
                return (
                    <div className="progress">
                        <div className="indeterminate"/>
                    </div>
                )
            }
        } else {
            return (
                <div/>
            )
        }
    }
}

const mapStateToProps = function(state) {
    return {
        chicken: state.firestore.ordered.chickenDetails,
        debt: state.firestore.ordered.oweJeff,
        balance: state.firestore.ordered.current,
        auth: state.firebase.auth,
        admin: state.auth.admin,
        changer: state.auth.changer,
        notifications: state.firestore.ordered.notifications,
        trays: state.firestore.ordered.trays,
        bags: state.firestore.ordered.bags,
        billing: state.firestore.ordered.private
    }
}

setPerformanceEnd('DASHBOARD_LOAD_TIME');

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'notifications', limit: 3, orderBy: ['time', 'desc']},
        {collection: 'current', limit: 10, orderBy: ['balance', 'desc']},
        {collection: 'chickenDetails'},
        {collection: 'oweJeff', limit: 4, orderBy: ['balance', 'desc']},
        {collection: 'trays', limit: 1, orderBy: ['number', 'desc']},
        {collection: 'bags', limit: 1, orderBy: ['number', 'desc']},
        {collection: 'private'}
    ])
)(Dashboard)
