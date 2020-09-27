import React, {Component} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import Charts from "./Charts";
import {setPerformanceEnd, setPerformanceStart} from "../../store/actions/moneyAction";

setPerformanceStart();

class LineChart extends Component {

    render() {
        const {eggs, profit, auth} = this.props;

        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }
        if (eggs && profit) {

            return (
                <div className="app">
                    <div className="chart">
                        <Charts eggs={eggs} profit={profit}/>
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
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        eggs: state.firestore.ordered.eggs,
        profit: state.firestore.ordered.profit
    }
}

setPerformanceEnd('CHARTS_LOAD_TIME');

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'eggs', orderBy: ['submittedOn', 'desc']},
        {collection: 'profit', orderBy: ['submittedOn', 'desc']}
    ])
)(LineChart)
