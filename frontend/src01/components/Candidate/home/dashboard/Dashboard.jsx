/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import { AgCharts } from "ag-charts-react";
import "./Dashboard.css";

function Dashboard() {

    const [options, setOptions] = useState({
        series: [
            {
                type: "donut",
                calloutLabelKey: "title",
                angleKey: "count",
                innerRadiusRatio: 0.5,
                width: '500px'
            }
        ],
        data: [
            { title: "Exams", count: 10 },
            { title: "Completed", count: 6 },
            { title: "Upcoming", count: 2 },
            { title: "Not Attended", count: 2 }
        ]
    });

    return (
        <div className="container p-4">
            <div className="dashboard_heading">Dashboard</div>
            <div className="row my-4">
                {/* <div className="col-md-7 col-lg-7">
                    <div className="dashboard_exams_container">
                        <h6>Looking for your exams?</h6>
                        <div>To find your next & incomplete exams, please go to <Link>Upcoming Exams</Link></div>
                        <div>To find your completed exams, please go to <Link>Exam History</Link></div>
                    </div>
                </div>
                <div className="col-md-5 col-lg-5">
                    <div className="dashboard_examstaken_container">
                        <div>Exams Taken</div>
                    </div>
                </div> */}
                <div className="col-6">
                    <div className="row row-gap-3">
                        <div className="col-6">
                            <div className="card h-100 dashboard_cards">
                                <div>
                                    <h6>Total Exams</h6>
                                    <div className="exams_count">10</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card h-100 dashboard_cards">
                                <div>
                                    <h6>Completed Exams</h6>
                                    <div className="exams_count">6</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card h-100 dashboard_cards">
                                <div>
                                    <h6>Upcoming Exams</h6>
                                    <div className="exams_count">2</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card h-100 dashboard_cards">
                                <div>
                                    <h6>Not Attended</h6>
                                    <div className="exams_count">2</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="row">
                        <div className="col-12">
                            <AgCharts options={options} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Dashboard;