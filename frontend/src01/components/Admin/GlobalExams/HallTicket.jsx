/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Paper, InputLabel, Typography } from "@mui/material";
import Service from '../../../service/Service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HallTicket = ({ examID, onBack }) => {

  const [hallTicketFormat, setHallTicketFormat] = useState({
    examID: examID,
    hallTicketIDFormat: { static: "QTGENST", range: "00001-99999" },
    backgroundImage: "",
    examName: "",
    examDate: "",
    examTimings: ""
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchHallTicketData = async () => {
      try {
        const response = await Service.get(`/api/get-hallticket/${examID}`);
        if (response.data) {
          setHallTicketFormat(response.data);
          if (response.data.backgroundImage) {
            console.log(response.data.backgroundImage);
            setImagePreview(response.data.backgroundImage);
          }
        }
      } catch (error) {
        toast.error("Failed to fetch hall ticket data.");
        console.error("Error fetching hall ticket data:", error);
      }
    };

    fetchHallTicketData();
  }, [examID]);

  const handleChange = (e) => {
    setHallTicketFormat({ ...hallTicketFormat, [e.target.name]: e.target.value });
  };

  const handleStaticChange = (e) => {
    setHallTicketFormat({
      ...hallTicketFormat,
      hallTicketIDFormat: { ...hallTicketFormat.hallTicketIDFormat, static: e.target.value }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setHallTicketFormat({ ...hallTicketFormat, backgroundImage: file });

    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {

      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("examID", examID);
      formData.append("hallTicketIDFormat", JSON.stringify(hallTicketFormat.hallTicketIDFormat));
      formData.append("examName", hallTicketFormat.examName);
      formData.append("examDate", hallTicketFormat.examDate);
      formData.append("examTimings", hallTicketFormat.examTimings);

      if (hallTicketFormat.backgroundImage instanceof File) {
        formData.append("backgroundImage", hallTicketFormat.backgroundImage);
      }

      const response = await Service.post("/api/save-hallticket", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Hall Ticket Format Saved Successfully!");
      console.log("Save response:", response);
    } catch (error) {
      toast.error("Failed to save hall ticket format.");
      console.error("Error saving hall ticket format:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Button variant="outlined" onClick={onBack} style={{ color: "black", border: "2px solid black" }}>
        Back
      </Button>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "23px", borderRadius: "10px" }}>
        <Box display="flex" flexDirection="column" gap={2}>
            <InputLabel style={{fontSize:"15px", fontWeight:"bolder"}}>HallTicketId Format</InputLabel>
          <div style={{ display: "flex", gap: "20px" }}>
            <TextField sx={{ flex: 2 }} label="Static Hall Ticket Prefix" name="static" value={hallTicketFormat.hallTicketIDFormat.static} onChange={handleStaticChange} />
            <TextField sx={{ flex: 2 }} label="Static Hall Ticket Range" disabled value={hallTicketFormat.hallTicketIDFormat.range} fullWidth />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <InputLabel style={{fontSize:"15px", fontWeight:"bolder"}}>Hallticket Background Image</InputLabel>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imagePreview && (
              <>
                <Typography variant="body2">Image Preview:</Typography>
                <img src={imagePreview.startsWith("data") ? imagePreview : `http://localhost:5000${imagePreview}`} alt="Background Preview" style={{ width: "200px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
              </>
            )}
          </div>
          <InputLabel style={{fontSize:"15px", fontWeight:"bolder"}}>Exam Name</InputLabel>
          <TextField label="Exam Name" name="examName" value={hallTicketFormat.examName} onChange={handleChange} fullWidth />
          <InputLabel style={{fontSize:"15px", fontWeight:"bolder"}}>Exam Date</InputLabel>
          <TextField label="Exam Date" name="examDate" value={hallTicketFormat.examDate} onChange={handleChange} fullWidth />
          <InputLabel style={{fontSize:"15px", fontWeight:"bolder"}}>Exam Timings</InputLabel>
          <TextField label="Exam Timings" name="examTimings" value={hallTicketFormat.examTimings} onChange={handleChange} fullWidth />
          <Button sx={{ width: "30%", margin: "0 auto", marginTop:"20px" }}
            variant="outlined"
            color="black"
            onClick={handleSave}>
            Save Hall Ticket Format
          </Button>
        </Box>
      </div>
    </>
  );
};

export default HallTicket;
