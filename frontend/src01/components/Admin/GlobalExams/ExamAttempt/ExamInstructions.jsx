/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useEffect, useRef } from 'react';
import Exam from './GlobalExamAttempt';
import { useSearchParams } from 'react-router-dom';
import Service from '../../../../service/Service';
import { toast } from 'react-toastify';
import {

  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faUndo } from '@fortawesome/free-solid-svg-icons';


const GlobalExamDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const examType = searchParams.get("type");
  const examToken = searchParams.get("examToken");
  const hId = searchParams.get("hId");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
  };

  const [timer, setTimer] = useState(15);
  const [fullscreenEnabled, setFullscreenEnabled] = useState(false);
  const [startExam, setStartExam] = useState(false);
  const [examDetails, setExamDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null); // 👈 Reference for Confirmation Form
  const [stage, setStage] = useState("stage-1");
  const [processing, setProcessing] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);



  useEffect(() => {
    if (isExamSubmitted) {
      setIsVisible(false); // Set to false when needed
    }
  }, []);

  const [systemConfig, setSystemConfig] = useState({
    operatingSystem: "",
    browser: "",
    browserVersion: "",
    screenResolution: "",
    serverStatus: "",
    javascript: "",
    fullscreen: "Disabled",
  });


  const checkSystem = async () => {
    try {
      // Check Operating System
      const osResponse = await Service.get("/checkOperatingSystem");

      console.log("os response :", osResponse);
      // await delay(1000);
      setSystemConfig((prev) => ({ ...prev, operatingSystem: osResponse.data.message }));

      // Check Browser
      const userAgent = window.navigator.userAgent;
      const isChrome = userAgent.includes("Chrome");
      console.log(userAgent, isChrome);

      // await delay(1000);
      setSystemConfig((prev) => ({ ...prev, browser: isChrome ? "Chrome" : "Other" }));

      // Check Browser Version
      const versionMatch = userAgent.match(/Chrome\/([\d.]+)/);
      console.log("versionMatch", versionMatch);
      // await delay(1000);

      setSystemConfig((prev) => ({
        ...prev,
        browserVersion: versionMatch ? versionMatch[1] : "Unknown",
      }));

      // Check Screen Resolution
      const screenRes = `${window.screen.width} x ${window.screen.height}`;

      console.log("screenRes", screenRes);
      // await delay(1000);
      setSystemConfig((prev) => ({ ...prev, screenResolution: screenRes }));

      // Check Server Status
      const serverResponse = await Service.get("/check-server-status");

      console.log("serverResponse :", serverResponse);
      // await delay(1000);
      setSystemConfig((prev) => ({
        ...prev,
        serverStatus: serverResponse.status === 200 ? "Online" : "Offline",
      }));

      // Check JavaScript
      // await delay(1000);
      setSystemConfig((prev) => ({ ...prev, javascript: "Enabled" }));

      // Check Fullscreen
      updateFullscreenStatus();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", updateFullscreenStatus);
    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenStatus);
    };
  }, []);


  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setFullscreenEnabled(true);
        updateFullscreenStatus();
      });
    }
  };

  const updateFullscreenStatus = () => {
    const isFullscreen = !!document.fullscreenElement;
    setFullscreenEnabled(isFullscreen);
    setSystemConfig((prev) => ({ ...prev, fullscreen: isFullscreen ? "Enabled" : "Disabled" }));
  };

  const checkCompatibility = (key, value) => {
    console.log(key, value);
    const compatibilityRules = {
      operatingSystem: value !== "Failure",
      browser: value === "Chrome",
      browserVersion: value !== "Unknown",
      screenResolution: (() => {
        const [width, height] = value.split(" x ").map(Number);
        return width >= 1280 && height >= 720;
      })(),
      serverStatus: value === "Online",
      javascript: value === "Enabled",
      fullscreen: value === "Enabled",
    };
    return compatibilityRules[key];
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


  useEffect(() => {
    if (examToken) {
      fetchExamDetails(examToken);
    } else {
      toast.error("Invalid examToken in the URL.");
    }
  }, [examToken]);

  useEffect(() => {
    if (examToken && hId) {
      fetchUserDetails(examToken, hId);
    }
  }, [examToken, hId]);

  const fetchExamDetails = async (examToken) => {
    try {
      setLoading(true);
      const response = await Service.get(`/api/getExamDetails/${examToken}`);
      console.log("Exam Details:", response.data.result);
      setExamDetails(response.data.result);
    } catch (error) {
      console.error("Error fetching exam details:", error);
      toast.error("Failed to fetch exam details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (examToken, hId) => {
    try {
      setLoading(true);
      const response = await Service.get(`/api/getHallTicketDetails/${examToken}/${hId}`);
      console.log("User Details:", response.data.result);
      setIsExamSubmitted(response.data.result.examStatus);
      console.log(isExamSubmitted);
      setUserDetails(response.data.result);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          if (fullscreenEnabled) {
            // setStartExam(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [fullscreenEnabled]);


  console.log(examDetails);

  if (startExam) {
    return <Exam examToken={examToken} hId={hId} />;
  }


  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const checkAllRequirements = () => {
    return Object.entries(systemConfig).every(([key, value]) => checkCompatibility(key, value));
  };



  const handleClick = () => {
    setProcessing(true);
    setStage("stage-2");

    checkSystem().finally(() => {
      setTimeout(() => setProcessing(false), 1000); // Simulate processing time
    });
  };


  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <h5 style={{ padding: "20px", fontWeight: "bolder", fontSize: "16px" }}>RS Exams</h5>
      <div style={{ flex: 2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      </div>

      <div
        style={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          justifyContent: "center",
          backgroundColor: "beige",
          padding: "20px",
          textAlign: "left",
          width: "50%",
          paddingRight: "13vw",
          paddingLeft: "5vw",
          fontFamily: "Courier, monospace"
        }}
      >

        {(stage === "stage-1" && <>
          <div style={{ marginTop: isExamSubmitted ? "0px" : "140vh" }}>
            <h2 style={{ fontSize: "1.5rem", color: "black" }}>Welcome to</h2>
            <h2 style={{ fontSize: "2rem", color: "black", fontWeight: "bold" }}>{examDetails && examDetails.examName}</h2>

            <div style={{ marginTop: "3vh" }}>
              <div style={{ display: "flex", gap: "30px" }}>
                <p style={{ fontSize: "1rem", color: "black", fontWeight: "bold" }}>Test Duration</p>
                <p style={{ fontSize: "1rem", color: "black", fontWeight: "bold" }}>No Of Questions</p>
              </div>
              <div style={{ display: "flex", gap: "60px", marginTop: "-2vh", marginLeft: "15px" }}>
                <p style={{ fontSize: "1rem", color: "black" }}>{examDetails && examDetails.duration} mins</p>
                <p style={{ fontSize: "1rem", color: "black" }}>{examDetails && examDetails.noOfQuestions} questions</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10vh", marginRight: "5vw" }}>
              <div style={{
                display: "flex",
                justifyContent: "center", // Centers button horizontally
                alignItems: "center", // Centers button vertically
                marginTop: "20px" // Adds some spacing from above elements
              }}>
                <Button
                  variant="outlined"
                  color="black"
                  onClick={!isExamSubmitted ? handleScrollToForm : undefined} // Prevents click if submitted
                  disabled={isExamSubmitted} // Disables button after submission
                >
                  {isExamSubmitted ? "Test Submitted Successfully" : "Let's Go"}
                </Button>
              </div>

            </div>
          </div>
          {isVisible  && !isExamSubmitted &&  (

            <div ref={formRef} style={{ marginTop: "60vh", marginBottom: "10vh" }}>
              <h2 style={{ fontSize: "2rem", color: "black", fontFamily: "Courier, monospace" }}>Instructions</h2>
              <ul style={{ textAlign: "left", maxWidth: "95%", fontSize: "1em", fontFamily: "Courier, monospace" }}>
                <li style={{ fontFamily: "Courier, monospace", fontWeight: "bold", fontSize: "18px" }}>This is a time-based test. The timer cannot be paused once started.</li>
                <li style={{ fontFamily: "Courier, monospace", fontWeight: "bold", fontSize: "18px" }}>Keep an eye on the timer to manage your time effectively.</li>
                <li style={{ fontFamily: "Courier, monospace", fontWeight: "bold", fontSize: "18px" }}>Ensure you have a stable internet connection throughout the exam.</li>
                <li style={{ fontFamily: "Courier, monospace", fontWeight: "bold", fontSize: "18px" }}>Use a browsers like Google Chrome, Firefox, Safari for best performance.</li>
                <li style={{ fontFamily: "Courier, monospace", fontWeight: "bold", fontSize: "18px" }}>Do not switch tabs or open new applications during the exam.</li>
                <li style={{ fontFamily: "Courier, monospace", fontWeight: "bold", fontSize: "18px" }}>Avoid refreshing the page to prevent data loss.</li>
                <li style={{ fontFamily: "Courier, monospace", fontWeight: "bold", fontSize: "18px" }}>Stay in a quiet environment to minimize distractions.</li>
                <li style={{ fontFamily: "Courier, monospace", fontWeight: "bold", fontSize: "18px" }}>Review all answers before submission, changes cannot be made afterward.</li>
                <li style={{ fontFamily: "Courier, monospace", fontWeight: "bold", fontSize: "18px" }}>For technical issues, contact support immediately.</li>
              </ul>
              <FormControlLabel
                control={
                  <Controller
                    name="declaration"
                    control={control}
                    rules={{ required: "You must agree to the declaration" }}
                    render={({ field }) => <Checkbox {...field} />}
                  />
                }
                label={
                  <Typography style={{ fontSize: "0.8rem" }}>
                    I confirm that I will work on this assessment with integrity, without relying on external sources or AI tools.
                  </Typography>
                }
              />
              {errors.declaration && (
                <Typography color="error" variant="body2" style={{ fontSize: "0.8rem" }}>
                  {errors.declaration.message}
                </Typography>
              )}

              <FormControlLabel
                control={
                  <Controller
                    name="terms"
                    control={control}
                    rules={{ required: "You must accept the terms" }}
                    render={({ field }) => <Checkbox {...field} />}
                  />
                }
                label={
                  <Typography style={{ fontSize: "0.8rem" }}>
                    I agree to RamanaSoft`s {" "}
                    <a href="#" style={{ textDecoration: "none", color: "blue" }}> Terms of Service </a>
                    {" "} and {" "}
                    <a href="#" style={{ textDecoration: "none", color: "blue" }}> Privacy Policy </a>.
                  </Typography>
                }
              />
              {errors.terms && (
                <Typography color="error" variant="body2" style={{ fontSize: "0.8rem" }}>
                  {errors.terms.message}
                </Typography>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "5vh", marginRight: "5vw" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={!isValid}
                    onClick={() => { setStage("stage-2"); localStorage.setItem("Accepted Terms", true); checkSystem(); }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
        )}

        {(stage === "stage-2" &&
          <>
            <div>
              <div>
                <p
                  style={{
                    fontSize: "32px",
                    fontFamily: "Arial Narrow, sans-serif",
                    fontWeight: "100", // Lighter font weight
                    color: "#999", // Soft gray for a lighter appearance
                  }}
                >
                  System Compatibility Check
                </p>


                <table style={{ width: "100%", border: "none" }}>
                  <tbody>
                    {Object.entries(systemConfig).map(([key, value]) => (
                      <tr key={key}>
                        <td style={{ padding: "10px", fontWeight: "bold" }}>{key}</td>
                        <td style={{ padding: "10px" }}>{value}</td>
                        <td
                          style={{
                            padding: "10px",
                            color: checkCompatibility(key, value) ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {checkCompatibility(key, value) ? <div>✅ Compatible</div> : "❌ Not Compatible"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!fullscreenEnabled && (

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "5vh", marginRight: "5vw" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "10px" }}>
                      <button
                        onClick={handleClick}
                        title='re-check'
                        style={{
                          padding: "8px 15px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          border: "none",
                          background: "none",
                          color: "black",
                          marginTop: "10px",
                          borderRadius: "5px",
                        }}
                        disabled={processing} // Optional: Disable button while processing
                      >
                        {processing ? <div style={{ fontSize: "15px", fontWeight: "bolder", marginBottom: "-2px" }}>Processing...</div> : <FontAwesomeIcon icon={faUndo} style={{ height: "20px", marginBottom: "-4px" }} />}
                      </button>
                      <button
                        title='Enter FullScreen Mode'
                        onClick={handleFullscreen}
                        style={{
                          padding: "8px 15px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          border: "2px solid black",
                          background: "none",
                          // backgroundColor: "#007BFF",
                          color: "black",
                          borderRadius: "5px",
                        }}
                      >
                        <FontAwesomeIcon icon={faExpand} style={{ marginRight: "8px" }} />

                        Enable Fullscreen
                      </button>
                    </div>
                  </div>


                )}
              </div>


              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "5vh", marginRight: "5vw" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <Button
                    variant="outlined"
                    color="black"
                    // disabled={!checkAllRequirements()}
                    onClick={() => setStartExam(true)}
                  >
                    Start Exam
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default GlobalExamDetailsPage;
