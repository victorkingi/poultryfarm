import React, {useMemo} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import {setPerformanceEnd, setPerformanceStart} from "../../../../services/actions/moneyAction";
import BuyList from "../list/BuyList";

setPerformanceStart();

function Buy(props) {
    const {buys} = props;
    const user = useMemo(() => {
        const __user = localStorage.getItem('user') || false;

        return {__user};
    }, [])

    if (!user.__user) {
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

const mapStateToProps = (state) => {
    return {
        buys: state.firestore.ordered.buys
    }
}

setPerformanceEnd('BUY_LOAD_TIME');

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'buys', limit: 1000, orderBy: ['submittedOn', 'desc']},
    ])
)(Buy)
