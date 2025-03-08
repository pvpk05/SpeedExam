/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
import { Button, FormControl, FormGroup, InputLabel, Select, Checkbox, IconButton, OutlinedInput, Table, TableContainer, Menu, MenuItem, TableBody, styled, TableCell, tableCellClasses, TableHead, TableRow, Paper, TablePagination, TextField, FormControlLabel, Radio, RadioGroup, FormHelperText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Service from '../../../service/Service'
import SettingsIcon from '@mui/icons-material/Settings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faUsers, faFileContract, faLink, faAward, faFileSignature, faMailBulk, faEdit } from '@fortawesome/free-solid-svg-icons';

import GlobalSubmissions from './GlobalSubmissions';
import GlobalMeritList from './GlobalMeritList';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import GlobalExamDetails from './GlobalExamDetails'
import GlobalRegistrations from './GlobalRegistrations';
import ExamSettings from './ExamSettings';
import HallTicket from './HallTicket';
import Mailing from './Mailing';
import ExamReport from './ExamReport';
import OfferMailFormat from './OfferMailFormat';


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
    const [menuAnchors, setMenuAnchors] = useState({}); // Stores anchorEl for each exam
    const [subMenuAnchors, setSubMenuAnchors] = useState({});
    const [currentExam, setCurrentExam] = useState(null);

    const handleClick = (event, exam) => {
        setCurrentExam(exam);
        setMenuAnchors((prev) => ({ ...prev, [exam.ID]: event.currentTarget }));
    };

    const handleClose = (examId) => {
        setMenuAnchors((prev) => ({ ...prev, [examId]: null }));
        setCurrentExam(null);
    };

    const handleSubMenuClick = (event, examId) => {
        setSubMenuAnchors((prev) => ({ ...prev, [examId]: event.currentTarget }));
    };

    const handleSubMenuClose = (examId) => {
        setSubMenuAnchors((prev) => ({ ...prev, [examId]: null }));
    };

    const handleStatusChange = (newStatus) => {
        if (currentExam) {
            updateExamStatus(currentExam.ID, newStatus);
        }
        handleClose(currentExam?.ID);
    };

    const filteredExams = examsList?.filter((exam) =>
        exam.examName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

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

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{ fontSize: "15px", fontWeight: "bolder" }}>S No</StyledTableCell>
                            <StyledTableCell style={{ fontSize: "15px", fontWeight: "bolder" }} align="center">Test Name</StyledTableCell>
                            <StyledTableCell style={{ fontSize: "15px", fontWeight: "bolder" }} align="center">Duration (in Mins)</StyledTableCell>
                            <StyledTableCell style={{ fontSize: "15px", fontWeight: "bolder" }} align="center">Test Date</StyledTableCell>
                            <StyledTableCell style={{ fontSize: "15px", fontWeight: "bolder" }} align="center">Current Status</StyledTableCell>
                            <StyledTableCell style={{ fontSize: "15px", fontWeight: "bolder" }} align="left">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredExams.length > 0 ? (
                            filteredExams
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((exam, index) => (
                                    <StyledTableRow key={exam.ID || index}>
                                        <StyledTableCell>{index + 1}</StyledTableCell>
                                        <StyledTableCell align="center">{exam.examName}</StyledTableCell>
                                        <StyledTableCell align="center">{exam.duration}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            {new Date(exam.examStartTime).toLocaleString()}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{exam.examStatus}</StyledTableCell>

                                        <StyledTableCell>
                                            <IconButton onClick={(event) => handleClick(event, exam)}>
                                                <SettingsIcon style={{ width: "20px" }} />
                                            </IconButton>
                                            <Menu
                                                anchorEl={menuAnchors[exam.ID] || null}
                                                open={Boolean(menuAnchors[exam.ID])}
                                                onClose={() => handleClose(exam.ID)}
                                            >
                                                <MenuItem style={{ fontSize: "15px", fontWeight: "bolder" }} onClick={() => onMenuItemClick("details", exam.ID, exam.examName)}>
                                                    <FontAwesomeIcon
                                                        icon={faList}
                                                        onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                                                        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                                        style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            marginRight: "10px"
                                                        }}
                                                    /> Details</MenuItem>
                                                <MenuItem style={{ fontSize: "15px", fontWeight: "bolder" }} onClick={() => onMenuItemClick("registrations", exam.ID, exam.examName)}>
                                                    <FontAwesomeIcon
                                                        icon={faUsers}
                                                        onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                                                        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                                        style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            marginRight: "10px"
                                                        }}
                                                    />Registrations</MenuItem>
                                                {exam.examStatus === "registration" && (
                                                    <MenuItem
                                                        style={{ fontSize: "15px", fontWeight: "bolder" }}
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(
                                                                `https://exams.ramanasoft.com/register?TId=${exam.examToken}`
                                                            )
                                                            toast.success("Registration Link Copied!!!")
                                                            setCurrentExam(null);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faLink}
                                                            onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                                                            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                                            style={{
                                                                width: "16px",
                                                                height: "16px",
                                                                marginRight: "10px"
                                                            }}
                                                        />
                                                        Registration Link
                                                    </MenuItem>
                                                )}

                                                {exam.examStatus === "closed" && (
                                                    <MenuItem
                                                        style={{ fontSize: "15px", fontWeight: "bolder" }}
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(
                                                                `https://exams.ramanasoft.com/results?TId=${exam.examToken}`
                                                            )
                                                            toast.success("Results Page Link Copied!!!")
                                                            setCurrentExam(null);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faLink}
                                                            onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                                                            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                                            style={{
                                                                width: "16px",
                                                                height: "16px",
                                                                marginRight: "10px"
                                                            }}
                                                        />
                                                        Results Page Link
                                                    </MenuItem>
                                                )}

                                                {!(exam.examStatus === "registration") && (
                                                    <>
                                                        <MenuItem style={{ fontSize: "15px", fontWeight: "bolder" }} onClick={() => onMenuItemClick("submissions", exam.examToken, exam.examName)}>
                                                            <FontAwesomeIcon
                                                                icon={faFileContract}
                                                                onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                                                                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                                                style={{
                                                                    width: "16px",
                                                                    height: "16px",
                                                                    marginRight: "10px"
                                                                }}
                                                            />
                                                            Submissions
                                                        </MenuItem>
                                                        <MenuItem style={{ fontSize: "15px", fontWeight: "bolder" }} onClick={() => onMenuItemClick("meritlist", exam.examToken, exam.examName)}>
                                                            <FontAwesomeIcon
                                                                icon={faAward}
                                                                onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                                                                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                                                style={{
                                                                    width: "16px",
                                                                    height: "16px",
                                                                    marginRight: "10px"
                                                                }}
                                                            />
                                                            Merit List
                                                        </MenuItem>
                                                    </>
                                                )}



                                                <MenuItem style={{ fontSize: "15px", fontWeight: "bolder" }} onClick={() => onMenuItemClick("halltickets", exam.ID, exam.examName)}>
                                                    <FontAwesomeIcon
                                                        icon={faFileSignature}
                                                        onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                                                        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                                        style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            marginRight: "10px"
                                                        }}
                                                    />
                                                    HallTicket Format</MenuItem>
                                                <MenuItem style={{ fontSize: "15px", fontWeight: "bolder" }} onClick={() => onMenuItemClick("mailing", exam.ID, exam.examName)}>
                                                    <FontAwesomeIcon
                                                        icon={faMailBulk}
                                                        onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                                                        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                                        style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            marginRight: "10px"
                                                        }}
                                                    />
                                                    Mailing Format</MenuItem>

                                                <MenuItem style={{ fontSize: "15px", fontWeight: "bolder" }} onClick={() => onMenuItemClick("OfferMail", exam.ID, exam.examName)}>
                                                    <FontAwesomeIcon
                                                        icon={faMailBulk}
                                                        onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                                                        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                                        style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            marginRight: "10px"
                                                        }}
                                                    />
                                                    Offer Mail Format</MenuItem>
                                                {/* <MenuItem style={{ fontSize: "15px", fontWeight: "bolder" }} onClick={() => onMenuItemClick("ExamReport", exam.examToken, exam.examName)}>
                                                    <FontAwesomeIcon
                                                        icon={faMailBulk}
                                                        onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                                                        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                                        style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            marginRight: "10px"
                                                        }}
                                                    />
                                                    Exam Report
                                                </MenuItem> */}
                                                <MenuItem>
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                                                        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                                        style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            marginRight: "8px"
                                                        }}
                                                    />
                                                    <Button
                                                        onClick={(event) => handleSubMenuClick(event, exam.ID)}
                                                        style={{
                                                            fontSize: "15px", fontWeight: "bolder",
                                                            textTransform: "none",
                                                            background: "none",
                                                            textDecoration: "none",
                                                            width: "110px",
                                                            padding: 0,
                                                            color: "black",
                                                        }}
                                                    >
                                                        Update Status
                                                    </Button>
                                                    <Menu
                                                        anchorEl={subMenuAnchors[exam.ID] || null}
                                                        open={Boolean(subMenuAnchors[exam.ID])}
                                                        onClose={() => handleSubMenuClose(exam.ID)}
                                                    >
                                                        <MenuItem
                                                            style={{ fontSize: "15px", fontWeight: "bolder" }}
                                                            onClick={() => {
                                                                handleStatusChange("registration");
                                                                handleSubMenuClose(exam.ID);
                                                            }}
                                                        >
                                                            Open Registrations
                                                        </MenuItem>
                                                        <MenuItem
                                                            style={{ fontSize: "15px", fontWeight: "bolder" }}
                                                            onClick={() => {
                                                                handleStatusChange("ongoing");
                                                                handleSubMenuClose(exam.ID);
                                                            }}
                                                        >
                                                            Start Exam
                                                        </MenuItem>
                                                        <MenuItem
                                                            style={{ fontSize: "15px", fontWeight: "bolder" }}
                                                            onClick={() => {
                                                                handleStatusChange("closed");
                                                                handleSubMenuClose(exam.ID);
                                                            }}
                                                        >
                                                            Close Exam
                                                        </MenuItem>
                                                    </Menu>
                                                </MenuItem>
                                            </Menu>
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
    const navigate = useNavigate();
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [examsList, setExamsList] = useState([]);
    const [errors, setErrors] = useState({});
    const [sectionsList, setSectionList] = useState([]);
    const [showExams, setShowExams] = useState(true);

    const handleToggle = () => {
        setIsCreateMode((prev) => !prev);
        setShowExams((prev) => !prev);
    };

    const [createExam, setCreateExam] = useState({
        examName: '',
        examToken: '',  // Added examToken field
        examStatus: "creation",
        duration: '',
        examStartTime: '',
        examEndTime: '',

        noOfQuestions: '',
        correctAnswerMarks: '',
        totalMarks: '',
        questionsSection: '',
        wrongAnswerMarks: '',
        PassMark: '',
        randomizeQuestions: '',
        unusualBehavior: '',
        submissionType: '',
        showResults: "",
        liveSupport: '',
        registrationFields: {
            fields: []
        }
    });


    useEffect(() => {
        if (!createExam.examToken) {
            const token = uuidv4();
            setCreateExam((prevState) => ({
                ...prevState,
                examToken: token,
            }));
        }
    }, [createExam.examToken]);


    const validateForm = () => {
        let formErrors = {};
        if (!createExam.examName) formErrors.examName = 'Exam name is required';
        if (!createExam.totalMarks) formErrors.totalMarks = 'Total marks is required';
        if (!createExam.duration) formErrors.duration = 'Duration is required';
        if (!createExam.correctAnswerMarks) formErrors.correctAnswerMarks = 'Correct marks is required';
        if (!createExam.wrongAnswerMarks) formErrors.wrongAnswerMarks = 'Worng marks is required';
        if (!createExam.PassMark) formErrors.PassMark = 'Pass marks is required';
        if (!createExam.noOfQuestions) formErrors.noOfQuestions = 'No of questions is required';
        if (!createExam.questionsSection) formErrors.questionsSection = 'Question bank is required';
        if (!createExam.randomizeQuestions) formErrors.randomizeQuestions = 'Assign questions is required';
        if (!createExam.submissionType) formErrors.submissionType = 'Select exam submission';
        if (!createExam.showResults) formErrors.showResults = 'Select show results';
        if (!createExam.unusualBehavior) formErrors.unusualBehavior = 'Select terminate exam';
        if (!createExam.examStartTime) formErrors.examStartTime = 'Select start date & time';
        if (!createExam.examEndTime) formErrors.examEndTime = "Select end date & time";
        if (!createExam.liveSupport) formErrors.liveSupport = 'Select live support';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };


    const onMenuItemClick = (action, examId, examName) => {
        console.log(`Action: ${action}, Exam ID: ${examId}, Exam Name: ${examName}`);

        navigate(`/admin/globalExams/${action}?Eid=${examId}`);
        if (!examId) {
            console.error("Error: Exam ID is missing!");
            return;
        }
        if (action === "details") {
            handleShowExamDetails(examId);
        } else if (action === "registrations") {
            handleshowRegistrations(examId);
        } else if (action === "submissions") {
            handleShowSubmissions(examId);
        } else if (action === "meritlist") {
            handleShowMeritList(examId);
        } else if (action === "settings") {
            handleshowExamSettings(examId);
        } else if (action === "halltickets") {
            handleshowHalltickets(examId);
        } else if (action === "mailing") {
            handleshowMailing(examId);
        } else if (action === "OfferMail") {
            handleshowOfferMail(examId);
        } else if (action === "ExamReport") {
            handleshowExamReport(examId);
        }


    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCreateExam((prevState) => {
            const updatedState = {
                ...prevState,
                [name]: value
            };

            if (name === "noOfQuestions" || name === "correctAnswerMarks") {
                updatedState.totalMarks = (updatedState.noOfQuestions || 0) * (updatedState.correctAnswerMarks || 0);
            }
            return updatedState;
        });

        // Validate exam name with regex
        if (name === "examName") {
            const trimmedValue = value.trim();  // Remove leading & trailing spaces

            if (!trimmedValue) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: "Exam name is required"
                }));
            } else if (trimmedValue.length < 3 || trimmedValue.length > 50) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: "Exam name must be 3-50 characters"
                }));
            } else if (!/^[A-Za-z0-9 ]+$/.test(trimmedValue)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: "Exam name must contain only letters, numbers, and spaces"
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: "",
                }));
            }
        }

        console.log("Field Changed:", name, value);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

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
                toast.error("Failed to create exam!!!")
                toast.error("Please try again!!!")
            });
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

    const [selectedExamToken, setSelectedExamToken] = useState("");
    const [showExamDetails, setShowExamDetails] = useState(false);
    const [selectedExamID, setSelectedExamID] = useState(null);
    const [showExamRegistrations, setshowExamRegistrations] = useState(false);
    const [showExamSubmissions, setshowExamSubmissions] = useState(false);
    const [showMeritList, setshowMeritList] = useState(false);

    const [showExamSettings, setshowExamSettings] = useState(false);
    const [showHalltickets, setshowHalltickets] = useState(false);
    const [showMailing, setshowMailing] = useState(false);
    const [showOfferMail, setshowOfferMail] = useState(false);
    const [showExamReport, setShowExamReport] = useState(false);


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

    const handleShowSubmissions = (examID) => {
        setSelectedExamToken(examID);
        setShowExams(false);
        setshowExamSubmissions(true);
    };

    const handleShowMeritList = (examID) => {
        setSelectedExamID(examID);
        setShowExams(false);
        setshowMeritList(true);
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

    const handleshowOfferMail = (examID) => {
        setSelectedExamID(examID);
        setShowExams(false);
        setshowOfferMail(true);
    };



    const handleshowExamReport = (examID) => {
        setSelectedExamToken(examID);
        setShowExams(false);
        setShowExamReport(true);
    }

    const handleBack = () => {
        setShowExamDetails(null);
        setSelectedExamID(null);
        setshowExamRegistrations(false);
        setshowExamSettings(null);
        setShowExams(true);
        setSelectedExamToken(null);
        setshowExamSubmissions(null);
        setshowMeritList(null);
        setshowHalltickets(null);
        setshowMailing(null);
        setshowOfferMail(null);
        setShowExamReport(null);
        navigate('/admin/globalExams')
    };


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
                                            <TextField className='mb-4' sx={{ flex: 2 }} label="Exam Name" name="examName"
                                                value={createExam.examName} onChange={handleChange} error={errors.examName}
                                                helperText={errors.examName} />
                                            <TextField sx={{ flex: 2 }} className='mb-4' label="Unique Exam Token" name="examToken"
                                                value={createExam.examToken} disabled />
                                            <TextField sx={{ flex: 1 }} className='mb-4' label="Current Exam Status" value={createExam.examStatus}
                                                disabled />
                                        </div>


                                        <div style={{ display: "flex", gap: "20px" }}>
                                            <TextField fullWidth className='mb-4' sx={{ flex: 2 }} label="Duration (in minutes)" type="number"
                                                name="duration" value={createExam.duration} error={errors.duration} helperText={errors.duration}
                                                onChange={(e) => {
                                                    const value = Math.max(1, Number(e.target.value));
                                                    handleChange({ target: { name: "duration", value } });
                                                }} />

                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateTimePicker label="Start Time" sx={{ flex: 2 }} value={dayjs(createExam.examStartTime)}
                                                    onChange={(newValue) => handleChange({ target: { name: "examStartTime", value: newValue } })}
                                                    minDateTime={dayjs()}
                                                    slotProps={{
                                                        textField: {
                                                            error: errors.examStartTime,
                                                            helperText: errors.examStartTime
                                                        }
                                                    }}
                                                />
                                            </LocalizationProvider>

                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateTimePicker label="End Time" sx={{ flex: 2 }} value={dayjs(createExam.examEndTime)}
                                                    onChange={(newValue) => handleChange({ target: { name: "examEndTime", value: newValue } })}
                                                    minDateTime={dayjs()}
                                                    slotProps={{
                                                        textField: {
                                                            error: errors.examEndTime,
                                                            helperText: errors.examEndTime
                                                        }
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                    </div>
                                    <h5 style={{ fontWeight: "bolder", marginTop: "40px" }}>Question Details</h5>


                                    <div style={{ display: "flex", gap: "16px", marginBottom: '15px' }}>
                                        <TextField
                                            sx={{ flex: 2 }}
                                            label="No of Questions"
                                            type="number"
                                            name="noOfQuestions"
                                            value={createExam.noOfQuestions}
                                            onChange={(e) => {
                                                const value = Math.max(1, Number(e.target.value));
                                                handleChange({ target: { name: "noOfQuestions", value } });
                                            }} error={errors.noOfQuestions}
                                            helperText={errors.noOfQuestions}
                                        />

                                        <FormControl variant="outlined" sx={{ flex: 2, mb: 2 }} error={errors.correctAnswerMarks}>
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
                                            {errors.correctAnswerMarks && <FormHelperText>{errors.correctAnswerMarks}</FormHelperText>}
                                        </FormControl>

                                        <TextField
                                            fullWidth
                                            className='mb-4'
                                            sx={{ flex: 2 }}
                                            label="Total Marks"
                                            type="number"
                                            name="totalMarks"
                                            disabled
                                            value={createExam.noOfQuestions * createExam.correctAnswerMarks || 0}
                                        />



                                    </div>

                                    <div style={{ display: "flex", gap: "16px" }}>
                                        <FormControl sx={{ flex: 2 }} error={errors.questionsSection}>
                                            <InputLabel>Select Question Bank</InputLabel>
                                            <Select
                                                label="Select Question Bank"
                                                value={createExam.questionsSection}
                                                name="questionsSection"
                                                onChange={handleChange}
                                            >
                                                {Array.isArray(sectionsList) &&
                                                    sectionsList
                                                        .filter(section => section.total_questions >= createExam.noOfQuestions) // Filter sections
                                                        .map((section, index) => (
                                                            <MenuItem key={index} value={section.section}>
                                                                {section.section}{" ("}{section.total_questions}{" questions)"}
                                                            </MenuItem>
                                                        ))
                                                }
                                            </Select>
                                            {errors.questionsSection && <FormHelperText>{errors.questionsSection}</FormHelperText>}
                                        </FormControl>


                                        <FormControl fullWidth variant="outlined" sx={{ flex: 2 }} error={errors.wrongAnswerMarks}>
                                            <InputLabel>Marks For Wrong Answer</InputLabel>
                                            <Select name='wrongAnswerMarks' value={createExam.wrongAnswerMarks} onChange={handleChange} label="Marks For Wrong Answer">
                                                <MenuItem value='0'>Do not Apply</MenuItem>
                                                <MenuItem value='25%'>Apply 25% negative marks</MenuItem>
                                                <MenuItem value='50%'>Apply 50% negative marks</MenuItem>
                                                <MenuItem value='100%'>Apply 100% negative marks</MenuItem>
                                            </Select>
                                            {errors.wrongAnswerMarks && <FormHelperText>{errors.wrongAnswerMarks}</FormHelperText>}
                                        </FormControl>


                                        <FormControl variant="outlined" sx={{ flex: 2, mb: 2 }} error={errors.PassMark}>
                                            <InputLabel htmlFor="PassMark">Minimum Required %</InputLabel>
                                            <OutlinedInput
                                                id="PassMark"
                                                name="PassMark"
                                                onChange={(e) => {
                                                    let value = Number(e.target.value);
                                                    value = Math.min(100, Math.max(1, value));
                                                    handleChange({ target: { name: 'PassMark', value } });
                                                }}

                                                type="number"
                                                value={createExam.PassMark}
                                                label="Minimum Required %"
                                            />
                                            {errors.PassMark && <FormHelperText>{errors.PassMark}</FormHelperText>}
                                        </FormControl>
                                    </div>


                                    <h5 style={{ fontWeight: "bolder", marginTop: "40px" }}>More Configurations</h5>
                                    <div style={{ paddingLeft: "30px" }}>
                                        <FormControl variant="outlined" style={{ width: "500px", marginTop: "20px" }} error={errors.randomizeQuestions}>
                                            <InputLabel>Assign Questions</InputLabel>
                                            <Select name="randomizeQuestions" value={createExam.randomizeQuestions} onChange={handleChange} label="Assign Questions">
                                                <MenuItem value='sameQuestions'>Same Questions For all Candidates</MenuItem>
                                                <MenuItem value='Randomize'>Randomize Questions and Options</MenuItem>
                                            </Select>
                                            {errors.randomizeQuestions && <FormHelperText>{errors.randomizeQuestions}</FormHelperText>}
                                        </FormControl>

                                        <FormControl fullWidth style={{ marginTop: "30px" }} error={errors.unusualBehavior}>
                                            <span className='text-bold fw-bold'>Terminate Exam if Caught Unusual Behaviour</span>
                                            <RadioGroup row name="unusualBehavior" value={createExam.unusualBehavior} onChange={handleChange}>
                                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value="Allow 1 time" control={<Radio />} label="Allow one time" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value="No" control={<Radio />} label="No" />
                                            </RadioGroup>
                                            {errors.unusualBehavior && <FormHelperText>{errors.unusualBehavior}</FormHelperText>}
                                        </FormControl>


                                        <FormControl fullWidth style={{ marginTop: "30px" }} error={errors.submissionType}>
                                            <span className='text-bold fw-bold'>Exam Submission</span>
                                            <RadioGroup row name="submissionType" value={createExam.submissionType} onChange={handleChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="Allow Submitting before end-time" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value={false} control={<Radio />} label="Wait till the end-time" />
                                            </RadioGroup>
                                            {errors.submissionType && <FormHelperText>{errors.submissionType}</FormHelperText>}
                                        </FormControl>


                                        <FormControl fullWidth style={{ marginTop: "30px" }} error={errors.showResults}>
                                            <span className='text-bold fw-bold'>Show Results After Exam</span>
                                            <RadioGroup row name="showResults" value={createExam.showResults} onChange={handleChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="After Immidiate Submission" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value={false} control={<Radio />} label="After the exam" />
                                            </RadioGroup>
                                            {errors.showResults && <FormHelperText>{errors.showResults}</FormHelperText>}
                                        </FormControl>

                                        <FormControl fullWidth style={{ marginTop: "30px" }} error={errors.liveSupport}>
                                            <span className='text-bold fw-bold'>Allow Live Support</span>
                                            <RadioGroup row name="liveSupport" value={createExam.liveSupport} onChange={handleChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="Allow" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value={false} control={<Radio />} label="Disallow" />
                                            </RadioGroup>
                                            {errors.liveSupport && <FormHelperText>{errors.liveSupport}</FormHelperText>}
                                        </FormControl>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: "center", gap: "100px", marginTop: "50px" }}>
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
            {showExamSubmissions && <GlobalSubmissions examID={selectedExamToken} onBack={handleBack} />}
            {showMeritList && <GlobalMeritList examID={selectedExamID} onBack={handleBack} />}
            {showHalltickets && <HallTicket examID={selectedExamID} onBack={handleBack} />}
            {showMailing && <Mailing examID={selectedExamID} onBack={handleBack} />}
            {showOfferMail && <OfferMailFormat examID={selectedExamID} onBack={handleBack} />}
            {showExamReport && <ExamReport examID={selectedExamToken} onBack={handleBack} />}
        </div>
    );
}

export default GlobalExams;

