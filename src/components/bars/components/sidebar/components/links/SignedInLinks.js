import React from 'react';
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux';
import {checkClaims, signOut} from "../../../../../../services/actions/authActions";

const SignedInLinks = (props) => {
    const {admin, changer, auth} = props;
    props.checkClaims();
    const lastIndex = auth?.displayName.lastIndexOf(" ");
    const initials = `${auth?.displayName.substring(0, 1)}${auth?.displayName.substring(lastIndex + 1, lastIndex + 2)}`

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
                    <li><NavLink to='/signin' onClick={props.signOut}>Log Out</NavLink></li>

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

                </ul>
            </div>
        );
    } else if (changer) {
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
    } else {
        return (
            <div className="container">
                <ul>
                    <li><NavLink to='/' className="btn btn-floating pink lighten-1">
                        {props.profile.initials || initials}
                    </NavLink></li>

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
        admin: state.auth.admin,
        changer: state.auth.changer,
        auth: state.firebase.auth
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut()),
        checkClaims: () => dispatch(checkClaims())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks)