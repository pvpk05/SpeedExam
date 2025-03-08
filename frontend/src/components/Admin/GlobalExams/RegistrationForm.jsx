/*eslint-disable no-unused-vars*/
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Service from "../../../service/Service";
import { Button, Typography, Box, Grid, Checkbox, FormControlLabel } from "@mui/material";
import p3 from '../../../assets/p3.png';
import p4 from '../../../assets/p4.png';
import ExamRegister from '../../../assets/RegisterBGRemove.png';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import * as Yup from 'yup';
import { useFormik } from 'formik';

const StandardInput = ({ label, name, value, onChange, onBlur, error, helperText, type = 'text', maxLength }) => (
    <Box >
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{label}</Typography>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            maxLength={maxLength}
            style={{
                width: '100%',
                padding: '4px 0',
                border: 'none',
                borderBottom: '1px solid #ccc',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'transparent',
                fontFamily: 'inherit'
            }}
        />
        {error && <Typography color="error" variant="caption">{helperText}</Typography>}
    </Box>
);

const RegistrationForm = () => {

    const [searchParams] = useSearchParams();
    const [examDetails, setExamDetails] = useState(null);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const [loading, setLoading] = useState(false);

    const [stage, setStage] = useState('details');
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

    const validationSchema = Yup.object({
        name: Yup.string()
            .trim()
            .min(3, 'Student name must be at least 3 characters')
            .max(50, 'Student name must be at most 50 characters')
            .matches(/^[A-Za-z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed')
            .required('Student name is required'),

        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),

        mobile: Yup.string()
            .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
            .required('Phone number is required'),

        yearOfPassing: Yup.number()
            .typeError('Year of passing must be a number')
            .min(1900, 'Year must be valid')
            .max(new Date().getFullYear(), `Year cannot be in the future`)
            .required('Year of passing is required'),

        collegeName: Yup.string()
            .trim()
            .min(3, 'College name must be at least 3 characters')
            .max(100, 'College name must be at most 100 characters')
            .required('College name is required'),

        agree: Yup.boolean()
            .oneOf([true], 'You need to agree to the terms')


    });



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

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await Service.post(`/api/register`, {
                examToken: token,
                ...values,   // Formik passes all form values here directly
            });

            if (response.status === 200) {
                await delay(1000);
                setStage('success');
            }
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error("You are already registered.");
            } else {
                toast.error("Failed to register. Please try again later.");
            }
        } finally {
            setSubmitting(false); // Formik also provides setSubmitting directly
        }
    };


    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            mobile: '',
            yearOfPassing: '',
            collegeName: '',
            agree: false
        },
        validationSchema,
        onSubmit: handleSubmit,
    });



    if (loading) {
        return <div>Loading...</div>;
    };

    return (
        <>
            {!isMobile &&
                <div style={{ display: "flex", height: "100vh", background: "black" }}>
                    <div style={{ flex: 2, background: `url(${ExamRegister})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "77% 64%" }} >
                        {/* <div style={{
                        flex: 2,
                        position: "relative",
                        overflow: "hidden", // in case anything overflows
                        background: `radial-gradient(circle at 50% 100%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0) 70%), url(${ExamRegister})`,
                        backgroundSize: "40% 40%",
                        backgroundPosition: "center center",
                        backgroundRepeat: "no-repeat"
                    }}> */}

                        <img src={p3} style={{ width: "160px", height: "50px", paddingTop: "15px", paddingLeft: "15px" }} alt="Logo" />
                    </div>

                    <div
                        style={{
                            flex: 3,
                            display: "flex",
                            background: "white",
                            color: "black",
                            flexDirection: "column",
                            borderTopLeftRadius: "2%",
                            borderBottomLeftRadius: "2%",
                            alignItems: "center",
                            // backgroundColor: "#e8edec",
                            padding: "20px",
                            width: "100%",
                            fontFamily: "Courier, monospace"
                        }}
                    >
                        {stage === 'details' && examDetails && (
                            <div style={{ marginTop: "15vh", paddingRight: "10vw", paddingLeft: "4vw" }}>
                                <h2 style={{ fontSize: "1.5rem", color: "black" }}>Welcome to</h2>
                                <h2 style={{ fontSize: "2rem", color: "black", fontWeight: "bold" }}>{examDetails && examDetails.examName}</h2>


                                <div style={{ marginTop: "3vh" }}>
                                    <div style={{ display: "flex", gap: "30px" }}>
                                        <p style={{ fontSize: "1rem", color: "black", fontWeight: "bold" }}>Test Duration</p>
                                        <p style={{ fontSize: "1rem", color: "black", fontWeight: "bold" }}>No Of Questions</p>
                                        <p style={{ fontSize: "1rem", color: "black", fontWeight: "bold", marginLeft: "1vw" }}>Exam Date</p>
                                        <p style={{ fontSize: "1rem", color: "black", fontWeight: "bold", marginLeft: "4vw" }}>Timings</p>

                                    </div>
                                    <div style={{ display: "flex", gap: "60px", marginTop: "-2vh", marginLeft: "15px" }}>
                                        <p style={{ fontSize: "0.8rem", color: "black", marginLeft: "18px" }}>{examDetails && examDetails.duration} mins</p>
                                        <p style={{ fontSize: "0.8rem", color: "black" }}>{examDetails && examDetails.noOfQuestions} questions</p>
                                        <p style={{ fontSize: "0.8rem", color: "black", marginLeft: "1vw" }}>{examDetails && examDetails.examDate}</p>
                                        <p style={{ fontSize: "0.8rem", color: "black" }}>{examDetails && examDetails.examTimings}</p>

                                    </div>
                                </div>

                                <div className="d-flex justify-content-end mt-5">
                                    {examDetails.examStatus === 'registration' ? (
                                        <Button
                                            variant="contained"
                                            style={{ color: "white", background: "black", border: "2px solid white" }}
                                            onClick={() => setStage('form')}
                                        >
                                            Register
                                        </Button>
                                    ) : (
                                        <Typography color="error">
                                            {examDetails.examStatus === 'ongoing'
                                                ? 'Registrations closed!'
                                                : 'Exam is closed.'}
                                        </Typography>
                                    )}
                                </div>

                                {/* {examDetails.examStatus === 'registration' && (
                                    <div className="d-flex justify-content-end">
                                        <Button variant="contained" style={{ color: "white", background: "black", border: "2px solid white" }} onClick={() => setStage('form')} className="mt-5">
                                            Register
                                        </Button>
                                    </div>
                                )}

                                {examDetails.examStatus === 'ongoing' && <Typography color="error">Registrations closed!</Typography>}
                                {examDetails.examStatus === 'closed' && <Typography color="error">Exam is closed.</Typography>} */}
                            </div>
                        )}

                        {stage === 'form' && (
                            <Box
                                component="form"
                                onSubmit={formik.handleSubmit}
                                sx={{
                                    maxWidth: 550,
                                    background: 'white',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    overflow: 'hidden',
                                    alignItems: "center",
                                    marginTop: Object.keys(formik.errors).length === 0 ? '50px' : '0px',
                                    fontFamily: 'Arial, sans-serif'
                                }}
                            >
                                <Box sx={{ backgroundColor: 'black', color: 'white', p: 2, textAlign: 'center' }}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                        REGISTRATION
                                    </Typography>
                                    <Typography variant="body2" style={{ fontSize: '12px' }}>
                                        Fill these basic details for Contact
                                    </Typography>
                                </Box>

                                <Box sx={{ p: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <StandardInput
                                                label="Full Name"
                                                name="name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.name && Boolean(formik.errors.name)}
                                                helperText={formik.touched.name && formik.errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StandardInput
                                                label="Email"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StandardInput
                                                label="Mobile"
                                                name="mobile"
                                                value={formik.values.mobile}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                maxLength={10}
                                                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                                helperText={formik.touched.mobile && formik.errors.mobile}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StandardInput
                                                label="Year of Passing"
                                                name="yearOfPassing"
                                                value={formik.values.yearOfPassing}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                maxLength={4}
                                                error={formik.touched.yearOfPassing && Boolean(formik.errors.yearOfPassing)}
                                                helperText={formik.touched.yearOfPassing && formik.errors.yearOfPassing}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StandardInput
                                                label="College Name"
                                                name="collegeName"
                                                value={formik.values.collegeName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.collegeName && Boolean(formik.errors.collegeName)}
                                                helperText={formik.touched.collegeName && formik.errors.collegeName}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        style={{ color: "black" }}
                                                        checked={formik.values.agree}
                                                        onChange={formik.handleChange}
                                                        name="agree"
                                                    />
                                                }
                                                label={
                                                    <Typography variant="body2">
                                                        I agree to the <a href="#" style={{ color: 'black', fontWeight: "bolder", textDecoration: 'none' }}>terms and conditions</a>
                                                    </Typography>
                                                }
                                            />
                                            <br />
                                            {formik.touched.agree && formik.errors.agree && (
                                                <Typography color="error" variant="caption" >
                                                    {formik.errors.agree}
                                                </Typography>
                                            )}
                                        </Grid>

                                    </Grid>
                                </Box>

                                <Box sx={{ color: 'white', display: "flex", justifyContent: "space-between", textAlign: 'center', p: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        sx={{
                                            border: "1px solid black",
                                            marginLeft: "100px",
                                            color: 'black',
                                            textTransform: 'uppercase',
                                            width: '120px'
                                        }}
                                        onClick={() => setStage('details')}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: 'black',
                                            color: 'white',
                                            marginRight: "100px",
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            width: '120px'
                                        }}
                                        disabled={formik.isSubmitting}
                                    >
                                        {formik.isSubmitting ? 'Registering...' : 'Submit'}
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

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Your Hall Ticket will be sent to your registered email once released.
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
            }
            {isMobile &&
                <div style={{ height: "100vh", background: "white" }}>
                    <img src={p4} style={{ width: "120px", height: "40px", paddingTop: "15px", paddingLeft: "15px" }} alt="Logo" />

                    <div
                        style={{
                            display: "flex",
                            background: "white",
                            color: "black",
                            flexDirection: "column",
                            alignItems: "center",
                            // backgroundColor: "#e8edec",
                            padding: "20px",
                            width: "100%",
                            fontFamily: "Courier, monospace"
                        }}
                    >
                        {stage === 'details' && examDetails && (
                            <div style={{ marginTop: "15vh" }}>
                                <h2 style={{ fontSize: "0.8rem", color: "black" }}>Welcome to</h2>
                                <h2 style={{ fontSize: "1rem", color: "black", fontWeight: "bold" }}>{examDetails && examDetails.examName}</h2>


                                <div style={{ marginTop: "3vh" }}>
                                    <div style={{ display: "flex", gap: "30px" }}>
                                        <p style={{ fontSize: "0.5rem", color: "black", fontWeight: "bold" }}>Test Duration</p>
                                        <p style={{ fontSize: "0.5rem", color: "black", fontWeight: "bold", marginLeft: "1vw" }}>No Of Questions</p>
                                        <p style={{ fontSize: "0.5rem", color: "black", fontWeight: "bold", marginLeft: "1vw" }}>Exam Date</p>
                                        <p style={{ fontSize: "0.5rem", color: "black", fontWeight: "bold", marginLeft: "4vw" }}>Timings</p>

                                    </div>
                                    <div style={{ display: "flex", gap: "45px", marginTop: "-2vh" }}>
                                        <p style={{ fontSize: "0.4rem", color: "black", marginLeft: "2vw" }}>{examDetails && examDetails.duration} mins</p>
                                        <p style={{ fontSize: "0.4rem", color: "black" }}>{examDetails && examDetails.noOfQuestions} questions</p>
                                        <p style={{ fontSize: "0.4rem", color: "black" }}>{examDetails && examDetails.examDate}</p>
                                        <p style={{ fontSize: "0.4rem", color: "black" }}>{examDetails && examDetails.examTimings}</p>

                                    </div>
                                </div>


                                {examDetails.examStatus === 'registration' && (
                                    <div className="d-flex justify-content-end">
                                        <Button variant="contained" style={{ color: "white", background: "black", border: "2px solid white" }} onClick={() => setStage('form')} className="mt-5">
                                            Register
                                        </Button>
                                    </div>
                                )}

                                {examDetails.examStatus === 'ongoing' && <Typography color="error">Registrations closed!</Typography>}
                                {examDetails.examStatus === 'closed' && <Typography color="error">Exam is closed.</Typography>}
                            </div>
                        )}

                        {stage === 'form' && (
                            <Box
                                component="form"
                                onSubmit={formik.handleSubmit}
                                sx={{
                                    maxWidth: 250,

                                    background: 'white',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    overflow: 'hidden',
                                    alignItems: "center",
                                    marginTop: Object.keys(formik.errors).length === 0 ? '50px' : '0px',
                                    fontFamily: 'Arial, sans-serif'
                                }}
                            >
                                {/* Top Banner */}
                                <Box sx={{ backgroundColor: 'black', color: 'white', p: 2, textAlign: 'center' }}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
                                        REGISTRATION
                                    </Typography>
                                    <Typography variant="body2" style={{ fontSize: '6px' }}>
                                        Fill these basic details for Contact
                                    </Typography>
                                </Box>

                                {/* Form Fields */}
                                <Box sx={{ p: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <StandardInput
                                                label="Full Name"
                                                name="name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.name && Boolean(formik.errors.name)}
                                                helperText={formik.touched.name && formik.errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StandardInput
                                                label="Email"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StandardInput
                                                label="Mobile"
                                                name="mobile"
                                                value={formik.values.mobile}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                maxLength={10}
                                                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                                helperText={formik.touched.mobile && formik.errors.mobile}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StandardInput
                                                label="Year of Passing"
                                                name="yearOfPassing"
                                                value={formik.values.yearOfPassing}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                maxLength={4}
                                                error={formik.touched.yearOfPassing && Boolean(formik.errors.yearOfPassing)}
                                                helperText={formik.touched.yearOfPassing && formik.errors.yearOfPassing}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StandardInput
                                                label="College Name"
                                                name="collegeName"
                                                value={formik.values.collegeName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.collegeName && Boolean(formik.errors.collegeName)}
                                                helperText={formik.touched.collegeName && formik.errors.collegeName}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        style={{ color: "black" }}
                                                        checked={formik.values.agree}
                                                        onChange={formik.handleChange}
                                                        name="agree"
                                                    />
                                                }
                                                label={
                                                    <Typography variant="body2">
                                                        I agree to the <a href="#" style={{ color: 'black', fontWeight: "bolder", textDecoration: 'none' }}>terms and conditions</a>
                                                    </Typography>
                                                }
                                            />
                                            <br />
                                            {formik.touched.agree && formik.errors.agree && (
                                                <Typography color="error" variant="caption" >
                                                    {formik.errors.agree}
                                                </Typography>
                                            )}
                                        </Grid>

                                    </Grid>
                                </Box>

                                {/* Bottom Bar & Submit */}
                                <Box sx={{ color: 'white', display: "flex", justifyContent: "space-between", textAlign: 'center', p: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        sx={{
                                            border: "1px solid black",
                                            marginLeft: "100px",
                                            color: 'black',
                                            textTransform: 'uppercase',
                                            width: '120px'
                                        }}
                                        onClick={() => setStage('details')}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: 'black',
                                            color: 'white',
                                            marginRight: "100px",
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            width: '120px'
                                        }}
                                        disabled={formik.isSubmitting}
                                    >
                                        {formik.isSubmitting ? 'Registering...' : 'Submit'}
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

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Your Hall Ticket will be sent to your registered email once released.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    sx={{ mt: 4, width: "40%" }}
                                    onClick={() => { toast.success("Registration Successful 🎉"); setStage("details"); setExamDetails(null);}}
                                >
                                    Ok
                                </Button>
                            </Box>
                        )}
                    </div>
                </div>
            }
        </>
    );
};

export default RegistrationForm;
