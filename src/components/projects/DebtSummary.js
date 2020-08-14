import React from "react";
import moment from "moment";
import {updateBankBalance} from "../../store/actions/moneyAction";
import {connect} from "react-redux";

const DebtSummary = (debt) => {

    const handleClick = (details) => {
        debt.updateBankBalance(details);
    }

    if (debt.item.submittedOn) {
        const time = debt.item.submittedOn.toDate() ? debt.item.submittedOn.toDate() : "No date given";


        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Debts</span>
                    <p>Ksh.{debt.item.balance}</p>
                    <p className="grey-text">{moment(time).calendar()}</p>
                </div>
                <button type="submit" onClick={() => {
                    handleClick(debt.item)
                }} className="btn pink lighten-2 z-depth-0">Pay off
                </button>
            </div>
        )
    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating debts...</p>
                </div>
            </div>

        )
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        updateBankBalance: (details) => dispatch(updateBankBalance(details))
    }
}

export default connect(null, mapDispatchToProps)(DebtSummary);