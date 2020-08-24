import React, {Component} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import SickDeadList from "../projects/SickDeadList";

class SickDead extends Component {

    render() {
        const {deadSick, auth} = this.props;
        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }

        return (
            <div className="dashboard container">
                <div className="row">

                    <div className="col s12 m6">
                        <SickDeadList deadSick={deadSick}/>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        deadSick: state.firestore.ordered.deadSick
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'deadSick', limit: 1000, orderBy: ['date', 'desc']}
    ])
)(SickDead)
