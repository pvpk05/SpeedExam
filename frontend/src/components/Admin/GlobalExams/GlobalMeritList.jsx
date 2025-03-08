/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Paper, TablePagination, Box, Pagination, Checkbox } from '@mui/material';
import Service from '../../../service/Service';
import { toast } from "react-toastify";

function GlobalMeritList({ examID, onBack }) {
    console.log(examID);

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const submissionsPerPage = 10;

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


    const handleSendOfferMails = async () => {
        if (selectedCandidates.length === 0) {
            toast.warning("Please select at least one candidate");
            return;
        }

        const selectedHallTicketIDs = submissions
            .filter((reg) => selectedCandidates.includes(reg.ID))
            .map((reg) => reg.hallTicketID);

        try {
            const response = await Service.post("/sendOfferEmails", {
                hallTicketIDs: selectedHallTicketIDs,
                examToken: examID,
            });

            if (response.data.success) {
                toast.success("Hall tickets sent successfully!");
                setSelectedCandidates([]);
                fetchRegistrations();
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

    const indexOfLastRegistration = currentPage * submissionsPerPage;
    const indexOfFirstRegistration = indexOfLastRegistration - submissionsPerPage;
    const currentRegistrations = submissions.slice(
        indexOfFirstRegistration,
        indexOfLastRegistration
    );

    const totalPages = Math.ceil(submissions.length / submissionsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendOfferMails}
                        disabled={selectedCandidates.length === 0}
                    >
                        Send Offer Mails
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
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedCandidates.includes(reg.ID)}
                                                onChange={() => handleCheckboxChange(reg.ID)}
                                                disabled={!reg.hallTicketID}
                                            />
                                        </TableCell>
                                        <TableCell>{reg.ID}</TableCell>

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

export default GlobalMeritList;
