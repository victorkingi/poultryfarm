import React, {Component} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import BuyList from "../projects/BuyList";

class Buy extends Component {

    render() {
        const {buys, auth} = this.props;

        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }
        return (
            <div className="dashboard container">
                <div className="row">

                    <div className="col s12 m6">
                        <BuyList buys={buys}/>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        buys: state.firestore.ordered.buys
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'buys', limit: 1000, orderBy: ['submittedOn', 'desc']},
    ])
)(Buy)
