import React, {useMemo} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import SalesList from "../projects/SalesList";
import {setPerformanceEnd, setPerformanceStart} from "../../store/actions/moneyAction";

setPerformanceStart();

function Sale(props) {
    const {sales} = props;
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
                    <SalesList sales={sales}/>
                </div>

            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        sales: state.firestore.ordered.sales
    }
}

setPerformanceEnd('SALE_LOAD_TIME');

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'sales', limit: 1000, orderBy: ['date', 'desc']}
    ])
)(Sale)
