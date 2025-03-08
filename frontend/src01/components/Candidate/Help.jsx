/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Service from '../../service/Service';

const Help = () => {
    const [ticketData, setTicketData] = useState({
        candidateID: '',
        ticketCategory: '',
        ticketSubject: '',
        ticketDescription: '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicketData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Ticket Submitted:', ticketData);
            const response = Service.post("/raiseTicket", ticketData);
            console.log(response);
            alert("ticket submitted succesfully");
            setTicketData({
                candidateID: '',
                ticketCategory: '',
                ticketSubject: '',
                ticketDescription: '',
            })
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 1000,
                margin: '0 auto',
                padding: 2,
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Raise a Support Ticket
            </Typography>

            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                If youre facing issues or have specific concerns that cannot be addressed through FAQs or troubleshooting, you can raise a support ticket to get assistance from our team.
            </Typography>

            <TextField
                label="Candidate ID"
                variant="outlined"
                fullWidth
                name="candidateID"
                value={ticketData.candidateID}
                onChange={handleChange}
                required
            />

            <FormControl required>
                <InputLabel id="ticket-category-label">Ticket Category</InputLabel>
                <Select
                    labelId="ticket-category-label"
                    id="ticket-category"
                    name="ticketCategory"
                    value={ticketData.ticketCategory}
                    onChange={handleChange}
                    label="Ticket Category"
                >
                    <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                    <MenuItem value="Technical Issue">Technical Issue</MenuItem>
                    <MenuItem value="Billing Issue">Billing Issue</MenuItem>
                    <MenuItem value="Account Issue">Account Issue</MenuItem>
                    {/* Add other categories as needed */}
                </Select>
            </FormControl>

            <TextField
                label="Ticket Subject"
                variant="outlined"
                fullWidth
                name="ticketSubject"
                value={ticketData.ticketSubject}
                onChange={handleChange}
                required
            />
            <TextField
                label="Ticket Description"
                variant="outlined"
                fullWidth
                name="ticketDescription"
                multiline
                rows={4}
                value={ticketData.ticketDescription}
                onChange={handleChange}
                required
            />

            <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>
                Submit Ticket
            </Button>
        </Box>
    );
};

export default Help;
