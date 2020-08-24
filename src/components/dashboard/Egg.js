import React, {Component} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import EggsList from "../projects/EggsList";

class Egg extends Component {

    render() {
        const {eggs, auth} = this.props;

        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }
        return (
            <div className="dashboard container">
                <div className="row">

                    <div className="col s12 m6">
                        <EggsList eggs={eggs}/>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        eggs: state.firestore.ordered.eggs,
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'eggs', limit: 1000, orderBy: ['date', 'desc']},
    ])
)(Egg)
