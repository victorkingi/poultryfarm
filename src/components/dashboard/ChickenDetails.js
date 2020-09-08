import React from "react";
import {connect} from "react-redux";
import {updateChickens} from "../../store/actions/chickenAction";

const ChickenDetails = (props) => {

    const {chicken} = props;
    props.updateChickens();

    if (chicken) {
        return (
            <div className="section">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">Birds Details</span>
                        <ul className="notifications">
                            {chicken && chicken.map(
                                item => {
                                    const weekPercent = Math.round((item.weekPercent + Number.EPSILON) * 100) / 100;
                                    return (
                                        <li key={item.id}>
                                            <span style={{fontSize: "20px"}}>No. of Months</span>
                                            <p style={{fontSize: "18px"}}>{item.monthNo}</p>
                                            <span style={{fontSize: "20px"}}>No. of weeks</span>
                                            <p style={{fontSize: "18px"}}>{item.weekNo}</p>
                                            <span style={{fontSize: "20px"}}>Weekly laying percentage</span>
                                            <p style={{fontSize: "18px"}}>{weekPercent}%</p>
                                            <span style={{fontSize: "20px"}}>Total Birds</span>
                                            <p style={{fontSize: "18px"}}>{item.total}</p>
                                        </li>
                                    )
                                }
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="section">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

}


const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateChickens: () => dispatch(updateChickens())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChickenDetails);