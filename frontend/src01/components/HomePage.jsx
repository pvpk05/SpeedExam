/* eslint-disable no-unused-vars */

import React from "react";

const HomePage = () => {
  const styles = {
    container: {
      minHeight: "90vh",
      marginTop:"2vh",
      backgroundColor: "#f9fafb",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      width: "100%",
      padding: "16px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    logo: {
      display: "flex",
      alignItems: "center",
    },
    logoTextMain: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#2563eb",
    },
    logoTextSub: {
      fontSize: "20px",
      marginLeft: "5px",
      fontWeight: "600",
      color: "#4b5563",
    },
    nav: {
      display: "flex",
      gap: "32px",
      color: "#4b5563",
    },
    navLink: {
      textDecoration: "none",
      color: "inherit",
      cursor: "pointer",
    },
    navLinkHover: {
      color: "#2563eb",
    },
    main: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "80px",
      textAlign: "center",
    },
    circleContainer: {
      position: "relative",
    },
    largeCircle: {
      width: "384px",
      height: "384px",
      backgroundColor: "#bfdbfe",
      borderRadius: "50%",
      opacity: 0.5,
      position: "absolute",
      zIndex: 0,
    },
    smallCircle: {
      width: "288px",
      height: "288px",
      backgroundColor: "#d1d5db",
      borderRadius: "50%",
      position: "absolute",
    },
    headline: {
      position: "relative",
      fontSize: "44px",
      fontWeight: "bolder",
      color: "#1f2937",
      marginTop: "48px",
    },
    highlight: {
      color: "#2563eb",
    },
    buttons: {
      marginTop: "32px",
      display: "flex",
      gap: "16px",
    },
    buttonPrimary: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      padding: "8px 24px",
      borderRadius: "9999px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
    },
    buttonPrimaryHover: {
      backgroundColor: "#1d4ed8",
    },
    buttonSecondary: {
      backgroundColor: "#e5e7eb",
      color: "#374151",
      padding: "8px 24px",
      borderRadius: "9999px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
    },
    buttonSecondaryHover: {
      backgroundColor: "#d1d5db",
    },
  };

  const features = [
    { Title: "Easy Registration", content: "Register and manage users effortlessly with our streamlined process." },
    { Title: "Exam Scheduling", content: "Schedule exams with an intuitive calendar-based interface." },
    { Title: "Real-Time Results", content: " Get results instantly after the exam is completed." },
    { Title: "Exam Scheduling", content: "Schedule exams with an intuitive calendar-based interface." },
    { Title: "Exam Scheduling", content: "Schedule exams with an intuitive calendar-based interface." },
    { Title: "Exam Scheduling", content: "Schedule exams with an intuitive calendar-based interface." },
    { Title: "Exam Scheduling", content: "Schedule exams with an intuitive calendar-based interface." },
    { Title: "Exam Scheduling", content: "Schedule exams with an intuitive calendar-based interface." },
    
]

  return (
    <div style={styles.container}>
      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.circleContainer}>
          <h1 style={{fontFamily:"Helvetica, sans-serif", fontWeight:"bolder"}}> 
          Build, customize, and share your <span style={styles.highlight}>EXAMS</span> effortlessly.
          </h1>
        </div>

        {/* Buttons */}
        <div style={styles.buttons}>
          <button
            style={styles.buttonPrimary}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonPrimaryHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.buttonPrimary.backgroundColor)}
          >
            Read more
          </button>
          <button
            style={styles.buttonSecondary}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonSecondaryHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.buttonSecondary.backgroundColor)}
          >
            Contact us
          </button>
        </div>
      </main>
      <div className="row" style={{marginTop:"10vh", padding:"80px"}}>
            {features.map((item, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card shadow-sm" style={{height:"200px", width:"420px", alignItems:"center", justifyContent:"center"}}>
                  <div style={{padding:"40px"}}>
                    <h5 className="fw-bold" style={{color:"#2563eb"}}>{item.Title}</h5>
                    <p>{item.content}</p>
                  </div>
                </div>
              </div>
            ))}

          </div>

    </div>
  );
};

export default HomePage;
