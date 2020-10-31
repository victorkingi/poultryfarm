import React from "react";

const SickDeadSummary = (deadSick) => {

    const img = document.createElement("img");

    img.src = deadSick.item.photoURL;
    img.onload = function () {
        console.log("complete");
    }
    img.onerror = function () {
        console.log("error loading image");
    }


    if (deadSick.item) {

        if (deadSick.item.section === "Sick") {
            if (deadSick.item.chickenNo === 1) {
                return (
                    <div className="row">
                        <div className="col s12 m7">
                            <div className="card">
                                <div className="card-image">
                                    <img alt="chickensick" src={deadSick.item.photoURL}/>
                                    <span className="card-title">{deadSick.item.section} Chicken</span>
                                </div>
                                <div className="card-content">
                                    <p>{deadSick.item.chickenNo} chicken was sick because of {deadSick.item.reason}</p>
                                    <p>Treatment: {deadSick.item.treatment}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else if (deadSick.item.chickenNo > 1) {
                return (
                    <div className="row">
                        <div className="col s12 m7">
                            <div className="card">
                                <div className="card-image">
                                    <img alt="chickensick" src={deadSick.item.photoURL}/>
                                    <span className="card-title">{deadSick.item.section} Chickens</span>
                                </div>
                                <div className="card-content">
                                    <p>{deadSick.item.chickenNo} chickens were sick because
                                        of {deadSick.item.reason} and we
                                        gave it {deadSick.item.treatment}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        } else {
            if (deadSick.item.chickenNo === 1) {
                return (
                    <div className="row">
                        <div className="col s12 m7">
                            <div className="card">
                                <div className="card-image">
                                    <img alt="chickendied" src={deadSick.item.photoURL}/>
                                    <span className="card-title">{deadSick.item.section} Chicken</span>
                                </div>
                                <div className="card-content">
                                    <p>{deadSick.item.chickenNo} chicken died cause of {deadSick.item.reason}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else if (deadSick.item.chickenNo > 1) {
                return (
                    <div className="row">
                        <div className="col s12 m7">
                            <div className="card">
                                <div className="card-image">
                                    <img alt="chickendied" src={deadSick.item.photoURL}/>
                                    <span className="card-title">{deadSick.item.section} Chickens</span>
                                </div>
                                <div className="card-content">
                                    <p>{deadSick.item.chickenNo} chickens died cause of {deadSick.item.reason}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }

    } else {
        return (
            <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <p>Updating chicken list...</p>
                </div>
            </div>

        )
    }
}

export default SickDeadSummary;