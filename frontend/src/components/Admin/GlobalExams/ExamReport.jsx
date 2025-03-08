/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Card, CardContent, Typography, Grid } from '@mui/material';
import Service from '../../../service/Service';
import { toast } from 'react-toastify';

const ExamReport = ({ examID, onBack }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    console.log(examID);

    useEffect(() => {
        if (examID) {
            fetchReport();
        }
    }, [examID]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await Service.get(`/api/ExamReport?token=${examID}`);
            console.log(response);
            
            if (response.data.success) {
                setReport(response.data);
            } else {
                toast.error("Failed to fetch exam report");
            }
        } catch (error) {
            console.error("Error fetching exam report:", error);
            toast.error("Error fetching exam report");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <Button
                variant="outlined"
                onClick={onBack}
                style={{ marginBottom: "20px", color: "black", border: "2px solid black" }}
            >
                Back
            </Button>

            {report && (
                <div>
                    <Typography variant="h5" gutterBottom>
                        Exam Report
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">Total Registrations</Typography>
                                    <Typography variant="h4">{report.registrations}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">Total Students Attempted</Typography>
                                    <Typography variant="h4">{report.totalStudents}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">Qualified Students</Typography>
                                    <Typography variant="h4">{report.qualifiedStudents}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            )}
        </div>
    );
};

export default ExamReport;
