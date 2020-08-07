import React from "react";
import moment from "moment";
import {connect} from 'react-redux';
import {updateBags} from "../../store/actions/buyAction";

const BagsSummary = (bag) => {

    if (bag.item.submittedOn) {
        const time = bag.item.submittedOn.toDate() ? bag.item.submittedOn.toDate() : "No date given";
        const currentDay = parseInt(new Date().getDate());
        const previous = parseInt(time.getDate());
        const currentMonth = (new Date().getMonth()) + 1;
        const prevMonth = time.getMonth() + 1;
        var num = parseInt(bag.item.number);
        var bagNo = undefined;
        const finalMonth = parseInt(currentMonth) - parseInt(prevMonth);

        if (previous < currentDay && finalMonth === 0) {
            const final = currentDay - previous;
            bagNo = num - final;

            const state = {
                submittedOn: bag.item.submittedOn,
                bagNo: bagNo
            }

            updateBags(state);
        }

        if (bagNo) {
            return (
                <div className="card z-depth-0 project-summary">
                    <div className="card-content grey-text text-darken-3">
                        <span className="card-title">Feeds</span>
                        <p>{bagNo} Bags of Feeds in Store</p>
                        <p className="grey-text">{moment(time).calendar()}</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="card z-depth-0 project-summary">
                    <div className="card-content grey-text text-darken-3">
                        <span className="card-title">Feeds</span>
                        <p>{bag.item.number} Bags of Feeds in Store</p>
                        <p className="grey-text">{moment(time).calendar()}</p>
                    </div>
                </div>
            );
        }

    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating bags...</p>
                </div>
            </div>

        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateBags: (details) => dispatch(updateBags(details)),
    }
}
export default connect(null, mapDispatchToProps)(BagsSummary);