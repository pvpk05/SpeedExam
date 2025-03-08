/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Paper, TablePagination } from '@mui/material';
import Service from '../../../service/Service';
import { toast } from "react-toastify";

function GlobalMeritList({ examID, onBack }) {
    console.log(examID);

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (examID) {
            fetchRegistrations();
        }
    }, [examID]);

    const fetchRegistrations = async () => {
        try {
            const response = await Service.get(`/api/MeritList?token=${examID}`);
            if (response.data.success) {
                console.log(response.data.data);
                setSubmissions(response.data.data);
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Button 
                variant="outlined" 
                onClick={onBack} 
                style={{ marginBottom: "20px", color: "black", border: "2px solid black" }}
            >
                Back
            </Button>

            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Hall Ticket ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell>Exam Status</TableCell>
                            <TableCell>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {submissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No records found
                                </TableCell>
                            </TableRow>
                        ) : (
                            submissions
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((reg) => (
                                    <TableRow key={reg.ID}>
                                        <TableCell>{reg.hallTicketID || "Not Generated"}</TableCell>
                                        <TableCell>{reg.candidateName}</TableCell>
                                        <TableCell>{reg.candidateEmail}</TableCell>
                                        <TableCell>{reg.candidateMobile}</TableCell>
                                        <TableCell>
                                            {reg.examStatus === 0 ? "Not Completed" : "Completed"}
                                        </TableCell>
                                        <TableCell>{reg.results}</TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {submissions.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={submissions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </>
    );
}

export default GlobalMeritList;
