import React from "react";
import moment from "moment";
import {connect} from 'react-redux';
import {updateBags} from "../../store/actions/buyAction";
import sample from "./images/sample-1.jpg";

const BagsSummary = (bag) => {

    if (bag.item.submittedOn) {
        if (parseInt(bag.item.number) < 1) {
            return (

                <div className="row">
                    <div className="col s12 m7">
                        <div className="card">
                            <div className="card-image">
                                <img alt="picture" src={sample}/>
                                <span className="card-title">Feeds</span>
                            </div>
                            <div className="card-content">
                                <p>No bags of feeds currently in store</p>
                            </div>
                        </div>
                    </div>
                </div>
            );

        } else {

            const time = bag.item.date.toDate() ? bag.item.date.toDate() : "No date given";
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

                if (parseInt(bagNo) < 1) {
                    bagNo = 0;
                }

                const state = {
                    submittedOn: bag.item.submittedOn,
                    bagNo: bagNo
                }

                updateBags(state);
            }

            var link = <p>{bag.item.number} Bags of Feeds in Store</p>

            if (parseInt(bag.item.number) === 1) {
                link = <p>{bag.item.number} Bag of Feeds in Store</p>
            }

            if (bag.item.number) {

                return (
                    <div className="card z-depth-0 project-summary">
                        <div className="card-content grey-text text-darken-3">
                            <span className="card-title">Feeds</span>
                            {link}
                            <p className="grey-text">{moment(time).calendar()}</p>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="card z-depth-0 project-summary">
                        <div className="card-content grey-text text-darken-3">
                            <span className="card-title">Feeds</span>
                            {link}
                            <p className="grey-text">{moment(time).calendar()}</p>
                        </div>
                    </div>
                );
            }
        }

    } else {
        return (

            <div className="row">
                <div className="col s12 m7">
                    <div className="card">
                        <div className="card-image">
                            <img alt="picture" src={sample}/>
                            <span className="card-title">Feeds</span>
                        </div>
                        <div className="card-content">
                            <p>No bags of feeds currently in store</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateBags: (details) => dispatch(updateBags(details)),
    }
}
export default connect(null, mapDispatchToProps)(BagsSummary);