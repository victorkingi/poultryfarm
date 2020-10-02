import React, {useMemo} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux'
import {Redirect} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import EggsList from "../projects/EggsList";
import {setPerformanceEnd, setPerformanceStart} from "../../store/actions/moneyAction";

setPerformanceStart();

function Egg(props) {
    const {eggs} = props;
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
                    <EggsList eggs={eggs}/>
                </div>

            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        eggs: state.firestore.ordered.eggs
    }
}

setPerformanceEnd('EGG_LOAD_TIME');


export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'eggs', limit: 1000, orderBy: ['date', 'desc']},
    ])
)(Egg)
