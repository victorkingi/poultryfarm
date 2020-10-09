import React, {useEffect, useMemo} from "react";
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
import InputNews from "../projects/InputNews";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {setPerformanceEnd, setPerformanceStart} from "../../store/actions/moneyAction";
import {messaging} from "../../config/fbConfig";
import "../../App.css";


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

function componentDidMount() {
    navigator.serviceWorker.addEventListener("message", (message) => {
        const customId = "myToast";
        if (message?.data) {
            const _data = `${message.data['firebase-messaging-msg-data'].data?.title}`;
            const _notification = `${message.data['firebase-messaging-msg-data']
                .notification?.title}: ${message.data['firebase-messaging-msg-data']
                .notification?.body}`;

            if (_data === 'undefined') {
                toast.info(_notification, {
                    toastId: customId,
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.info(_data, {
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
        }

    });
}

export const handleToken = (sendTokenToServer_, renderCount) => {

    if (renderCount % 2 !== 0) {
        messaging.requestPermission()
            .then(async function () {
                const token = await messaging.getToken();
                sendTokenToServer_(token);
            })
            .catch(function (err) {
                console.log("Unable to get permission to notify.", err);
                alert("ERROR: It seems that your browser has blocked notifications. Try changing your option in settings for this site or rather, uncheck the checkbox to continue");
                const load = document.getElementById("loading");
                const submit = document.getElementById("login");

                load.style.display = 'none';
                submit.style.display = 'block';
            });
        messaging.onTokenRefresh(() => {
            messaging.getToken().then((refreshedToken) => {
                console.log('Token refreshed.');
                sendTokenToServer_(refreshedToken);
                window.location.reload();
            }).catch((err) => {
                console.log('Unable to retrieve refreshed token ', err);
                window.location.reload();
            });
        });
    } else {
        window.location.reload();
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
        props.checkClaims();
        componentDidMount();

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
                <InputNews/>
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

const mapDispatchToProps = (dispatch) => {
    return {
        checkClaims: () => dispatch(checkClaims())
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
