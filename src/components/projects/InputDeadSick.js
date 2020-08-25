import React, {Component} from "react";
import {connect} from 'react-redux';
import {inputDeadSick} from "../../store/actions/DeadSickAction";
import M from "materialize-css";
import {Redirect} from "react-router-dom";

class InputDeadSick extends Component {

    state = {
        category: 'deadSick'
    }
    image = null;

    handleChange = (e) => {
        const selectBox = document.getElementById("section");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const date = document.getElementById('date').value;
        const mysec = document.getElementById('mySection');
        const reason = document.getElementById('reason');
        const total = document.getElementById('total');
        const sick = document.getElementById('sick');
        const submit = document.getElementById('submit-btn');
        const upload = document.getElementById('upload');
        const chickenNo = document.getElementById('chickenNo').value;


        if (parseInt(date) > 0 && parseInt(date) < 32 && date !== "") {
            mysec.style.display = 'block';
            document.getElementById("error-text").innerHTML = "";
        }
        if (parseInt(date) <= 0 || parseInt(date) >= 32 || date === "") {
            mysec.style.display = 'none';
            reason.style.display = 'none';
            total.style.display = 'none';
            sick.style.display = 'none';
            document.getElementById("error-text").innerHTML = "ERROR: date ranges from 1 to 31";
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
                this.image = e.target.files[0];
            }
        }

        if (e.target.id === "date" || e.target.id === "chickenNo") {
            if (isNaN(parseInt(e.target.value))) {
                document.getElementById("error-text").innerHTML = "Error! Input needs to be a number";
            } else {
                document.getElementById("error-text").innerHTML = "";
                this.setState({
                    [e.target.id]: parseInt(e.target.value)
                });
            }
        } else {
            this.setState({
                [e.target.id]: e.target.value
            });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.inputDeadSick(this.state, this.image);
        const loading = document.getElementById('loading');
        loading.style.display = 'block';
        //  this.props.history.push('/');

    }

    componentDidMount = () => {
        M.AutoInit();
    }

    render() {
        const {auth} = this.props;
        const link = this.image ? 'Image added: ' + this.image.name : 'No image added';


        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }

        return (
            <div>

                <div className="container">
                    <form onSubmit={this.handleSubmit} className="white">
                        <h5 className="grey-text text-darken-3">Input Dead / Sick</h5>
                        <br/>
                        <div className="input-field">
                            <label htmlFor="date">Select Date (range: 1 - 31)</label>
                            <input type="number" id="date" onChange={this.handleChange} required/>
                        </div>

                        <div style={{display: 'none'}} id="mySection">
                            <select id="section" onChange={this.handleChange} className="white" defaultValue="0">
                                <option value="0" disabled="disabled">Choose Section</option>
                                <option value="Dead">Dead</option>
                                <option value="Sick">Sick</option>
                            </select>
                        </div>

                        <div style={{display: 'none'}} id="reason">
                            <br/>
                            <div className="input-field">
                                <label htmlFor="reason">Reason</label>
                                <input type="text" id="reason" onChange={this.handleChange} required/>
                            </div>
                        </div>

                        <div style={{display: 'none'}} id="sick">
                            <br/>
                            <div className="input-field">
                                <label htmlFor="treatment">Treatment Given</label>
                                <input type="text" id="treatment" onChange={this.handleChange}/>
                            </div>
                        </div>


                        <div style={{display: 'none'}} id="total">
                            <br/>
                            <div className="input-field">
                                <label htmlFor="chickenNo">Number of chickens</label>
                                <input type="number" id="chickenNo" onChange={this.handleChange} required/>
                            </div>
                        </div>

                        <div style={{display: 'none'}} id="upload">
                            <span className="btn btn-file pink lighten-1 z-depth-0">
                                <i className="material-icons left">cloud_upload</i>
                                Browse Photo
                                <input type="file" id="photo" onChange={this.handleChange}/>
                           </span>
                            <p>{link}</p>
                        </div>

                        <div style={{display: 'none'}} id="loading">
                            <div className="preloader-wrapper big active">
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

                        <div style={{display: 'none'}} id="submit-btn">
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

}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        inputDeadSick: (deadSick, image) => dispatch(inputDeadSick(deadSick, image))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputDeadSick);