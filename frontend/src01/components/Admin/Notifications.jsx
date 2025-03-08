/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react'
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
import Service from '../../service/Service';

function Notifications() {


  const [tickets, setTickets] = useState([]);

  const getTickets = async () => {
    const response = await Service.get("/getTickets");
    setTickets(response.data);
    console.log(response.data);
  }

  useEffect(() => {
    getTickets();
  }, [])

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
    <>
      <div className='text-center fw-bold'>Notifications</div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">SI. NO</StyledTableCell>
                <StyledTableCell align="center">Candidate ID</StyledTableCell>
                <StyledTableCell align="center">Ticket Category</StyledTableCell>
                <StyledTableCell align="center">Ticket Subject</StyledTableCell>
                <StyledTableCell align="center">Ticket Description</StyledTableCell>
                <StyledTableCell align="center">Ticket RaisedTime</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="center">{ticket.candidateID}</StyledTableCell>
                  <StyledTableCell align="center">{ticket.ticketCategory}</StyledTableCell>
                  <StyledTableCell align="center">{ticket.ticketSubject}</StyledTableCell>
                  <StyledTableCell align="center">{ticket.ticketDescription}</StyledTableCell>
                  <StyledTableCell align="center">{ticket.ticketRaisedTime}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  )
}

export default Notifications