import React, {Component} from "react";
import {connect} from 'react-redux';
import {updateBorrow} from "../../store/actions/moneyAction";
import M from 'materialize-css';
import {Redirect} from "react-router-dom";

class InputBorrow extends Component {
    state = {
        category: 'borrow'
    }

    handleChange = (e) => {
        const selectBox = document.getElementById("borrower");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        const borrow = document.getElementById('borrow');
        const borrow2 = document.getElementById('borrowAmount').value;
        const submit = document.getElementById('submit-btn');

        if (selectedValue !== "") {
            borrow.style.display = 'block';
        }

        if (parseInt(borrow2) > 0 && parseInt(borrow2) < Number.MAX_SAFE_INTEGER) {
            submit.style.display = 'block';
            document.getElementById('error-text').innerHTML = "";
        } else {
            submit.style.display = 'none';
            document.getElementById('error-text').innerHTML = "ERROR: Must be a number above 0";
        }

        const myInt = parseInt(e.target.value);

        if (isNaN(myInt)) {
            this.setState({
                [e.target.id]: e.target.value
            });
        } else {
            this.setState({
                [e.target.id]: myInt
            });
        }

    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.updateBorrow(this.state);
        this.props.history.push('/');
    }

    componentDidMount = () => {
        M.AutoInit();
    }

    render() {
        const {auth} = this.props;

        if (!auth.uid) {
            return (
                <Redirect to="/signin"/>
            )
        }

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Input Borrowed Amount</h5>

                    <select id="borrower" onChange={this.handleChange} className="white" defaultValue="0">
                        <option value="0" disabled="disabled">Choose Borrower</option>
                        <option value="jeffkarue@gmail.com">Jeff</option>
                        <option value="Anne">Anne</option>
                    </select>
                    <br/>
                    <div style={{display: 'none'}} id="borrow">
                        <div className="input-field">
                            <label htmlFor="borrowAmount">Amount</label>
                            <input type="number" id="borrowAmount" onChange={this.handleChange}/>
                        </div>
                        <br/>
                        <div className="input-field">
                            <label htmlFor="purpose">Purpose</label>
                            <input type="text" id="purpose" onChange={this.handleChange} required/>
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
        updateBorrow: (details) => dispatch(updateBorrow(details))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputBorrow)