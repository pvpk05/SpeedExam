/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

const History = ({ candidateID, candidateHistory, onBack }) => {

  console.log(candidateHistory);


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


  const [page, setPage] = useState(0); // Track the current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to first page when rows per page changes
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: "20px" }}>
        Back
      </Button>
      <div>Exam History for Candidate ID: {candidateID}</div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">SI. NO</StyledTableCell>
                <StyledTableCell align="center">InternID</StyledTableCell>
                <StyledTableCell align="center">ExamID</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Score</StyledTableCell>
                <StyledTableCell align="center">Start Time</StyledTableCell>
                <StyledTableCell align="center">End Time</StyledTableCell>
                <StyledTableCell align="center">Time Taken </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidateHistory.map((exam, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="center">{exam.internID}</StyledTableCell>
                  <StyledTableCell align="center">{exam.examID}</StyledTableCell>
                  <StyledTableCell align="center">{exam.examStatus ? "Completed" : "Not Completed"}</StyledTableCell>

                  <StyledTableCell align="center">{exam.score}</StyledTableCell>
                  <StyledTableCell align="center">{exam.Start_time}</StyledTableCell>
                  <StyledTableCell align="center">{exam.end_time}</StyledTableCell>
                  <StyledTableCell align="center">
                    {(() => {
                      const diffInSecs = Math.floor((new Date(exam.end_time) - new Date(exam.Start_time)) / 1000);
                      const minutes = String(Math.floor(diffInSecs / 60)).padStart(2, '0');
                      const seconds = String(diffInSecs % 60).padStart(2, '0');
                      return `${minutes}:${seconds} Minutes`;
                    })()}
                  </StyledTableCell>


                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={candidateHistory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

    </div>
  );
};

export default History;

// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */

// import React from "react";
// import { Button } from "@mui/material";

// const History = ({ candidateID, onBack }) => {
//   return (
//     <div>
//       <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: "20px" }}>
//         Back
//       </Button>
//       <div>Exam History for Candidate ID: {candidateID}</div>
//     </div>
//   );
// };

// export default History;
