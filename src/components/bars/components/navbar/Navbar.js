import React from 'react';
import {Link} from 'react-router-dom';
import "./NavBar.css";
import {connect} from "react-redux";

const Navbar = function({hide}) {

    return (
        <nav className={`nav-wrapper grey darken-3 my-navbar ${hide && 'my-navbar-hide'}`}>
            <div className="container">
                <Link to='/' className="brand-logo left">Poultry101</Link>
            </div>
        </nav>
    )
}


const mapStateToProps = function(state) {
    return {
        hide: state.util.hide
    }
}

export default connect(mapStateToProps)(Navbar);