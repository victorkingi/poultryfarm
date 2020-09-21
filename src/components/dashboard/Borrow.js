import React, {Component} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import BorrowList from "../projects/BorrowList";
import {setPerformanceEnd, setPerformanceStart} from "../../store/actions/moneyAction";

setPerformanceStart();

class Borrow extends Component {

    render() {
        const {borrow, auth} = this.props;

        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }
        return (
            <div className="dashboard container">
                <div className="row">

                    <div className="col s12 m6">
                        <BorrowList borrow={borrow}/>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        borrow: state.firestore.ordered.borrow
    }
}

setPerformanceEnd('BORROW_LOAD_TIME');


export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'borrow', limit: 1000, orderBy: ['borrowAmount', 'desc']}
    ])
)(Borrow)
