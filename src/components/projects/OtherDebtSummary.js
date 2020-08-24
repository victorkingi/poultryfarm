import React from "react";
import moment from "moment";
import {clearedDebt} from "../../store/actions/moneyAction";
import {connect} from 'react-redux';

const OtherDebtSummary = (otherDebt) => {

    const handleClick = (details) => {
        otherDebt.clearedDebt(details);
    }

    if (otherDebt.item.submittedOn) {
        const time = otherDebt.item.submittedOn.toDate() ? otherDebt.item.submittedOn.toDate() : "No date given";


        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Other Debt: {otherDebt.item.debter}</span>
                    <p>Amount we owe them is Ksh.{otherDebt.item.balance}</p>
                    <p className="grey-text">{moment(time).calendar()}</p>
                    <button type="submit" onClick={() => {
                        handleClick(otherDebt.item)
                    }} className="btn pink lighten-2 z-depth-0">Cleared
                    </button>

                </div>
            </div>
        )
    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating debt...</p>
                </div>
            </div>

        )
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        clearedDebt: (details) => dispatch(clearedDebt(details))
    }
}


export default connect(null, mapDispatchToProps)(OtherDebtSummary);