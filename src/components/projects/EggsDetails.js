import React from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import {Redirect} from "react-router-dom";
import moment from "moment";

const EggsDetails = (props) => {
    const {egg, auth} = props;
    if (!auth.uid) {
        return <Redirect to='/signin'/>
    }

    if (egg) {
        const time = egg.submittedOn.toDate() ? egg.submittedOn.toDate() : "No date given", a1 = parseInt(egg['A 1']),
            a2 = parseInt(egg['A 2']), b1 = parseInt(egg['B 1']), b2 = parseInt(egg['B 2']), c1 = parseInt(egg['C 1']),
            c2 = parseInt(egg['C 2']), total = a1 + a2 + b1 + b2 + c1 + c2;

        return(
            <div className="container section project-details">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">{egg.category}: { total } eggs were collected </span>
                        <p>A 1: {egg['A 1']}</p>
                        <p>A 2: {egg['A 2']}</p>
                        <p>B 1: {egg['B 1']} </p>
                        <p>B 2: {egg['B 2']} </p>
                        <p>C 1: {egg['C 1']}  </p>
                        <p>C 2: {egg['C 2']} </p>
                        <p>Broken: {egg['broken']} </p>
                    </div>
                    <div className="card-action grey lighten-4 grey-text">
                        <div>Posted by { egg.submittedBy }</div>
                        <div>{moment(time).calendar()}</div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container center">
                <p>Loading eggs...</p>
            </div>

        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const eggs = state.firestore.data.eggs;
    const egg = eggs ? eggs[id] : null;

    return {
        egg: egg,
        auth: state.firebase.auth
    }
}

export default compose(
    firestoreConnect(() => ['eggs']),
    connect(mapStateToProps)
)(EggsDetails)