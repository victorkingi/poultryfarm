import React, {useMemo} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import Weekly from "../profit/components/weekly/Weekly";
import TotalWeekly from "../laying percentage/components/weekly/TotalWeekly";
import TotalEggs from "../eggs collected/components/total eggs/TotalEggs";
import EachWeekly from "../laying percentage/components/weekly/EachWeekly";
import EachMonthly from "../laying percentage/components/monthly/EachMonthly";
import EachSection from "../eggs collected/components/each section eggs/EachSection";

function AllCharts(props) {
    const {eggs, profit} = props;
    const user = useMemo(function () {
        const __user = localStorage.getItem('user') || false;

        return {__user};
    }, []);

    if (!user.__user) {
        return (
            <Redirect to="/signin"/>
        )
    }
    if (eggs && profit) {
        return (
            <div className="app">
                <div className="chart">
                    <Weekly profit={profit}/>
                    <TotalWeekly eggs={eggs}/>
                    <TotalEggs eggs={eggs}/>
                    <EachWeekly eggs={eggs}/>
                    <EachMonthly eggs={eggs}/>
                    <EachSection eggs={eggs}/>
                </div>
            </div>
        );
    } else if (eggs) {
        return (
            <div className="app">
                <div className="chart">
                    <TotalWeekly eggs={eggs}/>
                    <TotalEggs eggs={eggs}/>
                    <EachWeekly eggs={eggs}/>
                    <EachMonthly eggs={eggs}/>
                    <EachSection eggs={eggs}/>
                </div>
            </div>
        );
    } else if (profit) {
        return (
            <div className="app">
                <div className="chart">
                    <Weekly profit={profit}/>
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

const mapStateToProps = function (state) {
    return {
        eggs: state.firestore.ordered.eggs,
        profit: state.firestore.ordered.profit
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'eggs', orderBy: ['submittedOn', 'desc']},
        {collection: 'profit', orderBy: ['submittedOn', 'desc']}
    ])
)(AllCharts)
