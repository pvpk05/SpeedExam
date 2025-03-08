/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import Service from "../../../../service/Service";
import { Star, StarBorder } from "@mui/icons-material";
import { Button, TextField, Box, Typography, Paper, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import { toast } from "react-toastify";

export default function SuccessFeedbackPage({ examToken, hId }) {
    console.log(examToken, hId);

    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState([]);
    const [comments, setComments] = useState("");

    const feedbackOptions = ["Questions", "User Experience", "Code Autocomplete"];

    const toggleFeedback = (option) => {
        setFeedback((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };

    const handleSubmitFeedback = async () => {
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }

        try {
            const payload = {
                hallTicketID: hId,
                examToken: examToken,
                stars: rating,
                feedback: { categories: feedback, comments } // You can send both categories and comments
            };

            const response = await Service.put("/SaveGlobalFeedback", payload);
            
            toast.success("Feedback submitted successfully!");
            window.close();
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            alert("Failed to submit feedback. Please try again.");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5" p={3}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: "100%", textAlign: "center" }}>
                <Typography variant="h5" color="green">✔ Test submitted successfully</Typography>
                <Typography variant="body1" color="textSecondary" mt={1}>
                    Your response has been recorded.
                </Typography>

                {/* Rating */}
                <Box mt={3}>
                    <Typography variant="subtitle1">How was your overall experience?</Typography>
                    <Box display="flex" justifyContent="center" mt={1}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <IconButton key={num} onClick={() => setRating(num)}>
                                {num <= rating ? <Star color="warning" style={{ width: "40px", height: "40px" }} /> : <StarBorder style={{ width: "40px", height: "40px" }} />}
                            </IconButton>
                        ))}
                    </Box>
                </Box>

                {/* Feedback Categories */}
                <Box mt={3} textAlign="left">
                    <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>What would you like to give feedback on?</Typography>
                    {feedbackOptions.map((option) => (
                        <FormControlLabel
                            key={option}
                            control={<Checkbox checked={feedback.includes(option)} onChange={() => toggleFeedback(option)} />}
                            label={option}
                        />
                    ))}
                </Box>

                {/* Additional Comments */}
                <Box mt={2}>
                    <Typography variant="subtitle1" style={{ textAlign: "left", color: "#777", fontWeight: "bolder", marginLeft: "10px" }}>Your Feedback Matters!</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Enter your feedback here"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </Box>

                {/* Buttons */}
                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary" onClick={handleSubmitFeedback}>Submit Feedback</Button>
                    <Button variant="text" color="black" onClick={() => window.close()}>Skip & Close</Button>
                </Box>
            </Paper>
        </Box>
    );
}
