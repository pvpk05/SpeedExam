/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';
import "react-quill/dist/quill.snow.css";
import { Button, Dialog, DialogContent, Typography, Stack, Divider, DialogTitle, FormControl, InputLabel, FormHelperText, MenuItem, Select, Radio, RadioGroup, FormControlLabel, TextField, Checkbox, Paper, IconButton, Menu } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import { FaAngleLeft } from 'react-icons/fa';
import Service from "../../../service/Service";
import { Modal } from 'react-bootstrap';
import QuestionBulkUpload from "./QuestionBulkUpload";

import { toast } from "react-toastify";

const paginationModel = { page: 0, pageSize: 10 };
import SettingsIcon from "@mui/icons-material/Settings";

const QuestionPreview = ({ ID, onClose }) => {
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    if (ID) {
      Service.get(`/api/question/${ID}`).then((response) => {
        console.log("Question", response.data);
        setQuestion(response.data);
      });
    }
  }, [ID]);

  if (!question) return null;
  console.log("Question Options:", question.options, typeof question.options);
  console.log("Question correct answer:", question.correctAnswer, typeof question.correctAnswer);

  return (
    <Dialog
      open
      onClose={onClose}

      sx={{
        '& .MuiDialog-paper': {
          width: "1000px",
          borderRadius: '12px',
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography style={{ fontSize: "17px", fontWeight: "bold" }}>Question Id: {question.QID}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" divider={<Divider orientation="vertical" flexItem />}>
            <Typography variant="body2">
              <strong>Section:</strong> {question.section || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Type:</strong> {question.questionType || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Positive Marks:</strong> {question.score}
            </Typography>
            <Typography variant="body2">
              <strong>Negative Marks:</strong> {question.negativeMarks}
            </Typography>
          </Stack>

          <Divider />

          <Typography variant="body">
            Question: {question.questionName}
          </Typography>


          <RadioGroup>
            Options :
            {(Array.isArray(JSON.parse(question.options)) ? JSON.parse(question.options) : []).map((option, index) => (
              <FormControlLabel
                key={index}
                style={{ marginLeft: "10px" }}
                value={option}
                control={
                  <Radio
                    disabled
                    checked={JSON.parse(question.correctAnswer || "[]").includes(option)} // Check if the option is a correct answer
                  />
                }
                label={
                  JSON.parse(question.correctAnswer || "[]").includes(option) ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>{option}</span>
                  ) : (
                    option
                  )
                }
              />
            ))}
          </RadioGroup>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body" >
              <strong>Explaination: </strong>{question.description || 'No description available.'}
            </Typography>
          </Stack>

          <Divider />
          <Typography variant="caption" color="text.secondary">
            Created on {new Date(question.createdOn).toLocaleString() || 'N/A'}
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const SettingsDropdown = ({ handlePreview, handleEdit, handleDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SettingsIcon style={{ width: '20px' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '120px'
          },
        }}
      >
        <MenuItem onClick={handlePreview}>Preview</MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

    </div>
  );
}


function Questions({ selectedSection, onBack }) {
  console.log(selectedSection);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [previewQID, setPreviewQID] = useState(null);
  const [err, setErr] = useState({});
  const [formState, setFormState] = useState({
    questionName: "",
    section: selectedSection,
    questionType: "",
    options: [],
    correctAnswer: [],
    description: "",
    score: 0,
    negativeMarks: 0,
  });

  const [show, setShow] = useState(false);

  const handleEdit = (ID) => {
    getQuestionByID(ID);
    setShow(!show);
  };

  const handleClose = () => {
    setShow(!show);
  }

  const handlePreview = (ID) => {
    setPreviewQID(ID);
  };

  const handleClosePreview = () => {
    setPreviewQID(null);
  };


  const stripHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const toggleCreateMode = () => setIsCreateMode(!isCreateMode);


  const handleInputChange = (name, value, index) => {
    setFormState({ ...formState, [name]: value });
    setErr({ ...err, [name]: '' });
    setBulkData((prevData) =>
      prevData.map((item, idx) =>
        idx === index ? { ...item, [name]: value } : item
      )
    );
  }


  const listColumns = [
    { field: 'QID', headerName: 'QID', width: 150 },
    { field: 'questionName', headerName: 'Question Name', width: 400 },
    { field: 'section', headerName: 'Section', width: 200 },
    { field: 'questionType', headerName: 'Question Type', width: 200 },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <SettingsDropdown
          handlePreview={() => handlePreview(params.row.QID)}
          handleEdit={() => handleEdit(params.row.QID)}
          handleDelete={() => handleDelete(params.row.QID)}
        />
      ),
    },
  ];

  const validateForm = () => {
    let formErrors = {};
    if (!formState.questionType) formErrors.questionType = 'questionType is required';
    if (!formState.questionName) formErrors.questionName = 'questionName is required';
    if (formState.questionType !== "yesno" && formState.options.length < 2)
      formErrors.options = "At least 2 options are required.";
    if (formState.options.some((option) => !option.trim()))
      formErrors.options = "All options must have a value.";
    if (formState.correctAnswer.length === 0)
      formErrors.correctAnswer = "At least one correct answer must be selected.";
    if (!formState.description) formErrors.description = 'description selection is required';
    // if (!formState.score) formErrors.score = 'score is required';
    // if (!formState.negativeMarks) formErrors.negativeMarks = 'negativeMarks is required';

    setErr(formErrors);
    return Object.keys(formErrors).length === 0;
  }

  const handleOptionChange = (index, value) => {
    console.log(index, value);
    console.log(formState.options);

    const updatedOptions = [...formState.options];
    updatedOptions[index] = value;

    setFormState((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleSelectionChange = (index) => {
    console.log('Before update:', formState.options);
    console.log("index :", index);

    if (formState.questionType === "multipleCorrect") {
      // Toggle the selected state for the clicked option
      const updatedSelectedOptions = [...formState.selectedOptions];
      updatedSelectedOptions[index] = !updatedSelectedOptions[index];

      const correctAnswer = updatedSelectedOptions
        .map((isSelected, idx) => (isSelected ? idx : null))
        .filter((idx) => idx !== null);

      setFormState((prev) => ({
        ...prev,
        selectedOptions: updatedSelectedOptions,
        correctAnswer,
      }));
    } else if (formState.questionType === "singleCorrect") {

      const updatedSelectedOptions = formState.options.map((_, idx) => idx === index);

      console.log('Updated selected options:', updatedSelectedOptions);

      setFormState((prev) => ({
        ...prev,
        selectedOptions: updatedSelectedOptions,
        correctAnswer: [formState.options[index]],
      }));
    }
  };



  const addOption = () =>
    setFormState((prev) => ({
      ...prev,
      options: [...prev.options, { label: "", isSelected: false }],
    }));

  const deleteOption = (index) =>
    setFormState((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));

  const handleSave = () => {
    if (!validateForm()) return;

    const sanitizedQuestionName = stripHTML(formState.questionName);
    let correctAnswers = [];
    let updatedOptions = [];
    const { questionType, options, correctAnswer } = formState;

    // Transform options into a simple array of strings
    updatedOptions = options.map((option) => option);

    if (questionType === "yesno") {
      updatedOptions = ["Yes", "No"];
      correctAnswers = [updatedOptions[correctAnswer[0]]];
    } else if (questionType === "singleCorrect") {
      correctAnswers = correctAnswer.length > 0 ? [updatedOptions[correctAnswer[0]]] : [];
    } else if (questionType === "multipleCorrect") {
      // Map correctAnswer indices to their corresponding labels
      correctAnswers = correctAnswer.map((index) => updatedOptions[index]);
    }

    const payload = {
      ...formState,
      questionName: sanitizedQuestionName,
      options: updatedOptions, // Simplified array of strings
      correctAnswers, // Simplified array of selected labels
    };
    console.log(payload);

    Service.post("/createQuestion", payload)
      .then((res) => {
        toast.success("Question successfully added!");
        handleCancel();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add question");
      });
  };

  const handleCancel = () => {
    setFormState({
      questionName: "",
      section: "",
      questionType: "",
      options: [],
      correctAnswer: [],
      description: "",
      score: "",
      negativeMarks: "",
    })
    getAllQuestions();
    toggleCreateMode();
  };


  const [allQuestions, setAllQuestions] = useState({});

  const getAllQuestions = () => {
    Service.get(`/getAllQuestions/${selectedSection}`).then((res) => {
      console.log(res.data.result);
      const dataWithIds = res.data.result.map((item, index) => ({
        ...item,
        id: index, // Use ID or fallback to index as id
        questionName: item.questionName || 'N/A', // Handle null values
        section: item.section || 'N/A',
        questionType: item.questionType || 'N/A',
        score: item.score || 'N/A',
      }));

      setAllQuestions(dataWithIds);
      console.log(dataWithIds)
    })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleDelete = async (ID) => {
    try {
      const response = await Service.delete(`/api/question/${ID}`);
      toast.success(`${response.data.message}`);
      getAllQuestions();
    } catch (error) {
      toast.error(`Error deleting question ${ID}: ${error.response?.data?.message || error.message}`);
    }
  };

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
    getAllQuestions();
    sectionList();
  }, [])

  const [bulkData, setBulkData] = useState([]);


  const getQuestionByID = (ID) => {
    Service.get(`/getQuestionsBy/${ID}`).then((res) => {
      console.log(res.data.result[0]);
      setFormState(res.data.result[0]);
    })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleUpdateQuestion = () => {
    Service.put(`/updateQuestion`, formState).then((res) => {
      console.log(res);
      toast.success("Successfully updated")
      getAllQuestions();
      setShow(!show)
    })
      .catch((err) => {
        toast.error("Error while updating question")
        console.log(err);
      })
  }

  const [showUpload, setShowUpload] = useState(false);

  const handleImportClick = () => {
    setShowUpload(true);
  };


  const handleBack = () => {
    setShowUpload(false);
  }


  return (
    <>
      {!isCreateMode &&
        <Button variant="outlined" onClick={onBack} style={{ marginTop: "30px", color: "black", border: "2px solid black", marginLeft: "50px" }}>
          Back
        </Button>
      }

      {previewQID && (
        <QuestionPreview
          ID={previewQID}
          onClose={handleClosePreview}
        />
      )}


      {showUpload && <QuestionBulkUpload onBack={handleBack} />}

      <div className="container-fluid bg-exams rounded p-3">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", marginRight: "40px" }}>
            {!isCreateMode && !showUpload && (
              <Button variant="outlined" color="black" onClick={handleImportClick}>
                Bluk Upload
              </Button>
            )}

            {isCreateMode && (
              <div style={{ padding: "30px" }}>
                <Button variant="outlined" color="black" onClick={toggleCreateMode}>
                  cancel
                </Button>
              </div>
            )}

            {!isCreateMode && !showUpload && (
              <Button variant="outlined" color="black" onClick={toggleCreateMode}> Create</Button>
            )}
          </div>
        </div>

        {!isCreateMode && !showUpload && (
          <section>
            <div style={{ padding: "30px" }}>
              <Paper>
                <DataGrid
                  rows={allQuestions}
                  columns={listColumns}
                  width="1000px"
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[20, 30, 50]}
                  sx={{ border: 0 }}
                />
              </Paper>
            </div>
          </section>
        )}

        {isCreateMode && !showUpload && (
          <div style={{ padding: "30px" }}>
            <form>
              <div className="d-flex justify-content-between">
                <FormControl sx={{ m: 1, minWidth: 250 }} size="small" error={err.questionType}  >
                  <InputLabel>Question Type</InputLabel>
                  <Select
                    label="Question Type"
                    value={formState.questionType}
                    // error={err.questionType}
                    // helperText={err.questionType}
                    name="questionType"
                    onChange={(e) =>
                      handleInputChange("questionType", e.target.value)
                    }
                  >
                    <MenuItem value="singleCorrect">Single Correct</MenuItem>
                    <MenuItem value="multipleCorrect">Multiple Correct</MenuItem>
                    <MenuItem value="yesno">Yes / No</MenuItem>
                  </Select>
                  {err.questionType && <FormHelperText>{err.questionType} </FormHelperText>}
                  {/* {err.questionType && <span className="text-danger">{err.questionType}</span>} */}
                </FormControl>

                <FormControl sx={{ m: 1, minWidth: 250 }} size="small" error={err.section} >
                  <InputLabel>Section</InputLabel>
                  <Select
                    label="Section"
                    value={formState.section}
                    name="section"
                    error={err.section}
                    helperText={err.section}
                    onChange={(e) => handleInputChange("section", e.target.value)}
                  >
                    {sectionsList.map((section, index) =>
                      (<MenuItem value={section.Section} key={section.id}>{section.Section}</MenuItem>))}
                  </Select>
                  {err.section && <FormHelperText>{err.section} </FormHelperText>}
                  {/* {err.section && <span className="text-danger">{err.section}</span>} */}
                </FormControl>
              </div>

              <div className="mb-3">
                {/* <ReactQuill
                  theme="snow"
                  name="questionName"
                  value={formState.questionName}
                  onChange={(content) => handleInputChange("questionName", content)}
                  placeholder="Write your question here..."
                /> */}

                <TextField
                  label="questionName"
                  variant="outlined"
                  fullWidth
                  value={formState.questionName}
                  onChange={(e) => handleInputChange("questionName", e.target.value)}
                  className="mt-3"
                  error={err.questionName}
                  helperText={err.questionName}
                />


                {/* {err.questionName && <span className="text-danger">{err.questionName}</span>} */}
              </div>

              {formState.questionType && (
                <div className="p-3">

                  {formState.questionType === "yesno" ? <b>Select Option</b> :
                    <>
                      <Button
                        variant="contained"
                        onClick={addOption}
                        className="mb-3"
                      >
                        Add Option

                      </Button>
                      {err.options && <FormHelperText className="text-danger">{err.options}</FormHelperText>}
                    </>
                  }

                  <div className="mt-3">
                    {formState.questionType === "yesno" ? (
                      <RadioGroup
                        value={formState.correctAnswer[0]}
                        onChange={(e) =>
                          handleInputChange("correctAnswer", [
                            parseInt(e.target.value, 10),
                          ])
                        }
                        error={err.correctAnswer}
                        helperText={err.correctAnswer}
                      >

                        <FormControlLabel value={0} control={<Radio />} label="Yes" />
                        <FormControlLabel value={1} control={<Radio />} label="No" />

                      </RadioGroup>
                    ) : (
                      <div className="row">
                        {formState.options.map((option, index) => (
                          <div
                            key={index}
                            className="col-md-6 d-flex align-items-center mb-2"
                          >
                            {formState.questionType === "multipleCorrect" ? (
                              <Checkbox
                                // checked={option.isSelected}
                                checked={formState.correctAnswer.includes(option)}
                                onChange={() => handleSelectionChange(index)}
                              />
                            ) : (
                              <Radio
                                checked={formState.correctAnswer.includes(option)}
                                onChange={() => handleSelectionChange(index)}
                              />
                            )}
                            <TextField
                              value={option.label}
                              onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                              }
                              // error={err.options}
                              // helperText={err.options}
                              placeholder={`Option ${index + 1}`}
                              variant="outlined"
                              size="small"
                              className="me-2"
                            />
                            <Button
                              onClick={() => deleteOption(index)}
                              variant="contained"
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </Button>

                          </div>

                        ))}
                        {/* {err.options && <span className="text-danger">{err.options}</span>} */}
                        {/* {err.correctAnswer && <span className="text-danger">{err.correctAnswer}</span>} */}
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
                error={err.description}
                helperText={err.description}
                value={formState.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-3"
              />
              {/* {err.description && <span className="text-danger">{err.description}</span>} */}

              <div className="d-flex justify-content-between align-items-center mt-4">
                {/* <div>
                    <TextField
                      label="Score"
                      type="number"
                      size="small"
                      className="w-100"
                      error={err.score}
                      helperText={err.score}
                      value={formState.score}
                      inputProps={{
                        min: 1,
                        max: 5,
                        style: { width: "100%", textAlign: "center" }, 
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
                          e.preventDefault(); 
                        }
                      }}

                      onChange={(e) => handleInputChange("score", e.target.value)}
                    />
                  </div> */}


                {/* <div>
                    <TextField
                      label="Negative Marks"
                      type="number"
                      size="small"
                      className="w-100"
                      error={err.negativeMarks}
                      helperText={err.negativeMarks}
                      value={formState.negativeMarks}
                      onChange={(e) =>
                        handleInputChange("negativeMarks", e.target.value)
                      }
                      inputProps={{
                        min: 1,
                        max: 5,
                        style: { width: "100%", textAlign: "center" },
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div> */}

              </div>


              <div className="d-flex justify-content-around align-items-center mt-3">
                <Button
                  variant="contained"
                  color="light"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSave}

                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        )}
        {/* 
        {!isCreateMode && (

        )} */}

      </div>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="d-flex justify-content-between">
              <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                <InputLabel>Question Type</InputLabel>
                <Select
                  label="Question Type"
                  value={formState.questionType}
                  name="questionType"
                  onChange={(e) =>
                    handleInputChange("questionType", e.target.value)
                  }
                >
                  <MenuItem value="singleCorrect">Single Correct</MenuItem>
                  <MenuItem value="multipleCorrect">Multiple Correct</MenuItem>
                  <MenuItem value="yesno">Yes / No</MenuItem>
                </Select>
                {err.questionType && <span className="text-danger">{err.questionType}</span>}
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                <InputLabel>Section</InputLabel>
                <Select
                  label="Section"
                  value={formState.section}
                  name="section"
                  onChange={(e) => handleInputChange("section", e.target.value)}
                >
                  {sectionsList.map((section, index) =>
                    (<MenuItem value={section.Section} key={section.id}>{section.Section}</MenuItem>))}
                </Select>
                {err.section && <span className="text-danger">{err.section}</span>}
              </FormControl>
            </div>

            <div className="mb-3">

              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={formState.questionName}
                onChange={(e) => handleInputChange("questionName", e.target.value)}
                className="mt-3"
              />
              {err.questionName && <span className="text-danger">{err.questionName}</span>}
            </div>

            {formState.questionType && (
              <div className="p-3">
                <Button
                  variant="contained"
                  onClick={addOption}
                  className="mb-3"
                >
                  Add Option
                </Button>

                <div className="mt-3">
                  {formState.questionType === "yesno" ? (
                    <RadioGroup
                      value={formState.correctAnswer[0]}
                      onChange={(e) =>
                        handleInputChange("correctAnswer", [
                          parseInt(e.target.value, 10),
                        ])
                      }
                    >
                      <FormControlLabel value={0} control={<Radio />} label="Yes" />
                      <FormControlLabel value={1} control={<Radio />} label="No" />
                    </RadioGroup>
                  ) : (
                    <div className="row">
                      {formState.options.map((option, index) => (
                        <div
                          key={index}
                          className="col-md-6 d-flex align-items-center mb-2"
                        >
                          {formState.questionType === "multipleCorrect" ? (
                            <Checkbox
                              checked={JSON.parse(formState.correctAnswer.includes(option))} // Check if the option is a correct answer
                              onChange={() => handleSelectionChange(index)}
                            />
                          ) : (
                            <Radio
                              checked={formState.correctAnswer.includes(option)}
                              onChange={() => handleSelectionChange(index)}
                            />
                          )}
                          <TextField
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            variant="outlined"
                            size="small"
                            className="me-2"
                          />
                          <Button
                            onClick={() => deleteOption(index)}
                            variant="contained"
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </Button>

                        </div>

                      ))}
                      {err.options && <span className="text-danger">{err.options}</span>}
                      {err.correctAnswer && <span className="text-danger">{err.correctAnswer}</span>}
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
              value={formState.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="mt-3"
            />
            {err.description && <span className="text-danger">{err.description}</span>}
            {/* 
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                <TextField
                  label="Score"
                  type="number"
                  size="small"
                  value={formState.score}
                  // InputProps={{ inputProps: { min: 1, max: 5 } }}

                  onChange={(e) => handleInputChange("score", e.target.value)}
                />
                <div> {err.score && <span className="text-danger">{err.score}</span>}</div>
              </div>


              <div>
                <TextField
                  label="Negative Marks"
                  type="number"
                  size="small"
                  className="w-100"
                  value={formState.negativeMarks}
                  onChange={(e) =>
                    handleInputChange("negativeMarks", e.target.value)
                  }
                />

                <div>{err.negativeMarks && <span className="text-danger">{err.negativeMarks}</span>}</div>
              </div>

            </div> */}


            <div className="d-flex justify-content-around align-items-center mt-3">
              <Button
                variant="contained"
                color="light"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleUpdateQuestion}

              >
                Update
              </Button>
            </div>
          </form>

        </Modal.Body>

      </Modal>
    </>
  );
}

export default Questions;










