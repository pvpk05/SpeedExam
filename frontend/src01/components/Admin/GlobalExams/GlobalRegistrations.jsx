/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TableRow,
  TableHead,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { toast } from "react-toastify";
import Service from "../../../service/Service";

export default function GlobalRegistrations({ examID, onBack }) {
  const [examData, setExamData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examToken, setExamToken] = useState("");
  const [hallTicketFormat, setHallTicketFormat] = useState(null);

  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const registrationsPerPage = 10;

  useEffect(() => {
    fetchExamDetails();
  }, []);

  const fetchExamDetails = async () => {
    try {
      const response = await Service.get(`/GlobalExamDetailsByID?ID=${examID}`);
      if (response.status === 200) {
        setExamData(response.data.result);
        setExamToken(response.data.result.examToken);
        setHallTicketFormat(response.data.result.HallTicketFormat?.hallTicketIDFormat);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch exam details");
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await Service.get(`/api/registrations?token=${examToken}`);
      if (response.data.success) {
        setRegistrations(response.data.data);
      } else {
        toast.error("Failed to fetch registrations");
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Error fetching registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examToken) {
      fetchRegistrations();
    }
  }, [examToken]);

  const handleGenerateHallTickets = async () => {
    try {
      const response = await Service.post("/generateHallTickets", {
        examToken,
        hallTicketIDFormat: hallTicketFormat,
      });

      if (response.data.success) {
        toast.success("Hall tickets generated successfully!");
        fetchRegistrations();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleSendHallTickets = async () => {
    if (selectedCandidates.length === 0) {
      toast.warning("Please select at least one candidate");
      return;
    }

    const selectedHallTicketIDs = registrations
      .filter((reg) => selectedCandidates.includes(reg.ID))
      .map((reg) => reg.hallTicketID);

    try {
      const response = await Service.post("/sendHallTicketEmails", {
        hallTicketIDs: selectedHallTicketIDs,
        examToken,
      });

      if (response.data.success) {
        toast.success("Hall tickets sent successfully!");
        setSelectedCandidates([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send hall tickets");
    }
  };

  const handleCheckboxChange = (candidateID) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateID)
        ? prev.filter((id) => id !== candidateID)
        : [...prev, candidateID]
    );
  };

  const handleSelectAllChange = () => {
    const idsOnCurrentPage = currentRegistrations
      .filter((reg) => reg.hallTicketID)
      .map((reg) => reg.ID);

    const allSelectedOnPage = idsOnCurrentPage.every((id) => selectedCandidates.includes(id));

    setSelectedCandidates((prev) => {
      if (allSelectedOnPage) {
        return prev.filter((id) => !idsOnCurrentPage.includes(id));
      } else {
        const newSelection = idsOnCurrentPage.filter((id) => !prev.includes(id));
        return [...prev, ...newSelection];
      }
    });
  };

  const indexOfLastRegistration = currentPage * registrationsPerPage;
  const indexOfFirstRegistration = indexOfLastRegistration - registrationsPerPage;
  const currentRegistrations = registrations.slice(
    indexOfFirstRegistration,
    indexOfLastRegistration
  );

  const totalPages = Math.ceil(registrations.length / registrationsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Button variant="outlined" onClick={onBack} style={{ marginBottom: "20px", color: "black", border: "2px solid black" }}>
        Back
      </Button>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={handleGenerateHallTickets}
            style={{ marginRight: "10px" }}
          >
            Generate Hall Ticket IDs
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSendHallTickets}
            disabled={selectedCandidates.length === 0}
          >
            Send Hall Tickets
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox onChange={handleSelectAllChange} />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Hall Ticket ID</TableCell>
              <TableCell>Exam Status</TableCell>
              <TableCell>Registered On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRegistrations.map((reg) => (
              <TableRow key={reg.ID}>
                <TableCell>
                  <Checkbox
                    checked={selectedCandidates.includes(reg.ID)}
                    onChange={() => handleCheckboxChange(reg.ID)}
                    disabled={!reg.hallTicketID}
                  />
                </TableCell>
                <TableCell>{reg.ID}</TableCell>
                <TableCell>{reg.candidateName}</TableCell>
                <TableCell>{reg.candidateEmail}</TableCell>
                <TableCell>{reg.candidateMobile}</TableCell>
                <TableCell>{reg.hallTicketID || "Not Generated"}</TableCell>
                <TableCell>{reg.examStatus === 0 ? "Not Completed" : "Completed"}</TableCell>
                <TableCell>{new Date(reg.createdOn).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          sx={{
            mt: 2,
            "& .MuiPaginationItem-root": {
              border: "1px solid black",
            },
          }}
        />
      </Box>
    </>
  );
}


// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */

// import React, { useEffect, useState } from "react";
// import {
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   Paper,
//   TableRow,
//   TableHead,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Box,
//   CircularProgress,
// } from "@mui/material";
// import { Pagination } from "react-bootstrap";
// import { toast } from "react-toastify";
// import Service from "../../../service/Service";

// export default function GlobalRegistrations({ examID, onBack }) {
//   const [examData, setExamData] = useState(null);
//   const [registrations, setRegistrations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [examToken, setExamToken] = useState("");
//   const [hallTicketFormat, setHallTicketFormat] = useState(null);

//   const [selectedCandidates, setSelectedCandidates] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const registrationsPerPage = 10;

//   useEffect(() => {
//     fetchExamDetails();
//   }, []);

//   const fetchExamDetails = async () => {
//     try {
//       const response = await Service.get(`/GlobalExamDetailsByID?ID=${examID}`);
//       if (response.status === 200) {
//         setExamData(response.data.result);
//         setExamToken(response.data.result.examToken);
//         setHallTicketFormat(response.data.result.HallTicketFormat?.hallTicketIDFormat);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch exam details");
//     }
//   };

//   const fetchRegistrations = async () => {
//     try {
//       const response = await Service.get(`/api/registrations?token=${examToken}`);
//       if (response.data.success) {
//         setRegistrations(response.data.data);
//       } else {
//         toast.error("Failed to fetch registrations");
//       }
//     } catch (error) {
//       console.error("Error fetching registrations:", error);
//       toast.error("Error fetching registrations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (examToken) {
//       fetchRegistrations();
//     }
//   }, [examToken]);

//   const handleGenerateHallTickets = async () => {
//     try {
//       const response = await Service.post("/generateHallTickets", {
//         examToken,
//         hallTicketIDFormat: hallTicketFormat,
//       });

//       if (response.data.success) {
//         toast.success("Hall tickets generated successfully!");
//         fetchRegistrations();
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong!");
//     }
//   };

//   const handleSendHallTickets = async () => {
//     if (selectedCandidates.length === 0) {
//       toast.warning("Please select at least one candidate");
//       return;
//     }

//     const selectedHallTicketIDs = registrations
//       .filter((reg) => selectedCandidates.includes(reg.ID))
//       .map((reg) => reg.hallTicketID);

//     try {
//       const response = await Service.post("/sendHallTicketEmails", {
//         hallTicketIDs: selectedHallTicketIDs,
//         examToken,
//       });

//       if (response.data.success) {
//         toast.success("Hall tickets sent successfully!");
//         setSelectedCandidates([]); // Clear selection after sending
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to send hall tickets");
//     }
//   };

//   const handleCheckboxChange = (candidateID) => {
//     setSelectedCandidates((prev) =>
//       prev.includes(candidateID)
//         ? prev.filter((id) => id !== candidateID)
//         : [...prev, candidateID]
//     );
//   };

//   const indexOfLastRegistration = currentPage * registrationsPerPage;
//   const indexOfFirstRegistration = indexOfLastRegistration - registrationsPerPage;
//   const currentRegistrations = registrations.slice(
//     indexOfFirstRegistration,
//     indexOfLastRegistration
//   );

//   const totalPages = Math.ceil(registrations.length / registrationsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <>
// <Button variant="outlined" onClick={onBack} style={{ marginBottom: "20px", color: "black", border: "2px solid black" }}>
//   Back
// </Button>

// <div style={{ display: "flex", justifyContent: "flex-end" }}>
//   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
//     <Button
//       variant="outlined"
//       onClick={handleGenerateHallTickets}
//       style={{marginRight: "10px" }}
//     >
//       Generate Hall Ticket IDs
//     </Button>

//     <Button
//       variant="contained"
//       color="primary"
//       onClick={handleSendHallTickets}
//       disabled={selectedCandidates.length === 0}
//     >
//       Send Hall Tickets
//     </Button>
//   </div>
// </div>

//       <TableContainer component={Paper} sx={{ marginTop: 3 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Select</TableCell>
//               <TableCell>ID</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Mobile</TableCell>
//               <TableCell>Hall Ticket ID</TableCell>
//               <TableCell>Exam Status</TableCell>
//               <TableCell>Registered On</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {currentRegistrations.map((reg) => (
//               <TableRow key={reg.ID}>
//                 <TableCell>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={selectedCandidates.includes(reg.ID)}
//                         onChange={() => handleCheckboxChange(reg.ID)}
//                         disabled={!reg.hallTicketID}
//                       />
//                     }
//                   />
//                 </TableCell>
//                 <TableCell>{reg.ID}</TableCell>
//                 <TableCell>{reg.candidateName}</TableCell>
//                 <TableCell>{reg.candidateEmail}</TableCell>
//                 <TableCell>{reg.candidateMobile}</TableCell>
//                 <TableCell>
//                   {reg.hallTicketID ? reg.hallTicketID : "Not Generated"}
//                 </TableCell>
//                 <TableCell>{reg.examStatus === 0 ? "Not Completed" : "Completed"}</TableCell>
//                 <TableCell>{new Date(reg.createdOn).toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <div className="d-flex justify-content-center mt-3">
//         <Pagination>
//           {[...Array(totalPages).keys()].map((page) => (
//             <Pagination.Item
//               key={page + 1}
//               active={page + 1 === currentPage}
//               onClick={() => handlePageChange(page + 1)}
//             >
//               {page + 1}
//             </Pagination.Item>
//           ))}
//         </Pagination>
//       </div>
//     </>
//   );
// }