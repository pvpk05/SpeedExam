/*eslint-disable no-unused-vars*/

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Service from "../../../service/Service";
import { TextField, Button, Typography, Box, Grid, CircularProgress } from "@mui/material";
import p3 from '../../../assets/p3.png';
import ExamRegister from '../../../assets/RegisterBGRemove.png';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { Stepper, Step, StepLabel } from "@mui/material";
const steps = ['Exam Details', "Registration Form", 'Success'];

const RegistrationForm = () => {

    const [searchParams] = useSearchParams();
    const [examDetails, setExamDetails] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        yearOfPassing: "",
        collegeName: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [stage, setStage] = useState('details'); // 'details', 'form', 'success'
    const token = searchParams.get("TId");

    const [activeStep, setActiveStep] = useState(0);
    // Function to update stage and active step together
    const updateStage = (newStage) => {
        const stageMap = { details: 0, form: 1, success: 2 };
        setStage(newStage);
        setActiveStep(stageMap[newStage]);
    };
    const handleNext = () => {
        if (activeStep === 0) updateStage('form');
        else if (activeStep === 1) updateStage('success');
    };
    const handleBack = () => {
        if (activeStep === 1) updateStage('details');
        else if (activeStep === 2) updateStage('form');
    };

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

                const startTime = new Date(examData.examStartTime);
                const endTime = new Date(startTime.getTime() + examData.duration * 60000);

                const examDate = startTime.toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });

                const startTimeFormatted = startTime.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });

                const endTimeFormatted = endTime.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });

                const hours = Math.floor(examData.duration / 60);
                const minutes = examData.duration % 60;

                const durationFormatted =
                    minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;

                setExamDetails({
                    ...examData,
                    examDate,
                    examTimings: `${startTimeFormatted} - ${endTimeFormatted}`,
                    durationFormatted,
                });
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



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStage('success');
        try {
            const response = await Service.post(`/api/register`, {
                examToken: token,
                ...formData,
            });

            if (response.status === 200) {
                setStage('success');
            }
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error("You are already registered.");
            } else {
                toast.error("Failed to register. Please try again later.");
            }
        } finally {
            setSubmitting(false);
        }

    };

    if (loading) {
        return <div>Loading...</div>;
    };

    return (
        <div style={{ display: "flex", height: "100vh", background: "black" }}>
            <div style={{ flex: 2, background: `url(${ExamRegister})`, backgroundPosition: "center", backgroundRepeat: "no-repeat" }} >
                <img src={p3} style={{ width: "160px", height: "50px", paddingTop: "15px", paddingLeft: "15px" }} alt="Logo" />
            </div>

            <div
                style={{
                    flex: 3,
                    display: "flex",
                    flexDirection: "column",
                    borderTopLeftRadius: "2%",
                    borderBottomLeftRadius: "2%",
                    alignItems: "center",
                    backgroundColor: "#e8edec",
                    padding: "20px",
                    width: "100%",
                    fontFamily: "Courier, monospace"
                }}
            >
                {/* Stepper Component */}
                {/* <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 2 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper> */}
                {stage === 'details' && examDetails && (
                    <div style={{ marginTop: "15vh", paddingRight: "10vw", paddingLeft: "4vw" }}>
                        <h2 style={{ fontSize: "1.5rem", color: "black" }}>Welcome to</h2>
                        <h2 style={{ fontSize: "2rem", color: "black", fontWeight: "bold" }}>{examDetails && examDetails.examName}</h2>


                        <div style={{ marginTop: "3vh" }}>
                            <div style={{ display: "flex", gap: "30px" }}>
                                <p style={{ fontSize: "1rem", color: "black", fontWeight: "bold" }}>Test Duration</p>
                                <p style={{ fontSize: "1rem", color: "black", fontWeight: "bold" }}>No Of Questions</p>
                                <p style={{ fontSize: "1rem", color: "black", fontWeight: "bold", marginLeft:"1vw" }}>Exam Date</p>
                                <p style={{ fontSize: "1rem", color: "black", fontWeight: "bold", marginLeft:"4vw" }}>Timings</p>

                            </div>
                            <div style={{ display: "flex", gap: "60px", marginTop: "-2vh", marginLeft: "15px" }}>
                                <p style={{ fontSize: "0.8rem", color: "black", marginLeft:"18px" }}>{examDetails && examDetails.duration} mins</p>
                                <p style={{ fontSize: "0.8rem", color: "black" }}>{examDetails && examDetails.noOfQuestions} questions</p>
                                <p style={{ fontSize: "0.8rem", color: "black", marginLeft:"1vw" }}>{examDetails && examDetails.examDate}</p>
                                <p style={{ fontSize: "0.8rem", color: "black" }}>{examDetails && examDetails.examTimings}</p>

                            </div>
                        </div>


                        {/* <Typography variant="body1">
                            <b>Date:</b> {examDetails.examDate}
                        </Typography>
                        <Typography variant="body1">
                            <b>Timings:</b> {examDetails.examTimings}
                        </Typography>
                        <Typography variant="body1" className="my-3">
                            <b>Duration:</b> {examDetails.durationFormatted}
                        </Typography>

                        <Typography variant="body1">
                            <b>Number of Questions:</b> {examDetails.noOfQuestions}
                        </Typography>
                        <Typography variant="body1" className="my-3">
                            <b>Total Marks:</b> {examDetails.totalMarks}
                        </Typography>
                        <Typography variant="body1">
                            <b>Passing Marks:</b> {examDetails.PassMark}
                        </Typography>
                        <Typography variant="body1" className="my-3">
                            <b>Correct Answer:</b> +{examDetails.correctAnswerMarks} marks
                        </Typography>
                        <Typography variant="body1">
                            <b>Wrong Answer:</b> -{examDetails.wrongAnswerMarks} negative marking
                        </Typography> */}
                        {examDetails.examStatus === 'registration' && (
                            <div className="d-flex justify-content-end">
                                <Button variant="contained" color="primary" onClick={() => setStage('form')} className="mt-5">
                                    Register
                                </Button>
                            </div>
                        )}

                        {examDetails.examStatus === 'ongoing' && <Typography color="error">Registrations closed!</Typography>}
                        {examDetails.examStatus === 'closed' && <Typography color="error">Exam is closed.</Typography>}
                    </div>
                )}

                {stage === 'form' && (
                    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, p: 3, boxShadow: 3, background: 'white', borderRadius: 2 }}
                        className="my-auto">
                        <Typography variant="h5" align="center" gutterBottom className="mb-3">
                            Registration Form
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField label="Student Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth type="email" required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Phone Number" name="mobile" value={formData.mobile} onChange={handleChange} fullWidth type="tel" required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Year of Passing" name="yearOfPassing" value={formData.yearOfPassing} onChange={handleChange} fullWidth type="number" required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="College Name" name="collegeName" value={formData.collegeName} onChange={handleChange} fullWidth required />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 5 }}>
                            <Button variant="outlined" color="black" onClick={() => setStage('details')}>
                                Back
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                                {submitting ? <CircularProgress size={24} /> : "Submit"}
                            </Button>
                        </Box>
                    </Box>
                )}

                {stage === 'success' && (
                    <Box
                        sx={{
                            // height: "500px",
                            width: "500px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 3,
                            borderRadius: 3,
                            boxShadow: 2,
                            bgcolor: "background.paper",
                            textAlign: "center",
                            maxWidth: 400,
                            margin: 'auto 0'
                        }}
                    >
                        {/* <CheckCircleIcon sx={{ fontSize: 50, color: "success.main" }} /> */}
                        <div style={{ width: '100', color: 'green', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '30px auto' }}>
                            <IoMdCheckmarkCircleOutline style={{ fontSize: '70px' }} />
                        </div>
                        <Typography variant="h5" color="success.main" sx={{ mt: 1 }}>
                            Registration Successful!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                            Congratulations! You have successfully registered for the exam.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Your Hall Ticket will be sent to your registered email.
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            sx={{ mt: 4, width: "40%" }}
                            onClick={() => { toast.success("Registration Successful 🎉"); setStage("details") }}
                        >
                            Ok
                        </Button>
                    </Box>
                )}
            </div>
        </div>
    );
};

export default RegistrationForm;


// /*eslint-disable no-unused-vars*/

// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import Service from "../../../service/Service";
// import { TextField, Button, Typography, Box, Grid, CircularProgress } from "@mui/material";
// // import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import p3 from '../../../assets/p3.png';
// import ExamRegister from '../../../assets/RegisterBGRemove.png';

// const RegistrationForm = () => {
//     const [searchParams] = useSearchParams();
//     const [examDetails, setExamDetails] = useState(null);
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         mobile: "",
//         yearOfPassing: "",
//         collegeName: "",
//     });

//     const [loading, setLoading] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [stage, setStage] = useState('details'); // 'details', 'form', 'success'
//     const token = searchParams.get("TId");

//     useEffect(() => {
//         if (token) {
//             fetchExamDetails(token);
//         } else {
//             toast.error("Invalid token in the URL.");
//         }
//     }, [token]);

//     const fetchExamDetails = async (token) => {
//         try {
//             setLoading(true);
//             const response = await Service.get(`/api/getExamDetails/${token}`);
//             console.log(response.data.result);
//             setExamDetails(response.data.result);
//         } catch (error) {
//             console.error(error);
//             toast.error("Failed to fetch exam details.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmitting(true);
//         setStage('success');
//         // try {
//         //     const response = await Service.post(`/api/register`, {
//         //         examToken: token,
//         //         ...formData,
//         //     });

//         //     if (response.status === 200) {
//         //         setStage('success');
//         //     }
//         // } catch (error) {
//         //     if (error.response?.status === 409) {
//         //         toast.error("You are already registered.");
//         //     } else {
//         //         toast.error("Failed to register. Please try again later.");
//         //     }
//         // } finally {
//         //     setSubmitting(false);
//         // }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div style={{ display: "flex", height: "100vh", background: "black" }}>
//             <div style={{ flex: 2, background: `url(${ExamRegister})`, backgroundPosition: "center", backgroundRepeat: "no-repeat" }} >
//                 <img src={p3} style={{ width: "160px", height: "50px", paddingTop: "15px", paddingLeft: "15px" }} alt="Logo" />
//             </div>

//             <div
//                 style={{
//                     flex: 2,
//                     display: "flex",
//                     flexDirection: "column",
//                     // justifyContent: "center",
//                     borderTopLeftRadius: "4%",
//                     borderBottomLeftRadius: "4%",
//                     alignItems: "center",
//                     backgroundColor: "#e8edec",
//                     padding: "20px",
//                     // textAlign: "left",
//                     width: "50%",
//                     fontFamily: "Courier, monospace"
//                 }}
//             >
//                 {stage === 'details' && examDetails && (
//                     <div style={{marginTop:"15vh"}}>
//                         <Typography variant="h5" gutterBottom>
//                             {examDetails.examName}
//                         </Typography>
//                         <Typography variant="body1">
//                             Date: {examDetails.examStartTime}
//                         </Typography>
//                         <Typography variant="body1">
//                             Time: {examDetails.examTime}
//                         </Typography>
//                         {examDetails.examStatus === 'registration' && (
//                             <Button variant="contained" color="primary" onClick={() => setStage('form')}>
//                                 Register Now
//                             </Button>
//                         )}

//                         {examDetails.examStatus === 'ongoing' && <Typography color="error">Registrations closed!</Typography>}
//                         {examDetails.examStatus === 'closed' && <Typography color="error">Exam is closed.</Typography>}
//                     </div>
//                 )}

//                 {stage === 'form' && (
//                     <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, p: 3, boxShadow: 3, background: 'white', borderRadius: 3 }}>
//                         <Typography variant="h5" align="center" gutterBottom>
//                             Register now
//                         </Typography>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12}>
//                                 <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth type="email" />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <TextField label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} fullWidth type="tel" />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <TextField label="Year of Passing" name="yearOfPassing" value={formData.yearOfPassing} onChange={handleChange} fullWidth type="number" />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <TextField label="College Name" name="collegeName" value={formData.collegeName} onChange={handleChange} fullWidth />
//                             </Grid>
//                         </Grid>

//                         <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={submitting}>
//                             {submitting ? <CircularProgress size={24} /> : "Register"}
//                         </Button>
//                     </Box>
//                 )}

//                 {stage === 'success' && (
//                     <Box
//                         sx={{
//                             height:"500px",
//                             width:"500px",
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             p: 3,
//                             borderRadius: 3,
//                             boxShadow: 2,
//                             bgcolor: "background.paper",
//                             textAlign: "center",
//                             maxWidth: 500
//                         }}
//                     >
//                         {/* <CheckCircleIcon sx={{ fontSize: 50, color: "success.main" }} /> */}
//                         <Typography variant="h5" color="success.main" sx={{ mt: 1 }}>
//                             Registration Successful!
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                             Successfully registered for the exam.
//                         </Typography>
//                         <Button
//                             variant="contained"
//                             color="success"
//                             sx={{ mt: 2, width: "40%" }}
//                             onClick = {()=> {toast.success("Registration Completed"); setStage("details")}}
//                         >
//                             Ok
//                         </Button>
//                     </Box>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default RegistrationForm;