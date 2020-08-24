import React, {useState} from "react";
import {connect} from 'react-redux';
import {photoUpload} from "../../store/actions/DeadSickAction";

const ReactFirebaseFileUpload = (props) => {
    const [image, setImage] = useState(null);
    this.state = {
        category: 'deadSick'
    }

    const handleChange = (e) => {
        const selectBox = document.getElementById("section");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const date = document.getElementById('date').value;
        const mysec = document.getElementById('mySection');
        const reason = document.getElementById('reason');
        const total = document.getElementById('total');
        const sick = document.getElementById('sick');
        const submit = document.getElementById('submit-btn');
        const chickenNo = document.getElementById('chickenNo').value;

        if (parseInt(date) > 0 && parseInt(date) < 32 && date !== "") {
            mysec.style.display = 'block';
            document.getElementById("error-text").innerHTML = "";
        } else {
            mysec.style.display = 'none';
            reason.style.display = 'none';
            total.style.display = 'none';
            sick.style.display = 'none';
            document.getElementById("error-text").innerHTML = "ERROR: date ranges from 1 to 31";
        }

        if (selectedValue === "Dead" || selectedValue === "Sick") {
            reason.style.display = 'block';
            total.style.display = 'block';
        }

        if (selectedValue === "") {
            mysec.style.display = 'none';
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
        } else {
            submit.style.display = 'none';
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

        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectBox = document.getElementById("section");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;

        if (selectedValue === "Other" || selectedValue === "Old Chickens") {
            const sales = document.getElementById("buyerName");
            if (sales.value === "") {
                document.getElementById("error-text").innerHTML = "Please input a buyer name"
            } else {
                this.props.inputSales(this.state);
                this.props.history.push('/');
            }
        }
        if (selectedValue !== "Other" && selectedValue !== "Old Chickens") {
            const sales = document.getElementById("buyerName");
            if (sales.value !== "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            } else {
                this.props.inputSales(this.state);
                this.props.history.push('/');
            }
        }

    }

    const handleUpload = () => {

        console.log("image: ", image.name);
        props.photoUpload(image);
    }

    return (
        <div>

            <div className="container">
                <form onSubmit={handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Input Dead / Sick</h5>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="date">Select Date (range: 1 - 31)</label>
                        <input type="number" id="date" onChange={handleChange} required/>
                    </div>

                    <div style={{display: 'none'}} id="mySection">
                        <select id="section" onChange={handleChange} className="white" defaultValue="0">
                            <option value="0" disabled="disabled">Choose Section</option>
                            <option value="Dead">Dead</option>
                            <option value="Sick">Sick</option>
                        </select>
                    </div>

                    <div style={{display: 'none'}} id="reason">
                        <br/>
                        <div className="input-field">
                            <label htmlFor="reason">Reason</label>
                            <input type="text" id="reason" onChange={handleChange}/>
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
                            <input type="number" id="chickenNo" onChange={handleChange}/>
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

            <br/>
            <br/>
            <input type="file" onChange={handleChange}/>
            <button onClick={handleUpload}>Upload</button>
            <br/>
            <br/>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        photoUpload: (photo) => dispatch(photoUpload(photo))
    }
}

export default connect(null, mapDispatchToProps)(ReactFirebaseFileUpload);