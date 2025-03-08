/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    CardContent,
    Typography,
    Avatar,
    Grid,
    Divider,
    Chip,
    Grid2,
} from "@mui/material";
import Service from "../../../service/Service";

const Profile = ({ candidateID, onBack }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the profile data when the component loads
        const fetchProfileData = async () => {
            try {
                const response = await Service.get(`/intern_data/${candidateID}`);
                setProfileData(response.data[0][0]); // Assuming the API returns an array
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load profile data");
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [candidateID]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const {
        fullName,
        email,
        mobileNo,
        altMobileNo,
        domain,
        belongedToVasaviFoundation,
        address,
        batchNo,
        modeOfInternship,
        profile_img,
        dateAccepted,
        endDate,
    } = profileData;

    return (
        <div style={{ padding: "20px" }}>
            <Button
                variant="contained"
                color="primary"
                onClick={onBack}
                style={{ marginBottom: "20px" }}
            >
                Back
            </Button>
            <Grid container spacing={3}>
                {/* Profile Details Section */}
                <Grid item xs={12} md={8}>
                    <CardContent>
                        <Typography
                            variant="h5"
                            gutterBottom
                            style={{
                                fontWeight: "bold",
                                color: "#3f51b5",
                                marginBottom: "16px",
                            }}
                        >
                            Profile Details
                        </Typography>

                        <Grid item sm={4}>
                            <Avatar
                                src={profile_img || "/default-profile.png"} // Use a default image if none provided
                                alt={fullName}
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    margin: "16px auto",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                }}
                            />
                        </Grid>

                        <Divider style={{ marginBottom: "16px" }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Name:</strong> {fullName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Email:</strong> {email}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Domain:</strong> {domain}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Batch No:</strong> {batchNo}
                                </Typography>
                            </Grid>


                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Mobile:</strong> {mobileNo}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Alt Mobile:</strong> {altMobileNo}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Registered on:</strong>{" "}
                                    {new Date(dateAccepted).toLocaleDateString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Internship ends:</strong>{" "}
                                    {new Date(endDate).toLocaleDateString()}
                                </Typography>
                            </Grid>
                        </Grid>

                    </CardContent>
                </Grid>
            </Grid>
        </div>
    );
};

export default Profile;

// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */

// import React, { useState, useEffect } from "react";
// import { Button, Card, CardContent, Typography, Avatar, Grid, Chip } from "@mui/material";
// import Service from "../../../service/Service";
// const Profile = ({ candidateID, onBack }) => {
//     const [profileData, setProfileData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // Fetch the profile data when the component loads
//         const fetchProfileData = async () => {
//             try {
//                 const response = await Service.get(`/intern_data/${candidateID}`);
//                 console.log(response.data[0][0]);
//                 setProfileData(response.data[0][0]); // Assuming the API returns an array
//                 setLoading(false);
//             } catch (err) {
//                 console.error(err);
//                 setError("Failed to load profile data");
//                 setLoading(false);
//             }
//         };

//         fetchProfileData();
//     }, [candidateID]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;

//     const {
//         fullName,
//         email,
//         mobileNo,
//         altMobileNo,
//         domain,
//         belongedToVasaviFoundation,
//         address,
//         batchNo,
//         modeOfInternship,
//         profile_img,
//         dateAccepted,
//         endDate,
//     } = profileData;

//     return (
//         <div style={{ padding: "20px" }}>
//             <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={onBack}
//                 style={{ marginBottom: "20px" }}
//             >
//                 Back
//             </Button>
//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={8}>
//                     <Card>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 Profile Details
//                             </Typography>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={12} sm={6}>
//                                     <Typography variant="body2">
//                                         <strong>Name:</strong> {fullName}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <Typography variant="body2">
//                                         <strong>Email:</strong> {email}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <Typography variant="body2">
//                                         <strong>Mobile:</strong> {mobileNo}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <Typography variant="body2">
//                                         <strong>Alt Mobile:</strong> {altMobileNo}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <Typography variant="body2">
//                                         <strong>Domain:</strong> {domain}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <Typography variant="body2">
//                                         <strong>Belonged to Vasavi Foundation:</strong>{" "}
//                                         {belongedToVasaviFoundation ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12}>
//                                     <Typography variant="body2">
//                                         <strong>Address:</strong> {address}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <Typography variant="body2">
//                                         <strong>Batch No:</strong> {batchNo}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <Typography variant="body2">
//                                         <strong>Mode of Internship:</strong> {modeOfInternship}
//                                     </Typography>
//                                 </Grid>

//                                 <Grid item xs={12} sm={6}>
//                                     <Typography >
//                                         <strong>Registered on:</strong> {new Date(dateAccepted).toLocaleDateString()}{" "}
//                                     </Typography>
//                                 </Grid>

//                                 <Grid item xs={12} sm={6}>
//                                     <Typography >
//                                     <strong>Internship ends:</strong> {new Date(endDate).toLocaleDateString()}
//                                     </Typography>
//                                 </Grid>
//                             </Grid>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                         <Avatar
//                             src={profile_img || "/default-profile.png"} // Use a default image if none provided
//                             alt={fullName}
//                             style={{ width: "150px", height: "150px", margin: "0 auto" }}
//                         />
//                 </Grid>
//             </Grid>
//         </div>
//     );
// };

// export default Profile;
