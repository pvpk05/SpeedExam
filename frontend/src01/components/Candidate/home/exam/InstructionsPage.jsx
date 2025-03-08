/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useEffect, useRef } from 'react';
import Exam from './Exam';
import { useParams } from 'react-router-dom';

const InstructionsPage = () => {

    const [agreed, setAgreed] = useState(false);

    const examID = useParams();

    console.log(examID);
    
    const [timer, setTimer] = useState(15);
    const [fullscreenEnabled, setFullscreenEnabled] = useState(false);
    const [startExam, setStartExam] = useState(false);

    useEffect(() => {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            if (fullscreenEnabled) {
              setStartExam(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }, [fullscreenEnabled]);
  
    const handleFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(() => setFullscreenEnabled(true));
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen().then(() => setFullscreenEnabled(true));
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen().then(() => setFullscreenEnabled(true));
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen().then(() => setFullscreenEnabled(true));
      }
    };
  

    if (startExam) {
        return <Exam examID={examID} />;
      }
    

    return (
        <div style={{ display: "flex", height: "100vh" }}>

            <h5 style={{ padding: "20px", fontWeight: "bolder", fontSize: "16px" }}>RS Exams</h5>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            </div>
            <div
                style={{
                    flex: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "beige",
                    borderLeft: "2px solid black",
                    padding: "20px",
                    textAlign: "left",
                    width: "50%",
                    fontFamily: "Courier, monospace"
                }}
            >
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

                {/* <div style={{ marginTop: "15px", fontSize: "1.2rem" }}>
                    Time remaining: {timer} seconds
                </div> */}

                <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreed}
                        onChange={() => setAgreed(!agreed)}
                        style={{ marginRight: "10px" }}
                    />
                    <label htmlFor="terms">I agree to the terms and conditions</label>
                </div>

                <button
                    onClick={handleFullscreen}
                    style={{
                        marginTop: "15px",
                        padding: "10px 20px",
                        fontSize: "1rem",
                        cursor: "pointer",
                        backgroundColor: fullscreenEnabled ? "#28A745" : "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    {fullscreenEnabled ? "Fullscreen Enabled" : "Enable Fullscreen"}
                </button>

                <button
                    disabled={!agreed || !fullscreenEnabled || timer > 0}
                    style={{
                        marginTop: "15px",
                        padding: "10px 20px",
                        fontSize: "1rem",
                        cursor: agreed && fullscreenEnabled && timer === 0 ? "pointer" : "not-allowed",
                        backgroundColor: agreed && fullscreenEnabled && timer === 0 ? "#28A745" : "#ccc",
                        color: "black",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    Proceeding in {timer} sec
                </button>
            </div>
        </div>
    );
};

export default InstructionsPage;
