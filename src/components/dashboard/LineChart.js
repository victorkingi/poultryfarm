import React, {Component} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import Charts from "./Charts";

class LineChart extends Component {

    render() {
        const {eggs, auth} = this.props;

        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }
        if (eggs) {
            return (
                <div className="app">
                    <div className="chart">
                        <Charts eggs={eggs}/>
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
        eggs: state.firestore.ordered.eggs
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'eggs', orderBy: ['submittedOn', 'desc']}
    ])
)(LineChart)
