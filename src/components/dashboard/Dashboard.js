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
import {sendTokenToServer} from "../../store/actions/chickenAction";
import {updateBags} from "../../store/actions/buyAction";
import InputNews from "../projects/InputNews";
import {messaging} from "../../config/fbConfig";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {setPerformanceEnd, setPerformanceStart} from "../../store/actions/moneyAction";

setPerformanceStart();

async function componentDidMount(sendToken) {

    messaging.requestPermission()
        .then(async function () {
            const token = await messaging.getToken();
            sendToken(token);
        })
        .catch(function (err) {
            console.log("Unable to get permission to notify.", err);
        });
    messaging.onTokenRefresh(() => {
        messaging.getToken().then((refreshedToken) => {
            console.log('Token refreshed.');
            sendToken(refreshedToken);
        }).catch((err) => {
            console.log('Unable to retrieve refreshed token ', err);
        });
    });
    navigator.serviceWorker.addEventListener("message", (message) => {
        const customId = "myToast";
        if (message.data) {

            toast.info(`${message.data['firebase-messaging-msg-data'].data.title}`, {
                toastId: customId,
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

    });
}


class Dashboard extends Component {

    render() {
        const {news, chicken, balance, bags, trays, debt, auth, admin, moderator, changer, profile, notifications} = this.props;
        this.props.checkClaims();
        // this.props.sendTokenToServern();
        componentDidMount(this.props.sendTokenToServer).then(() => console.log("success")).catch((err) => console.log("error: ", err));


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

                let num = parseInt(bags['0'].number);
                const time = bags ? bags['0'].counter.toDate() : "No date given";
                const currentDay = parseInt(new Date().getDate());
                let counter = parseInt(time.getDate());
                const month = time.getMonth() + 1;
                const year = time.getFullYear();
                try {
                    const submit = bags['0'].submittedOn.toDate();
                    const submitDate = submit.getDate();

                    if (counter < currentDay && submitDate !== currentDay) {
                        counter = currentDay - counter;
                        num = num - counter;
                        counter = new Date(year, month, currentDay);

                        if (parseInt(num) < 1) {
                            num = 0;
                        }

                        const state = {
                            bagNo: num,
                            counter: counter
                        }


                        this.props.updateBags(state)
                    }

                } catch (error) {
                    console.log("Waiting for response...", error);
                }

                return (
                    <div className="dashboard container">
                        <div className="row">
                            <ToastContainer
                                position="top-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                            />
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
        } else if (moderator) {
            return (
                <InputNews/>
            )
        } else if (changer) {
            time();

            if (profile.firstName) {
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
            } else {
                return (
                    <div className="progress">
                        <div className="indeterminate"/>
                    </div>
                );
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
        sendTokenToServer: (token) => dispatch(sendTokenToServer(token)),
        updateBags: (state) => dispatch(updateBags(state))

    }
}

setPerformanceEnd('DASHBOARD_LOAD_TIME');

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
