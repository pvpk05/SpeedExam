/* eslint-disable no-unused-vars*/
/* eslint-disable react/prop-types */

import React, { useEffect, useState, useRef } from 'react'
import Typography from '@mui/material/Typography';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactQuill from 'react-quill';
import Service from '../../../service/Service';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faTimes, faUsers, faShoppingCart, faWrench, faUser, faBell, faHandPointLeft, faHandPointRight, faUpload } from '@fortawesome/free-solid-svg-icons';

import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';


function QuestionImport({ onBulkUpload }) {
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleButtonClick = () =>
        fileInputRef.current.click();

    const handleFileUpload = (e) => {
        setIsLoading(true);
        const file = e.target.files[0];

        if (!file) {
            setIsLoading(false);
            return
        };

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const formattedData = formatData(json);
                onBulkUpload(formattedData);
            } catch (error) {
                console.error('Error parsing file:', error);
            }
        };

        reader.onerror = (error) => {
            console.error('Error reading file:', error);
        };

        reader.readAsArrayBuffer(file);
    };

    const formatData = (json) => {
        const headers = json[0];
        const data = json.slice(1);

        const pages_data = [];

        data.forEach((row) => {
            const question = {
                QID: row[headers.indexOf('S No.')],
                section: row[headers.indexOf('SUBJECT')],
                questionName: row[headers.indexOf('QUESTION TEXT')],
                options: [
                    row[headers.indexOf('OPTION1')],
                    row[headers.indexOf('OPTION2')],
                    row[headers.indexOf('OPTION3')],
                    row[headers.indexOf('OPTION4')],
                    row[headers.indexOf('OPTION5')],
                    row[headers.indexOf('OPTION6')],
                    row[headers.indexOf('OPTION7')],
                    row[headers.indexOf('OPTION8')],
                    row[headers.indexOf('OPTION9')],
                    row[headers.indexOf('OPTION10')]
                ].filter(option => option !== null && option !== undefined && (typeof option === 'string' ? option.trim() !== '' : true)),
                description: row[headers.indexOf('EXPLANATION')],
                questionType: row[headers.indexOf('QUESTION TYPE')],
                correctAnswer: [row[headers.indexOf('RIGHT ANSWER')]],
                score: row[headers.indexOf('CORRECT MARKS')],
                negativeMarks: row[headers.indexOf('NEGATIVE MARKS')],
            };
            console.log(question);
            pages_data.push(question);
        });
        console.log(pages_data);
        return {
            pages_data
        };
    };

    return (

        <div style={{ marginLeft: "60px" }}>
            <Button
                variant="outlined"
                onClick={handleButtonClick}
                // disabled={isLoading} // Disable while loading
            >
                <FontAwesomeIcon icon={faUpload} style={{ width: "16px", height: "16px", marginRight: "8px", textTransform: "capitalize" }} />
                {isLoading ? "Processing  Data..." : "Select File"}
            </Button>
            <input
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
            />

            {/* Display file name if uploaded */}
            {fileName && (
                <p style={{ marginTop: "10px", fontWeight: "bold", color: "#333" }}>
                    Uploaded File: {fileName}
                </p>
            )}
        </div>
    )
}

function QuestionBulkUpload({ onBack }) {
    const [bulkData, setBulkData] = useState([]); // Initialize with your data
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value, index) => {
        const updatedBulkData = [...bulkData];

        if (Array.isArray(updatedBulkData[index][field]) && Array.isArray(value)) {
            updatedBulkData[index][field] = [...value];
        } else {
            updatedBulkData[index][field] = value;
        }

        setBulkData(updatedBulkData); // Update the state
    };

    const stripHTML = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    const handleBulkUpload = (data) => {
        setBulkData(data.pages_data);
    };

    const handleRemove = (index) => {
        const data = bulkData.filter((item, i) => i != index);
        setBulkData(data);

    }

    const [sectionsList, setSectionList] = useState([]);
    const sectionList = () => {
        Service.get('/getAllSections').then((res) => {
            console.log(res.data);
            setSectionList(res.data.result);
        })
            .catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        sectionList();
    }, [])

    const handleSelectionChange = (index, optionIndex) => {
        const updatedBulkData = [...bulkData];

        updatedBulkData[index].correctAnswer = [optionIndex]; // or whatever logic you use for the selected index
        setBulkData(updatedBulkData);
    };



    const deleteOption = (questionIndex, optionIndex) => {
        setBulkData((prev) =>
            prev.map((item, idx) =>
                idx === questionIndex
                    ? {
                        ...item,
                        options: item.options.filter((_, optIdx) => optIdx !== optionIndex),
                    }
                    : item
            )
        );
    };


    const handleOptionChange = (index, optionIndex, value) => {
        const updatedBulkData = [...bulkData];
        updatedBulkData[index].options[optionIndex] = value; // Update the label of the specific option
        setBulkData(updatedBulkData);
    };



    const processBulkData = (bulkData) => {
        return bulkData.map((item) => {
            const sanitizedQuestionName = stripHTML(item.questionName);
            let correctAnswers = [];
            const { questionType, options, correctAnswer } = item;

            let updatedOptions = [...options];

            if (questionType === "yesno") {
                updatedOptions = [
                    { label: "Yes", isSelected: correctAnswer[0] === 0 },
                    { label: "No", isSelected: correctAnswer[0] === 1 },
                ];
                correctAnswers = [updatedOptions[correctAnswer[0]].label];
            } else if (questionType === "singleCorrect") {
                correctAnswers =
                    correctAnswer.length > 0 ? [options[correctAnswer[0]]] : [];
            } else if (questionType === "multipleCorrect") {
                correctAnswers = options
                    .filter((option) => option.isSelected)
                    .map((option) => option.label);
            }

            return {
                ...item,
                questionName: sanitizedQuestionName,
                options: updatedOptions,
                correctAnswers,
            };
        });
    };


    const handleCancelBulk = () => {
        setBulkData([]);
    };


    const handleSaveBulk = () => {
        const payloads = processBulkData(bulkData);
        setLoading(true);

        console.log(payloads)
        Service.post("/createQuestion", payloads)
            .then((res) => {
                toast.success("Questions successfully added!");
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                toast.error("Failed to add questions.");
            });
    };


    const handleAddOption = (index) => {
        const updatedBulkData = [...bulkData];
        const item = updatedBulkData[index];

        const newOption = `Option ${item.options.length + 1}`;

        item.options.push(newOption);
        console.log("New Option:", newOption);
        setBulkData(updatedBulkData);
    };



    return (
        <div className="Create_container">

            {/* <Button variant="outlined" onClick={onBack} style={{ marginBottom: "20px", color: "black", border: "2px solid black" }}>
                Back
            </Button> */}

            <Typography gutterBottom style={{ fontSize: "24px", padding: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }}>
                Import Questions
            </Typography>

            <QuestionImport onBulkUpload={handleBulkUpload} />

            <div >
                {bulkData.length > 0 &&
                    <div style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                        {bulkData.map((item, index) => (
                            <div className="bg-light rounded my-4 p-3" key={index}>
                                <form className="my-3">
                                    <div className="d-flex justify-content-end mb-3">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleRemove(index)}
                                        >
                                            Remove Question
                                        </Button>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                                            <InputLabel>Question Type</InputLabel>
                                            <Select
                                                label="Question Type"
                                                value={item.questionType}
                                                name="questionType"
                                                onChange={(e) =>
                                                    handleInputChange("questionType", e.target.value, index)
                                                }
                                            >
                                                <MenuItem value="singleCorrect">Single Correct</MenuItem>
                                                <MenuItem value="multipleCorrect">Multiple Correct</MenuItem>
                                                <MenuItem value="yesno">Yes / No</MenuItem>
                                            </Select>
                                            {/* {err.questionType && <span className="text-danger">{err.questionType}</span>} */}
                                        </FormControl>

                                        <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                                            <InputLabel>Section</InputLabel>
                                            <Select
                                                label="Section"
                                                value={item.section}
                                                name="section"
                                                onChange={(e) => handleInputChange("section", e.target.value, index)}
                                            >
                                                {sectionsList.map((section, index) => (
                                                    <MenuItem key={index} value={section.Section}>
                                                        {section.Section}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {/* {err.section && <span className="text-danger">{err.section}</span>} */}
                                        </FormControl>
                                    </div>

                                    <div className="mb-3">
                                        <ReactQuill
                                            theme="snow"
                                            name="questionName"
                                            value={item.questionName}
                                            onChange={(content) => handleInputChange("questionName", content, index)}
                                            placeholder="Write your question here..."
                                        />
                                        {/* {err.questionName && <span className="text-danger">{err.questionName}</span>} */}
                                    </div>

                                    {item.questionType && (
                                        <div className="p-3">
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAddOption(index)}
                                                className="mb-3"
                                            >
                                                Add Option
                                            </Button>

                                            <div className="mt-3">
                                                {item.questionType === "yesno" ? (
                                                    <RadioGroup
                                                        value={item.correctAnswer[0]}
                                                        onChange={(e) =>
                                                            handleInputChange("correctAnswer", [parseInt(e.target.value, 10)], index)
                                                        }
                                                    >
                                                        <FormControlLabel value={0} control={<Radio />} label="Yes" />
                                                        <FormControlLabel value={1} control={<Radio />} label="No" />
                                                    </RadioGroup>
                                                ) : (
                                                    <div className="row">
                                                        {item.options.map((option, optionIndex) => (
                                                            <div
                                                                key={optionIndex}
                                                                className="col-md-6 d-flex align-items-center mb-2"
                                                            >
                                                                {item.questionType === "multipleCorrect" ? (
                                                                    <Checkbox
                                                                        // checked={option.isSelected}
                                                                        checked={item.correctAnswer.some(element => element.includes(optionIndex + 1))}
                                                                        onChange={() => handleSelectionChange(index, optionIndex + 1)}
                                                                    />
                                                                ) : (
                                                                    <Radio
                                                                        checked={item.correctAnswer.includes(optionIndex + 1)} // Assuming correctAnswer holds the index
                                                                        onChange={() => handleSelectionChange(index, optionIndex + 1)}
                                                                    />
                                                                )}
                                                                <TextField
                                                                    value={option ? option : " "} // Ensure label is being accessed
                                                                    onChange={(e) =>
                                                                        handleOptionChange(index, optionIndex, e.target.value)
                                                                    }
                                                                    placeholder={`Option ${optionIndex + 1}`}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    className="me-2"
                                                                />
                                                                <Button
                                                                    onClick={() => deleteOption(index, optionIndex)}
                                                                    variant="contained"
                                                                    color="error"
                                                                    size="small"
                                                                >
                                                                    <DeleteIcon />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <TextField
                                        label="Description"
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        fullWidth
                                        value={item.description}
                                        onChange={(e) => handleInputChange("description", e.target.value, index)}
                                        className="mt-3"
                                    />
                                    {/* {err.description && <span className="text-danger">{err.description}</span>} */}

                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <div>
                                            <TextField
                                                label="Score"
                                                type="number"
                                                size="small"
                                                value={item.score}
                                                onChange={(e) => handleInputChange("score", e.target.value, index)}
                                            />
                                            {/* {err.score && <span className="text-danger">{err.score}</span>} */}
                                        </div>

                                        <div>
                                            <TextField
                                                label="Negative Marks"
                                                type="number"
                                                size="small"
                                                value={item.negativeMarks}
                                                onChange={(e) => handleInputChange("negativeMarks", e.target.value, index)}
                                            />
                                            {/* {err.negativeMarks && <span className="text-danger">{err.negativeMarks}</span>} */}
                                        </div>
                                    </div>


                                </form>
                            </div>

                        ))}
                        <div className="d-flex justify-content-around align-items-center mt-3 py-5">
                            <Button
                                variant="contained"
                                color="light"
                                onClick={handleCancelBulk}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSaveBulk}
                                disabled={loading}
                                className='px-5'
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                }
            </div>

        </div>
    )
}

export default QuestionBulkUpload;