import React, { Component } from "react";
import { connect } from 'react-redux';
import { inputSales } from "../../store/actions/salesAction";
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
        if(selectedValue !== "") {
            const sales = document.getElementById("sales");
            sales.style.display = 'block';
        }

        if(selectedValue === "Other") {
            const sales = document.getElementById("other");
            sales.style.display = 'block';
        }

        if (selectedValue !== "Other" &&  selectedValue !== "") {
            const item = document.getElementById("other");
            item.style.display = 'none';
        }

        this.setState({
                [e.target.id]: e.target.value
            });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const selectBox = document.getElementById("section");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;

        if(selectedValue === "Other") {
            const sales = document.getElementById("buyerName");
            if(sales.value === "") {
                document.getElementById("error-text").innerHTML = "Please input an Item name"
            }
            else {
                this.props.inputSales(this.state);
                this.props.history.push('/');
            }
        }
        if (selectedValue !== "Other") {
            const sales = document.getElementById("buyerName");
            if(sales.value !== "") {
                document.getElementById("error-text").innerHTML = "Error! Try again"
            }
            else {
                this.props.inputSales(this.state);
                this.props.history.push('/');
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

                    <select id="section" onChange={this.handleChange} className="white" defaultValue="0" >
                        <option value="0" disabled="disabled">Choose Section</option>
                        <option value="Thika Farmers">Thika Farmers</option>
                        <option value="Cakes">Cakes</option>
                        <option value="Simbi">Simbi</option>
                        <option value="Other">Other</option>
                    </select>

                    <div style={{display: 'none' }} id="other" >
                        <div className="input-field">
                            <label htmlFor="buyerName">Name of Buyer</label>
                            <input type="text" id="buyerName" onChange={this.handleChange} />
                        </div>
                    </div>

                    <div style={{display: 'none' }} id="sales" >
                        <div className="input-field">
                            <label htmlFor="trayNo">Number of Trays</label>
                            <input type="number" id="trayNo" onChange={this.handleChange} required/>
                        </div>

                        <div className="input-field">
                            <label htmlFor="trayPrice">Price per Tray</label>
                            <input type="number" id="trayPrice" onChange={this.handleChange} required/>
                        </div>

                        <div className="input-field">
                            <button type="Submit" className="btn pink lighten-1 z-depth-0">Submit</button>
                            <div className="red-text center" id="error-text"/>
                        </div>

                    </div>

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
        inputSales: (sale) => dispatch(inputSales(sale))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inputsell)