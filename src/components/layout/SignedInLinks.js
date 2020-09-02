import React from 'react';
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux';
import {checkClaims, signOut} from "../../store/actions/authActions";

const SignedInLinks = (props) => {
    const {admin} = props;
    props.checkClaims();

    if (admin) {
        return (
            <div className="container">
                <ul>
                    <li><NavLink to='/' className="btn btn-floating pink lighten-1">
                        {props.profile.initials}
                    </NavLink></li>

                    <li>
                        <div className="divider"/>
                    </li>

                    <li>
                        <span className="subheader">Inputs</span>
                    </li>

                    <li><NavLink to='/sales'>Input Sales</NavLink></li>
                    <li><NavLink to='/eggs'>Input Eggs</NavLink></li>
                    <li><NavLink to='/buy'>Input Purchases</NavLink></li>
                    <li><NavLink to='/ib'>Input Borrowing</NavLink></li>
                    <li><NavLink to='/d'>Input Sick / Dead Chicken</NavLink></li>

                    <li>
                        <div className="divider"/>
                    </li>

                    <li>
                        <span className="subheader">Send</span>
                    </li>

                    <li><NavLink to='/send'>Send money</NavLink></li>

                    <li>
                        <div className="divider"/>
                    </li>

                    <li>
                        <span className="subheader">Payments</span>
                    </li>

                    <li><NavLink to='/l'>Late Payments</NavLink></li>
                    <li><NavLink to='/rb'>Random Borrowing</NavLink></li>
                    <li><NavLink to='/o'>Other Debts</NavLink></li>

                    <li>
                        <div className="divider"/>
                    </li>

                    <li>
                        <span className="subheader">Data</span>
                    </li>

                    <li><NavLink to='/e'>Eggs collected</NavLink></li>
                    <li><NavLink to='/s'>Sales Made</NavLink></li>
                    <li><NavLink to='/b'>Items Purchased</NavLink></li>
                    <li><NavLink to='/sd'>Sick / Dead Chicken</NavLink></li>
                    <li><NavLink to='/chart'>Charts</NavLink></li>

                    <li>
                        <div className="divider"/>
                    </li>

                    <li>
                        <span className="subheader">Exit</span>
                    </li>

                    <li><NavLink to='/signin' onClick={props.signOut}>Log Out</NavLink></li>
                </ul>
            </div>
        );
    } else {
        return (
            <div className="container">
                <ul>
                    <li><NavLink to='/' className="btn btn-floating pink lighten-1">
                        {props.profile.initials}
                    </NavLink></li>

                    <li>
                        <div className="divider"/>
                    </li>

                    <li>
                        <span className="subheader">Inputs</span>
                    </li>

                    <li><NavLink to='/sales'>Input Sales</NavLink></li>
                    <li><NavLink to='/eggs'>Input Eggs</NavLink></li>
                    <li><NavLink to='/buy'>Input Purchases</NavLink></li>

                    <li>
                        <div className="divider"/>
                    </li>

                    <li>
                        <span className="subheader">Send</span>
                    </li>

                    <li><NavLink to='/send'>Send money</NavLink></li>

                    <li>
                        <div className="divider"/>
                    </li>

                    <li>
                        <span className="subheader">Payments</span>
                    </li>

                    <li><NavLink to='/l'>Late Payments</NavLink></li>

                    <li>
                        <div className="divider"/>
                    </li>

                    <li>
                        <span className="subheader">Exit</span>
                    </li>

                    <li><NavLink to='/signin' onClick={props.signOut}>Log Out</NavLink></li>
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        admin: state.auth.admin
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut()),
        checkClaims: () => dispatch(checkClaims())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks)