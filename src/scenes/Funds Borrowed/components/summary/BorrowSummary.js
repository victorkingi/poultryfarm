import React, {useRef} from "react";
import moment from "moment";
import {connect} from "react-redux";
import numeral from "numeral";
import {borrowerReturnsFunds} from "../../../../services/actions/moneyAction";

const BorrowSummary = function (borrow) {
    const inputRef = useRef();

    const handleClick = function (e) {
        e.preventDefault();
        const load = document.getElementById(`load${borrow.item.id}`);
        load.style.display = 'block';
        inputRef.current.attributes['2'].nodeValue = "display: none;";
        borrow.borrowerReturnsFunds(borrow.item);
    }

    if (borrow.item.submittedOn) {
        const time = borrow.item.submittedOn.toDate() ? borrow.item.submittedOn.toDate() : "No date given";


        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Borrow Summary</span>
                    <span style={{fontSize: "30px"}}>{borrow.item.borrower}</span>
                    <p>Ksh.{numeral(borrow.item.borrowAmount).format("0,0")}</p>
                    <p className="grey-text">{moment(time).calendar()}</p>
                </div>

                <div style={{display: 'none'}} id={`load${borrow.item.id}`}>
                    <div className="preloader-wrapper medium active">
                        <div className="spinner-layer spinner-blue">
                            <div className="circle-clipper left">
                                <div className="circle"/>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"/>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"/>
                            </div>
                        </div>

                        <div className="spinner-layer spinner-red">
                            <div className="circle-clipper left">
                                <div className="circle"/>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"/>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"/>
                            </div>
                        </div>

                        <div className="spinner-layer spinner-yellow">
                            <div className="circle-clipper left">
                                <div className="circle"/>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"/>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"/>
                            </div>
                        </div>

                        <div className="spinner-layer spinner-green">
                            <div className="circle-clipper left">
                                <div className="circle"/>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"/>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"/>
                            </div>
                        </div>
                    </div>
                </div>

                <button ref={inputRef} style={{display: 'block'}} id={`submit${borrow.item.id}`} onClick={function(e) {
                    handleClick(e)
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

const mapDispatchToProps = function(dispatch) {

    return {
        borrowerReturnsFunds: function(details) {
            dispatch(borrowerReturnsFunds(details));
        }
    }
}

export default connect(null, mapDispatchToProps)(BorrowSummary);