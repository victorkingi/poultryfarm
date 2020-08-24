import React from "react";
import moment from "moment";
import {updateBorrowCleared} from "../../store/actions/moneyAction";
import {connect} from "react-redux";

const BorrowSummary = (borrow) => {

    const handleClick = (details) => {
        borrow.updateBorrowCleared(details);
    }

    if (borrow.item.submittedOn) {
        const time = borrow.item.submittedOn.toDate() ? borrow.item.submittedOn.toDate() : "No date given";


        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Borrow Summary</span>
                    <span style={{fontSize: "30px"}}>{borrow.item.borrower}</span>
                    <p>Ksh.{borrow.item.borrowAmount}</p>
                    <p className="grey-text">{moment(time).calendar()}</p>
                </div>
                <button onClick={() => {
                    handleClick(borrow.item)
                }} className="btn pink lighten-2 z-depth-0">Cleared
                </button>
            </div>
        )
    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating borrow card...</p>
                </div>
            </div>

        )
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        updateBorrowCleared: (details) => dispatch(updateBorrowCleared(details))
    }
}

export default connect(null, mapDispatchToProps)(BorrowSummary);