/*eslint-disable no-unused-vars*/

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Service from "../../../service/Service";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import p3 from '../../../assets/p3.png';
import p4 from '../../../assets/p4.png';
import ExamRegister from '../../../assets/Register5.png';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';



const ResultsForm = () => {
    const [searchParams] = useSearchParams();
    const [examDetails, setExamDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");  // For mobile, email, or hallTicketID
    const [resultData, setResultData] = useState(null);  // To display fetched result
    const token = searchParams.get("TId");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 565); // Adjust breakpoint as needed
        };

        handleResize(); // Check on initial load
        window.addEventListener('resize', handleResize); // Add resize listener
        return () => window.removeEventListener('resize', handleResize); // Cleanup
    }, []);



    useEffect(() => {
        if (token) {
            fetchExamDetails(token);
        } else {
            toast.error("Invalid token in the URL.");
        }
    }, [token]);

    const fetchExamDetails = async (token) => {
        try {
            setLoading(true);
            const response = await Service.get(`/api/getExamDetails/${token}`);

            if (response.status === 200) {
                const examData = response.data.result;
                setExamDetails(examData);
            } else {
                toast.error("Invalid exam data received.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch exam details.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchInput.trim()) {
            toast.error("Please enter mobile number, email, or hall ticket ID.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                examToken: token,
                searchInput: searchInput.trim()
            };

            const response = await Service.post(`/api/fetchResult`, payload);

            if (response.status === 200) {
                setResultData(response.data.result);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.warn(error.response.data.message || "No result found for the given input.");
                setResultData(null); // Clear any old data
            } else {
                console.error(error);
                toast.error("Error fetching result.");
                setResultData(null);
            }
        } finally {
            setLoading(false);
        }
    };


    const calculatePercentage = (scoredMarks, totalMarks) => {
        return (scoredMarks / totalMarks) * 100;
    };

    const getResultStatus = () => {
        if (resultData.data.examStatus === 0) return "----";
        const isPass = calculatePercentage(resultData.data.results, resultData.examData.totalMarks) >= resultData.examData.PassMark;
        return <span style={{ color: isPass ? "green" : "red", fontWeight: "bold" }}>{isPass ? "Pass" : "Fail"}</span>;
    };


    return (
        <>
            {!isMobile && <div style={{ display: "flex", height: "100vh", background: "white" }}>
                <div style={{ flex: 2, background: `url(${ExamRegister})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "90% 70%" }} >
                    <img src={p4} style={{ width: "160px", height: "50px", paddingTop: "15px", paddingLeft: "15px" }} alt="Logo" />
                </div>

                <div
                    style={{
                        flex: 3,
                        display: "flex",
                        background: "black",
                        color: "white",
                        flexDirection: "column",
                        borderTopLeftRadius: "2%",
                        borderBottomLeftRadius: "2%",
                        alignItems: "center",
                        padding: "20px",
                        width: "100%",
                        fontFamily: "Courier, monospace"
                    }}
                >
                    <h2 style={{ fontSize: "1.5rem", color: "white", fontWeight: "bold", marginTop: "10vh" }}>
                        Search Your Results For
                    </h2>

                    <div style={{ paddingRight: "10vw", paddingLeft: "4vw", textAlign: "center" }}>
                        <h2 style={{ fontSize: "1.5rem", color: "white", fontWeight: "bold" }}>
                            {examDetails && examDetails.examName}
                        </h2>
                        {examDetails?.examStatus === 'registration' && (
                            <Typography color="error" style={{ marginTop: "5vh", fontSize: "20px", textAlign: "center", fontWeight: "bold", marginLeft: "30px", fontFamily: "Verdana, sans-serif" }}>Results not disclosed yet.</Typography>
                        )}
                    </div>

                    {!resultData && examDetails?.examStatus === 'closed' && (
                        <div style={{ marginTop: "20px", width: "80%", display: "flex", gap: "20px" }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter Mobile Number, Email or Hall Ticket ID"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                sx={{
                                    backgroundColor: "white",
                                    borderRadius: "5px"
                                }}
                            />
                            {loading ? <div style={{ fontSize: "10px", fontWeight: "bolder", marginTop: "10px" }}>Searching...</div> : <Button
                                variant="outlined"
                                color="black"
                                onClick={handleSearch}
                                sx={{ height: "40px", marginTop: "5px", fontSize: "10px" }}
                            >
                                <FontAwesomeIcon icon={faSearch} style={{ marginRight: "4px", color: "white" }} /> Search
                            </Button>}
                        </div>
                    )}

                    {resultData && (
                        <div style={{ position: "relative", width: "50%", marginTop: "30px", border: "2px solid white" }}>
                            <Button
                                style={{
                                    color: "white",
                                    border: "2px solid white",
                                    position: "absolute",
                                    top: "-15px",
                                    right: "-15px",
                                    zIndex: 10,
                                    background: "black",
                                    borderRadius: "50%",
                                    width: "35px",
                                    height: "35px",
                                    minWidth: "35px",
                                    padding: 0,
                                }}
                                onClick={() => {
                                    setSearchInput(null);
                                    setResultData(null);
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </Button>

                            <TableContainer style={{ width: "100%" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={2} style={{ fontWeight: "bold", fontSize: "18px", background: "#f0f0f0" }}>
                                                Your Results
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell style={{ color: "white" }}><strong>Candidate Name</strong></TableCell>
                                            <TableCell style={{ color: "white" }}>{resultData.data.candidateName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ color: "white" }}><strong>Email</strong></TableCell>
                                            <TableCell style={{ color: "white" }}>{resultData.data.candidateEmail}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ color: "white" }}><strong>Exam Status</strong></TableCell>
                                            <TableCell style={{ color: "white" }}>{resultData.data.examStatus === 0 ? "Not Attempted" : "Attempted"}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ color: "white" }}><strong>Result</strong></TableCell>
                                            <TableCell style={{ color: "white" }}>
                                                {resultData.data.examStatus === 0
                                                    ? "---------------------"
                                                    : (
                                                        <span style={{
                                                            fontWeight: "bold",
                                                            color: calculatePercentage(resultData.data.results, resultData.examData.totalMarks) >= resultData.examData.PassMark
                                                                ? "green"
                                                                : "red"
                                                        }}>
                                                            {calculatePercentage(resultData.data.results, resultData.examData.totalMarks) >= resultData.examData.PassMark
                                                                ? "Pass"
                                                                : "Fail"
                                                            }
                                                        </span>
                                                    )
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                    )}


                </div>
            </div>}

            {isMobile && (
                <div style={{ height: "100vh", background: "black" }}>
                    <img src={p3} style={{ width: "110px", height: "40px", paddingTop: "15px", paddingLeft: "15px" }} alt="Logo" />
                    <div
                        style={{
                            display: "flex",
                            background: "black",
                            color: "white",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "20px",
                            width: "100%",
                            fontFamily: "Courier, monospace"
                        }}
                    >
                        <h2 style={{ fontSize: "0.7rem", color: "white", fontWeight: "bold", marginTop: "7vh" }}>
                            Search Your Results For
                        </h2>

                        <div style={{ paddingRight: "2vw", paddingLeft: "2vw", textAlign: "center" }}>
                            <h2 style={{ fontSize: "0.8rem", color: "white", fontWeight: "bold" }}>
                                {examDetails && examDetails.examName}
                            </h2>
                            {examDetails?.examStatus === 'registration' && (
                                <Typography color="error" style={{ marginTop: "5vh", fontSize: "12px", textAlign: "center", fontWeight: "bold", marginLeft: "30px", fontFamily: "Verdana, sans-serif" }}>Results not disclosed yet.</Typography>
                            )}
                        </div>

                        {!resultData && examDetails?.examStatus === 'closed' && (
                            <div style={{ marginTop: "20px", width: "80%", display: "flex", gap: "20px" }}>
                                <TextField
                                    sx={{
                                        width: {
                                            xs: "100%",
                                            sm: "300px",
                                        },
                                        color:"white",
                                        border:"2px solid white",
                                        borderRadius: "5px",
                                        fontSize: "12px",
                                        input: {
                                            color:"white",
                                            padding: "8px 10px",
                                            fontSize: "7px",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            border:"white",
                                            height: "36px",
                                        },
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Enter Mobile Number, Email or Hall Ticket ID"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}

                                />
                                {loading ? 
                                <div style={{ fontSize: "10px", fontWeight: "bolder", marginTop: "10px" }}>Searching...</div> : 
                                <button
                                    color="black"
                                    onClick={handleSearch}
                                    style={{ height: "30px", marginTop:"5px", width:"40px", fontSize: "10px", background:"none", color:"white",  border:"1px solid white", padding:"4px", borderRadius:"3px"}}
                                >
                                    <FontAwesomeIcon icon={faSearch} style={{ color: "white" }} />
                                </button>}
                            </div>
                        )}

                        {resultData && (
                            <div style={{ position: "relative", width: "90%", marginTop: "30px", border: "2px solid white" }}>
                                <Button
                                    style={{
                                        color: "white",
                                        border: "2px solid white",
                                        position: "absolute",
                                        top: "-15px",
                                        right: "-15px",
                                        zIndex: 10,
                                        background: "black",
                                        borderRadius: "50%",
                                        width: "35px",
                                        height: "35px",
                                        minWidth: "35px",
                                        padding: 0,
                                    }}
                                    onClick={() => {
                                        setSearchInput(null);
                                        setResultData(null);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </Button>

                                <TableContainer style={{ width: "100%" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell colSpan={2} style={{ fontWeight: "bold", fontSize: "12px", background: "#f0f0f0" }}>
                                                    Your Results
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{ color: "white", fontSize:"10px" }}><strong>Candidate Name</strong></TableCell>
                                                <TableCell style={{ color: "white", fontSize:"10px" }}>{resultData.data.candidateName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ color: "white", fontSize:"10px" }}><strong>Email</strong></TableCell>
                                                <TableCell style={{ color: "white", fontSize:"10px" }}>{resultData.data.candidateEmail}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ color: "white", fontSize:"10px" }}><strong>Exam Status</strong></TableCell>
                                                <TableCell style={{ color: "white", fontSize:"10px" }}>{resultData.data.examStatus === 0 ? "Not Attempted" : "Attempted"}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ color: "white", fontSize:"10px" }}><strong>Result</strong></TableCell>
                                                <TableCell style={{ color: "white", fontSize:"10px" }}>
                                                    {resultData.data.examStatus === 0
                                                        ? "---------------------"
                                                        : (
                                                            <span style={{
                                                                fontWeight: "bold",
                                                                color: calculatePercentage(resultData.data.results, resultData.examData.totalMarks) >= resultData.examData.PassMark
                                                                    ? "green"
                                                                    : "red"
                                                            }}>
                                                                {calculatePercentage(resultData.data.results, resultData.examData.totalMarks) >= resultData.examData.PassMark
                                                                    ? "Pass"
                                                                    : "Fail"
                                                                }
                                                            </span>
                                                        )
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>

                        )}


                    </div>
                </div>
            )}
        </>
    );
};

export default ResultsForm;
