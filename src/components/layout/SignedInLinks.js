import React from 'react';
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux';
import {signOut} from "../../store/actions/authActions";

const SignedInLinks = (props) => {

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
                    <a className="subheader">Inputs</a>
                </li>

                <li><NavLink to='/sales'>Input Sales</NavLink></li>
                <li><NavLink to='/eggs'>Input Eggs</NavLink></li>
                <li><NavLink to='/buy'>Input Purchases</NavLink></li>
                <li><NavLink to='/send'>Send money</NavLink></li>
                <li><NavLink to='/late'>Late Payments</NavLink></li>

                <li>
                    <div className="divider"/>
                </li>

                <li>
                    <a className="subheader">Exit</a>
                </li>

                <li><a href='/' onClick={props.signOut}>Log Out</a></li>
           </ul>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}

export default connect(null, mapDispatchToProps)(SignedInLinks)