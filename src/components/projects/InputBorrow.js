import React, {Component} from "react";
import {connect} from 'react-redux';
import {borrowSomeMoney} from "../../store/actions/moneyAction";
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
        const load = document.getElementById("loading");
        const submit = document.getElementById("submit-btn");

        submit.style.display = 'none';
        load.style.display = 'block';

        //   this.props.borrowSomeMoney(this.state);

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
        borrowSomeMoney: (details) => dispatch(borrowSomeMoney(details))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputBorrow)