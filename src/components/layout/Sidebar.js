import React, {useEffect} from "react";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import {connect} from 'react-redux';
import M from "materialize-css/dist/js/materialize.min.js";
import "materialize-css/dist/css/materialize.min.css";
import "./SideBar.css";

const Sidebar = (props) => {
    function componentDidMount() {

    }

    useEffect(() => {
        M.AutoInit();
        const elem = document.querySelector(".sidenav");
        const instance = () => {
            M.Sidenav.init(elem, {
                edge: "left",
                inDuration: 250
            });
        }
        instance();

    }, []);

    componentDidMount();

    const {auth, profile, hide} = props;

    const links = auth.uid ? <SignedInLinks profile={profile}/> : <SignedOutLinks/>;

    return (
        <div className={`my-sidebar ${hide && 'my-sidebar-hide'}`}>
            <ul id="slide-out" className="sidenav">
                    {auth.isLoaded && links}
                </ul>
                <a href='/' data-target="slide-out" className="sidenav-trigger">
                    <i className="material-icons icon-black">menu</i>
                </a>
            </div>
        );

}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
        hide: state.util.hide
    }
}

export default connect(mapStateToProps)(Sidebar);