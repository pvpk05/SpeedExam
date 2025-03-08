/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import { Box, Menu, MenuItem, Typography, FormControl, OutlinedInput, InputLabel, Select, Table, TableBody, TableCell, TableRow, Stepper, Step, StepLabel, Button, TextField, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import Service from "../../../service/Service";
import { Audio } from 'react-loader-spinner'
import EditIcon from '@mui/icons-material/Edit';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEdit } from '@fortawesome/free-solid-svg-icons';

import { toast } from "react-toastify";

const ExamEdit = ({ examDetails, handleCancel }) => {
    const [isCreateMode, setIsCreateMode] = useState(!examDetails);  // Determine mode
    const [examsList, setExamsList] = useState([]);
    const [errors, setErrors] = useState({});
    const [sectionsList, setSectionList] = useState([]);
    const [showExams, setShowExams] = useState(true);

    const [createExam, setCreateExam] = useState(
        examDetails || {  // Use examDetails if editing
            examName: '',
            examToken: '',
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
        }
    );

    useEffect(() => {
        sectionList();
    }, [])

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCreateExam((prevState) => {
            const updatedState = {
                ...prevState,
                [name]: value
            };

            // Auto-calculate totalMarks
            if (name === "noOfQuestions" || name === "correctAnswerMarks") {
                updatedState.totalMarks = (updatedState.noOfQuestions || 0) * (updatedState.correctAnswerMarks || 0);
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
        console.log("createExam :", createExam);
        Service.put(`/updateGlobalExam/${createExam.examToken}`, createExam)
            .then((res) => {
                console.log("Response:", res.data);
                toast.success(res.data.message);
                setIsCreateMode(false);
                handleCancel();
            })
            .catch((err) => {
                console.error("Error:", err.response?.message || err.message);
                toast.error("Failed to update exam!!!")
                toast.error("Please try again!!!")
            });
    };

    return (
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


                    <div style={{ display: "flex", gap: "20px" }}>
                        <TextField fullWidth className='mb-4' sx={{ flex: 2 }} label="Duration (in minutes)" type="number" name="duration" value={createExam.duration} onChange={(e) => {
                            const value = Math.max(1, Number(e.target.value));
                            handleChange({ target: { name: "duration", value } });
                        }} />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker label="Start Time" sx={{ flex: 2 }} value={dayjs(createExam.examStartTime)} onChange={(newValue) => handleChange({ target: { name: "examStartTime", value: newValue } })} />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker label="End Time" sx={{ flex: 2 }} value={dayjs(createExam.examEndTime)} onChange={(newValue) => handleChange({ target: { name: "examEndTime", value: newValue } })} />
                        </LocalizationProvider>
                    </div>
                </div>
                <h5 style={{ fontWeight: "bolder", marginTop: "40px" }}>Question Details</h5>


                <div style={{ display: "flex", gap: "16px" }}>

                    <TextField
                        sx={{ flex: 2 }}
                        label="No of Questions"
                        type="number"
                        name="noOfQuestions"
                        value={createExam.noOfQuestions}
                        onChange={handleChange}
                    />

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

                    <TextField
                        fullWidth
                        className='mb-4'
                        sx={{ flex: 2 }}
                        label="Total Marks"
                        type="number"
                        name="totalMarks"
                        value={createExam.noOfQuestions * createExam.correctAnswerMarks || 0}
                    />



                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                    <FormControl sx={{ flex: 2 }}>
                        <InputLabel>Assign Questions From Section</InputLabel>
                        <Select
                            label="Assign Questions From Section"
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
                        {errors.section && <span className="text-danger">{errors.section}</span>}
                    </FormControl>


                    <FormControl fullWidth variant="outlined" sx={{ flex: 2 }} error={!!errors.wrongAnswerMarks}>
                        <InputLabel>Marks For Wrong Answer</InputLabel>
                        <Select name='wrongAnswerMarks' value={createExam.wrongAnswerMarks} onChange={handleChange} label="Marks For Wrong Answer">
                            <MenuItem value='0'>Do not Apply</MenuItem>
                            <MenuItem value='25%'>Apply 25% negative marks</MenuItem>
                            <MenuItem value='50%'>Apply 50% negative marks</MenuItem>
                            <MenuItem value='100%'>Apply 100% negative marks</MenuItem>
                        </Select>
                    </FormControl>


                    <FormControl variant="outlined" sx={{ flex: 2, mb: 2 }} error={!!errors.PassMark}>
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
                    </FormControl>
                </div>


                <h5 style={{ fontWeight: "bolder", marginTop: "40px" }}>More Configurations</h5>
                <div style={{ paddingLeft: "30px" }}>
                    <FormControl variant="outlined" style={{ width: "500px", marginTop: "20px" }}>
                        <InputLabel>Assign Questions</InputLabel>
                        <Select name="randomizeQuestions" value={createExam.randomizeQuestions} onChange={handleChange} label="Assign Questions">
                            <MenuItem value='0'>Same Questions For all Candidates</MenuItem>
                            <MenuItem value='1'>Randomize Questions and Options</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth style={{ marginTop: "30px" }}>
                        <span className='text-bold fw-bold'>Terminate Exam if Caught Unusual Behaviour</span>
                        <RadioGroup row name="unusualBehavior" value={createExam.unusualBehavior} onChange={handleChange}>
                            <FormControlLabel value='1' control={<Radio />} label="Yes" style={{ marginRight: "100px" }} />
                            <FormControlLabel value='0' control={<Radio />} label="No" />
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
                            <FormControlLabel value='1' control={<Radio />} label="After Immidiate Submission" style={{ marginRight: "100px" }} />
                            <FormControlLabel value='0' control={<Radio />} label="After the exam" />
                        </RadioGroup>
                    </FormControl>

                    <FormControl fullWidth style={{ marginTop: "30px" }}>
                        <span className='text-bold fw-bold'>Allow Live Support</span>
                        <RadioGroup row name="liveSupport" value={createExam.liveSupport} onChange={handleChange}>
                            <FormControlLabel value='1' control={<Radio />} label="Allow" style={{ marginRight: "100px" }} />
                            <FormControlLabel value='0' control={<Radio />} label="Disallow" />
                        </RadioGroup>
                    </FormControl>
                </div>

                <div style={{ display: 'flex', justifyContent: "center", gap: "100px", marginTop: "50px" }}>
                    <Button variant="contained" color="#4c4f4d" onClick={handleCancel}>Cancel</Button>
                    <Button variant="contained" color="success" type="submit">Save Exam</Button>
                </div>

            </form>
        </section>
        // <section>
        //     <form onSubmit={handleSubmit} style={{ margin: "auto", padding: "20px", borderRadius: "8px" }}>
        //         <p style={{ fontWeight: "bold", fontSize: "20px", paddingBottom: "10px" }}> Creating Global Exam </p>

        //         <h5 style={{ fontWeight: "bolder" }}>Exam Details</h5>
        //         <div style={{ paddingLeft: "30px", paddingRight: "60px" }}>
        //             <div style={{ display: "flex", gap: "16px" }}>
        //                 <TextField className='mb-4' sx={{ flex: 2 }} label="Exam Name" name="examName" value={createExam.examName} onChange={handleChange} error={!!errors.examName} helperText={errors.examName} />
        //                 <TextField sx={{ flex: 2 }} className='mb-4' label="Unique Exam Token" name="examToken" value={createExam.examToken} disabled />
        //                 <TextField sx={{ flex: 1 }} className='mb-4' label="Current Exam Status" value={createExam.examStatus} disabled />
        //             </div>

        //             <div style={{ display: "flex", gap: "20px" }}>
        //                 <TextField fullWidth className='mb-4' sx={{ flex: 2 }} label="Duration (in minutes)" type="number" name="duration" value={createExam.duration} onChange={(e) => {
        //                     const value = Math.max(1, Number(e.target.value));
        //                     handleChange({ target: { name: "duration", value } });
        //                 }} />

        //                 <LocalizationProvider dateAdapter={AdapterDayjs}>
        //                     <DateTimePicker label="Start Time" sx={{ flex: 2 }} value={dayjs(createExam.examStartTime)} onChange={(newValue) => handleChange({ target: { name: "examStartTime", value: newValue } })} />
        //                 </LocalizationProvider>

        //                 <LocalizationProvider dateAdapter={AdapterDayjs}>
        //                     <DateTimePicker label="End Time" sx={{ flex: 2 }} value={dayjs(createExam.examEndTime)} onChange={(newValue) => handleChange({ target: { name: "examEndTime", value: newValue } })} />
        //                 </LocalizationProvider>
        //             </div>
        //         </div>

        //         {/* More Configurations */}
        //         <h5 style={{ fontWeight: "bolder", marginTop: "40px" }}>More Configurations</h5>
        //         <div style={{ paddingLeft: "30px" }}>
        //             <FormControl variant="outlined" style={{ width: "500px", marginTop: "20px" }}>
        //                 <InputLabel>Assign Questions</InputLabel>
        //                 <Select name="randomizeQuestions" value={createExam.randomizeQuestions} onChange={handleChange} label="Assign Questions">
        //                     <MenuItem value='sameQuestions'>Same Questions For all Candidates</MenuItem>
        //                     <MenuItem value='Randomize'>Randomize Questions and Options</MenuItem>
        //                 </Select>
        //             </FormControl>
        //         </div>

        //         <div style={{ display: 'flex', justifyContent: "center", gap: "100px", marginTop: "50px" }}>
        //             <Button variant="contained" color="#4c4f4d" onClick={handleCancel}>Cancel</Button>
        //             <Button variant="contained" color="success" type="submit">
        //                 {isCreateMode ? "Save Exam" : "Update Exam"}
        //             </Button>
        //         </div>
        //     </form>
        // </section>
    );
};

export default function ExamDetailsWithStatus({ examID, onBack }) {


    console.log("Global Exam Details ExamID :", examID);

    const [examData, setExamData] = useState(null);
    const [error, setError] = useState(null);
    const [anchorElSub, setAnchorElSub] = useState(null);
    const [currentExam, setCurrentExam] = useState(null);
    const [isEdit, setIsEdit] = useState(false);


    async function fetchExamDetails() {
        try {
            const response = await Service.get(`/GlobalExamDetailsByID?ID=${examID}`);

            if (response.status == 200) {
                console.log("result :", response.data.result);
                setExamData(response.data.result);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch exam details.");
        }
    }

    useEffect(() => {
        fetchExamDetails();
    }, [examID]);



    const steps = ["Creation", "Registration", "Ongoing", "Closed"];
    const currentStep = steps.indexOf(
        examData && examData.examStatus.charAt(0).toUpperCase() + examData.examStatus.slice(1)
    );

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    const handleCancel = () => {
        fetchExamDetails();
        setIsEdit(false);
    }

    if (!examData) {
        return <Typography>
            <Audio
                height="80"
                width="80"
                radius="9"
                color="green"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
            />
        </Typography>;
    }

    return (
        <>
            <Button variant="outlined" onClick={onBack} style={{ marginBottom: "20px", color: "black", border: "2px solid black" }}>
                Back
            </Button>

            {isEdit && <ExamEdit examDetails={examData} handleCancel={handleCancel} />}

            {!isEdit && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                <Box sx={{ flex: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }} style={{ fontWeight: "bolder" }}>
                        Exam Details
                    </Typography>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Exam Name</TableCell>
                                <TableCell>{examData.examName || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>No of Questions</TableCell>
                                <TableCell>{examData.noOfQuestions || "N/A"} questions</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Total Marks</TableCell>
                                <TableCell>{examData.totalMarks || "N/A"} marks</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Duration</TableCell>
                                <TableCell>{examData.duration || "N/A"} minutes</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Exam Availability</TableCell>
                                <TableCell>
                                    {new Date(examData.examStartTime)
                                        .toISOString()
                                        .slice(0, 19)
                                        .replace("T", " ") || "N/A"} - {new Date(examData.examEndTime && examData.examEndTime)
                                            .toISOString()
                                            .slice(0, 19)
                                            .replace("T", " ") || "N/A"}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Created On</TableCell>
                                <TableCell>
                                    {new Date(examData.createdOn)
                                        .toISOString()
                                        .slice(0, 10)
                                        .replace("T", " ") || "N/A"}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Exam Current Status</TableCell>
                                <TableCell>{examData.examStatus || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Unique Exam Token</TableCell>
                                <TableCell>{examData.examToken || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Section Name</TableCell>
                                <TableCell>{examData.questionsSection || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Marks for Corrent response</TableCell>
                                <TableCell>{examData.correctAnswerMarks || "N/A"} marks</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Marks for Wrong response</TableCell>
                                <TableCell>
                                    {examData.wrongAnswerMarks && examData.correctAnswerMarks
                                        ? `-${(parseFloat(examData.wrongAnswerMarks) / 100) * examData.correctAnswerMarks} marks`
                                        : "N/A"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Randomize Questions & Options</TableCell>
                                <TableCell>{examData.randomizeQuestions === 0 ? "Not Randomized" : "Randomized"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Submission Type</TableCell>
                                <TableCell>{examData.submissionType === "false" ? "Wait till End of the exam" : "Can submit Before end time."}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Show results after submission</TableCell>
                                <TableCell>{examData.submissionType === 1 ? "After Immidiate Submission" : "When admin enabled."}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Terminate Exam if Caught Unusual Behaviour</TableCell>
                                <TableCell>{examData.unusualBehavior === 1 ? "Yes" : "No"}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>

                {/* Right Section: Stepper */}
                <Box
                    sx={{
                        width: "300px",
                        p: 3,
                    }}
                >
                    {!isEdit && (

                        <button style={{marginBottom:"40px", height:"40px", background:"none", width:"90px",  color:"black", border:"2px solid black", fontWeight:"bolder", borderRadius:"6px", paddingLeft:"10px", paddingRight:"10px"}} onClick={() => setIsEdit(true)}>
                            <FontAwesomeIcon icon={faEdit} style={{marginRight:"8px", }}/> Edit
                        </button>
                    )}
                    <Typography variant="h6" sx={{ mb: 2 }} style={{ fontWeight: "bolder", fontSize: "16px" }}>
                        Current Exam Status
                    </Typography>
                    <Stepper
                        style={{ height: "50vh", marginLeft: "30px" }}
                        activeStep={currentStep}
                        orientation="vertical"
                        sx={{
                            "& .MuiStepConnector-line": {
                                minHeight: "75px",
                                borderLeftWidth: 2,
                                borderColor: "#bdbdbd",
                            }
                        }}
                    >
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                </Box>
            </div>}
        </>
    );
}
