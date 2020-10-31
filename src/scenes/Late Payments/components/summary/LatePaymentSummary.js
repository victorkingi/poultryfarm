import React, {useRef} from "react";
import moment from "moment";
import {connect} from "react-redux";
import numeral from "numeral";
import {hasPaidLate} from "../../../../services/actions/moneyAction";

const LatePaymentSummary = (late) => {
    const inputRef = useRef();

    const handleClick = (e) => {
        e.preventDefault();
        const load = document.getElementById(`load${late.item.id}`);
        load.style.display = 'block';
        inputRef.current.attributes['3'].nodeValue = "display: none;";
        late.hasPaidLate(late.item);
    }

    if (late) {
        const time = late.item.date.toDate() ? late.item.date.toDate() : "No date given";
        const buy = late.item.buyer ? late.item.buyer : late.item.section;

        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Not yet paid</span>
                    <span style={{fontSize: "30px"}}>{buy}</span>
                    <p>Amount due: Ksh.{numeral(late.item.amountDue).format("0,0")}</p>
                    <p className="grey-text">{moment(time).calendar()}</p>

                    <div style={{display: 'none'}} id={`load${late.item.id}`}>
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

                    <button ref={inputRef} style={{display: 'block'}} id={`submit${late.item.id}`} type="submit"
                            onClick={(e) => {
                                handleClick(e)
                            }} className="btn pink lighten-2 z-depth-0">Payment received
                    </button>

                </div>
            </div>
        )

    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating late payments...</p>
                </div>
            </div>

        )
    }
}


const mapDispatchToProps = (dispatch) => {

    return {
        hasPaidLate: (details) => dispatch(hasPaidLate(details))
    }
}

export default connect(null, mapDispatchToProps)(LatePaymentSummary);