/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Service from "../../../../service/Service";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography } from "@mui/material";

function ExamHistory() {
    const [exams, setExams] = useState([]);
    const [showExamRules, setShowExamRules] = useState(false);
    const [selectedExamID, setSelectedExamID] = useState(null);
    const navigate = useNavigate();

    const getExamsByID = (ID) => {
        Service.get("/getCandidateExams", { params: { ID } })
            .then((res) => {
                setExams(res.data.result);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const completedExams = exams.filter((exam) => exam.examStatus === 1); // Completed
    const ongoingExams = exams.filter((exam) => exam.examStatus === 0); // Ongoing

    const isStartButtonAvailable = (exam) => {
        if (exam.examAvailability === "Always available") {
            return true;
        } else if (exam.examAvailability === "Available on specific time") {
            const now = moment();
            const startTime = moment(exam.startDateTime);
            const endTime = moment(exam.endDateTime);
            return now.isBetween(startTime, endTime);
        }
        return false;
    };

    const handleStartExam = (examID) => {
        // setSelectedExamID(examID);
        // setShowExamRules(true);
        // navigate( `/exam/${examID}`)
        window.open(`/startExam/${examID}`);

    };

    useEffect(() => {
        getExamsByID("RS24B001");
    }, []);

    const ongoingColumns = [
        { field: "examID", headerName: "Exam ID", flex: 1 },
        { field: "examName", headerName: "Exam Name", flex: 2 },
        { field: "domainName", headerName: "Domain", flex: 1 },
        { field: "duration", headerName: "Duration", flex: 1 },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            renderCell: (params) => (
                isStartButtonAvailable(params.row) ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleStartExam(params.row.examID)}
                    >
                        Start Exam
                    </Button>
                ) : (
                    <Button variant="outlined" color="secondary" disabled>
                        Not Available
                    </Button>
                )
            ),
        },
    ];

    const completedColumns = [
        { field: "examID", headerName: "Exam ID", flex: 1 },
        { field: "examName", headerName: "Exam Name", flex: 2 },
        { field: "domainName", headerName: "Domain", flex: 1 },
        { field: "duration", headerName: "Duration", flex: 1 },
    ];

    return (
        <Box p={3}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Ongoing Exams
            </Typography>
            <Box mb={4} style={{ height: 400 }}>
                <DataGrid
                    rows={ongoingExams.map((exam, index) => ({ ...exam, id: index }))}
                    columns={ongoingColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                />
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Completed Exams
            </Typography>
            <Box style={{ height: 400 }}>
                <DataGrid
                    rows={completedExams.map((exam, index) => ({ ...exam, id: index }))}
                    columns={completedColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                />
            </Box>
        </Box>
    );
}

export default ExamHistory;
