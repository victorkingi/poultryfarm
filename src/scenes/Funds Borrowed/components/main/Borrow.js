import React, {useMemo} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import {setPerformanceEnd, setPerformanceStart} from "../../../../services/actions/moneyAction";
import BorrowList from "../list/BorrowList";

setPerformanceStart();

function Borrow(props) {
    const {borrow} = props;
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
                    <BorrowList borrow={borrow}/>
                </div>

            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
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
