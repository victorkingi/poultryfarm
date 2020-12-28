import React, {useRef} from "react";
import moment from "moment";
import {connect} from "react-redux";
import {rollBack} from "../../../../services/actions/utilAction";

const RollbackSummary = ({item, name}) => {
    const inputRef = useRef();

    const handleClick = (e, details) => {
        e.preventDefault();
        const load = document.getElementById(`load${item.id}`);
        load.style.display = 'block';
        inputRef.current.attributes['3'].nodeValue = "display: none;";
        item.rollBack(details);
    }

    if (item && !item?.item?.test) {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Rewind To</span>
                    <span style={{fontSize: "30px"}}>{moment(item?.time.toDate()).calendar()}</span>
                    <br />
                    <span style={{fontSize: "20px"}}>By {name}</span>
                    <p className="grey-text">{moment(item?.time.toDate()).format('LLL')}</p>

                    <div style={{display: 'none'}} id={`load${item.id}`}>
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

                    <button ref={inputRef} style={{display: 'block'}} id={`submit${item.id}`} type="submit"
                            onClick={(e) => {
                                if (window.confirm('Are you sure you want to rewind? THIS CANNOT BE UNDONE!')) {
                                    handleClick(e, item)
                                } else {
                                    e.preventDefault();
                                    return false;
                                }
                            }} className="btn pink lighten-2 z-depth-0">Rewind
                    </button>

                </div>
            </div>
        )

    } else {
        return (
            <div/>
        )
    }
}


const mapDispatchToProps = (dispatch) => {

    return {
        rollBack: (details) => dispatch(rollBack(details))
    }
}

export default connect(null, mapDispatchToProps)(RollbackSummary);