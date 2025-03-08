/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import { Box, Menu, MenuItem, Typography, Table, TableBody, TableCell, TableRow, Stepper, Step, StepLabel, Button } from "@mui/material";
import Service from "../../../service/Service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function ExamSettings({ examID, onBack }) {
  const [examData, setExamData] = useState(null);
  const [error, setError] = useState(null);
  const [anchorElSub, setAnchorElSub] = useState(null);
  const [currentExam, setCurrentExam] = useState(null);


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


  const handleClose = () => {
    setCurrentExam(null);
};

  const handleStatusChange = (newStatus) => {
    if (examID && newStatus) {
      updateExamStatus(examID, newStatus); // Call the function to update status
    }
    handleClose();
  };

  const updateExamStatus = async (examID, newStatus) => {
    try {
      const response = await Service.put("/updateExamStatus", {
        examID,
        newStatus,
      });

      if (response.status === 200) {
        toast.success(response.data.message)
        fetchExamDetails();
      } else {
        console.error(response.data.message);
        toast.error("Failed to update exam status");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the exam status");
    }
  };

  const steps = ["Creation", "Registration", "Ongoing", "Closed"];
  const currentStep = steps.indexOf(
    examData && examData.examStatus.charAt(0).toUpperCase() + examData.examStatus.slice(1)
  );

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!examData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Button variant="outlined" onClick={onBack} style={{ marginBottom: "20px", color: "black", border: "2px solid black" }}>
        Back
      </Button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
        <Box sx={{ flex: 1, p: 3 }}>
            <Button
              onClick={(event) => setAnchorElSub(event.currentTarget)}
              style={{ textTransform: "none", textDecoration: "none", color: "black" }}
            >
              Update Status
            </Button>
            <Menu
              anchorEl={anchorElSub}
              open={Boolean(anchorElSub)}
              onClose={() => setAnchorElSub(null)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleStatusChange("registration");
                  setAnchorElSub(null);
                }}
              >
                Open Registrations
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleStatusChange("ongoing");
                  setAnchorElSub(null);
                }}
              >
                Start Exam
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleStatusChange("closed");
                  setAnchorElSub(null);
                }}
              >
                Close Exam
              </MenuItem>
            </Menu>

        </Box>


        <Box
          sx={{
            width: "300px",
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }} style={{ fontWeight: "bolder", fontSize: "16px" }}>
            Current Exam Status
          </Typography>
          <Stepper
            style={{ height: "50vh", marginLeft: "30px" }}
            activeStep={currentStep}
            orientation="vertical"
            sx={{
              "& .MuiStepConnector-line": {
                minHeight: "75px", // Ensures the line between steps has enough height
                borderLeftWidth: 2, // Line thickness
                borderColor: "#bdbdbd", // Line color
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
      </div>
    </>
  );
}




// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */

// import React, { useEffect, useState } from "react";
// import { Box, Menu, MenuItem, Typography, Table, TableBody, TableCell, TableRow, Stepper, Step, StepLabel, Button } from "@mui/material";
// import Service from "../../../service/Service";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// export default function ExamSettings({ examID, onBack }) {
//   const [examData, setExamData] = useState(null);
//   const [error, setError] = useState(null);
//   const [anchorElSub, setAnchorElSub] = useState(null);
//   const [currentExam, setCurrentExam] = useState(null);


//   async function fetchExamDetails() {
//     try {
//       const response = await Service.get(`/GlobalExamDetailsByID?ID=${examID}`);

//       if (response.status == 200) {
//         console.log("result :", response.data.result);
//         setExamData(response.data.result);
//       } else {
//         setError(response.data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch exam details.");
//     }
//   }


//   useEffect(() => {
//     fetchExamDetails();
//   }, [examID]);


//   const handleClose = () => {
//     setCurrentExam(null);
//   };

//   const handleStatusChange = (newStatus) => {
//     if (examID && newStatus) {
//       updateExamStatus(examID, newStatus); // Call the function to update status
//     }
//     handleClose();
//   };

//   const updateExamStatus = async (examID, newStatus) => {
//     try {
//       const response = await Service.put("/updateExamStatus", {
//         examID,
//         newStatus,
//       });

//       if (response.status === 200) {
//         newStatus === 'registration' && toast.success("registrations opened");
//         newStatus === 'ongoing' && (toast.warning("Registrations Stopped !!!"), toast.success("Exam Started"));
//         newStatus === 'closed' && toast.success("Exam closed")
         
//         fetchExamDetails();
//       } else {
//         console.error(response.data.message);
//         toast.error("Failed to update exam status");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("An error occurred while updating the exam status");
//     }
//   };

//   const steps = ["Creation", "Registration", "Ongoing", "Closed"];
//   const currentStep = steps.indexOf(
//     examData && examData.examStatus.charAt(0).toUpperCase() + examData.examStatus.slice(1)
//   );

//   if (error) {
//     return <Typography color="error">{error}</Typography>;
//   }

//   if (!examData) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <>
//       <Button variant="outlined" onClick={onBack} style={{ marginBottom: "20px", color: "black", border: "2px solid black" }}>
//         Back
//       </Button>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
//         <Box sx={{ flex: 1, p: 3 }}>
//           <Button
//             onClick={() => {
//               handleStatusChange("registration");
//               setAnchorElSub(null);
//             }}
//           >
//             Open Registrations
//           </Button>

//           <Button
//             onClick={() => {
//               handleStatusChange("ongoing");
//               setAnchorElSub(null);
//             }}
//           >
//             Start Exam
//           </Button>
//           <Button
//             onClick={() => {
//               handleStatusChange("closed");
//               setAnchorElSub(null);
//             }}
//           >
//             Close Exam
//           </Button>
//         </Box>


//         <Box
//           sx={{
//             width: "300px",
//             p: 3,
//           }}
//         >
//           <Typography variant="h6" sx={{ mb: 2 }} style={{ fontWeight: "bolder", fontSize: "16px" }}>
//             Current Exam Status
//           </Typography>
//           <Stepper
//             style={{ height: "50vh", marginLeft: "30px" }}
//             activeStep={currentStep}
//             orientation="vertical"
//             sx={{
//               "& .MuiStepConnector-line": {
//                 minHeight: "75px", // Ensures the line between steps has enough height
//                 borderLeftWidth: 2, // Line thickness
//                 borderColor: "#bdbdbd", // Line color
//               }
//             }}
//           >
//             {steps.map((label, index) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>

//         </Box>
//       </div>
//     </>
//   );
// }
