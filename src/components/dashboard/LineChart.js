import React, {Component} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import Charts from "./Charts";
import ProfitChart from "./ProfitChart";

class LineChart extends Component {

    render() {
        const {eggs, profit, profitSale, auth} = this.props;

        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }
        if (eggs && profit) {
            const dets = {
                profit: profit,
                profitSale: profitSale
            }

            return (
                <div className="app">
                    <div className="chart">
                        <Charts eggs={eggs}/>
                        <ProfitChart dets={dets}/>
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
        profit: state.firestore.ordered.profit,
        profitSale: state.firestore.ordered.sales
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'eggs', orderBy: ['submittedOn', 'desc']},
        {collection: 'profit', orderBy: ['submittedOn', 'desc']},
        {collection: 'profitSale', orderBy: ['submittedOn', 'desc']}
    ])
)(LineChart)
