/* eslint-disable no-unused-vars */

import zIndex from "@mui/material/styles/zIndex";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Home01 from '../assets/Home02.png'
import HomeFeature01 from '../assets/HomeFeature01.png'
import HomeFeature02 from '../assets/HomeFeature02.png'
import HomeFeature03 from '../assets/HomeFeature03.jpg'
import HomeFeature04 from '../assets/HomeFeature04.png'
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import './Home.css'
import { Button } from "@mui/material";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';


const HomePage = () => {

  const navigate = useNavigate();
  useEffect(() => {

    const verified = Cookies.get('verified') === 'true';



    if (verified) {
      const internID = Cookies.get('internID');
      if (internID) {
        toast.success('Intern Session Exists!')
        navigate('/candidate/dashboard');
        return;
      }

      const SAid = Cookies.get('SAid');
      if (SAid) {
        navigate('/admin/dashboard');
        return;
      }
    }
  }, [navigate]);


  const [isMobile, setIsMobile] = useState(false);
  const [hover1, setHover1] = useState(false);
  const [hover2, setHover2] = useState(false);
  const [hover3, setHover3] = useState(false);


  // Detect if the screen is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1100); // Adjust breakpoint as needed
    };

    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize); // Add resize listener
    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  return (
    <div style={{ minHeight: "90vh", marginTop: "2vh", background: "black", display: "flex", flexDirection: "column", alignItems: "center", }}>

      <main className="split-text-container">
        <div style={{
          flex: 2,
          height: "80vh",
          margin: "0 auto",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <div style={{
            flex: 2,
            margin: "0 auto",
            // border: "2px solid white",
            marginTop: isMobile ? "14vh" : "20vh",
            marginLeft: isMobile ? "0vw" : "5vw",
          }}>
            <div className="dropping-texts">
              <div>CREATE</div>
              <div>CONFIGURE</div>
              <div>SHARE</div>
            </div>
            <span className="text-part left exams-text">EXAMS</span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: isMobile ? "1vh" : "3vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <Button className="text-part left read-more">
                Read More <FontAwesomeIcon icon={faAngleRight} style={{ marginLeft: "5px" }} />
              </Button>

              <Button
                className="text-part left contact-us"
                color="white"
              >
                Contact Us <FontAwesomeIcon icon={faAngleRight} style={{ marginLeft: "5px" }} />
              </Button>
            </div>
          </div>
        </div>

        <div style={{
          flex: 2,
          height: isMobile ? "40px" : "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <img className="text-part right" src={Home01} alt="" style={{ height: "60vh", objectFit: "contain", marginBottom: isMobile ? "100px" : "" }} />
        </div>

      </main>

      {!isMobile && (
        <>
          <div style={{ marginBottom: "20vh", display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "10vw", paddingRight: "15vw", backgroundColor: "black", color: "white" }}>
            <div style={{ maxWidth: "50%", textAlign: "left" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "32px", color: "white", fontFamily: "New Century Schoolbook, TeX Gyre Schola, serif" }}>Write exam from anywhere</h2>
              <p style={{ lineHeight: "1.6", fontFamily: "Arial Narrow, sans-serif", color: "#999", fontSize: "18px" }}>
                Empower your candidates with the freedom to write exams from any location — whether at home, in the office, or on the move. Our platform supports seamless access across devices, including desktops, laptops, tablets, and smartphones. With secure browser controls, real-time monitoring, and compatibility across major operating systems, remote exams have never been this reliable and convenient.</p>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "3vh" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <Button
                    color="white"
                    style={{ marginRight: "40px" }}
                  >
                    Read More <FontAwesomeIcon icon={faAngleRight} style={{ marginLeft: "5px" }} />
                  </Button>
                </div>
              </div>
            </div>
            <img src={HomeFeature01} alt="" style={{ height: "55vh", width: "55vh", background: "white", borderRadius: "40%" }} />

          </div>


          <div style={{ marginBottom: "20vh", display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "10vw", paddingRight: "12vw", backgroundColor: "black", color: "white" }}>
            <img src={HomeFeature04} alt="" style={{ height: "55vh", width: "55vh", background: "white", borderRadius: "40%" }} />

            <div style={{ maxWidth: "50%", textAlign: "left" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "26px", color: "white", fontFamily: "New Century Schoolbook, TeX Gyre Schola, serif" }}>Seamless Communication via Email & Live Chat</h2>
              <p style={{ lineHeight: "1.6", fontFamily: "Arial Narrow, sans-serif", color: "#999", fontSize: "18px" }}>
                Maintain clear and efficient communication throughout the exam lifecycle with integrated email and live chat tools. Send automated exam notifications, reminders, and result updates directly from the platform. During live exams, candidates can easily reach support teams through real-time chat, ensuring a smooth and stress-free exam experience.          </p>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "3vh" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <Button
                    color="white"
                    style={{ marginRight: "40px" }}
                  >
                    Read More <FontAwesomeIcon icon={faAngleRight} style={{ marginLeft: "5px" }} />
                  </Button>
                </div>
              </div>
            </div>

          </div>

          <div style={{ marginBottom: "20vh", display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "10vw", paddingRight: "15vw", backgroundColor: "black", color: "white" }}>
            <div style={{ maxWidth: "50%", textAlign: "left" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "32px", color: "white", fontFamily: "New Century Schoolbook, TeX Gyre Schola, serif" }}>Advanced Proctoring</h2>
              <p style={{ lineHeight: "1.6", fontFamily: "Arial Narrow, sans-serif", color: "#999", fontSize: "18px" }}>
                Ensure exam integrity with cutting-edge AI proctoring technology that actively detects and prevents cheating in real-time. The system intelligently monitors candidates, identifying suspicious activities such as multiple people in view, switching between windows, or unusual movements all without manual intervention.</p>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "3vh" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <Button
                    color="white"
                    style={{ marginRight: "40px" }}
                  >
                    Read More <FontAwesomeIcon icon={faAngleRight} style={{ marginLeft: "5px" }} />
                  </Button>
                </div>
              </div>
            </div>
            <img
              src={HomeFeature02}
              alt="Feature Illustration"
              style={{
                height: "55vh",
                width: "55vh",
                backgroundColor: "white",
                backgroundSize: "60% 40%",
                borderRadius: "40%"
              }}
            />

          </div>

        </>
      )}

      {isMobile && (
        <>
          <div style={{ marginBottom: "10vh", alignItems: "center", justifyContent: "space-between", paddingLeft: "5vw", paddingRight: "5vw", backgroundColor: "black", color: "white" }}>
            <div>
              <h2 style={{ fontWeight: "bold", fontSize: "32px", color: "white", fontFamily: "New Century Schoolbook, TeX Gyre Schola, serif" }}>Write exam from anywhere</h2>
              <p style={{ lineHeight: "1.6", fontFamily: "Arial Narrow, sans-serif", color: "#999", fontSize: "18px" }}>
                Empower your candidates with the freedom to write exams from any location — whether at home, in the office, or on the move. Our platform supports seamless access across devices, including desktops, laptops, tablets, and smartphones. With secure browser controls, real-time monitoring, and compatibility across major operating systems, remote exams have never been this reliable and convenient.</p>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "3vh" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <Button
                    color="white"
                    style={{ marginRight: "40px" }}
                  >
                    Read More <FontAwesomeIcon icon={faAngleRight} style={{ marginLeft: "5px" }} />
                  </Button>
                </div>
              </div>
            </div>
          </div>


          <div style={{ marginBottom: "10vh", alignItems: "center", justifyContent: "space-between", paddingLeft: "5vw", paddingRight: "5vw", backgroundColor: "black", color: "white" }}>
            <div>
              <h2 style={{ fontWeight: "bold", fontSize: "26px", color: "white", fontFamily: "New Century Schoolbook, TeX Gyre Schola, serif" }}>Seamless Communication via Email & Live Chat</h2>
              <p style={{ lineHeight: "1.6", fontFamily: "Arial Narrow, sans-serif", color: "#999", fontSize: "18px" }}>
                Maintain clear and efficient communication throughout the exam lifecycle with integrated email and live chat tools. Send automated exam notifications, reminders, and result updates directly from the platform. During live exams, candidates can easily reach support teams through real-time chat, ensuring a smooth and stress-free exam experience.          </p>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "3vh" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <Button
                    color="white"
                    style={{ marginRight: "40px" }}
                  >
                    Read More <FontAwesomeIcon icon={faAngleRight} style={{ marginLeft: "5px" }} />
                  </Button>
                </div>
              </div>
            </div>

          </div>

          <div style={{ marginBottom: "10vh", alignItems: "center", justifyContent: "space-between", paddingLeft: "5vw", paddingRight: "5vw", backgroundColor: "black", color: "white" }}>
            <div>
              <h2 style={{ fontWeight: "bold", fontSize: "32px", color: "white", fontFamily: "New Century Schoolbook, TeX Gyre Schola, serif" }}>Advanced Proctoring</h2>
              <p style={{ lineHeight: "1.6", fontFamily: "Arial Narrow, sans-serif", color: "#999", fontSize: "18px" }}>
                Ensure exam integrity with cutting-edge AI proctoring technology that actively detects and prevents cheating in real-time. The system intelligently monitors candidates, identifying suspicious activities such as multiple people in view, switching between windows, or unusual movements all without manual intervention.</p>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "3vh" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <Button
                    color="white"
                    style={{ marginRight: "40px" }}
                  >
                    Read More <FontAwesomeIcon icon={faAngleRight} style={{ marginLeft: "5px" }} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default HomePage;
