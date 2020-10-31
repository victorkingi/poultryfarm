import React, {useEffect, useMemo, useState} from "react";
import {connect} from 'react-redux';
import {inputDeadSick} from "../../../../../services/actions/DeadSickAction";
import M from "materialize-css";
import {Redirect} from "react-router-dom";

function InputDeadSick(props) {

    const [state, setState] = useState({
        category: 'deadSick'
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        M.AutoInit();

    }, []);

    const handleChange = (e) => {
        const selectBox = document.getElementById("section");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const date = document.getElementById('date').value;
        const month = document.getElementById('month').value;
        const mysec = document.getElementById('mySection');
        const reason = document.getElementById('reason');
        const total = document.getElementById('total');
        const sick = document.getElementById('sick');
        const submit = document.getElementById('submit-btn-dead-sick');
        const upload = document.getElementById('upload');
        const chickenNo = document.getElementById('chickenNo').value;
        const checks = parseInt(date) > 0 && parseInt(date) < 32 && date !== "" && parseInt(month) > 0 && parseInt(month) < 13;


        if (checks) {
            mysec.style.display = 'block';
        }
        if (parseInt(date) <= 0 || parseInt(date) >= 32 || date === "") {
            mysec.style.display = 'none';
            reason.style.display = 'none';
            total.style.display = 'none';
            sick.style.display = 'none';
        }

        if (selectedValue === "Dead" || selectedValue === "Sick") {
            reason.style.display = 'block';
            total.style.display = 'block';
        } else {
            reason.style.display = 'none';
            total.style.display = 'none';
            sick.style.display = 'none';
        }

        if (selectedValue === "Sick") {
            sick.style.display = 'block';
        } else {
            sick.style.display = 'none';
        }

        if (parseInt(chickenNo) > 0) {
            submit.style.display = 'block';
            upload.style.display = 'block';
        } else {
            submit.style.display = 'none';
            upload.style.display = 'none';
        }

        if (e.target.files) {
            if (e.target.files[0]) {
                setImage(e.target.files[0]);
            }
        }

        if (e.target.id === "date" || e.target.id === "chickenNo" || e.target.id === "month") {
            if (isNaN(parseInt(e.target.value))) {
                document.getElementById("error-text").innerHTML = "Error! Input needs to be a number";
            } else {
                document.getElementById("error-text").innerHTML = "";
                setState({
                    ...state,
                    [e.target.id]: parseInt(e.target.value)
                });
            }
        } else {
            setState({
                ...state,
                [e.target.id]: e.target.value
            });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const load = document.getElementById("loading-dead-sick");
        const submit = document.getElementById("submit-btn-dead-sick");
        submit.style.display = 'none';
        load.style.display = 'block';
        props.inputDeadSick(state, image);

    }

    const user = useMemo(() => {
        const __user = localStorage.getItem('user') || false;

        return {__user};
    }, []);

    if (!user.__user) {
        return (
            <Redirect to="/signin"/>
        )
    }
    const link = image ? 'Image added: ' + image.name : 'No image added';

    return (
        <div>

            <div className="container">
                <form id="dead-sick-form" onSubmit={handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Input Dead / Sick</h5>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="date">Select Date (range: 1 - 31)</label>
                        <input type="number" id="date" onChange={handleChange} required/>
                    </div>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="month">Select Month (range: 1 - 12)</label>
                        <input type="number" id="month" onChange={handleChange} required/>
                    </div>

                    <div style={{display: 'none'}} id="mySection">
                        <select id="section" onChange={handleChange} className="white" defaultValue="0">
                            <option value="0" disabled="disabled">Choose Section</option>
                            <option value="Dead">Dead</option>
                            <option value="Sick">Sick</option>
                        </select>
                        <br/>
                        <select id="place" onChange={handleChange} className="white" defaultValue="0">
                            <option value="0" disabled="disabled">Choose Location</option>
                            <option value="Cage">Cage</option>
                            <option value="House">House</option>
                        </select>

                    </div>

                    <div style={{display: 'none'}} id="reason">
                        <br/>
                        <div className="input-field">
                            <label htmlFor="reason">Reason</label>
                            <input type="text" id="reason" onChange={handleChange} required/>
                        </div>
                    </div>

                    <div style={{display: 'none'}} id="sick">
                        <br/>
                        <div className="input-field">
                            <label htmlFor="treatment">Treatment Given</label>
                            <input type="text" id="treatment" onChange={handleChange}/>
                        </div>
                    </div>


                    <div style={{display: 'none'}} id="total">
                        <br/>
                        <div className="input-field">
                            <label htmlFor="chickenNo">Number of chickens</label>
                            <input type="number" id="chickenNo" onChange={handleChange} required/>
                        </div>
                    </div>

                    <div style={{display: 'none'}} id="upload">
                            <span className="btn btn-file pink lighten-1 z-depth-0">
                                <i className="material-icons left">cloud_upload</i>
                                Browse Photo
                                <input type="file" id="photo" onChange={handleChange}/>
                           </span>
                        <p>{link}</p>
                    </div>

                    <div style={{display: 'none'}} id="loading-dead-sick">
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

                    <div style={{display: 'none'}} id="submit-btn-dead-sick">
                        <div className="input-field">
                            <button type="Submit" className="btn pink lighten-1 z-depth-0">Submit</button>
                        </div>
                    </div>
                    <div className="red-text center" id="error-text"/>
                </form>
            </div>
        </div>
    );

}

const mapDispatchToProps = (dispatch) => {
    return {
        inputDeadSick: (deadSick, image) => dispatch(inputDeadSick(deadSick, image))
    }
}

export default connect(null, mapDispatchToProps)(InputDeadSick);