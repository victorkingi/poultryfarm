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
import ChickenDetails from "./ChickenDetails";
import News from "./News";
import {handleToken} from "../../store/actions/chickenAction";
import {updateBags} from "../../store/actions/buyAction";

class Dashboard extends Component {

    render() {
        const {news, chicken, balance, bags, trays, debt, auth, admin, profile, notifications} = this.props;
        this.props.checkClaims();
        // this.props.handleToken();


        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }


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

        if (admin) {
            time();
            if (balance && bags && trays && debt && notifications && news) {

                let num = bags['0'].number;
                const time = bags ? bags['0'].date.toDate() : "No date given";
                const currentDay = parseInt(new Date().getDate());
                const previous = parseInt(time.getDate());
                let bagNo = undefined;
                const submit = bags['0'].submittedOn ? bags['0'].submittedOn.toDate() : null;
                const submitDate = submit.getDate();

                if (previous !== currentDay && submitDate !== currentDay) {
                    bagNo = num--;

                    if (parseInt(bagNo) < 1) {
                        bagNo = 0;
                    }

                    const state = {
                        bagNo: bagNo
                    }


                    this.props.updateBags(state)
                }

                return (
                    <div className="dashboard container">
                        <div className="row">

                            <div className="center-align">
                                <h3 className="spinner-blue" id="details"> {period} {profile.firstName}</h3>
                            </div>

                            <div className="col s12 m5 offset-m1">
                                <Notifications notifications={notifications}/>
                            </div>

                            <div className="col s12 m5 offset-m1">
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
        } else {
            time();

            if(profile.firstName) {
                return (
                    <div className="dashboard container">

                        <div className="center-align">
                            <h3 className="spinner-blue"> {period} {profile.firstName}</h3>
                        </div>

                        <div className="col s12 m5 offset-m1">
                            <Notifications notifications={notifications}/>
                        </div>

                        <div className="col s12 m5 offset-m1">
                            <Current balance={balance}/>
                        </div>

                    </div>
                )
            }
            else {
                return (
                    <div className="progress">
                        <div className="indeterminate"/>
                    </div>
                );
            }
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
        profile: state.firebase.profile,
        notifications: state.firestore.ordered.notifications,
        trays: state.firestore.ordered.trays,
        bags: state.firestore.ordered.bags,
        news: state.firestore.ordered.latestNews,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkClaims: () => dispatch(checkClaims()),
        handleToken: () => dispatch(handleToken()),
        updateBags: (state) => dispatch(updateBags(state))

    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
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
