/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
import { Button, FormControl, FormGroup, InputLabel, Select, Checkbox, IconButton, OutlinedInput, Table, TableContainer, Menu, MenuItem, TableBody, styled, TableCell, tableCellClasses, TableHead, TableRow, Paper, TablePagination, TextField, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Service from '../../../service/Service'
import SettingsIcon from '@mui/icons-material/Settings';
import ExamsHistory from '../exams/ExamsHistory';
import ExamSummary from '../exams/ExamSummary';
import MeritList from '../exams/MeritList';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import { Typography, Grid } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import GlobalExamDetails from './GlobalExamDetails'
import GlobalRegistrations from './GlobalRegistrations';
import ExamSettings from './ExamSettings';
import HallTicket from './HallTicket';
import Mailing from './Mailing';


const GradeTypeSelector = () => {
    const [gradeType, setGradeType] = useState("Pass/Fail");
    const [ranges, setRanges] = useState({
        "Pass/Fail": { min: 40 },
        Grading: [
            { label: "Grade A", min: 81, max: 100 },
            { label: "Grade B", min: 61, max: 80 },
            { label: "Grade C", min: 41, max: 60 },
            { label: "Grade D", min: 21, max: 40 },
            { label: "Grade E", min: 0, max: 20 },
        ],
        "Good/Excellent": [
            { label: "Excellent", min: 81, max: 100 },
            { label: "Very Good", min: 61, max: 80 },
            { label: "Good", min: 41, max: 60 },
            { label: "Fair", min: 21, max: 40 },
            { label: "Needs Improvement", min: 0, max: 20 },
        ],
    });

    // Handle change in the grading type
    const handleGradeTypeChange = (e) => {
        setGradeType(e.target.value);
    };

    // Handle change in grading ranges
    const handleRangeChange = (index, field, value) => {
        const updatedRanges = ranges[gradeType].map((range, idx) =>
            idx === index ? { ...range, [field]: value } : range
        );
        setRanges({ ...ranges, [gradeType]: updatedRanges });
    };

    // Handle change for Pass/Fail minimum
    const handlePassFailChange = (value) => {
        setRanges({ ...ranges, "Pass/Fail": { min: value } });
    };

    // Send grading details for the selected type
    const sendGradingDetails = () => {
        console.log("Grading Details to Send:", ranges[gradeType]);
    };

    return (
        <div style={{ padding: "20px", display: "flex", gap: "50px" }}>
            <div >
                <Select
                    value={gradeType}
                    onChange={handleGradeTypeChange}
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: "20px" }}
                >
                    <MenuItem value="Pass/Fail">Pass/Fail</MenuItem>
                    <MenuItem value="Grading">Grading</MenuItem>
                    <MenuItem value="Good/Excellent">Good/Excellent</MenuItem>
                </Select>
            </div>

            {gradeType === "Pass/Fail" && (
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <Typography>Minimum required score:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            type="number"
                            value={ranges["Pass/Fail"].min}
                            onChange={(e) => handlePassFailChange(e.target.value)}
                            variant="outlined"
                            size="small"
                            style={{ width: "100px" }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography>%</Typography>
                    </Grid>
                </Grid>
            )}

            {(gradeType === "Grading" || gradeType === "Good/Excellent") && (
                <div>
                    {ranges[gradeType].map((range, index) => (
                        <Grid container alignItems="center" spacing={2} key={index}>
                            <Grid item>
                                <Typography>{range.label}:</Typography>
                            </Grid>
                            <Grid item>
                                <TextField
                                    type="number"
                                    value={range.min}
                                    onChange={(e) => handleRangeChange(index, "min", e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    style={{ width: "100px" }}
                                />
                            </Grid>
                            <Grid item>
                                <Typography>% to </Typography>
                            </Grid>
                            <Grid item>
                                <TextField
                                    type="number"
                                    value={range.max}
                                    onChange={(e) => handleRangeChange(index, "max", e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    style={{ width: "100px" }}
                                />
                            </Grid>
                            <Grid item>
                                <Typography>% {" "}</Typography>
                            </Grid>
                        </Grid>
                    ))}
                </div>
            )}
        </div>
    );
};


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const ExamsTable = ({ examsList, onMenuItemClick, updateExamStatus }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElSub, setAnchorElSub] = useState(null);
    const [currentExam, setCurrentExam] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event, exam) => {
        console.log("Clicked Exam:", exam);  // Debugging log
        setAnchorEl(event.currentTarget);
        setCurrentExam(exam);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentExam(null);
    };

    const handleStatusChange = (newStatus) => {
        if (currentExam) {
            updateExamStatus(currentExam.ID, newStatus); // Call the function to update status
        }
        handleClose();
    };

    const filteredExams = Array.isArray(examsList)
        ? examsList.filter((exam) =>
            exam.examName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div style={{ width: "75vw", margin: "0 auto" }}>
            <TextField
                label="Search"
                placeholder="Search with exam name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                autoComplete="off"
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <TableContainer component={Paper} style={{ height: "auto" }}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell align="center">Test Name</StyledTableCell>
                            <StyledTableCell align="center">Duration (in Mins)</StyledTableCell>
                            <StyledTableCell align="center">Test Date</StyledTableCell>
                            <StyledTableCell align="center">Current Status</StyledTableCell>
                            <StyledTableCell align="left">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredExams.length > 0 ? (
                            filteredExams
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((exam, index) => (
                                    <StyledTableRow key={exam.ID || index}>
                                        <StyledTableCell component="th" scope="row">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {exam.examName}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {exam.duration}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {new Date(exam.examStartTime).toLocaleString()}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {exam.examStatus}
                                        </StyledTableCell>


                                        <StyledTableCell>
                                            <div>
                                                <IconButton onClick={(event) => handleClick(event, exam)}>
                                                    <SettingsIcon style={{ width: "20px" }} />
                                                </IconButton>
                                                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                                    <MenuItem onClick={() => onMenuItemClick("preview")}>Details</MenuItem>
                                                    {/* {exam.examStatus === "registration" && <MenuItem onClick={() => navigator.clipboard.writeText(`http://localhost:5173/register?TId=${exam.examToken}`)}>Registration Link</MenuItem>} */}
                                                    <MenuItem onClick={() => onMenuItemClick("registrations")}>Registrations</MenuItem>
                                                    <MenuItem onClick={() => onMenuItemClick("history")}>Submissions</MenuItem>
                                                    <MenuItem onClick={() => onMenuItemClick("meritlist")}>Merit List</MenuItem>
                                                    <MenuItem onClick={() => onMenuItemClick("halltickets")}>HallTickets</MenuItem>
                                                    <MenuItem onClick={() => onMenuItemClick("mailing")}>Mailing Format</MenuItem>
                                                    <MenuItem onClick={() => onMenuItemClick("settings")}>settings</MenuItem>
                                                    {/* <MenuItem>
                                                        <Button
                                                            onClick={(event) => setAnchorElSub(event.currentTarget)}
                                                            style={{ textTransform: "none", textDecoration:"none", color:"black" }}
                                                        >
                                                            Update Status
                                                        </Button>
                                                        <Menu
                                                            anchorEl={anchorElSub}
                                                            open={Boolean(anchorElSub)}
                                                            onClose={() => setAnchorElSub(null)}
                                                            anchorOrigin={{
                                                                vertical: "top",
                                                                horizontal: "left",
                                                            }}
                                                            transformOrigin={{
                                                                vertical: "top",
                                                                horizontal: "left",
                                                            }}
                                                        >
                                                            <MenuItem
                                                                onClick={() => {
                                                                    handleStatusChange("registration");
                                                                    setAnchorElSub(null);
                                                                }}
                                                            >
                                                                Open Registrations
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() => {
                                                                    handleStatusChange("ongoing");
                                                                    setAnchorElSub(null);
                                                                }}
                                                            >
                                                                Start Exam
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() => {
                                                                    handleStatusChange("closed");
                                                                    setAnchorElSub(null);
                                                                }}
                                                            >
                                                                Close Exam
                                                            </MenuItem>
                                                        </Menu>

                                                    </MenuItem> */}
                                                </Menu>
                                            </div>
                                        </StyledTableCell>


                                    </StyledTableRow>
                                ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={7} align="center">
                                    No exams found
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredExams.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
};



function GlobalExams() {

    const [isCreateMode, setIsCreateMode] = useState(false);
    const [examsList, setExamsList] = useState([]);
    const [batchList, setBatchList] = useState([]);
    const [examLink, setExamLink] = useState("");
    const [errors, setErrors] = useState({});
    const [exam, setExam] = useState('');
    const [editExamModal, setEditExamModal] = useState(false);
    const [sectionsList, setSectionList] = useState([]);

    const navigate = useNavigate();
    const [showDomains, setShowDomains] = useState(false);
    const [examHistory, setExamHistory] = useState(null);
    const [examSummary, setExamSummary] = useState(null);
    const [meritList, setMeritList] = useState(null);
    const [showExams, setShowExams] = useState(true);


    const today = new Date().toISOString().slice(0, 16); // This gives YYYY-MM-DDTHH:MM

    const handleToggle = () => {
        setIsCreateMode((prev) => !prev);
        setShowExams((prev) => !prev);
    };

    const [createExam, setCreateExam] = useState({
        examName: '',
        examToken: '',  // Added examToken field
        examStatus: "creation",
        totalMarks: '',
        correctAnswerMarks: '',
        wrongAnswerMarks: '',
        duration: '',
        examStartTime: 'Aptitude',
        noOfQuestions: '',
        questionsSection: '',
        randomizeQuestions: '',
        unusualBehavior: '',
        submissionType: '',
        showResults: "",
        liveSupport: '',
    });


    // Generate exam token only once when the component is mounted
    useEffect(() => {
        if (!createExam.examToken) {
            const token = uuidv4(); // Generate a unique token using uuidv4
            setCreateExam((prevState) => ({
                ...prevState,
                examToken: token,  // Set the generated token
            }));
        }
    }, [createExam.examToken]); // Only run once when examToken is not set


    const validateForm = () => {
        let formErrors = {};
        if (!createExam.examName) formErrors.examName = 'Exam Name is required';
        if (!createExam.duration) formErrors.duration = 'Duration is required';
        if (!createExam.negativeMarks) formErrors.negativeMarks = 'Negative Marks selection is required';
        if (!createExam.autoSubmit) formErrors.autoSubmit = 'Auto Submit selection is required';
        if (!createExam.examAvailability) formErrors.examAvailability = 'Exam Availability selection is required';
        // if (!createExam.countDown) formErrors.countDown = 'Countdown selection is required';
        if (!createExam.questions) formErrors.questions = 'questions is required';
        if (createExam.examAvailability === "Available on specific time") {
            if (!createExam.startDateTime) formErrors.startDateTime = "startDateTime is required"
            if (!createExam.endDateTime) formErrors.endDateTime = "endDateTime is required"
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };


    const onMenuItemClick = (action, examId, examName) => {
        console.log();

        console.log(`Action: ${action}, Exam ID: ${examId}, Exam Name: ${examName}`);

        if (action === "preview") {
            handleShowExamDetails(examId);
        } else if (action === "registrations") {
            handleshowRegistrations(examId);
        } else if (action === "history") {
            getExamHistory(examId, examName);
        } else if (action === "meritlist") {
            getMeritList(examId, examName);
        } else if (action === "settings") {
            handleshowExamSettings(examId);
        } else if (action === "halltickets") {
            handleshowHalltickets(examId);
        } else if (action === "mailing") {
            handleshowMailing(examId);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreateExam((prevState) => {
            const updatedState = { ...prevState, [name]: value };
            if (name === "examType" && value === "Global") {

                updatedState.examLink = `http://localhost:5173/exam/${createExam.examToken}`
            } else if (name === "examType" && value === "Internal") {
                updatedState.examLink = "";
            }
            return updatedState;
        });

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));

        console.log("Field Changed:", name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        console.log(createExam);
        // if (!validateForm()) return;
        console.log("Form submitted successfully", createExam);

        Service.post("/createGlobalExam", createExam)
            .then((res) => {
                console.log("Response:", res.data);
                toast.success(res.data.message);
                getExamsList();
                setShowExams(true);
                setIsCreateMode(false);
            })
            .catch((err) => {
                console.error("Error:", err.response?.message || err.message);
                alert("Failed to create exam. Please try again.");
            });
    };

    const handleCancel = () => {
        setCreateExam(null);
        setErrors({});
        setIsCreateMode(false);
    };

    const getExamsList = () => {
        Service.get('/getGlobalExams').then((res) => {
            console.log(res);
            const dataWithIds = res.data.results.map((item, index) => ({
                ...item,
                id: index,
                questions: item.questions || 'N/A',
                duration: item.duration || 'N/A',
                examName: item.examName || 'N/A',
            }));
            setExamsList(dataWithIds);

        })
            .catch((err) => {
                console.log(err);
            })
    }

    const getExamsByID = (ID) => {
        Service.get('/getExamByID', { params: { ID } }).then((res) => {
            console.log(res);

            setCreateExam(res.data.result);
        })
            .catch((err) => {
                console.log(err);
            })
    }
    console.log(exam)
    const sectionList = () => {
        Service.get('/GetSection_QuestionsInfo')
            .then((res) => {
                console.log("Sections (before state update):", res.data.sections);
                setSectionList(res.data.sections);
                console.log("SectionsList state after setting:", sectionsList);
            })

            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getExamsList();
        sectionList();
    }, [])

    console.log(examsList);


    const examEdit = (examId) => {
        getExamsByID(examId);
        setEditExamModal(!editExamModal);

    }


    const deleteExam = (examId) => {
        if (window.confirm("Are you sure want to delete exam with:- " + examId)) {
            Service.delete(`/deleteExam/${examId}`)
                .then((res) => {
                    console.log(res.data);
                    alert("Deleted successfully");
                    getExamsList();
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            alert("Deletion cancelled");
        }
    };

    const [showExamDetails, setShowExamDetails] = useState(false);
    const [selectedExamID, setSelectedExamID] = useState(null);
    const [showExamRegistrations, setshowExamRegistrations] = useState(false);
    const [showExamSettings, setshowExamSettings] = useState(false);
    const [showHalltickets, setshowHalltickets] = useState(false);
    const [showMailing, setshowMailing] = useState(false);


    const handleShowExamDetails = (examID) => {
        setSelectedExamID(examID);
        setShowExams(false);
        setShowExamDetails(true);
    };

    const handleshowRegistrations = (examID) => {
        setSelectedExamID(examID);
        setShowExams(false);
        setshowExamRegistrations(true);
    };

    const handleshowExamSettings = (examID) => {
        setSelectedExamID(examID);
        setShowExams(false);
        setshowExamSettings(true);
    };


    const handleshowHalltickets = (examID) => {
        setSelectedExamID(examID);
        setShowExams(false);
        setshowHalltickets(true);
    };


    const handleshowMailing = (examID) => {
        setSelectedExamID(examID);
        setShowExams(false);
        setshowMailing(true);
    };


    const handleBack = () => {
        setShowExamDetails(null);
        setSelectedExamID(null);
        setshowExamRegistrations(false);
        setshowExamSettings(null);
        setShowExams(true);
        setMeritList(null);
        setExamHistory(null);
        setExamSummary(null);
        setshowHalltickets(null);
        setshowMailing(null);
    };


    const getMeritList = (examID, examName) => {
        Service.get(`/getMeritList/${examID}`)
            .then((res) => {
                console.log("API response:", res.data);
                setMeritList(res.data.meritList || []);
                if (res.data.result && res.data.result.length == 0)
                    alert(`No responses found for ${examName} exam`)

            })
            .catch((err) => {
                console.error("Error fetching exam history:", err);
            });
    }

    if (meritList && meritList.length > 0) {
        return <MeritList meritList={meritList} onBack={handleBack} />;
    }

    const getExamHistory = (examID, examName) => {
        Service.get(`/getAssignedExams/${examID}`)
            .then((res) => {
                console.log("API response:", res.data);
                setExamHistory(res.data.result || []);
                if (res.data.result.length == 0)
                    alert(`No responses found for ${examName} exam`)

            })
            .catch((err) => {
                console.error("Error fetching exam history:", err);
            });

    };

    if (examHistory && examHistory.length > 0) {
        return <ExamsHistory examHistory={examHistory} onBack={handleBack} />;
    }

    const updateExamStatus = async (examID, newStatus) => {
        try {
            const response = await Service.put("/updateExamStatus", {
                examID,
                newStatus,
            });

            if (response.status === 200) {
                toast.success(response.data.message)
                getExamsList();
            } else {
                console.error(response.data.message);
                toast.error("Failed to update exam status");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while updating the exam status");
        }
    };

    const getExamSumary = (examID, examName) => {
        Service.get(`/getExamByID/${examID}`)
            .then((res) => {
                console.log("API response:", res.data.result);
                setExamSummary(res.data.result || []);
                if (res.data.result.length == 0)
                    alert(`No responses found for ${examName} exam`)

            })
            .catch((err) => {
                console.error("Error fetching exam history:", err);
            });
    }

    if (examSummary) {
        return <ExamSummary examSummary={examSummary} onBack={handleBack} />;
    }

    return (
        <div style={{ width: "78vw", margin: "0 auto" }}>
            <div style={{ marginTop: "-10px", height: "auto" }} className='p-2'>
                <div>
                    <section>
                        <div className="d-flex justify-content-between p-3 align-items-center">
                            <div style={{ width: "70px", height: "35px", justifyContent: "center", fontSize: "15px" }}></div>
                            <Button variant="contained" color="success" onClick={handleToggle}>
                                {isCreateMode ? (
                                    <>
                                        <MenuIcon /> <small className="ms-2">List</small>
                                    </>
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </div>

                        {isCreateMode &&
                            <section>
                                <form onSubmit={handleSubmit} style={{ margin: "auto", padding: "20px", borderRadius: "8px" }}>
                                    <p style={{ fontWeight: "bold", fontSize: "20px", paddingBottom: "10px" }}>Creating Global Exam</p>

                                    <h5 style={{ fontWeight: "bolder" }}>Exam Details</h5>
                                    <div style={{ paddingLeft: "30px", paddingRight: "60px" }}>
                                        <div style={{ display: "flex", gap: "16px" }}>
                                            <TextField className='mb-4' sx={{ flex: 2 }} label="Exam Name" name="examName" value={createExam.examName} onChange={handleChange} error={!!errors.examName} helperText={errors.examName} />
                                            <TextField sx={{ flex: 2 }} className='mb-4' label="Unique Exam Token" name="examToken" value={createExam.examToken} disabled />
                                            <TextField sx={{ flex: 1 }} className='mb-4' label="Current Exam Status" value={createExam.examStatus} disabled />
                                        </div>
                                        <div style={{ display: "flex", gap: "16px" }}>
                                            <TextField fullWidth className='mb-4' sx={{ flex: 2 }} label="Total Marks" type="number" name="totalMarks" value={createExam.totalMarks} onChange={handleChange} />
                                            <FormControl variant="outlined" sx={{ flex: 2, mb: 2 }} error={!!errors.correctAnswerMarks}>
                                                <InputLabel htmlFor="totalMarks">Marks For Correct Answer</InputLabel>
                                                <OutlinedInput
                                                    id="correctAnswerMarks"
                                                    name="correctAnswerMarks"
                                                    onChange={(e) => {
                                                        const value = Math.max(1, Number(e.target.value));
                                                        handleChange({ target: { name: "correctAnswerMarks", value } });
                                                    }}
                                                    type="number"
                                                    value={createExam.correctAnswerMarks}
                                                    label="Marks For Correct Answer"
                                                />
                                            </FormControl>

                                            <FormControl fullWidth variant="outlined" sx={{ mb: 2, flex: 2 }} error={!!errors.wrongAnswerMarks}>
                                                <InputLabel>Marks For Wrong Answer</InputLabel>
                                                <Select name='wrongAnswerMarks' value={createExam.wrongAnswerMarks} onChange={handleChange} label="Marks For Wrong Answer">
                                                    <MenuItem value='0'>Do not Apply</MenuItem>
                                                    <MenuItem value='25%'>Apply 25% negative marks</MenuItem>
                                                    <MenuItem value='50%'>Apply 50% negative marks</MenuItem>
                                                    <MenuItem value='100%'>Apply 100% negative marks</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <TextField fullWidth className='mb-4' label="Duration (in minutes)" type="number" name="duration" value={createExam.duration} onChange={handleChange} />
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker label="Start Time" value={dayjs(createExam.examStartTime)} onChange={(newValue) => handleChange({ target: { name: "examStartTime", value: newValue } })} />
                                        </LocalizationProvider>
                                    </div>
                                    <h5 style={{ fontWeight: "bolder", marginTop: "40px" }}>Question Details</h5>
                                    <div style={{ display: "flex", gap: "16px", marginBottom: "20px", marginTop: "20px", paddingLeft: "30px" }}>
                                        <TextField style={{ width: "500px" }} label="No of Questions" type="number" name="noOfQuestions" value={createExam.noOfQuestions} onChange={handleChange} />
                                        <div style={{ width: "500px" }}>
                                            <FormControl className='col-12'>
                                                <InputLabel>Assign Questions From Section</InputLabel>
                                                <Select
                                                    label="Assign Questions From Section"
                                                    value={createExam.questionsSection}
                                                    name="questionsSection"
                                                    onChange={handleChange}
                                                >
                                                    {Array.isArray(sectionsList) && sectionsList.map((section, index) => (
                                                        <MenuItem key={index} value={section.section}>
                                                            {section.section}{" ("}{section.total_questions}{" questions)"}
                                                        </MenuItem>
                                                    ))}

                                                </Select>
                                                {errors.section && <span className="text-danger">{errors.section}</span>}
                                            </FormControl>
                                        </div>
                                    </div>
                                    


                                    <div>
                                    <GradeTypeSelector />
                                    </div>
                                    <h5 style={{ fontWeight: "bolder", marginTop: "40px" }}>More Configurations</h5>
                                    <div style={{ paddingLeft: "30px" }}>
                                        <FormControl variant="outlined" style={{ width: "500px", marginTop: "20px" }}>
                                            <InputLabel>Assign Questions</InputLabel>
                                            <Select name="randomizeQuestions" value={createExam.randomizeQuestions} onChange={handleChange} label="Assign Questions">
                                                <MenuItem value='sameQuestions'>Same Questions For all Candidates</MenuItem>
                                                <MenuItem value='Randomize'>Randomize Questions and Options</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth style={{ marginTop: "30px" }}>
                                            <span className='text-bold fw-bold'>Terminate Exam if Caught Unusual Behaviour</span>
                                            <RadioGroup row name="unusualBehavior" value={createExam.unusualBehavior} onChange={handleChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="Yes" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value={false} control={<Radio />} label="Allow one time" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value={false} control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>


                                        <FormControl fullWidth style={{ marginTop: "30px" }}>
                                            <span className='text-bold fw-bold'>Exam Submission</span>
                                            <RadioGroup row name="submissionType" value={createExam.submissionType} onChange={handleChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="Allow Submitting before end-time" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value={false} control={<Radio />} label="Wait till the end-time" />
                                            </RadioGroup>
                                        </FormControl>


                                        <FormControl fullWidth style={{ marginTop: "30px" }}>
                                            <span className='text-bold fw-bold'>Show Results After Exam</span>
                                            <RadioGroup row name="showResults" value={createExam.showResults} onChange={handleChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="After Immidiate Submission" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value={false} control={<Radio />} label="After the exam" />
                                            </RadioGroup>
                                        </FormControl>

                                        <FormControl fullWidth style={{ marginTop: "30px" }}>
                                            <span className='text-bold fw-bold'>Allow Live Support</span>
                                            <RadioGroup row name="liveSupport" value={createExam.liveSupport} onChange={handleChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="Allow" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value={false} control={<Radio />} label="Disallow" />
                                            </RadioGroup>
                                        </FormControl>

                                    </div>

                                    <div style={{ display: 'flex', justifyContent: "center", gap: "100px" }}>
                                        <Button variant="contained" color="#4c4f4d">Cancel</Button>
                                        <Button variant="contained" color="success" type="submit">Save Exam</Button>
                                    </div>
                                </form>
                            </section>
                        }
                    </section>
                </div>
            </div >
            {showExams && <ExamsTable onMenuItemClick={onMenuItemClick} examsList={examsList} updateExamStatus={updateExamStatus} />}
            {showExamDetails && <GlobalExamDetails examID={selectedExamID} onBack={handleBack} />}
            {showExamRegistrations && <GlobalRegistrations examID={selectedExamID} onBack={handleBack} />}
            {showExamSettings && <ExamSettings examID={selectedExamID} onBack={handleBack} />}
            {showHalltickets && <HallTicket examID={selectedExamID} onBack={handleBack} />}
            {showMailing && <Mailing examID={selectedExamID} onBack={handleBack} />}

        </div>
    );
}

export default GlobalExams;

