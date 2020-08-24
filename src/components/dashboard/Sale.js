import React, {Component} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import SalesList from "../projects/SalesList";

class Sale extends Component {

    render() {
        const {sales, auth} = this.props;

        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }
        return (
            <div className="dashboard container">
                <div className="row">

                    <div className="col s12 m6">
                        <SalesList sales={sales}/>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        sales: state.firestore.ordered.sales
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'sales', limit: 1000, orderBy: ['date', 'desc']}
    ])
)(Sale)
