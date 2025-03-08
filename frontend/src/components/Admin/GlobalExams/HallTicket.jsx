/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, InputLabel, Typography } from "@mui/material";
import Service from "../../../service/Service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HallTicket = ({ examID, onBack }) => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
  const [existingBackgroundImage, setExistingBackgroundImage] = useState("");

  useEffect(() => {
    if (!examID) {
      toast.error("Invalid Exam ID");
      return;
    }

    const fetchHallTicketData = async () => {
      try {
        const response = await Service.get(`/api/get-hallticket/${examID}`);

        if (response.data) {
          const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;

          formik.setValues({
            staticPrefix: data.hallTicketIDFormat?.static || "",
            examName: data.examName || "",
            examDate: data.examDate || "",
            examTimings: data.examTimings || "",
          });

          if (data.backgroundImage) {
            setImagePreview(`http://localhost:5000${data.backgroundImage}`);
            setExistingBackgroundImage(data.backgroundImage); // For keeping track of already saved image
          }
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          toast.warn("No hall ticket data found for this exam.");
        } else {
          toast.error("Failed to fetch hall ticket data.");
        }
      }
    };

    fetchHallTicketData();
  }, [examID]);

  const formik = useFormik({
    initialValues: {
      staticPrefix: "",
      examName: "",
      examDate: "",
      examTimings: "",
      backgroundImage: null,
    },
    validationSchema: Yup.object({
      staticPrefix: Yup.string().required("Static Prefix is required"),
      examName: Yup.string().required("Exam Name is required"),
      examDate: Yup.string().required("Exam Date is required"),
      examTimings: Yup.string().required("Exam Timings are required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("examID", examID);
        formData.append("hallTicketIDFormat", JSON.stringify({ static: values.staticPrefix, range: "00001-99999" }));
        formData.append("examName", values.examName);
        formData.append("examDate", values.examDate);
        formData.append("examTimings", values.examTimings);

        if (values.backgroundImage) {
          formData.append("backgroundImage", values.backgroundImage);
        } else if (existingBackgroundImage) {
          // Send existing image path if user didn't change image
          formData.append("existingBackgroundImage", existingBackgroundImage);
        }

        await Service.post("/api/save-hallticket", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Hall Ticket Format Saved Successfully!");
        navigate("/admin/globalExams");
      } catch (error) {
        toast.error("Failed to save hall ticket format.");
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("backgroundImage", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <ToastContainer />
      <Button variant="outlined" onClick={onBack} style={{ color: "black", border: "2px solid black" }}>
        Back
      </Button>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "23px", borderRadius: "10px" }}>
        <form onSubmit={formik.handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Static Prefix */}
            <InputLabel style={{ fontSize: "15px", fontWeight: "bolder" }}>HallTicketId Format *</InputLabel>
            <TextField
              fullWidth
              name="staticPrefix"
              label="Static Hall Ticket Prefix"
              value={formik.values.staticPrefix}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.staticPrefix && Boolean(formik.errors.staticPrefix)}
              helperText={formik.touched.staticPrefix && formik.errors.staticPrefix}
            />
            <TextField
              fullWidth
              disabled
              label="Static Hall Ticket Range"
              value="00001-99999"
            />

            {/* Background Image */}
            <InputLabel style={{ fontSize: "15px", fontWeight: "bolder" }}>Hallticket Background Image (Only PNG)</InputLabel>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imagePreview && (
              <>
                <Typography variant="body2">Image Preview:</Typography>
                <img
                  src={imagePreview}
                  alt="Background Preview"
                  style={{ width: "200px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                />
              </>
            )}

            {/* Exam Name */}
            <InputLabel style={{ fontSize: "15px", fontWeight: "bolder" }}>Exam Name *</InputLabel>
            <TextField
              fullWidth
              name="examName"
              value={formik.values.examName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.examName && Boolean(formik.errors.examName)}
              helperText={formik.touched.examName && formik.errors.examName}
            />

            {/* Exam Date */}
            <InputLabel style={{ fontSize: "15px", fontWeight: "bolder" }}>Exam Date *</InputLabel>
            <TextField
              fullWidth
              name="examDate"
              value={formik.values.examDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.examDate && Boolean(formik.errors.examDate)}
              helperText={formik.touched.examDate && formik.errors.examDate}
            />

            {/* Exam Timings */}
            <InputLabel style={{ fontSize: "15px", fontWeight: "bolder" }}>Exam Timings *</InputLabel>
            <TextField
              fullWidth
              name="examTimings"
              value={formik.values.examTimings}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.examTimings && Boolean(formik.errors.examTimings)}
              helperText={formik.touched.examTimings && formik.errors.examTimings}
            />

            {/* Save Button */}
            <Button
              sx={{ width: "30%", margin: "0 auto", marginTop: "20px" }}
              variant="outlined"
              color="black"
              type="submit"
            >
              Save Hall Ticket Format
            </Button>
          </Box>
        </form>
      </div>
    </>
  );
};

export default HallTicket;

// import React, { useState, useEffect } from "react";
// import {useNavigate} from 'react-router-dom';

// import { TextField, Button, Box, Paper, InputLabel, Typography } from "@mui/material";
// import Service from '../../../service/Service';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const HallTicket = ({ examID, onBack }) => {
//   const navigate = useNavigate();
//   const [hallTicketFormat, setHallTicketFormat] = useState({
//     examID: examID,
//     hallTicketIDFormat: { static: "QTGENST", range: "00001-99999" },
//     backgroundImage: "",
//     examName: "",
//     examDate: "",
//     examTimings: ""
//   });

//   const [imagePreview, setImagePreview] = useState("");

//   useEffect(() => {
//     if (!examID) {
//       toast.error("Invalid Exam ID");
//       return;
//     }

//     const fetchHallTicketData = async () => {
//       try {
//         const response = await Service.get(`/api/get-hallticket/${examID}`);

//         if (response.data) {
//           // Check if the data is actually valid JSON if needed.
//           if (typeof response.data === 'string') {
//             try {
//               const parsedData = JSON.parse(response.data);
//               setHallTicketFormat(parsedData);

//               if (parsedData.backgroundImage) {
//                 setImagePreview(parsedData.backgroundImage);
//               }
//             } catch (parseError) {
//               toast.error("Invalid hall ticket format data.");
//               console.error("Failed to parse hall ticket data:", parseError);
//             }
//           } else {
//             setHallTicketFormat(response.data);

//             if (response.data.backgroundImage) {
//               setImagePreview(response.data.backgroundImage);
//             }
//           }
//         } else {
//           toast.warn("No hall ticket data found.");
//         }
//       } catch (error) {
//         if (error?.response?.status === 404) {
//           toast.error("No hall ticket data found for this exam.");
//         } else {
//           toast.error("Failed to fetch hall ticket data. Please try again later.");
//         }
//         console.error("Error fetching hall ticket data:", error);
//       }
//     };

//     fetchHallTicketData();
//   }, [examID]);


//   const handleChange = (e) => {
//     setHallTicketFormat({ ...hallTicketFormat, [e.target.name]: e.target.value });
//   };

//   const handleStaticChange = (e) => {
//     setHallTicketFormat({
//       ...hallTicketFormat,
//       hallTicketIDFormat: { ...hallTicketFormat.hallTicketIDFormat, static: e.target.value }
//     });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setHallTicketFormat({ ...hallTicketFormat, backgroundImage: file });

//     // Preview the selected image
//     const reader = new FileReader();
//     reader.onloadend = () => {

//       setImagePreview(reader.result);
//     };
//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("examID", examID);
//       formData.append("hallTicketIDFormat", JSON.stringify(hallTicketFormat.hallTicketIDFormat));
//       formData.append("examName", hallTicketFormat.examName);
//       formData.append("examDate", hallTicketFormat.examDate);
//       formData.append("examTimings", hallTicketFormat.examTimings);

//       if (hallTicketFormat.backgroundImage instanceof File) {
//         formData.append("backgroundImage", hallTicketFormat.backgroundImage);
//       }

//       const response = await Service.post("/api/save-hallticket", formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       toast.success("Hall Ticket Format Saved Successfully!");
//       navigate('/admin/globalExams');
//       console.log("Save response:", response);
//     } catch (error) {
//       toast.error("Failed to save hall ticket format.");
//       console.error("Error saving hall ticket format:", error);
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <Button variant="outlined" onClick={onBack} style={{ color: "black", border: "2px solid black" }}>
//         Back
//       </Button>
//       <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "23px", borderRadius: "10px" }}>
//         <Box display="flex" flexDirection="column" gap={2}>
//           <form onSubmit={handleSave}>
//             <InputLabel style={{ fontSize: "15px", fontWeight: "bolder" }}>HallTicketId Format *</InputLabel>
//             <div style={{ display: "flex", gap: "20px", marginTop:"10px", marginBottom:"20px" }}>
//               <TextField sx={{ flex: 2 }} required label="Static Hall Ticket Prefix" name="static" value={hallTicketFormat.hallTicketIDFormat.static} onChange={handleStaticChange} />
//               <TextField sx={{ flex: 2 }} required label="Static Hall Ticket Range" disabled value={hallTicketFormat.hallTicketIDFormat.range} fullWidth />
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop:"10px", marginBottom:"20px" }}>
//               <InputLabel style={{ fontSize: "15px", fontWeight: "bolder" }}>Hallticket Background Image (Only PNG) </InputLabel>
//               <input type="file" accept="image/*" onChange={handleFileChange} />
//               {imagePreview && (
//                 <>
//                   <Typography variant="body2">Image Preview:</Typography>
//                   <img src={imagePreview.startsWith("data") ? imagePreview : `http://localhost:5000${imagePreview}`} alt="Background Preview" style={{ width: "200px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
//                 </>
//               )}
//             </div>
//             <InputLabel style={{ fontSize: "15px", fontWeight: "bolder" }}>Exam Name *</InputLabel>
//             <TextField required name="examName" value={hallTicketFormat.examName} onChange={handleChange} fullWidth style={{marginTop:"10px", marginBottom:"20px"}}/>
//             <InputLabel style={{ fontSize: "15px", fontWeight: "bolder" }}>Exam Date *</InputLabel>
//             <TextField  required name="examDate" value={hallTicketFormat.examDate} onChange={handleChange} fullWidth style={{marginTop:"10px", marginBottom:"20px"}} />
//             <InputLabel style={{ fontSize: "15px", fontWeight: "bolder" }}>Exam Timings *</InputLabel>
//             <TextField  required name="examTimings" value={hallTicketFormat.examTimings} onChange={handleChange} fullWidth style={{marginTop:"10px", marginBottom:"20px"}}/>
//             <Button sx={{ width: "30%", margin: "0 auto", marginTop: "20px" }}
//               variant="outlined"
//               color="black"
//               type="submit"
//             >
//               Save Hall Ticket Format
//             </Button>
//           </form>
//         </Box>
//       </div>
//     </>
//   );
// };

// export default HallTicket;
