import React, {useEffect} from "react";
import {connect} from "react-redux";
import "./NotFound.css";
import {hideBars} from "../../../../services/actions/utilAction";

function NotFound(props) {
    props.hideBars();

    useEffect(() => {
        document.body.style.background = 'white';

        return () => {
            document.body.style.background = 'url(background.jpg) scroll';
        }

    }, [])

    return (
        <div className="not-found">
            <img
                src="https://miro.medium.com/max/5120/1*DeBkx8vjbumpCO-ZkPE9Cw.png"
                alt="STATUS_CODE:_404_HTTPS_ERROR"
            />
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        hideBars: () => dispatch(hideBars())
    }
}

export default connect(null, mapDispatchToProps)(NotFound);
