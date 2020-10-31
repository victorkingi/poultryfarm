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
import News from "../latest news/components/news/News";
import Notifications from "../notifications/components/notifications/Notifications";
import {setPerformanceEnd, setPerformanceStart} from "../../../../services/actions/moneyAction";


setPerformanceStart();

let checkHour = new Date();
checkHour = checkHour.getHours();
let period = "";

function time() {
    if ((checkHour >= 0) && (checkHour <= 12)) {
        period = "Good Morning";
    } else if ((checkHour >= 12) && (checkHour <= 18)) {
        period = "Afternoon";
    } else {
        period = "Good Evening";
    }
}

function Dashboard(props) {
    const {auth, admin, moderator, changer, balance, notifications} = props;
    const firstName = auth?.displayName?.substring(0, auth?.displayName?.lastIndexOf(' '));

    const user = useMemo(() => {
        const __user = localStorage.getItem('user') || false;

        return {__user};
    }, []);

    useEffect(() => {
        time();

    }, [props]);

    if (!user.__user) {
        return (
            <Redirect to="/signin"/>
        )
    } else {
        if (admin) {
            const {
                news, chicken, bags,
                trays, debt
            } = props;

            if (bags && trays && debt && news) {
                return (
                    <div className="dashboard container">
                        <div className="row">
                            <div className="center-align">
                                <h3 className="spinner-blue" id="details"> {period} {firstName}</h3>
                            </div>

                            <div className="col s12 m5 offset-m1">
                                <Notifications notifications={notifications}/>
                            </div>

                            <div className="col s12 m5 offset-m1 pointer">
                                <News news={news}/>
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
                                <BagsList bags={bags}/>
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
        } else if (moderator) {
            return (
                <div/>
            )
        } else if (changer) {
            if (notifications && balance) {
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

const mapStateToProps = (state) => {
    return {
        chicken: state.firestore.ordered.chickenDetails,
        debt: state.firestore.ordered.oweJeff,
        balance: state.firestore.ordered.current,
        auth: state.firebase.auth,
        admin: state.auth.admin,
        moderator: state.auth.moderator,
        changer: state.auth.changer,
        notifications: state.firestore.ordered.notifications,
        trays: state.firestore.ordered.trays,
        bags: state.firestore.ordered.bags,
        news: state.firestore.ordered.latestNews,
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
        {collection: 'latestNews', limit: 1, orderBy: ['time', 'desc']},
    ])
)(Dashboard)
