/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { DataGrid } from '@mui/x-data-grid';
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, InputLabel, MenuItem, Select, Radio, RadioGroup, FormControlLabel, TextField, Checkbox, Paper, IconButton, Menu } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Service from "../../../service/Service";
import QuestionImport from "./QuestionImport";
import { Link } from "react-router-dom";
import QuestionPreview from "./questionPreview";
import { Modal } from 'react-bootstrap';


const paginationModel = { page: 0, pageSize: 10 };
import SettingsIcon from "@mui/icons-material/Settings";



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





function Questions() {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [previewQID, setPreviewQID] = useState(null);
  const [err, setErr] = useState({});
  const [formState, setFormState] = useState({
    questionName: "",
    section: "",
    questionType: "",
    options: [],
    correctAnswer: [],
    description: "",
    score: "",
    negativeMarks: "",
  });

  const [show, setShow] = useState(false);

  const handleEdit = (ID) => {
    // alert(`${ID} edit clicked`);
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

  const handleDelete = async (ID) => {
    try {
      const response = await Service.delete(`/api/question/${ID}`);
      alert(`${ID} deleted successfully: ${response.data.message}`);
    } catch (error) {
      alert(`Error deleting question ${ID}: ${error.response?.data?.message || error.message}`);
    }
  };



  // Utility function to strip HTML tags
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
    if (!formState.section) formErrors.section = 'section is required';
    if (!formState.questionName) formErrors.questionName = 'questionName is required';
    if (formState.questionType !== "yesno" && formState.options.length < 2)
      formErrors.options = "At least 2 options are required.";
    if (formState.options.some((option) => !option.trim()))
      formErrors.options = "All options must have a value.";
    if (formState.correctAnswer.length === 0)
      formErrors.correctAnswer = "At least one correct answer must be selected.";
    if (!formState.description) formErrors.description = 'description selection is required';
    if (!formState.score) formErrors.score = 'score is required';
    if (!formState.negativeMarks) formErrors.negativeMarks = 'negativeMarks is required';


    setErr(formErrors);
    return Object.keys(formErrors).length === 0;
  }

  // const handleOptionChange = (index, value) => {

  //   console.log(index, value);

  //   console.log(formState.options);


  //   const updatedOptions = formState.options
  //   console.log(updatedOptions);

  //   updatedOptions[index] = { ...updatedOptions[index], label: value };
  //   setFormState((prev) => ({ ...prev, options: updatedOptions }));
  // };

  const handleOptionChange = (index, value) => {
    console.log(index, value);
    console.log(formState.options);

    // Create a new array to avoid direct mutation
    const updatedOptions = [...formState.options];

    // Ensure the item at the given index is treated as an object
    updatedOptions[index] = value;


    console.log(updatedOptions);

    // Update the state
    setFormState((prev) => ({ ...prev, options: updatedOptions }));
  };


  // const UpdateHandleOptionChange = (index, value) => {

  //   console.log(index, value);

  //   const updatedOptions = [...formState.options];
  //   updatedOptions = { ...updatedOptions, label: value };
  //   setFormState((prev) => ({ ...prev, options: updatedOptions }));
  // };

  // const handleSelectionChange = (index) => {
  //   console.log(index);

  //   if (formState.questionType === "multipleCorrect") {

  //     const updatedOptions = [...formState.options];
  //     updatedOptions[index].isSelected = !updatedOptions[index].isSelected;

  //     const correctAnswer = updatedOptions
  //       .map((option, idx) => (option.isSelected ? idx : null))
  //       .filter((idx) => idx !== null);

  //     setFormState((prev) => ({
  //       ...prev,
  //       options: updatedOptions,
  //       correctAnswer,
  //     }));
  //   } else if (formState.questionType === "singleCorrect") {

  //     const updatedOptions = formState.options.map((option, idx) => ({
  //       ...option,
  //       isSelected: idx == index,
  //     }));

  //     console.log(updatedOptions);



  //     setFormState((prev) => ({
  //       ...prev,
  //       options: updatedOptions,
  //       correctAnswer: [index],
  //     }));
  //   }


  // };



  const handleSelectionChange = (index) => {
    console.log('Before update:', formState.options);

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
      // In single correct, set only the selected option to true, all others to false
      const updatedSelectedOptions = formState.options.map((_, idx) => idx === index);

      console.log('Updated selected options:', updatedSelectedOptions);

      setFormState((prev) => ({
        ...prev,
        selectedOptions: updatedSelectedOptions,
        correctAnswer: [formState.options[index]],
      }));
    }
  };


  const UpdateHandleSelectionChange = (option) => {
    if (formState.questionType === "multipleCorrect") {
      // const updatedOptions = [...formState.options];
      // updatedOptions[index].isSelected = !updatedOptions[index].isSelected;

      // const correctAnswer = updatedOptions
      //   .map((option, idx) => (option.isSelected ? idx : null))
      //   .filter((idx) => idx !== null);

      // setFormState((prev) => ({
      //   ...prev,
      //   options: updatedOptions,
      //   correctAnswer,
      // }));
      console.log("hiii");

    } else if (formState.questionType === "singleCorrect") {
      const updatedOptions = formState.options.map((option, idx) => ({
        ...option,
        isSelected: option == option,
      }));

      setFormState((prev) => ({
        ...prev,
        options: updatedOptions,
        correctAnswer: [option]
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
        alert("Question successfully added!");
        handleCancel();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add question.");
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
    Service.get("/getAllQuestions").then((res) => {
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
  // 
  const handleBulkUpload = (data) => {
    setBulkData(data.pages_data);
    console.log(data.pages_data)
    // toast.success('Data imported successfully!'); // Show success toast
  };


  const handleImportClick = () => {
    console.log("Import CLicked");

  }

  const [loading, setLoading] = useState(false);

  const processBulkData = (item) => {

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
        correctAnswer.length > 0 ? [options[correctAnswer[0]].label] : [];
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
  };


  const getQuestionByID = (ID) => {
    Service.get(`/getQuestionsBy/${ID}`).then((res) => {
      console.log(res.data.result[0]);
      setFormState(res.data.result[0]);
    })
      .catch((err) => {
        console.log(err);
      })
  }

  // const getQuestionByID = (ID) => {
  //   Service.get(`/getQuestionsBy/${ID}`)
  //     .then((res) => {
  //       console.log("API Response:", res.data.result[0]);
  //       setFormState((prevState) => ({
  //         ...prevState,
  //         ...res.data.result[0]  // Spread the response data while keeping missing fields intact
  //       }));
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };



  console.log("Updated formState:", formState);



  const handleUpdateQuestion = () => {
    Service.put(`/updateQuestion`, formState).then((res) => {
      console.log(res);
      alert("Succesfully updated ")
      setShow(!show)
    })
      .catch((err) => {
        console.log(err);

      })
  }


  return (

    <div className="p-3">
      {previewQID && (
        <QuestionPreview
          ID={previewQID}
          onClose={handleClosePreview}
        />
      )}
      <div className="container-fluid bg-exams rounded p-3">
        <header className="d-flex justify-content-between align-items-center">
          <p className="text-muted fs-4">
            {isCreateMode ? "Create Question" : "Questions"}
          </p>
          {isCreateMode ? (
            <>

              <Button variant="contained" color="success" onClick={handleImportClick}>
                Import
              </Button>

              <Button variant="contained" color="success" onClick={toggleCreateMode}>
                List
              </Button>

            </>
          ) : (
            <Button variant="contained" color="success" onClick={toggleCreateMode}> Create</Button>
          )}
        </header>

        {isCreateMode ? (
          <>
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
                {/* <ReactQuill
                  theme="snow"
                  name="questionName"
                  value={formState.questionName}
                  onChange={(content) => handleInputChange("questionName", content)}
                  placeholder="Write your question here..."
                /> */}

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
                                checked={option.isSelected}
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
                  // InputProps={{ inputProps: { min: 1, max: 5 } }}
                  />

                  {/* <NumberInput min={2} max={5} /> */}
                  <div>{err.negativeMarks && <span className="text-danger">{err.negativeMarks}</span>}</div>
                </div>

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

          </>
        ) : (
          <section>
            <div className="p-1">
              <Paper>
                <DataGrid
                  rows={allQuestions}
                  columns={listColumns}
                  width='1000px'
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[20, 30, 50]}
                  sx={{ border: 0 }}
                />
              </Paper>
            </div>
          </section>
        )}
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
                  <MenuItem value={formState.questionType}>Single Correct</MenuItem>
                  {/* <MenuItem value="multipleCorrect">Multiple Correct</MenuItem>
                  <MenuItem value="yesno">Yes / No</MenuItem> */}
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
              {/* <ReactQuill
                theme="snow"
                name="questionName"
                value={formState.questionName}
                onChange={(content) => handleInputChange("questionName", content)}
                placeholder="Write your question here..."
              /> */}
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
                              checked={option.isSelected}
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
                // InputProps={{ inputProps: { min: 1, max: 5 } }}
                />

                {/* <NumberInput min={2} max={5} /> */}
                <div>{err.negativeMarks && <span className="text-danger">{err.negativeMarks}</span>}</div>
              </div>

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
                onClick={handleUpdateQuestion}

              >
                Update
              </Button>
            </div>
          </form>

        </Modal.Body>

      </Modal>
    </div>
  );
}

export default Questions;










