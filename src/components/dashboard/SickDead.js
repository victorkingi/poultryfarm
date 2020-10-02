import React, {useMemo} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import SickDeadList from "../projects/SickDeadList";
import {setPerformanceEnd, setPerformanceStart} from "../../store/actions/moneyAction";

setPerformanceStart();

function SickDead(props) {
    const {deadSick} = props;
    const user = useMemo(() => {
        const __user = localStorage.getItem('user') || false;

        return {__user};
    }, []);

    if (!user.__user) {
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

const mapStateToProps = (state) => {
    return {
        deadSick: state.firestore.ordered.deadSick
    }
}

setPerformanceEnd('DEAD_SICK_LOAD_TIME');

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'deadSick', limit: 1000, orderBy: ['date', 'desc']}
    ])
)(SickDead)
