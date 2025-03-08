/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Paper, Box, TextField, Button, InputLabel, Chip } from '@mui/material';
import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import Service from '../../../service/Service';
const initialMailingFormat = {
  subject: '',
  content: '',
};

const variableTags = [
  'student-name', 'offline-location', 'exam-link', 'qt-site-url', 'rs-site-url', 'qt-logo-image', 'rs-logo-image', 'qt-social_media-links', 'rs-social_media-links'
];




export default function Mailing({ examID, onBack }) {

  console.log(examID);
  const [mailingFormat, setMailingFormat] = useState(initialMailingFormat);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMailingFormat((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setMailingFormat((prev) => ({ ...prev, content: value }));
  };

  useEffect(() => {
    const fetchMainingData = async () => {
      try {
        const response = await Service.get(`/api/get-mailingFormat/${examID}`);
        console.log("Fetched data:", response.data); // Debugging
        if (response.data) {
          setMailingFormat((prev) => ({
            subject: response.data.subject || prev.subject,
            content: response.data.content || prev.content,
          }));
        }
      } catch (error) {
        toast.error("Failed to fetch hall ticket data.");
        console.error("Error fetching hall ticket data:", error);
      }
    };

    fetchMainingData();
  }, [examID]);


  const handleTagClick = (tag) => {
    setMailingFormat((prev) => ({ ...prev, content: prev.content + `{{${tag}}}` }));
  };


  const handleSave = async () => {
    console.log(mailingFormat, examID);
    const payload = { ...mailingFormat, examID };
    const send = await Service.post("/api/save-mailingFormat", payload);
    console.log(send);
  };

  return (
    <>
      <Button variant="outlined" onClick={onBack} style={{ color: "black", border: "2px solid black" }}>
        Back
      </Button>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding:"23px", borderRadius:"10px" }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <InputLabel style={{fontSize:"15px", fontWeight:"bolder"}}>Subject</InputLabel>
          <TextField
            label="Subject"
            name="subject"
            value={mailingFormat.subject}
            onChange={handleChange}
            fullWidth
          />
          <InputLabel style={{fontSize:"15px", fontWeight:"bolder"}}>Content</InputLabel>
          <ReactQuill
            value={mailingFormat.content}
            onChange={handleContentChange}
            theme="snow"
          />
          <Box>
            <InputLabel style={{fontSize:"15px", fontWeight:"bolder"}}>Available Variables:</InputLabel>
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              {variableTags.map((tag) => (
                <Chip key={tag} label={`{{${tag}}}`} variant="outlined" onClick={() => handleTagClick(tag)} />
              ))}
            </Box>
          </Box>
          <Button
            sx={{width:"30%", margin:"0 auto"}}
            variant="outlined"
            color="black"
            onClick={handleSave}
          >
            Save Mailing Format
          </Button>
        </Box>
      </div>
    </>
  );
}
