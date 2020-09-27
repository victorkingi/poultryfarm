import React from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import {Redirect} from "react-router-dom";
import moment from "moment";
import numeral from "numeral";

const SalesDetails = (props) => {
    const {sale, auth} = props;
    if (!auth.uid) {
        return (
            <Redirect to="/signin"/>
        )
    }

    if (sale) {
        const total = sale.chickenNo ? (sale.chickenNo * sale.chickenPrice) : (sale.trayNo * sale.trayPrice);
        const time = sale.date ? sale.date.toDate() : "No date given";

        if (parseInt(sale.chickenNo) === 1) {

        }


        if (sale.buyerName) {
            if (sale.chickenNo && parseInt(sale.chickenNo) > 1) {
                return (
                    <div className="container section project-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">{sale.category}: {sale.section}</span>
                                <p>We sold {sale.chickenNo} chickens to {sale.buyerName} at a price of
                                    Ksh.{sale.chickenPrice} per
                                    chicken and earned Ksh.{numeral(total).format("0,0")} in total.</p>
                            </div>
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Posted by {sale.submittedBy}</div>
                                <div>{moment(time).calendar()}</div>
                            </div>
                        </div>
                    </div>
                )

            } else if (sale.chickenNo && parseInt(sale.chickenNo) === 1) {

                return (
                    <div className="container section project-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">{sale.category}: {sale.section}</span>
                                <p>We sold {sale.chickenNo} chicken to {sale.buyerName} at a price of
                                    Ksh.{sale.chickenPrice} per
                                    chicken and earned Ksh.{total} in total.</p>
                            </div>
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Posted by {sale.submittedBy}</div>
                                <div>{moment(time).calendar()}</div>
                            </div>
                        </div>
                    </div>
                )


            } else if (sale.trayNo && parseInt(sale.trayNo) > 1) {
                return (
                    <div className="container section project-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">{sale.category}: {sale.section}</span>
                                <p>We sold {sale.trayNo} trays to {sale.buyerName} at a price of
                                    Ksh.{sale.trayPrice} per
                                    tray and earned Ksh.{numeral(total).format("0,0")} in total.</p>
                            </div>
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Posted by {sale.submittedBy}</div>
                                <div>{moment(time).calendar()}</div>
                            </div>
                        </div>
                    </div>
                )
            } else if (sale.trayNo && parseInt(sale.trayNo) === 1) {
                return (
                    <div className="container section project-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">{sale.category}: {sale.section}</span>
                                <p>We sold {sale.trayNo} tray to {sale.buyerName} at a price of
                                    Ksh.{sale.trayPrice} per
                                    tray and earned Ksh.{total} in total.</p>
                            </div>
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Posted by {sale.submittedBy}</div>
                                <div>{moment(time).calendar()}</div>
                            </div>
                        </div>
                    </div>
                )
            }

        } else {
            return (
                <div/>
            )
        }
    } else {
        return (
            <div className="container center">
                <p>Loading sales...</p>
            </div>

        )
    }
}

const mapStateToProps = (state, ownProps) => {

    const id = ownProps.match.params.id;
    const sales = state.firestore.data.sales;
    const sale = sales ? sales[id] : null;

    return {
        sale: sale,
        auth: state.firebase.auth
    }
}

export default compose(
    firestoreConnect(() => ['sales']),
    connect(mapStateToProps)
)(SalesDetails)