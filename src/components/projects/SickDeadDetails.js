import React, {useMemo} from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import {Redirect} from "react-router-dom";
import moment from "moment";

const SickDeadDetails = (props) => {
    const {ds} = props;
    const user = useMemo(() => {
        const __user = localStorage.getItem('user') || false;

        return {__user};
    }, []);

    if (!user.__user) {
        return (
            <Redirect to="/signin"/>
        )
    }

    if (ds) {
        const time = ds.date ? ds.date.toDate() : "No date given";

        var img = document.createElement("img");

        img.src = ds.photoURL;
        img.onload = function () {
            console.log("complete");
        }
        img.onerror = function () {
            console.log("error loading image");
        }


        if (ds.section === "Sick") {
            if (ds.chickenNo === 1) {
                return (
                    <div className="container section project-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">{ds.section} Chicken</span>
                                <p>{ds.chickenNo} chickens was sick because
                                    of {ds.reason}.<br/>Treatment: {ds.treatment}</p>
                                <img alt="chickensick" className="img" src={ds.photoURL}/>
                            </div>
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Posted by {ds.submittedBy}</div>
                                <div>{moment(time).calendar()}</div>
                            </div>
                        </div>
                    </div>

                )
            } else if (ds.chickenNo > 1) {
                return (
                    <div className="container section project-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">{ds.section} Chickens</span>
                                <p>{ds.chickenNo} chickens were sick because of {ds.reason} and we
                                    gave them {ds.treatment}</p>
                                <img alt="chickensick" className="img" src={ds.photoURL}/>
                            </div>
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Posted by {ds.submittedBy}</div>
                                <div>{moment(time).calendar()}</div>
                            </div>
                        </div>
                    </div>
                )
            }
        } else {
            if (ds.chickenNo === 1) {
                return (
                    <div className="container section project-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">{ds.section} Chicken</span>
                                <p>{ds.chickenNo} chicken died cause of {ds.reason}</p>
                                <img alt="chickendied" className="img" src={ds.photoURL}/>
                            </div>
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Posted by {ds.submittedBy}</div>
                                <div>{moment(time).calendar()}</div>
                            </div>
                        </div>
                    </div>
                )
            } else if (ds.chickenNo > 1) {
                return (
                    <div className="container section project-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">{ds.section} Chickens</span>
                                <p>{ds.chickenNo} chickens died cause of {ds.reason}</p>
                            </div>
                            <img alt="chickendied" className="img" src={ds.photoURL}/>
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Posted by {ds.submittedBy}</div>
                                <div>{moment(time).calendar()}</div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating chicken list...</p>
                </div>
            </div>

        )
    }

}

const mapStateToProps = (state, ownProps) => {

    const id = ownProps.match.params.id;
    const deadSick = state.firestore.data.deadSick;
    const ds = deadSick ? deadSick[id] : null;

    return {
        ds: ds
    }
}

export default compose(
    firestoreConnect(() => ['deadSick']),
    connect(mapStateToProps)
)(SickDeadDetails)