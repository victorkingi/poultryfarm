import React, {Component} from "react";
import {connect} from 'react-redux';
import {inputSell} from "../../store/actions/salesAction";
import M from 'materialize-css';
import {Redirect} from "react-router-dom";

class Inputsell extends Component {
    state = {
        category: 'sales',
        section: '',
    }

    handleChange = (e) => {
        const selectBox = document.getElementById("section");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const status = document.getElementById('status');
        const statusValue = status.options[status.selectedIndex].value;
        const date = document.getElementById('date').value;
        const month = document.getElementById('month').value;
        const mysec = document.getElementById('mySection');
        const sales = document.getElementById('sales');
        const trayPrice = document.getElementById('trayPrice').value;
        const checks = parseInt(date) > 0 && parseInt(date) < 32 && date !== "" && parseInt(month) > 0 && parseInt(month) < 13;


        if (checks) {
            mysec.style.display = 'block';
        } else {
            mysec.style.display = 'none';
            sales.style.display = 'none';

        }

        if (selectedValue === "Cakes" || selectedValue === "Simbi" || selectedValue === "Thika Farmers") {
            const old = document.getElementById("old");
            const other = document.getElementById("other");
            const sales = document.getElementById("sales");
            sales.style.display = 'block';
            old.style.display = 'none';
            other.style.display = 'none';
        }

        if (selectedValue === "Other") {
            const other = document.getElementById("other");
            const sales = document.getElementById("sales");
            const old = document.getElementById("old");
            old.style.display = 'none';
            other.style.display = 'block';
            sales.style.display = 'block';
        }

        if (selectedValue === "Old Chickens") {
            const old = document.getElementById("old");
            const other = document.getElementById("other");
            const sales = document.getElementById("sales");
            const final = document.getElementById("final");
            other.style.display = 'block';
            old.style.display = 'block';
            sales.style.display = 'none';
            final.style.display = 'block';
        }

        if (selectedValue !== "Old Chickens" && selectedValue !== "Other") {
            const item = document.getElementById("other");
            item.style.display = 'none';

        }

        if (parseInt(trayPrice) > 0) {
            const final = document.getElementById("final");
            final.style.display = 'block';
        }

        if (statusValue !== "0") {
            const btn = document.getElementById("submit-btn");
            btn.style.display = 'block';
        }

        if (e.target.id === "status") {
            this.setState({
                [e.target.id]: JSON.parse(e.target.value)
            });
        } else if (e.target.id === "date" || e.target.id === "trayNo" || e.target.id === "trayPrice"
            || e.target.id === "chickenNo" || e.target.id === "chickenPrice" || e.target.id === "month") {
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
        const selectBox = document.getElementById("section");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const load = document.getElementById("loading");
        const submit = document.getElementById("submit-btn");

        submit.style.display = 'none';
        load.style.display = 'block';

        if (selectedValue === "Other" || selectedValue === "Old Chickens") {
            const sales = document.getElementById("buyerName");
            if (sales.value === "") {
                document.getElementById("error-text").innerHTML = "Please input a buyer name"
            } else {
                this.props.inputSell(this.state);
            }
        }
        if (selectedValue !== "Other" && selectedValue !== "Old Chickens") {
            const sales = document.getElementById("buyerName");
            if (sales.value !== "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            } else {
                this.props.inputSell(this.state);
            }
        }

    }

    componentDidMount = () => {
        M.AutoInit();
    }

    render() {
        const { auth } = this.props;

        if(!auth.uid) {
            return (
                <Redirect to="/signin" />
            )
        }

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Input Sales</h5>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="date">Select Date (range: 1 - 31)</label>
                        <input type="number" id="date" onChange={this.handleChange} required/>
                    </div>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="month">Select Month (range: 1 - 12)</label>
                        <input type="number" id="month" onChange={this.handleChange} required/>
                    </div>

                    <div style={{display: 'none'}} id="mySection">
                        <select id="section" onChange={this.handleChange} className="white" defaultValue="0">
                            <option value="0" disabled="disabled">Choose Section</option>
                            <option value="Thika Farmers">Thika Farmers</option>
                            <option value="Cakes">Cakes</option>
                            <option value="Simbi">Duka</option>
                            <option value="Old Chickens">Old chickens</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{display: 'none'}} id="other">
                        <br/>
                        <div className="input-field">
                            <label htmlFor="buyerName">Name of Buyer</label>
                            <input type="text" id="buyerName" onChange={this.handleChange}/>
                        </div>
                    </div>

                    <div style={{display: 'none'}} id="old">
                        <br/>
                        <div className="input-field">
                            <label htmlFor="chickenNo">Number of old chickens</label>
                            <input type="number" id="chickenNo" onChange={this.handleChange}/>
                        </div>
                        <br/>
                        <div className="input-field">
                            <label htmlFor="chickenPrice">Price of 1 chicken</label>
                            <input type="number" id="chickenPrice" onChange={this.handleChange}/>
                        </div>
                    </div>

                    <div style={{display: 'none'}} id="sales">
                        <br/>
                        <div className="input-field">
                            <label htmlFor="trayNo">Number of Trays</label>
                            <input type="number" id="trayNo" onChange={this.handleChange}/>
                        </div>
                        <br/>
                        <div className="input-field">
                            <label htmlFor="trayPrice">Price per Tray</label>
                            <input type="number" id="trayPrice" onChange={this.handleChange}/>
                        </div>

                    </div>

                    <div style={{display: 'none'}} id="final">
                        <select id="status" onChange={this.handleChange} className="white" defaultValue="0">
                            <option value="0" disabled="disabled">Status</option>
                            <option value={true}>Paid</option>
                            <option value={false}>Not paid</option>
                        </select>
                    </div>

                    <div style={{display: 'none'}} id="loading">
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

                    <div style={{display: 'none'}} id="submit-btn">
                        <div className="input-field">
                            <button type="Submit" className="btn pink lighten-1 z-depth-0">Submit</button>
                        </div>
                    </div>
                    <div className="red-text center" id="error-text"/>
                </form>
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
        inputSell: (sale) => dispatch(inputSell(sale))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inputsell)