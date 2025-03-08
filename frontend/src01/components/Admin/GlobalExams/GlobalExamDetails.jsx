/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import { Box, Menu, MenuItem, Typography, Table, TableBody, TableCell, TableRow, Stepper, Step, StepLabel, Button } from "@mui/material";
import Service from "../../../service/Service";
import { Audio } from 'react-loader-spinner'


export default function ExamDetailsWithStatus({ examID, onBack }) {


  console.log("Global Exam Details ExamID :", examID);

  const [examData, setExamData] = useState(null);
  const [error, setError] = useState(null);
  const [anchorElSub, setAnchorElSub] = useState(null);
  const [currentExam, setCurrentExam] = useState(null);


  useEffect(() => {
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
    fetchExamDetails();
  }, [examID]);


  const steps = ["Creation", "Registration", "Ongoing", "Closed"];
  const currentStep = steps.indexOf(
    examData && examData.examStatus.charAt(0).toUpperCase() + examData.examStatus.slice(1)
  );

  if (error) {
    return <Typography color="error">{error}</Typography>;
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
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
                <TableCell style={{ fontWeight: "bold" }}>Registration Link</TableCell>
                <TableCell>
                  <a
                    href={`http://194.238.17.64:5173/register?TId=${examData.examToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    Exam Registration Link
                  </a>
                </TableCell>
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
                <TableCell style={{ fontWeight: "bold" }}>Exam Date & Time</TableCell>
                <TableCell>
                  {new Date(examData.examStartTime)
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
