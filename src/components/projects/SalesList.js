import React from "react";
import SalesSummary from "./SalesSummary";
import { Link } from "react-router-dom";

const SalesList = ({sales}) => {

    return (
        <div className="project-list section">
            { sales && sales.map(item => {
                return (
                    <Link to={'/s/' + item.id} key={item.id} >
                    <SalesSummary item={item}  />
                    </Link>
                )
            })}
        </div>
    )
}

export default SalesList;