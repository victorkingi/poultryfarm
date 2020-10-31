import React from "react";
import moment from "moment";

const News = (props) => {
    const {news} = props;

    if (news) {
        return (
            <div className="section modal-trigger">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <div className="card z-depth-0 project-summary">
                            {news && news.map(item => {

                                return (
                                    <span key={item.id} onClick={() => {
                                        window.location.href = item.link
                                    }}>
                                            <span className="card-title">{item.title}</span>
                                            <span className="card-content">{item.content}</span>
                                             <div className="grey-text note-date">
                                                {moment(item.time.toDate()).fromNow()}
                                            </div>
                                        </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );

    } else {
        return (
            <div className="section">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">Latest Poultry News</span>
                        <span className="card-content">Loading data...</span>
                    </div>
                </div>
            </div>
        );

    }
}

export default News;