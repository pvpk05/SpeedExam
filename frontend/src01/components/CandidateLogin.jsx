/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import img1 from '../assets/CandidateLogin.jpg';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Service from '../service/Service';
import Cookies from 'js-cookie';

const CandidateLogin = () => {

    const [userMobile, setUserMobile] = useState("");
    const [error, setError] = useState("")
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [userOTP, setUserOTP] = useState();
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const handleUserMobile = (event) => {
        const { value } = event.target;

        const mobilePattern = /^[6-9]\d{9}$/;  // regex pattern for mobile number
        if (!/^\d*$/.test(value)) return;  // allow only numbers

        setUserMobile(value);

        if (value.length == 10 && !mobilePattern.test(value)) { setError("") }
        else { setError('') };
    };

    const handleSendOTP = async (event) => {
        event.preventDefault();

        try {
            const response = await Service.post('/api/normal-login', { mobileNo: userMobile });
            // console.log(response)
            if (response.status == 200) {
                const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString().split("");
                console.log("Generated OTP:", generatedOTP.join())
                setUserOTP(generatedOTP);
                setOtpSent(true)
                setTimer(30)
            }
        }
        catch (error) {
            console.log(error)
            if (error.status == 400) {
                console.log(error.response.data.message)
                // console.log('User not found, please register')
            }
            else if (error.status == 500) {
                console.log(error.response.data.message)
                // console.log('Server error')
            }
        }
    };

    const handleVerifyOTP = async (event) => {
        event.preventDefault();

        console.log("Generated OTP:", userOTP.join(''))
        console.log("Entered OTP:", otp.join(''))

        if (userOTP.join('') == otp.join('')) {
            setOtpSent(false);
            // navigate('/candidate')

            try {
                const response = await Service.post("/api/normal-login", { mobileNo: userMobile })
                console.log(response)
                if(response.status == 200){
                    const intern = response.data.intern[0];

                    if (response.data.type === "intern") {
                        Cookies.set('role', 'intern', { expires: 30 });
                        Cookies.set('internID', intern.candidateID, { expires: 30 });
                        Cookies.set('verified', 'true', { expires: 30 });
                        navigate('/candidate/dashboard');
                      }
                }
            }
            catch (error) {
                console.log(error)
            }
        }
        else {
            console.log('Invalid OTP')
        }
    };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        };
        return () => clearInterval(interval)
    }, [timer]);

    const handleOTPChange = (index, event) => {
        const { value } = event.target;
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftSection}>
                <h2 style={styles.title}>Candidate SignIn</h2>
                <form style={styles.form}>
                    {/* <input
                        type="email"
                        placeholder="Email"
                        style={styles.input}
                    /> */}
                    <TextField label='Mobile Number'
                        sx={{ m: 1 }}
                        value={userMobile}
                        onChange={handleUserMobile}
                        error={!!error}
                        helperText={error}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position='start'>+91</InputAdornment>
                            }
                        }}
                        inputProps={{ maxLength: 10 }}
                    />
                    <button style={styles.loginButton} onClick={handleSendOTP} disabled={!!error}>
                        {timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP"}
                    </button>

                    {
                        timer>0 && (
                            <div className='mt-3'>
                                <div>
                                    {otp.map((digit, index) => (
                                        <input key={index} type='text' style={styles.otpInput}
                                            maxLength={1} value={digit}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            onChange={(e) => handleOTPChange(index, e)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                        />
                                    ))}
                                </div>
                                <button className='btn btn-success mt-3' onClick={handleVerifyOTP}>
                                    Verify OTP
                                </button>
                            </div>
                        )
                    }

                    {/* <input
                        type="password"
                        placeholder="Password"
                        style={styles.input}
                    /> */}
                    {/* <button style={styles.loginButton} onClick={handleSendOTP}>
                         Login
                    </button> */}
                </form>

            </div>
            <div style={styles.rightSection}>
                <img src={img1} alt='img01' style={{ width: "600px", marginRight: "100px" }} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '90vh',
        fontFamily: 'Arial, sans-serif',
    },
    leftSection: {
        flex: 1,
        // backgroundColor: '#3b3db8',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // padding: '40px',
        textAlign: 'center',
    },
    welcomeTitle: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
    },
    description: {
        fontSize: '1rem',
        marginTop: '20px',
        lineHeight: '1.6',
    },
    footer: {
        marginTop: 'auto',
        fontSize: '0.85rem',
        opacity: 0.7,
    },
    rightSection: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: "50px",
        backgroundColor: '#fff',
    },
    title: {
        fontSize: '1.8rem',
        marginBottom: '10px',
        color: '#587cf4'
    },
    createAccountText: {
        fontSize: '0.9rem',
        marginBottom: '30px',
    },
    link: {
        color: '#3b3db8',
        textDecoration: 'underline',
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    loginButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#587cf4',
        color: 'white',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    googleButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#f1f1f1',
        color: 'black',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '20px',
    },
    forgotPasswordLink: {
        fontSize: '0.9rem',
        textDecoration: 'none',
        color: 'black',
    },
    otpInput: {
        width: "30px",
        height: "30px",
        textAlign: "center",
        fontSize: "20px",
        border: "1px solid lightgray",
        borderRadius: "2px",
        margin: "0 3px"
    }
};

export default CandidateLogin;
