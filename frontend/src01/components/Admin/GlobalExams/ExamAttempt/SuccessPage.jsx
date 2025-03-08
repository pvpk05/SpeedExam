/* eslint-disable no-unused-vars */

import { useState } from "react";
import { Star, StarBorder, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Button, TextField, Box, Typography, Paper, IconButton } from "@mui/material";

export default function SuccessFeedbackPage() {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState([]);
    const [comments, setComments] = useState("");

    const feedbackOptions = ["Questions", "User Experience", "Code Autocomplete"];

    const toggleFeedback = (option) => {
        setFeedback((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
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
                                {num <= rating ? <Star color="warning" style={{width:"40px", height:"40px"}} /> : <StarBorder  style={{width:"40px", height:"40px"}}/>}
                            </IconButton>
                        ))}
                    </Box>
                </Box>

                {/* Additional Comments */}
                <Box mt={3}>
                    <Typography variant="subtitle1" style={{textAlign:"left", color:"#777", fontWeight:"bolder", marginLeft:"10px"}}>Your Feedback Matters !</Typography>
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
                    <Button variant="contained" color="primary">Submit Feedback</Button>
                    <Button variant="text" color="black"  onClick={() => window.close()}>Skip & Close</Button>
                </Box>
            </Paper>
        </Box>
    );
}
