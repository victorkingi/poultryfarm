import React, {useMemo, useEffect} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import {setPerformanceEnd, setPerformanceStart} from "../../../../services/actions/moneyAction";
import Rollback from "../list/Rollback";

setPerformanceStart();

function Roll(props) {
    const {roll} = props;
    const user = useMemo(() => {
        const __user = localStorage.getItem('user') || false;

        return {__user};
    }, []);

    useEffect(() => {
       window.alert("NB:- This page is still experimental, tread cautiously!");
    }, []);

    if (!user.__user) {
        return (
            <Redirect to="/signin"/>
        );
    }

    if (roll) {
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m6">
                        <Rollback roll={roll}/>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="progress">
                <div className="indeterminate"/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        roll: state.firestore.ordered.rollback,
        logs: state.firestore.ordered.userLogs
    }
}

setPerformanceEnd('LATE_LOAD_TIME');

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'rollback', limit: 1000, orderBy: ['time', 'desc']}
    ])
)(Roll)
