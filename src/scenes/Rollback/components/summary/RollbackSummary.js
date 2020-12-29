import React, {useRef, useEffect, useState} from "react";
import moment from "moment";
import {connect} from "react-redux";
import {rollBack} from "../../../../services/actions/utilAction";
import {firebase} from "../../../../services/api/firebase configurations/fbConfig";

const RollbackSummary = (prop) => {
    const inputRef = useRef();
    const [event, setEvent] = useState('');
    async function getDoc(docId) {
        const docData = await firebase.firestore().doc(docId).get();
        const data = docData.data();
        setEvent(data.event);
    }

    const handleClick = (e, details) => {
        e.preventDefault();
        const load = document.getElementById(`load${prop.item.id}`);
        load.style.display = 'block';
        inputRef.current.attributes['3'].nodeValue = "display: none;";
        prop.rollBack(details);
    }
    useEffect(() => {
        if (prop?.item?.docId) {
            getDoc(prop.item.docId);
        }

    }, [prop]);

    if (prop?.item) {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">Rewind To</span>
                    <span style={{fontSize: "30px"}}>{moment(prop.item?.time.toDate()).calendar()}</span>
                    <br />
                    <span style={{fontSize: "20px"}}>By {prop.name}</span>
                    <br />
                    <span style={{fontSize: "20px"}}>Event: {event}</span>
                    <p className="grey-text">{moment(prop.item?.time.toDate()).format('LLL')}</p>

                    <div style={{display: 'none'}} id={`load${prop.item.id}`}>
                        <div className="preloader-wrapper small active">
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

                    <button ref={inputRef} style={{display: 'block'}} id={`submit${prop.item.id}`} type="submit"
                            onClick={(e) => {
                                if (window.confirm('Are you sure you want to rewind? THIS CANNOT BE UNDONE! NB:- Rewinding to a long time ago will not delete the newest entries but only update the chosen entry')) {
                                    handleClick(e, prop.item)
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