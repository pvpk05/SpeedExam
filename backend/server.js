
const express = require('express');
const cors = require('cors');
const db = require('./db')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { SendMailClient } = require("zeptomail");
const https = require('https');

const db2 = require('./db2')
const app = express();

const axios = require('axios');
const url = "https://api.zeptomail.in/";
const token = "Zoho-enczapikey PHtE6r0LReju2DYu9RJTsfC+F5alZtx/r+lgLglGt4wWCPEGGk0D+I99ljbm/R4iXfVLQfOfmYppsO7JtbrXc2rvNGoaCGqyqK3sx/VYSPOZsbq6x00ct1QffkTYUILscd5v3SHWstjeNA==";
const client = new SendMailClient({ url, token });

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/rsexamsbackend.ramanasoft.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/rsexamsbackend.ramanasoft.com/fullchain.pem')
};


const { check, validationResult } = require('express-validator');
app.use(cors());
app.use(express.json());

const PORT = 5002;

https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running on https://rsexamsbackend.ramanasoft.com:${PORT}`);
});


// const express = require('express');
// const cors = require('cors');
// const db = require('./db')
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const os = require('os');
// const { SendMailClient } = require("zeptomail");

// const db2 = require('./db2')
// const app = express();

// const axios = require('axios');
// const url = "https://api.zeptomail.in/";
// const token = "Zoho-enczapikey PHtE6r0LReju2DYu9RJTsfC+F5alZtx/r+lgLglGt4wWCPEGGk0D+I99ljbm/R4iXfVLQfOfmYppsO7JtbrXc2rvNGoaCGqyqK3sx/VYSPOZsbq6x00ct1QffkTYUILscd5v3SHWstjeNA==";
// const client = new SendMailClient({ url, token });


// const { check, validationResult } = require('express-validator');
// app.use(cors());
// app.use(express.json());


// const port = 5002;
// app.listen(port, () => {
//     console.log("Server Started Successfully on: ", port)
// });



const uploadDir = 'uploads/GlobalExamBGS';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Hello from RS Exams Backend!');
});


// const sendEmail = async (email, mailOptions) => {
//     const mailData = {
//       from: {
//         address: "noreply@ramanasoft.in",
//         name: "Ramanasoft Team",
//       },
//       to: [
//         {
//           email_address: {
//             address: "pvpk06@gmail.com",
//             name: mailOptions.name,
//           },
//         },
//       ],
//       subject: mailOptions.subject,
//       htmlbody: mailOptions.htmlBody,
//     };

//     console.log(mailData);
//     try {
//       const response = await client.sendMail(mailData);
//       console.log("Email sent successfully:", response);
//       return { status: 200, message: "Email sent successfully", response };
//     } catch (error) {
//       console.error("Error sending email:", error);
//       return { status: 500, message: "Error sending email", error };
//     }
//   };

app.get("/checkOperatingSystem", (req, res) => {
    try {
        const osType = os.type();
        const formattedOS = osType == 'Windows_NT' ? 'Windows' : osType;
        return res.status(formattedOS == 'Windows' ? 200 : 400).json({ message: formattedOS == 'Windows' ? 'Success' : 'Failure', osType })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
});

app.get("/check-server-status", (req, res) => {
    res.status(200).json({ staus: 'running', message: 'Server is running' });
});



// const sendEmail = async (email, mailOptions, pdfBuffer, pdfFileName) => {
//     console.log(email, mailOptions);
//     const mailData = {
//         from: {
//             address: 'noreply@ramanasoft.in',
//             name: 'Ramanasoft Team',
//         },
//         to: [
//             {
//                 email_address: {
//                     address: email,
//                     name: mailOptions.name,
//                 },
//             },
//         ],
//         subject: mailOptions.subject,
//         htmlbody: mailOptions.htmlBody,
//         attachments: [
//             {
//                 content: pdfBuffer.toString('base64'),
//                 name: pdfFileName || 'HallTicket.pdf',
//                 mime_type: 'application/pdf',
//             },
//         ],
//     };

//     try {
//         const response = await client.sendMail(mailData);
//         console.log(response);

//         return { status: 200, message: 'Email sent successfully', response };
//     } catch (error) {
//         return { status: 500, message: 'Error sending email', error };
//     }
// };

const sendEmail = async (email, mailOptions, pdfBuffer, pdfFileName) => {
    console.log(email, mailOptions);
    const mailData = {
        from: {
            address: 'noreply@ramanasoft.in',
            name: 'Ramanasoft Team',
        },
        to: [
            {
                email_address: {
                    address: email,
                    name: mailOptions.name,
                },
            },
        ],
        subject: mailOptions.subject,
        htmlbody: mailOptions.htmlBody,
        attachments: [
            {
                content: pdfBuffer.toString('base64'),
                name: pdfFileName || 'HallTicket.pdf',
                mime_type: 'application/pdf',
            },
        ],
    };

    try {
        const response = await client.sendMail(mailData);
        console.log(response);
        return { status: 200, success: true, message: 'Email sent successfully', response };
    } catch (error) {
        return { status: 500, success: false, message: 'Error sending email', error };
    }
};

const sendOfferEmail = async (email, mailOptions) => {
    console.log(email, mailOptions);
    const mailData = {
        from: {
            address: 'noreply@ramanasoft.in',
            name: 'Ramanasoft Team',
        },
        to: [
            {
                email_address: {
                    address: email,
                    name: mailOptions.name,
                },
            },
        ],
        subject: mailOptions.subject,
        htmlbody: mailOptions.htmlBody,
    };

    try {
        const response = await client.sendMail(mailData);
        console.log(response);
        return { status: 200, success: true, message: 'Email sent successfully', response };
    } catch (error) {
        return { status: 500, success: false, message: 'Error sending email', error };
    }
};
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function generateHallTicketPDF(candidate, hallTicketFormat) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { examName, examDate, examTimings, backgroundImage } = hallTicketFormat;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    // Optional: Add background image
    if (backgroundImage) {
        const bgImagePath = path.join(__dirname, 'uploads', backgroundImage.split('/uploads/')[1]);
        if (fs.existsSync(bgImagePath)) {
            const bgImageBytes = fs.readFileSync(bgImagePath);
            const bgImage = await pdfDoc.embedPng(bgImageBytes);
            page.drawImage(bgImage, {
                x: 0,
                y: 0,
                width,
                height,
            });
        }
    }

    page.drawText(`Hall Ticket: ${candidate.hallTicketID}`, { x: 50, y: height - 50, font, size: 18, color: rgb(0, 0, 0) });
    page.drawText(`Name: ${candidate.candidateName}`, { x: 50, y: height - 80, font, size: 14 });
    page.drawText(`Exam Name: ${examName}`, { x: 50, y: height - 110, font, size: 14 });
    page.drawText(`Exam Date: ${examDate}`, { x: 50, y: height - 140, font, size: 14 });
    page.drawText(`Timings: ${examTimings}`, { x: 50, y: height - 170, font, size: 14 });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}



//   app.post('/sendHallTicketEmails', async (req, res) => {
//     try {
//       const { examToken, hallTicketIDs } = req.body;

//     console.log(examToken, hallTicketIDs);
//       if (!examToken || !hallTicketIDs || !hallTicketIDs.length) {
//         return res.status(400).json({ success: false, message: 'Missing required parameters' });
//       }

//       // Fetch MailingFormat and HallTicketFormat from GlobalExams
//       const [examData] = await db.query(
//         'SELECT MailingFormat, HallTicketFormat FROM GlobalExams WHERE examToken = ?',
//         [examToken]
//       );

//       if (examData.length === 0) {
//         return res.status(404).json({ success: false, message: 'Exam not found.' });
//       }

//       const mailingFormat = examData[0].MailingFormat;
//       const hallTicketFormat = examData[0].HallTicketFormat;

//       // Fetch candidate details for the provided hallTicketIDs
//       const [candidates] = await db.query(
//         'SELECT * FROM GlobalResponses WHERE hallTicketID IN (?) AND examToken = ?',
//         [hallTicketIDs, examToken]
//       );

//       if (candidates.length === 0) {
//         return res.status(404).json({ success: false, message: 'No candidates found.' });
//       }

//       const emailResponses = [];

//       for (const candidate of candidates) {
//         // Replace placeholders in MailingFormat content
//         const personalizedContent = mailingFormat.content
//           .replace('{{student-name}}', candidate.candidateName)
//           .replace('{{offline-location}}', 'Your Exam Center') // Customize as needed
//           .replace('{{exam-link}}', 'https://examportal.com/login') // Customize as needed
//           .replace('{{qt-site-url}}', 'https://qualitythought.in')
//           .replace('{{rs-social_media-links}}', '<a href="https://facebook.com">Facebook</a> | <a href="https://linkedin.com">LinkedIn</a>');

//         // Generate PDF Hall Ticket
//         const pdfBuffer = await generateHallTicketPDF(candidate, hallTicketFormat);

//         // Prepare mail options
//         const mailOptions = {
//           subject: mailingFormat.subject,
//           htmlBody: personalizedContent,
//           name: candidate.candidateName,
//         };

//         // Send email with PDF
//         const response = await sendEmail(
//           candidate.candidateEmail,
//           mailOptions,
//           pdfBuffer,
//           `HallTicket_${candidate.hallTicketID}.pdf`
//         );

//         emailResponses.push({
//           hallTicketID: candidate.hallTicketID,
//           emailStatus: response.status,
//           message: response.message,
//         });
//       }

//       res.status(200).json({
//         success: true,
//         message: 'Emails processed',
//         emailResponses,
//       });
//     } catch (error) {
//       console.error('Error sending hall ticket emails:', error);
//       res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//   });


app.post('/sendHallTicketEmails', async (req, res) => {
    try {
        const { examToken, hallTicketIDs } = req.body;

        console.log(examToken, hallTicketIDs);

        if (!examToken || !hallTicketIDs || !hallTicketIDs.length) {
            return res.status(400).json({ success: false, message: 'Missing required parameters' });
        }

        // Fetch MailingFormat and HallTicketFormat from GlobalExams
        const [examData] = await db.query(
            'SELECT MailingFormat, HallTicketFormat FROM GlobalExams WHERE examToken = ?',
            [examToken]
        );

        if (examData.length === 0) {
            return res.status(404).json({ success: false, message: 'Exam not found.' });
        }

        const mailingFormat = examData[0].MailingFormat;
        const hallTicketFormat = examData[0].HallTicketFormat;

        // Fetch candidate details for the provided hallTicketIDs
        const [candidates] = await db.query(
            'SELECT * FROM GlobalResponses WHERE hallTicketID IN (?) AND examToken = ?',
            [hallTicketIDs, examToken]
        );


        if (candidates.length === 0) {
            return res.status(404).json({ success: false, message: 'No candidates found.' });
        }

        const emailResponses = [];

        for (const candidate of candidates) {
            try {

                const examLink = `https://exams.ramanasoft.com/Exam?type=global&examToken=${examToken}&hId=${candidate.hallTicketID}`;

                // Replace placeholders in MailingFormat content
                const personalizedContent = mailingFormat.content
                    .replace('{{student-name}}', candidate.candidateName)
                    .replace('{{offline-location}}', 'Your Exam Center')
                    .replace(
                        "{{exam-link}}",
                        `<a href="${examLink}">Exam Link</a>`
                    )
                    .replace('{{qt-site-url}}', 'https://qualitythought.in')
                    .replace('{{rs-social_media-links}}', '<a href="https://facebook.com">Facebook</a> | <a href="https://linkedin.com">LinkedIn</a>');

                // Generate PDF Hall Ticket
                const pdfBuffer = await generateHallTicketPDF(candidate, hallTicketFormat);

                // Prepare mail options
                const mailOptions = {
                    subject: mailingFormat.subject,
                    htmlBody: personalizedContent,
                    name: candidate.candidateName,
                };

                const response = await sendEmail(
                    candidate.candidateEmail,
                    mailOptions,
                    pdfBuffer,
                    `HallTicket_${candidate.hallTicketID}.pdf`
                );

                if (response.status === 200) {
                    await db.query(
                        'UPDATE GlobalResponses SET SentHallTicketMail = ? WHERE hallTicketID = ? AND examToken = ?',
                        [1, candidate.hallTicketID, examToken]
                    );
                } else {
                    console.error(`Failed to send email to ${candidate.candidateEmail}`, response.error);
                }


                emailResponses.push({
                    hallTicketID: candidate.hallTicketID,
                    emailStatus: response.status,
                    message: response.message,
                });
            } catch (emailError) {
                console.error(`Failed to send email to ${candidate.candidateEmail}:`, emailError.message);

                // Update SentHallTicketMail as '0:<error>'
                await db.query(
                    'UPDATE GlobalResponses SET SentHallTicketMail = ? WHERE hallTicketID = ? AND examToken = ?',
                    [`0:${emailError.message}`, candidate.hallTicketID, examToken]
                );

                emailResponses.push({
                    hallTicketID: candidate.hallTicketID,
                    emailStatus: 'failed',
                    message: emailError.message,
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Emails processed',
            emailResponses,
        });
    } catch (error) {
        console.error('Error sending hall ticket emails:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/sendOfferEmails', async (req, res) => {
    try {
        const { examToken, hallTicketIDs } = req.body;

        console.log(examToken, hallTicketIDs);
        if (!examToken || !hallTicketIDs || !hallTicketIDs.length) {
            return res.status(400).json({ success: false, message: 'Missing required parameters' });
        }

        // Fetch OfferMailFormat from GlobalExams
        const [examData] = await db.query(
            'SELECT OfferMailFormat FROM GlobalExams WHERE examToken = ?',
            [examToken]
        );

        console.log(examData);

        if (examData.length === 0) {
            return res.status(404).json({ success: false, message: 'Exam not found.' });
        }

        let mailingFormat;
        try {
            mailingFormat = examData[0].OfferMailFormat;

            if (mailingFormat === null) {
                return res.status(401).json({ success: false, message: 'Offer Mail format not found in database.' });
            }
        } catch (parseError) {
            return res.status(500).json({ success: false, message: 'Invalid offer mail format in database.' });
        }

        const [candidates] = await db.query(
            'SELECT * FROM GlobalResponses WHERE hallTicketID IN (?) AND examToken = ?',
            [hallTicketIDs, examToken]
        );

        if (candidates.length === 0) {
            return res.status(404).json({ success: false, message: 'No candidates found.' });
        }

        const emailResponses = [];

        for (const candidate of candidates) {
            try {
                const examLink = `http://localhost:5173/Exam?type=global&examToken=${examToken}&hId=${candidate.hallTicketID}`;

                const personalizedContent = mailingFormat.content
                    .replace('{{student-name}}', candidate.candidateName || 'Candidate')
                    .replace('{{offline-location}}', 'Your Exam Center')
                    .replace(
                        '{{exam-link}}',
                        `Click this <a href="${examLink}">Exam Link</a> to attempt the exam`
                    )
                    .replace('{{qt-site-url}}', 'https://qualitythought.in')
                    .replace('{{rs-social_media-links}}', '<a href="https://facebook.com">Facebook</a> | <a href="https://linkedin.com">LinkedIn</a>');

                const mailOptions = {
                    subject: mailingFormat.subject,
                    htmlBody: personalizedContent,
                    name: candidate.candidateName || 'Candidate',
                };

                const response = await sendOfferEmail(candidate.candidateEmail, mailOptions);


                console.log(response);
                if (response.status === 200) {
                    await db.query(
                        'UPDATE GlobalResponses SET SentHallTicketMail = ? WHERE hallTicketID = ? AND examToken = ?',
                        [1, candidate.hallTicketID, examToken]
                    );
                } else {
                    console.error(`Failed to send email to ${candidate.candidateEmail}`, response.error);
                }

                emailResponses.push({
                    hallTicketID: candidate.hallTicketID,
                    emailStatus: response.status,
                    message: response.message,
                });

            } catch (emailError) {
                console.error(`Failed to send email to ${candidate.candidateEmail}:`, emailError.message);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Offer emails processed successfully.',
            emailResponses,
        });

    } catch (error) {
        console.error('Error sending offer emails:', error);
        res.status(500).json({ success: false, message: 'Failed to send offer emails due to server error.' });
    }
});


app.get("/getAlldomains", async (req, res) => {
    try {
        const domainsQuery = "SELECT * FROM domains";
        const result = await query(domainsQuery);
        return res.status(200).json({ message: "Got All Domains", result });
    } catch (err) {
        console.error("Error fetching domains:", err);
        return res.status(500).json({ error: "Error while fetching all domains", details: err.message });
    }
});


app.delete("/deleteDomain/:domain", async (req, res) => {
    try {
        const { domain } = req.params;
        console.log(domain);

        const deleteQuery = "DELETE FROM domains WHERE domain=?";
        const result = await query(deleteQuery, [domain]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Domain not found" });
        }

        return res.status(200).json({ message: "Domain Deleted Successfully", result });
    } catch (err) {
        console.error("Error deleting domain:", err);
        return res.status(500).json({ error: "Error while deleting domain", details: err.message });
    }
});

// Edit Domain
app.put("/editDomain", async (req, res) => {
    try {
        const { existingDomain, newDomain } = req.body;
        console.log(req.body);

        const isDomainPresent = "SELECT * FROM domains WHERE domain=?";
        const updateQuery = "UPDATE domains SET domain=? WHERE domain=?";

        const existing = await query(isDomainPresent, [newDomain]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Domain already exists", domain: newDomain });
        }

        const updateResult = await query(updateQuery, [newDomain, existingDomain]);
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "Domain not found" });
        }

        return res.status(200).json({ message: "Domain Updated Successfully", result: updateResult });

    } catch (err) {
        console.error("Error updating domain:", err);
        return res.status(500).json({ error: "Error while updating domain", details: err.message });
    }
});

app.post("/addSection", async (req, res) => {
    try {
        const Section = req.body.section;
        console.log(req.body);
        console.log(Section);

        const isDomainPresent = "SELECT * FROM sections WHERE Section=?";
        const insertQuery = "INSERT INTO sections (Section) VALUES (?)";

        const [existingSections] = await db.query(isDomainPresent, [Section]);
        console.log(existingSections);

        if (existingSections.length > 0) {
            return res.status(409).send("Section already exists: " + Section);
        } else {
            const [insertResult] = await db.query(insertQuery, [Section]);
            return res.status(201).json({ message: "Section Added Successfully", insertResult });
        }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).send("Internal Server Error");
    }
});


app.get("/getAllSections", async (req, res) => {
    try {
        const Sections = "SELECT * FROM sections";

        // Use await to handle the promise-based query
        const [result] = await db.query(Sections);

        return res.status(200).json({ message: "Got All Sections", result });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error while fetching all Sections");
    }
});


app.put("/editSection", async (req, res) => {
    try {
        const { existingSection, newSection } = req.body;
        console.log(req.body);

        const isSectionPresent = "SELECT * FROM sections WHERE section=?";
        const updateQuery = "UPDATE sections SET section=? WHERE section=?";

        const [existingSections] = await db.query(isSectionPresent, [newSection]);

        console.log(existingSections);


        if (existingSections.length > 0) {
            return res.status(409).send("Section already exists: " + newSection);
        }

        const [updateResult] = await db.query(updateQuery, [newSection, existingSection]);

        return res.status(200).json({ message: "Section Updated Successfully", updateResult });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).send("Internal Server Error");
    }
});

app.get("/getAllSections", async (req, res) => {
    try {
        const Sections = "SELECT * FROM sections";

        // Use await to handle the promise-based query
        const [result] = await db.query(Sections);

        return res.status(200).json({ message: "Got All Sections", result });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error while fetching all Sections");
    }
});



app.get("/GetSection_QuestionsInfo", async (req, res) => {
    try {
        const query = `
            SELECT section, COUNT(*) AS total_questions 
            FROM questions 
            GROUP BY section 
            ORDER BY section`;
        const [result] = await db.query(query);

        return res.status(200).json({ message: "Got All Sections", sections: result });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error while fetching sections with question counts");
    }
});


app.post("/createExam", async (req, res) => {
    const {
        examName,
        examToken,
        questions,
        duration,
        totalMarks,
        correctAnswerMarks,
        negativeMarks,
        autoSubmit,
        examAvailability,
        domainName,
        batches,
        section,
        startDateTime,
        endDateTime,
        questionPick,
        examType,
        examLink,
    } = req.body;

    let examID;

    console.log(req.body);

    try {
        // Insert exam into `exams` table
        const insertExamQuery =
            "INSERT INTO exams (examName, examToken, questions, duration, totalMarks, correctAnswerMarks, negativeMarks, autoSubmit, examAvailability, domainName, batches, section, startDateTime, endDateTime, questionPick, examType, examLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const [examResult] = await db.query(insertExamQuery, [
            examName,
            examToken,
            questions,
            duration,
            totalMarks,
            correctAnswerMarks,
            negativeMarks,
            autoSubmit,
            examAvailability,
            domainName,
            JSON.stringify(batches),
            section,
            startDateTime || null,
            endDateTime || null,
            questionPick,
            examType,
            examLink, // Store the provided examLink
        ]);

        examID = examResult.insertId; // Get the inserted exam ID

        // If examType is 'Internal', assign interns
        if (examType === "Internal") {
            const fetchInternsQuery =
                "SELECT candidateID FROM intern_data WHERE domain = ? AND batchNo IN (?)";

            const [interns] = await db2.query(fetchInternsQuery, [
                domainName,
                batches,
            ]);

            if (interns.length === 0) {
                return res.status(404).json({
                    message: "No interns found for the specified domain and batches",
                });
            }

            const assignedExamsData = interns.map((intern) => [
                intern.candidateID,
                examID,
                false,
            ]);

            const insertAssignedExamsQuery =
                "INSERT INTO assignedExams (internID, examID, examStatus) VALUES ?";

            await db.query(insertAssignedExamsQuery, [assignedExamsData]);
        }

        return res.status(201).json({
            message: "Exam created successfully",
            examID,
            // assignedTo: examType === "Internal" ? (interns ? interns.length : 0) : null,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Error creating exam or assigning interns", error: err });
    }
});


app.put("/updateExam", (req, res) => {
    try {
        const { ID, examName, questions, duration, negativeMarks, autoSubmit, examAvailability, countDown, domainName, section, startDateTime, endDateTime } = req.body;
        console.log(req.body);

        const query = `UPDATE exams SET examName = ?, questions = ?, duration = ?, negativeMarks = ?, autoSubmit = ?, examAvailability = ?, countDown = ?, domainName = ?,  section = ?,   startDateTime = ?,  endDateTime = ? WHERE ID = ?`;

        db.query(query, [examName, questions, duration, negativeMarks, autoSubmit, examAvailability, countDown, domainName, section, startDateTime, endDateTime, ID], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error while updating Exam Details", error: err });
            }
            return res.status(200).json({ message: "Exam Details Updated Successfully", result });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err });
    }
});

app.delete("/deleteExam/:examId", (req, res) => {
    try {
        const { examId } = req.params;
        console.log(examId);


        const query = "Delete from exams where ID = ?";

        db.query(query, [examId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json("Err while Deleting exams Details with ExamID:- " + examId);
            }
            return res.status(204).json("Exam Detail Deleted Successfully:-  " + examId);
        })

    } catch (error) {

    }
})


app.get("/getExams", async (req, res) => {
    console.log(req.query);
    try {
        const domainName = req.query.domain;
        console.log(domainName);

        // Update this to use promise-based query
        const query = "SELECT ID, examName, duration, examType, section, questions FROM exams WHERE domainName = ?";

        // Use await to get the result
        const [result] = await db.query(query, [domainName]);

        // Send the response after receiving the result
        return res.status(200).json({ message: "Got Exams List", result });

    } catch (error) {
        console.error(error);
        return res.status(500).send("An unexpected error occurred");
    }
});


app.get("/getExamByID", async (req, res) => {
    try {
        const { ID } = req.query;
        console.log(ID);

        const query = "SELECT * FROM exams WHERE ID = ?";
        const [result] = await db.query(query, [ID]); // Use await to handle the promise
        console.log(result);
        if (!result.length) {
            return res.status(404).json({ message: "Exam not found" });
        }

        return res.status(200).json({ message: "Got Exam", result: result[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).send("An unexpected error occurred");
    }
});
app.post("/createQuestion", async (req, res) => {
    try {
        console.log(req.body);

        const insertQuery = 'INSERT INTO questions (section, questionName, options, description, questionType, correctAnswer, score, negativeMarks) VALUES ?';

        let values = [];

        if (Array.isArray(req.body)) {
            values = req.body.map(({ section, questionName, options, description, questionType, correctAnswers, score, negativeMarks }) => {
                return [section, questionName, JSON.stringify(options), description, questionType, JSON.stringify(correctAnswers), score, negativeMarks];
            });
        } else {
            const { section, questionName, options, description, questionType, correctAnswers, score, negativeMarks } = req.body;
            values.push([section, questionName, JSON.stringify(options), description, questionType, JSON.stringify(correctAnswers), score, negativeMarks]);
        }

        if (values.length > 0) {
            const [result] = await db.query(insertQuery, [values]);
            return res.status(201).json({ message: "Questions added successfully", result });
        } else {
            return res.status(400).json({ message: "Invalid request body" });
        }

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ message: "An unexpected error occurred", error: error.message });
    }
});

// app.post("/createQuestion", (req, res) => {
//     try {
//         console.log(req.body);

//         if (Array.isArray(req.body)) {
//             let responseSent = false; // Flag to ensure only one response is sent
//             req.body.forEach((element, index) => {
//                 const { section, questionName, options, description, questionType, correctAnswer, correctAnswers, score, negativeMarks } = element;
//                 const serializedOptions = JSON.stringify(options);
//                 const serializedCorrectAnswer = JSON.stringify(correctAnswers);

//                 console.log(typeof serializedOptions);
//                 console.log(serializedCorrectAnswer);

//                 const query = 'INSERT INTO questions(section, questionName, options, description, questionType, correctAnswer, score, negativeMarks) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
//                 db.query(query, [section, questionName, serializedOptions, description, questionType, serializedCorrectAnswer, score, negativeMarks], (err, result) => {
//                     if (err) {
//                         console.log(err);
//                         if (!responseSent) {
//                             return res.status(500).send("Error while adding question");
//                         }
//                     } else {
//                         if (!responseSent) {
//                             res.status(201).json({ message: "Questions added successfully", result });
//                             responseSent = true; // Mark response as sent
//                         }
//                     }
//                 });
//             });
//         } else {
//             const { section, questionName, options, description, questionType, correctAnswer, correctAnswers, score, negativeMarks } = req.body;
//             const serializedOptions = JSON.stringify(options);
//             const serializedCorrectAnswer = JSON.stringify(correctAnswers);

//             console.log(typeof serializedOptions);
//             console.log(serializedCorrectAnswer);

//             const query = 'INSERT INTO questions(section, questionName, options, description, questionType, correctAnswer, score, negativeMarks) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
//             db.query(query, [section, questionName, serializedOptions, description, questionType, serializedCorrectAnswer, score, negativeMarks], (err, result) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).send("Error while adding question");
//                 }
//                 return res.status(201).json({ message: "Question added successfully", result });
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send("An unexpected error occurred");
//     }
// });


app.get("/getAllQuestions/:section", async (req, res) => {
    const { section } = req.params;
    console.log(section);
    try {
        const query = "SELECT * FROM questions where section = ?";
        const [result] = await db.query(query, [section]); // Using the promise API with async/await
        console.log(result);

        return res.status(200).json({
            message: "Questions retrieved successfully",
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("An unexpected error occurred");
    }
});

app.get("/getQuestionsBy/:ID", async (req, res) => {
    try {
        const { ID } = req.params;
        console.log(ID);
        const query = "SELECT * FROM questions WHERE QID=?";
        const [result] = await db.query(query, [ID]);

        // Transform the result to parse JSON fields
        const formattedResult = result.map(question => ({
            ...question,
            options: JSON.parse(question.options),
            correctAnswer: JSON.parse(question.correctAnswer)
        }));

        return res.status(200).json({
            message: "Question fetched successfully based on examId",
            result: formattedResult
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("An unexpected error occurred");
    }
});




// Distinct Domains
app.get("/Domains", async (req, res) => {
    try {
        const domains = await db2.query('SELECT DISTINCT domain FROM intern_data');
        const result = domains[0];
        console.log(result);
        res.status(200).json({ message: "Got All domains", result });
    } catch (err) {
        console.error("Database query error: ", err);
        res.status(500).json({ message: "Server error" });
    }
});


// Batches in a particular domains
app.get("/Domain_batches", async (req, res) => {
    const { domain } = req.query; // Extract the domain parameter from the query
    console.log(domain);
    try {
        const batches = await db2.query(
            'SELECT DISTINCT batchNo FROM intern_data WHERE domain = ?',
            [domain]
        );
        const result = batches[0];
        console.log(result);
        if (result.length === 0) {
            return res.status(404).json({ message: `No batches found for domain: ${domain}` });
        }
        res.status(200).json({ message: `Got all batches for domain: ${domain}`, result });
    } catch (err) {
        console.error("Database query error: ", err);
        res.status(500).json({ message: "Server error" });
    }
});


//Students list in SA 
app.get("/intern_data", async (req, res) => {
    try {
        const rows = await db2.query('SELECT * FROM intern_data order by candidateID desc');
        res.status(200).json(rows);
    } catch (err) {
        console.error("Database query error: ", err);
        res.status(500).json({ message: "Server error" });
    }
});


//Student profile for SA && Intern Profile
app.get("/intern_data/:id", async (req, res) => {
    const internID = req.params.id;

    try {
        const rows = await db2.query('SELECT * FROM intern_data WHERE candidateID = ?', [internID]);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Database query error: ", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/getExamByID", async (req, res) => {
    try {
        const { ID } = req.query;
        console.log(ID);

        const query = "SELECT * FROM exams WHERE ID = ?";
        const [result] = await db.query(query, [ID]); // Use await to handle the promise
        console.log(result);
        if (!result.length) {
            return res.status(404).json({ message: "Exam not found" });
        }

        return res.status(200).json({ message: "Got Exam", result: result[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).send("An unexpected error occurred");
    }
});

app.get("/getCandidateExams", async (req, res) => {
    console.log(req.query.ID);
    try {
        const ID = req.query.ID;
        console.log(ID);

        // Query to join `assignedExams` and `exams` table
        const query = `
            SELECT 
                ae.internID, 
                ae.examID, 
                ae.examStatus,
                e.*
            FROM 
                assignedExams ae
            JOIN 
                exams e
            ON 
                ae.examID = e.ID
            WHERE 
                ae.internID = ?`;

        const [result] = await db.query(query, [ID]);
        console.log(result);

        return res.status(200).json({ message: "Got Exams List", result });
    } catch (error) {
        console.error(error);
        return res.status(500).send("An unexpected error occurred");
    }
});


app.get('/admin_dashboardData', async (req, res) => {
    try {
        // Fetching exam data (IDs and dates)
        const GraphData = await db.query(`SELECT ID, conductedOn FROM exams`);

        // Check the structure of GraphData to ensure it's correct
        console.log('GraphData:', GraphData);

        // Fetching other required data
        const TotalExamsResult = await db.query(`SELECT count(*) as count FROM exams`);
        const TotalCandidatesResult = await db2.query(`SELECT count(*) as count FROM intern_data`);
        const DomainCountResult = await db2.query(`SELECT DISTINCT(domain) FROM intern_data`);
        const SectionCountResult = await db.query(`SELECT count(*) as count FROM sections`);
        const QuestionCountResult = await db.query(`SELECT count(*) as count FROM questions`);

        // Extracting values from the nested query results
        const TotalExams = TotalExamsResult[0]?.[0]?.count || 0;
        const TotalCandidates = TotalCandidatesResult[0]?.[0]?.count || 0;
        const DomainCount = DomainCountResult[0]?.length || 0; // Count of unique domains
        const SectionCount = SectionCountResult[0]?.[0]?.count || 0;
        const QuestionCount = QuestionCountResult[0]?.[0]?.count || 0;

        // Check the structure of the data to ensure the mapping works correctly
        if (GraphData && Array.isArray(GraphData)) {
            const formattedGraphData = GraphData[0].map((item) => ({
                examID: item.ID,
                dateConducted: item.conductedOn
            }));

            // Preparing the DashboardData object
            const DashboardData = {
                GraphData: formattedGraphData,
                TotalExams,
                TotalCandidates,
                DomainCount,
                SectionCount,
                QuestionCount,
            };

            console.log('DashboardData:', DashboardData);

            res.json(DashboardData);
        } else {
            res.status(500).json({ error: 'Failed to fetch graph data' });
        }
    } catch (error) {
        console.error('Error fetching Dashboard Data:', error);
        res.status(500).json({ error: 'Failed to fetch Dashboard Data' });
    }
});



app.get("/getExamsWithQuestions", async (req, res) => {
    try {
        const { ID } = req.query;
        console.log(ID);


        if (!ID) {
            return res.status(400).json({ message: "ID is required" });
        }

        // // Create a connection pool
        // const db = await mysql.createPool(dbConfig);

        // Query to fetch exams
        const examsQuery = "SELECT ID, examName, duration, questions, section FROM exams WHERE ID=?";
        const [exams] = await db.query(examsQuery, [ID]);

        if (!exams || exams.length === 0) {
            return res.status(404).json({ message: "No exams found for the given ID" });
        }

        // Query to fetch questions for each section
        const questionsQuery = "SELECT * FROM questions WHERE section=?";
        const examsWithQuestions = await Promise.all(
            exams.map(async (exam) => {
                const [questions] = await db.query(questionsQuery, [exam.section]);
                return {
                    ...exam,
                    questionsList: questions || [],
                };
            })
        );

        // Send the final response
        return res.status(200).json({
            message: "Successfully retrieved exams and questions list",
            exams: examsWithQuestions,
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "An unexpected error occurred", error: error.message });
    }
});

app.put("/updateAssignedExams", async (req, res) => {
    try {
        const { InternID, ExamID, examStatus, responses, Start_time, end_time, score } = req.body;
        console.log(req.body);

        const serializedResponses = JSON.stringify(responses);
        const query = `UPDATE assignedExams SET examStatus = ?, responses = ?, Start_time = ?, end_time = ?, score = ? WHERE InternID = ? AND ExamID=?`;

        const [result] = await db.query(query, [examStatus, serializedResponses, Start_time, end_time, score, InternID, ExamID]);

        console.log(result);
        return res.status(200).json({ message: "Exam Details Updated Successfully", result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err });
    }
});


app.get("/getAssignedExams/:examID", async (req, res) => {
    try {
        const { examID } = req.params; // Retrieve from URL path parameters
        console.log(examID);

        const query = "select * from assignedExams where ExamID=?";

        const [result] = await db.query(query, [examID]);
        return res.status(200).json({ message: "Exam Details Updated Successfully", result });
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err });
    }
});


app.get('/api/question/:qid', async (req, res) => {
    const { qid } = req.params;
    console.log(qid);
    const query = 'SELECT * FROM questions WHERE QID = ?';

    try {
        // Use the query with a promise
        const [rows] = await db.query(query, [qid]);

        console.log(rows[0]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json(rows[0]); // Send the first matching question
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while retrieving the question.' });
    }
});


app.delete('/api/question/:qid', async (req, res) => {
    const { qid } = req.params;
    console.log(`Deleting question with QID: ${qid}`);

    const query = 'DELETE FROM questions WHERE QID = ?';

    try {
        // Perform the delete operation
        const [result] = await db.query(query, [qid]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json({ message: `Question with QID: ${qid} deleted successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while deleting the question.' });
    }
});



// app.get('/Section_UsedIn/:section', async (req, res) => {
//     const { section } = req.params;
//     console.log(section);
//     const query1 = 'SELECT * FROM exams WHERE section = ?';
//     const query2 = 'select * from GlobalExams where questionsSection = ?'

//     try {
//         // Use the query with a promise
//         const [rows] = await db.query(query, [section]);

//         console.log(rows);
//         if (rows.length === 0) {
//             return res.status(404).json({ message: 'No exams Found' });
//         }

//         res.status(200).json(rows); // Send the first matching question
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'An error occurred while retrieving the question.' });
//     }
// });

app.get('/Section_UsedIn/:section', async (req, res) => {
    const { section } = req.params;
    console.log(section);

    const query1 = 'SELECT * FROM exams WHERE section = ?';
    const query2 = 'SELECT * FROM GlobalExams WHERE questionsSection = ?';

    try {
        // Execute both queries concurrently
        const [exams] = await db.query(query1, [section]);
        const [globalExams] = await db.query(query2, [section]);

        res.status(200).json({ exams, globalExams });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while retrieving the data.' });
    }
});


app.delete("/deleteSection/:section", async (req, res) => {
    try {
        const { section } = req.params;
        console.log(section);

        const query01 = "DELETE FROM sections WHERE section=?";
        const query02 = "DELETE FROM questions WHERE section=?";

        await db.query(query01, [section]);
        await db.query(query02, [section]);


        res.status(200).json({ message: "Section deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while deleting section", error });
    }
});


app.get("/getAssignedExams/:examID", async (req, res) => {
    try {
        const { examID } = req.params; // Retrieve from URL path parameters
        console.log(examID);

        const query = "select * from assignedExams where ExamID=?";

        const [result] = await db.query(query, [examID]);
        return res.status(200).json({ message: "Exam Details Updated Successfully", result });
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err });
    }
})

app.get("/getMeritList/:examID", async (req, res) => {
    try {
        const { examID } = req.params; // Retrieve from URL path parameters
        console.log(examID);

        const query = "SELECT * FROM assignedExams WHERE ExamID = ? AND examStatus = 1";

        const [result] = await db.query(query, [examID]);

        // Sort by score in descending order (highest score first)
        const sortedMeritList = result.sort((a, b) => parseInt(b.score) - parseInt(a.score));
        console.log(sortedMeritList);


        return res.status(200).json({
            message: "Merit List Retrieved Successfully",
            meritList: sortedMeritList
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error });
    }
});


app.get("/getExamByID/:ID", async (req, res) => {
    try {
        const { ID } = req.params;
        console.log(ID);

        const query = "SELECT * FROM exams WHERE ID = ?";
        const [result] = await db.query(query, [ID]); // Use await to handle the promise
        console.log(result);
        if (!result.length) {
            return res.status(404).json({ message: "Exam not found" });
        }

        return res.status(200).json({ message: "Got Exam", result: result[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).send("An unexpected error occurred");
    }
});



app.put("/updateQuestion", async (req, res) => {
    try {
        // const { ID } = req.params;
        const { QID, section, questionName, options, description, questionType, correctAnswer, score, negativeMarks } = req.body;
        console.log(req.body);

        const serializedOptions = JSON.stringify(options);
        const serializedCorrectAnswer = JSON.stringify(correctAnswer);

        console.log(typeof serializedOptions);
        console.log(serializedCorrectAnswer);

        const query = `UPDATE questions SET section = ?, questionName = ?, options = ?, description = ?, questionType = ?, correctAnswer = ?, score = ?, negativeMarks = ? WHERE QID = ?;`;

        const [result] = await db.query(query, [section, questionName, serializedOptions, description, questionType, serializedCorrectAnswer, score, negativeMarks, QID]);
        return res.status(201).json({ message: "Exam Details Updated Successfully", result });


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err });
    }
})



app.get("/getExamByCandidateID/:candidateId", async (req, res) => {
    try {
        const { candidateId } = req.params;

        console.log(candidateId);


        const query = "select * from assignedExams where internID=?";
        const [result] = await db.query(query, [candidateId]);

        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        return res.status(500).send("An Expected Error")

    }

})

app.post("/raiseTicket", async (req, res) => {
    try {
        const { candidateID, ticketCategory, ticketSubject, ticketDescription } = req.body;
        const ticketRaisedTime = new Date();
        const query = `INSERT INTO tickets(candidateID, ticketCategory, ticketSubject, ticketDescription, ticketRaisedTime) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(query, [candidateID, ticketCategory, ticketSubject, ticketDescription, ticketRaisedTime]);

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send("An Expected Error")
    }

})

app.get("/getTickets", async (req, res) => {
    try {
        const query = "select * from tickets";
        const [result] = await db.query(query);
        return res.json(result);
    } catch (error) {
        console.error(error);


        return res.status(500).send("An error occured");
    }

})




// SuperAdmin Login
app.post('/api/SAlogin', [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
], async (req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const rows = await db2.query('SELECT * FROM superadmin WHERE username = ? AND password = ?', [username, password]);
        if (rows[0].length > 0) {
            const user = rows[0];
            console.log(user);
            console.log(user.name, "Logged in successfully");
            res.status(200).json({ message: 'Logged in successfully', name: user.name, SAid: user.SAid });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});




app.post("/api/normal-login", [check('mobileNo', 'Mobile number is required').not().isEmpty()], async (request, res) => {
    const { mobileNo } = request.body;
    console.log("Mobile Num: " + mobileNo);

    try {
        const isIntern = await db2.query('SELECT * FROM intern_data WHERE mobileNo = ?', [mobileNo]);
        if (isIntern[0].length > 0) {
            const intern = isIntern[0];
            console.log("Intern data:", intern);

            if (intern.blockProfile) {
                console.log("Blocked Intern");
                return res.status(403).json({ message: "Your profile is blocked. Please contact support." });
            }
            res.cookie('internID', intern.candidateID, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return res.status(200).json({
                message: 'Login successful!',
                intern,
                type: "intern"
            });
        }

        console.log("User is not registered");
        return res.status(400).json({ message: "User not found, Please register!" });
    } catch (error) {
        console.error("Catch error:", error);
        return res.status(500).json({ message: "Internal server error at normal login" });
    }
}
);


app.post("/createGlobalExam", async (req, res) => {
    const {
        examName, examToken, examStatus, totalMarks, correctAnswerMarks, wrongAnswerMarks,
        duration, examStartTime, noOfQuestions, questionsSection, randomizeQuestions,
        unusualBehavior, submissionType, showResults, liveSupport, PassMark, examEndTime
    } = req.body;

    console.log(req.body);
    try {
        // Convert ISO datetime string to MySQL format
        const formattedExamStartTime = new Date(examStartTime).toISOString().slice(0, 19).replace("T", " ");

        // Insert exam into the `GlobalExams` table
        const insertExamQuery = `
            INSERT INTO GlobalExams (
                examName, examToken, examStatus, totalMarks, correctAnswerMarks, wrongAnswerMarks,
                duration, examStartTime, noOfQuestions, questionsSection, randomizeQuestions,
                unusualBehavior, submissionType, showResults, liveSupport, PassMark, examEndTime
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [examResult] = await db.query(insertExamQuery, [
            examName, examToken, examStatus || "creation", totalMarks, correctAnswerMarks, wrongAnswerMarks,
            duration, formattedExamStartTime, noOfQuestions, questionsSection,
            randomizeQuestions === "true", unusualBehavior === "true",
            submissionType, showResults === "true", liveSupport === "true", PassMark, examEndTime
        ]);

        const examID = examResult.insertId;

        return res.status(201).json({
            message: "Exam created successfully",
            examID
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating the exam", error: err });
    }
});

app.put("/updateGlobalExam/:examToken", async (req, res) => {
    const { examToken } = req.params;
    const updateFields = req.body;
    console.log(examToken, updateFields);


    if (!examToken) {
        return res.status(400).json({ message: "Exam token is required" });
    }

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No fields provided for update" });
    }

    try {
        let updateQuery = "UPDATE GlobalExams SET ";
        const values = [];

        for (const [key, value] of Object.entries(updateFields)) {
            if (key === "createdOn") continue; // Skip createdOn field

            if (key === "examStartTime" || key === "examEndTime") {
                values.push(new Date(value).toISOString().slice(0, 19).replace("T", " "));
            } else if (typeof value === "object") {
                values.push(JSON.stringify(value)); // Convert object to JSON string
            } else {
                values.push(value);
            }
            updateQuery += `${key} = ?, `;
        }

        if (values.length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }

        updateQuery = updateQuery.slice(0, -2); // Remove trailing comma
        updateQuery += " WHERE examToken = ?";
        values.push(examToken);

        const [updateResult] = await db.query(updateQuery, values);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "Exam not found or no changes applied" });
        }

        return res.status(200).json({ message: "Exam updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating the exam", error: err });
    }

});




app.get("/getGlobalExams", async (req, res) => {
    console.log(req.query);
    try {
        const query = "SELECT ID, examName, examToken, duration, totalMarks, createdOn, examStartTime, examStatus FROM GlobalExams order by ID desc";
        const [result] = await db.query(query);
        const results = result.map((exam) => ({
            ...exam,
            createdOn: new Date(exam.createdOn).toISOString().slice(0, 10), // Extract YYYY-MM-DD
            examStartTime: new Date(exam.examStartTime).toISOString().slice(0, 10) // Extract YYYY-MM-DD
        }));
        console.log(results);
        return res.status(200).json({ message: "Got Exams List", results });
    } catch (error) {
        console.error(error);
        return res.status(500).send("An unexpected error occurred");
    }
});


app.put("/updateExamStatus", async (req, res) => {
    const { examID, newStatus } = req.body;

    try {
        const updateQuery = "UPDATE GlobalExams SET examStatus = ? WHERE ID = ?";
        await db.query(updateQuery, [newStatus, examID]);

        res.status(200).json({ message: "Exam status updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating exam status", error: err });
    }
});



app.get("/getGlobalExamsWithQuestions", async (req, res) => {
    try {
        const { examToken } = req.query;
        console.log("Received examToken:", examToken);

        if (!examToken) {
            return res.status(400).json({ message: "examToken is missing" });
        }

        const examsQuery = "SELECT * FROM GlobalExams WHERE examToken = ?";
        const [examDetails] = await db.query(examsQuery, [examToken]);

        console.log("Exam details:", examDetails);

        if (!examDetails || examDetails.length === 0) {
            return res.status(404).json({ message: "No exams found for the given Token" });
        }

        const section = examDetails[0]?.questionsSection; // Access the first exam record

        if (!section) {
            return res.status(400).json({ message: "questionsSection is missing in the exam details" });
        }

        console.log("Fetching questions for section:", section);

        const questionsQuery = "SELECT * FROM questions WHERE section = ?";
        const [questions] = await db.query(questionsQuery, [section]);

        console.log("Questions fetched:", questions);

        return res.status(200).json({
            message: "Successfully retrieved exams and questions list",
            result: {
                examDetails: examDetails[0], // Return only the first exam details
                questions,
            },
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "An unexpected error occurred", error: error.message });
    }
});


app.get("/api/getExamDetails/:TId", async (req, res) => {

    console.log(" get exam details using tid api called");
    const { TId } = req.params;
    console.log(TId);

    if (!TId) {
        return res.status(400).json({ message: "TId parameter is required" });
    }

    try {
        const query = "SELECT * FROM GlobalExams WHERE examToken = ?";
        const [result] = await db.query(query, [TId]);
        console.log(result);
        if (result.length === 0) {
            return res.status(404).json({ message: "Exam not found" });
        }

        res.status(200).json({ message: "Got Exam Data", result: result[0] });
    } catch (err) {
        console.error("Error fetching exam details:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/api/getHallTicketDetails/:TId/:HId", async (req, res) => {

    const { TId, HId } = req.params;
    console.log(TId, HId);

    if (!TId || !HId) {
        return res.status(400).json({ message: "parameters is required" });
    }

    try {
        const query = "SELECT * FROM GlobalResponses WHERE examToken = ? and hallTicketID = ?";
        const [result] = await db.query(query, [TId, HId]);
        console.log(result);
        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Got User Info", result: result[0] });
    } catch (err) {
        console.error("Error fetching user details:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});



app.get("/GlobalExamDetailsByID", async (req, res) => {
    try {
        const { ID } = req.query;
        console.log(ID);

        const query = "SELECT * FROM GlobalExams WHERE ID = ?";
        const [result] = await db.query(query, [ID]);
        console.log(result);
        if (!result.length) {
            return res.status(404).json({ message: "Exam not found" });
        }

        return res.status(200).json({ message: "Got Exam", result: result[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).send("An unexpected error occurred");
    }
});


app.post("/api/register", async (req, res) => {
    try {
        const { name, email, mobile, yearOfPassing, collegeName, examToken } = req.body;
        console.log(req.body);

        if (!name || !email || !mobile || !examToken) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the user already exists
        const [checkResults] = await db.query(
            `SELECT ID FROM GlobalResponses WHERE (candidateEmail = ? OR candidateMobile = ?) AND examToken = ?`,
            [email, mobile, examToken]
        );

        if (checkResults.length > 0) {
            return res.status(409).json({ message: "User already registered" });
        }

        // Insert new registration
        const [results] = await db.query(
            `INSERT INTO GlobalResponses (examToken, candidateName, candidateEmail, candidateMobile, candidateYOP, candidateCollege, examStatus)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [examToken, name, email, mobile, yearOfPassing, collegeName, 0]
        );

        res.json({ message: "Registration successful", registrationID: results.insertId });

    } catch (error) {
        console.error("Error handling registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/api/registrations", async (req, res) => {
    const token = req.query.token;  // Extract correct token
    console.log("Received token:", token);
    try {
        const [registrations] = await db.query(
            `SELECT ID, examToken, candidateName, candidateEmail, candidateMobile, hallTicketID, examStatus, createdOn, SentHallTicketMail
             FROM GlobalResponses WHERE examToken = ?`, [token]  // ✅ Use parameterized query to prevent SQL injection
        );

        res.json({ success: true, data: registrations });
    } catch (error) {
        console.error("Error fetching registrations:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.get("/api/submissions", async (req, res) => {
    const token = req.query.token;  // Extract correct token
    console.log("Received token:", token);
    try {
        const [submissions] = await db.query(
            `SELECT ID, candidateName, candidateEmail, candidateMobile, hallTicketID, examStatus, results 
             FROM GlobalResponses WHERE examToken = ?`, [token]
        );

        res.json({ success: true, data: submissions });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


app.get("/api/MeritList", async (req, res) => {
    const token = req.query.token;
    console.log("Received token:", token);

    try {
        // Fetch PassMark and totalMarks from GlobalExams table
        const [examData] = await db.query(
            `SELECT PassMark, totalMarks FROM GlobalExams WHERE examToken = ?`,
            [token]
        );

        if (examData.length === 0) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        const { PassMark, totalMarks } = examData[0];

        // Fetch candidates who participated in the exam
        const [submissions] = await db.query(
            `SELECT ID, candidateName, candidateEmail, candidateMobile, hallTicketID, examStatus, results 
             FROM GlobalResponses WHERE examToken = ?`,
            [token]
        );

        // Filter candidates who scored more than the PassMark percentage
        const meritList = submissions.filter(candidate => {
            const percentage = (candidate.results / totalMarks) * 100;
            return percentage > PassMark;
        });

        res.json({ success: true, data: meritList });
    } catch (error) {
        console.error("Error fetching merit list:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


app.get("/api/email-logs", async (req, res) => {
    try {
        const response = await axios.get("https://zeptomail.zoho.com/api/v1.1/logs?limit=50", {
            headers: {
                Authorization: `Zoho-oauthtoken ${process.env.ZEPTO_ACCESS_TOKEN}`,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching email logs:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch email logs" });
    }
});


app.post('/api/save-hallticket', upload.single('backgroundImage'), async (req, res) => {
    try {
        const { examID, hallTicketIDFormat, examName, examDate, examTimings } = req.body;

        console.log(req.body);
        if (!examID) {
            return res.status(400).json({ error: 'examID is required' });
        }

        const backgroundImagePath = req.file ? `/uploads/GlobalExamBGS/${req.file.filename}` : null;

        const hallTicketFormat = JSON.stringify({
            hallTicketIDFormat: JSON.parse(hallTicketIDFormat),
            backgroundImage: backgroundImagePath || null,
            examName,
            examDate,
            examTimings
        });

        const query = 'UPDATE GlobalExams SET HallTicketFormat = ? WHERE ID = ?';
        const [result] = await db.query(query, [hallTicketFormat, examID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Exam not found or no changes made' });
        }

        res.status(200).json({
            message: 'Hall Ticket Format saved successfully',
            hallTicketFormat,
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Database update error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});


// Update Hall Ticket Format
app.put('/api/update-hallticket/:examID', upload.single('backgroundImage'), async (req, res) => {
    try {
        const { examID } = req.params;
        const { hallTicketIDFormat, examName, examDate, examTimings } = req.body;

        const backgroundImagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const hallTicketFormat = JSON.stringify({
            hallTicketIDFormat: JSON.parse(hallTicketIDFormat),
            backgroundImage: backgroundImagePath || null,
            examName,
            examDate,
            examTimings
        });

        const query = 'UPDATE GlobalExams SET HallTicketFormat = ? WHERE ID = ?';
        const [result] = await db.query(query, [hallTicketFormat, examID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Exam not found or no changes made' });
        }

        res.status(200).json({
            message: 'Hall Ticket Format updated successfully',
            hallTicketFormat,
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Database update error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.get('/api/get-hallticket/:examID', async (req, res) => {
    const { examID } = req.params;

    if (!examID) {
        return res.status(400).json({ error: 'Exam ID is required' });
    }

    try {
        const query = 'SELECT HallTicketFormat FROM GlobalExams WHERE ID = ?';
        const [rows] = await db.query(query, [examID]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Hall Ticket data not found' });
        }

        const hallTicketFormat = rows[0].HallTicketFormat;

        if (!hallTicketFormat) {
            return res.status(404).json({ error: 'Hall Ticket format is empty' });
        }

        let parsedFormat;

        try {
            parsedFormat = hallTicketFormat;
        } catch (jsonError) {
            console.error('Invalid HallTicketFormat JSON:', jsonError);
            return res.status(500).json({ error: 'Hall Ticket data is corrupted' });
        }

        res.status(200).json(parsedFormat);
    } catch (error) {
        console.error('Database fetch error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});



app.get('/api/get-mailingFormat/:examID', async (req, res) => {
    try {
        const { examID } = req.params;
        const query = 'SELECT MailingFormat FROM GlobalExams WHERE ID = ?';
        const [rows] = await db.query(query, [examID]);

        console.log(rows);
        if (rows.length === 0 || !rows[0].MailingFormat) {
            return res.status(404).json({ error: 'Hall Ticket data not found' });
        }

        const MailingFormat = rows[0].MailingFormat;
        res.status(200).json(MailingFormat);
    } catch (error) {
        console.error('Database fetch error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});


// API to store Mailing format
app.post("/api/save-mailingFormat", async (req, res) => {
    try {
        const { examID, subject, content } = req.body;
        console.log(req.body);

        if (!examID) {
            return res.status(400).json({ error: "examID is required" });
        }

        const MailingFormat = JSON.stringify({
            subject,
            content,
        });

        const query = "UPDATE GlobalExams SET MailingFormat = ? WHERE ID = ?";
        const [result] = await db.query(query, [MailingFormat, examID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Exam not found or no changes made" });
        }

        res.status(200).json({
            message: "Mailing format updated successfully",
            affectedRows: result.affectedRows,
        });
    } catch (error) {
        console.error("Database update error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});


app.get('/api/get-OfferMailingFormat/:examID', async (req, res) => {
    try {
        const { examID } = req.params;
        console.log(examID);
        const query = 'SELECT OfferMailFormat FROM GlobalExams WHERE ID = ?';
        const [rows] = await db.query(query, [examID]);
        console.log(rows);

        if (rows.length === 0 || !rows[0].OfferMailFormat) {
            return res.status(404).json({ error: 'Offer Mailing Format not found' });
        }

        const OfferMailFormat = rows[0].OfferMailFormat;
        res.status(200).json(OfferMailFormat);
    } catch (error) {
        console.error('Database fetch error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});


// API to store Mailing format
app.post("/api/save-OfferMailingFormat", async (req, res) => {
    try {
        const { examID, subject, content } = req.body;
        console.log(req.body);

        if (!examID) {
            return res.status(400).json({ error: "examID is required" });
        }

        const MailingFormat = JSON.stringify({
            subject,
            content,
        });

        const query = "UPDATE GlobalExams SET OfferMailFormat = ? WHERE ID = ?";
        const [result] = await db.query(query, [MailingFormat, examID]);

        console.log(result);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Exam not found or no changes made" });
        }

        res.status(200).json({
            message: "Mailing format updated successfully",
            affectedRows: result.affectedRows,
        });
    } catch (error) {
        console.error("Database update error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});



app.post("/generateHallTickets", async (req, res) => {
    try {
        const { examToken, hallTicketIDFormat } = req.body;

        console.log(req.body);

        if (!examToken || !hallTicketIDFormat) {
            return res.status(400).json({ success: false, message: "Missing required parameters" });
        }

        const { static: prefix, range } = hallTicketIDFormat;
        const [start, end] = range.split("-").map(Number);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ success: false, message: "Invalid range format" });
        }

        // Fetch examID using examToken
        const [examData] = await db.query(
            "SELECT ID FROM GlobalExams WHERE examToken = ?",
            [examToken]
        );

        if (examData.length === 0) {
            return res.status(404).json({ success: false, message: "Exam not found." });
        }



        const [lastTicket] = await db.query(
            `SELECT hallTicketID FROM GlobalResponses 
             WHERE examToken = ? AND hallTicketID IS NOT NULL 
             ORDER BY ID DESC LIMIT 1`,
            [examToken]
        );

        console.log(lastTicket);

        let lastAssignedNumber = lastTicket.length > 0
            ? parseInt(lastTicket[0].hallTicketID.replace(prefix, ""), 10) || start - 1
            : start - 1;

        console.log(lastAssignedNumber);

        // Fetch students without hall tickets
        const [students] = await db.query(
            "SELECT ID FROM GlobalResponses WHERE examToken = ? AND hallTicketID IS NULL ORDER BY ID ASC LIMIT ?",
            [examToken, end - start + 1]
        );

        console.log(students, start, end);

        if (students.length === 0) {
            return res.status(400).json({ success: false, message: "No students found or all hall tickets already assigned." });
        }

        const updates = students.map((student) => {
            lastAssignedNumber += 1;
            return [`${prefix}${String(lastAssignedNumber).padStart(range.split("-")[0].length, "0")}`, student.ID];
        });

        // Bulk update query to assign hall tickets
        await db.query(
            "UPDATE GlobalResponses SET hallTicketID = CASE " +
            updates.map(([hallTicketID, id]) => `WHEN ID = ${id} THEN '${hallTicketID}'`).join(" ") +
            " END WHERE ID IN (" + updates.map(([_, id]) => id).join(",") + ")"
        );

        res.status(200).json({ success: true, message: "Hall tickets generated successfully." });

    } catch (error) {
        console.error("Error generating hall tickets:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});



app.get("/api/email-logs", async (req, res) => {
    try {
        const response = await axios.get("https://zeptomail.zoho.com/api/v1.1/logs?limit=50", {
            headers: {
                Authorization: `PHtE6r0LReju2DYu9RJTsfC+F5alZtx/r+lgLglGt4wWCPEGGk0D+I99ljbm/R4iXfVLQfOfmYppsO7JtbrXc2rvNGoaCGqyqK3sx/VYSPOZsbq6x00ct1QffkTYUILscd5v3SHWstjeNA==`,
            },
        });

        res.json(response.data);
    } catch (error) {
        // console.log(error.response);
        //   console.error("Error fetching email logs:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch email logs" });
    }
});




app.put("/SaveGlobalResponse", async (req, res) => {
    try {
        const { hallTicketID, examToken, examStatus, timeDetails, responseDetails, results } = req.body;
        console.log(req.body);

        const query = `UPDATE GlobalResponses SET examStatus = ?, responseDetails = ?, timeDetails = ?, results = ? WHERE hallTicketID = ? AND examToken=?`;

        const [result] = await db.query(query, [examStatus, JSON.stringify(responseDetails), JSON.stringify(timeDetails), results, hallTicketID, examToken]);
        console.log(result);

        return res.status(200).json({ message: "Responses Saved Successfully", result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err });
    }
});



app.get("/api/ExamReport", async (req, res) => {
    const token = req.query.token;
    console.log("Received token:", token);

    try {
        // Get total registrations
        const [[{ registrations }]] = await db.query(
            `SELECT COUNT(*) AS registrations FROM GlobalResponses WHERE examToken = ?`,
            [token]
        );


        // Fetch exam details (PassMark & totalMarks)
        const [[examData]] = await db.query(
            `SELECT PassMark, totalMarks FROM GlobalExams WHERE examToken = ?`,
            [token]
        );

        if (!examData) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        const { PassMark, totalMarks } = examData;

        console.log(PassMark, totalMarks);

        // Fetch all student submissions
        const [submissions] = await db.query(
            `SELECT count(*) FROM GlobalResponses WHERE examToken = ? and examStatus = 1`,
            [token]
        );

        // Count students who attempted the exam
        const totalStudents = submissions.length;

        // Count qualified students
        const qualifiedStudents = submissions.filter(candidate => {
            return candidate.results && (candidate.results / totalMarks) * 100 >= PassMark;
        }).length;

        res.json({
            success: true,
            registrations,
            totalStudents,
            qualifiedStudents
        });

    } catch (error) {
        console.error("Error fetching exam report:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

const isValidEmail = (input) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
};

const isValidMobile = (input) => {
    return /^[0-9]{10}$/.test(input);
};


app.post('/api/fetchResult', async (req, res) => {
    const { examToken, searchInput } = req.body;

    console.log(examToken, searchInput);
    if (!examToken || !searchInput) {
        return res.status(400).json({ message: "examToken and searchInput are required." });
    }

    let searchColumn;

    if (isValidEmail(searchInput)) {
        searchColumn = 'candidateEmail';
    } else if (isValidMobile(searchInput)) {
        searchColumn = 'candidateMobile';
    } else {
        searchColumn = 'hallTicketID';
    }


    try {
        const [rows] = await db.query(
            `SELECT candidateName, candidateEmail, examStatus, results FROM GlobalResponses WHERE examToken = ? AND ${searchColumn} = ?`,
            [examToken, searchInput]
        );

        console.log(rows);

        const data = rows[0];

        const [[examData]] = await db.query(
            `SELECT PassMark, totalMarks FROM GlobalExams WHERE examToken = ?`,
            [examToken]
        );

        if (!examData) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        const result = {
            data,
            examData
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: "No result found for the given input." });
        }

        return res.status(200).json({ result: result });

    } catch (error) {
        console.error("Error fetching result:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});





app.put("/SaveGlobalFeedback", async (req, res) => {
    try {
        const { hallTicketID, examToken, stars, feedback } = req.body;
        console.log(req.body);

        const query = `UPDATE GlobalResponses SET feedback = ? WHERE hallTicketID = ? AND examToken = ?`;
        const feedbackData = JSON.stringify({ stars, feedback }); // Combine into one object

        const [result] = await db.query(query, [feedbackData, hallTicketID, examToken]);

        console.log(result);

        return res.status(200).json({ message: "Feedback Saved Successfully", result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err });
    }
});