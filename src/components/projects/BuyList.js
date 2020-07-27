import React from "react";
import BuySummary from "./BuySummary";
import { Link } from "react-router-dom";

const BuyList = ({buys}) => {
    return (
        <div className="project-list section">
            { buys && buys.map(buy => {
                return (
                    <Link to={'/b/' + buy.id} key={buy.id} >
                    <BuySummary buy={buy}  />
                    </Link>
                )
            })}
        </div>
    )
}

export default BuyList;