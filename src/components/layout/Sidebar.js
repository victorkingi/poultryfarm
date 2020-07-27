import React from "react";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import { connect } from 'react-redux';
import M from "materialize-css/dist/js/materialize.min.js";
import "materialize-css/dist/css/materialize.min.css";

const Sidebar = (props) => {
    function componentDidMount() {
        const elem = document.querySelector(".sidenav");
        const instance = () =>
        {
            M.Sidenav.init(elem, {
                edge: "left",
                inDuration: 250
            });
        }
        instance();
    }

    componentDidMount();

    const { auth, profile } = props;

    const links = auth.uid ? <SignedInLinks profile={profile} /> : <SignedOutLinks />;

        return (
            <div>
                <ul id="slide-out" className="sidenav">
                    { auth.isLoaded && links }
                </ul>
                <a href="#" data-target="slide-out" className="sidenav-trigger">
                    <i className="material-icons">menu</i>
                </a>
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

export default connect(mapStateToProps)(Sidebar);