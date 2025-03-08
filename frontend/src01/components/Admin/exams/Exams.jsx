/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
import { Button, FormControl, FormGroup, InputLabel, Select, Checkbox, IconButton, OutlinedInput, Table, TableContainer, Menu, MenuItem, TableBody, styled, TableCell, tableCellClasses, TableHead, TableRow, Paper, TablePagination, TextField, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Service from '../../../service/Service'
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Modal from 'react-bootstrap/Modal';
import Domains from './Domains';
import ExamsHistory from './ExamsHistory';
import ExamSummary from './ExamSummary';
import MeritList from './MeritList';
import { FaAngleLeft } from 'react-icons/fa';
import { useAsyncError, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


const ExamsTable = ({ examsList, onMenuItemClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Ensure examsList is always an array
  const filteredExams = Array.isArray(examsList)
    ? examsList.filter((exam) =>
      exam.examName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ width: "75vw", margin: "0 auto" }}>
      <TextField
        label="Search"
        placeholder="Search with exam name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        autoComplete="off"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper} style={{ height: "auto" }}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell align="center">Exam Name</StyledTableCell>
              <StyledTableCell align="center">Questions</StyledTableCell>
              <StyledTableCell align="center">Duration</StyledTableCell>
              <StyledTableCell align="center">Exam Type</StyledTableCell>
              <StyledTableCell align="center">Section</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExams.length > 0 ? (
              filteredExams
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((exam, index) => (
                  <StyledTableRow key={exam.ID || index}>
                    <StyledTableCell component="th" scope="row">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {exam.examName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {exam.questions}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {exam.duration}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {exam.examType}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {exam.section}
                    </StyledTableCell>
                    <StyledTableCell>
                      <div>
                        <IconButton onClick={handleClick}>
                          <SettingsIcon style={{ width: "20px" }} />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                          <MenuItem onClick={() => onMenuItemClick("preview", exam.ID)}>
                            Exam Preview
                          </MenuItem>
                          <MenuItem onClick={() => onMenuItemClick("summary", exam.ID)}>
                            Exam Summary
                          </MenuItem>
                          <MenuItem onClick={() => onMenuItemClick("history", exam.ID, exam.examName)}>
                            Exam History
                          </MenuItem>
                          <MenuItem onClick={() => onMenuItemClick("meritlist", exam.ID)}>
                            Merit List
                          </MenuItem>
                          <MenuItem onClick={() => onMenuItemClick("edit", exam.ID)}>
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => onMenuItemClick("delete", exam.ID)}>
                            Delete
                          </MenuItem>
                        </Menu>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  No exams found
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredExams.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



const durationOptions = [
  { id: 1, name: '00:15' }, { id: 1, name: '00:30' }, { id: 1, name: '00:45' }, { id: 1, name: '01:00' },
  { id: 1, name: '01:15' }, { id: 1, name: '01:30' }, { id: 1, name: '01:45' }, { id: 1, name: '02:00' },
]

const questionOptions = [
  { id: 1, count: 10 }, { id: 1, count: 20 }, { id: 1, count: 30 },
  { id: 1, count: 40 }, { id: 1, count: 50 }, { id: 1, count: 60 },
]



function Exams({ domain }) {
  console.log(domain);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [examsList, setExamsList] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [examLink, setExamLink] = useState("");
  const [errors, setErrors] = useState({});
  const [exam, setExam] = useState('');
  const [editExamModal, setEditExamModal] = useState(false);
  const [sectionsList, setSectionList] = useState([]);

  const navigate = useNavigate();
  const [showDomains, setShowDomains] = useState(false);
  const [examHistory, setExamHistory] = useState(null);
  const [examSummary, setExamSummary] = useState(null);
  const [meritList, setMeritList] = useState(null);
  const [showExams, setShowExams] = useState(true);


  const handleToggle = () => {
    setIsCreateMode((prev) => !prev);
    setShowExams((prev) => !prev);
  };

  const [createExam, setCreateExam] = useState({
    examName: '',
    examToken: '',  // Added examToken field
    questions: '',
    duration: '',
    totalMarks: '',
    correctAnswerMarks: '',
    negativeMarks: '',
    autoSubmit: '',
    examAvailability: '',
    domainName: domain,
    batches: [],
    section: '',
    startDateTime: '',
    endDateTime: ''
  });


  // Generate exam token only once when the component is mounted
  useEffect(() => {
    if (!createExam.examToken) {
      const token = uuidv4(); // Generate a unique token using uuidv4
      setCreateExam((prevState) => ({
        ...prevState,
        examToken: token,  // Set the generated token
      }));
    }
  }, [createExam.examToken]); // Only run once when examToken is not set


  const validateForm = () => {
    let formErrors = {};
    if (!createExam.examName) formErrors.examName = 'Exam Name is required';
    if (!createExam.duration) formErrors.duration = 'Duration is required';
    if (!createExam.negativeMarks) formErrors.negativeMarks = 'Negative Marks selection is required';
    if (!createExam.autoSubmit) formErrors.autoSubmit = 'Auto Submit selection is required';
    if (!createExam.examAvailability) formErrors.examAvailability = 'Exam Availability selection is required';
    // if (!createExam.countDown) formErrors.countDown = 'Countdown selection is required';
    if (!createExam.questions) formErrors.questions = 'questions is required';
    if (!createExam.section) formErrors.section = 'Section is required';
    if (createExam.examAvailability === "Available on specific time") {
      if (!createExam.startDateTime) formErrors.startDateTime = "startDateTime is required"
      if (!createExam.endDateTime) formErrors.endDateTime = "endDateTime is required"
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };


  useEffect(() => {
    const fetchBatches = async () => {
      if (!createExam.domainName) return;
      try {
        const response = await Service.get(`/Domain_batches`, {
          params: { domain: createExam.domainName },
        });
        console.log(response);
        setBatchList(response.data.result);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatches();
  }, [createExam.domainName]);


  const onMenuItemClick = (action, examId, examName) => {
    console.log(`Action: ${action}, Exam ID: ${examId}, Exam Name: ${examName}`);

    if (action === "preview") {
      getExamPreview(examId);
    } else if (action === "summary") {
      getExamSumary(examId);
    } else if (action === "history") {
      getExamHistory(examId, examName);
    } else if (action === "meritlist") {
      getMeritList(examId, examName);
    } else if (action === "edit") {
      examEdit(examId);
    } else if (action === "delete") {
      deleteExam(examId);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateExam((prevState) => {
      const updatedState = { ...prevState, [name]: value };
      return updatedState;
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    console.log("Field Changed:", name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    console.log("Form submitted successfully", createExam);

    Service.post("/createExam", createExam)
      .then((res) => {
        console.log("Response:", res.data);
        alert(res.data.message);
        getExamsList();
        handleCancel();
        setIsCreateMode(false);
        setShowExams(true);
      })
      .catch((err) => {
        console.error("Error:", err.response?.message || err.message);
        alert("Failed to create exam. Please try again.");
      });
  };

  const handleCancel = () => {
    setCreateExam({
      examName: "",
      questions: "",
      questionPick: "",
      section: "",
      duration: "",
      negativeMarks: "",
      autoSubmit: "",
      examAvailability: "",
      countDown: "",
      domainName: domain,
      batches: [],
      startDateTime: "",
      endDateTime: "",
      examType: '',
      examLink: '',
    });
    setErrors({});
    setIsCreateMode(false);
  };

  const getExamsList = () => {
    console.log({ domain })
    Service.get('/getExams', { params: { domain } }).then((res) => {
      console.log(res);
      const dataWithIds = res.data.result.map((item, index) => ({
        ...item,
        id: index,
        questions: item.questions || 'N/A',
        duration: item.duration || 'N/A',
        examName: item.examName || 'N/A',
      }));
      setExamsList(dataWithIds);

    })
      .catch((err) => {
        console.log(err);
      })
  }

  const getExamsByID = (ID) => {
    Service.get('/getExamByID', { params: { ID } }).then((res) => {
      console.log(res);

      setCreateExam(res.data.result);
    })
      .catch((err) => {
        console.log(err);
      })
  }
  console.log(exam)
  const sectionList = () => {
    Service.get('/GetSection_QuestionsInfo').then((res) => {
      console.log(res.data.sections);
      setSectionList(res.data.sections);
    })
      .catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    getExamsList();
    sectionList();
  }, [])

  console.log(examsList);


  const handleChangeDateTime = (value, fieldName) => {
    setCreateExam((prevState) => ({
      ...prevState,
      [fieldName]: value ? value.toDate() : null,
    }));
  };



  const examEdit = (examId) => {
    getExamsByID(examId);
    setEditExamModal(!editExamModal);

  }


  // useEffect(() => {
  //   if (createExam.examType === "Global" && createExam.examName) {
  //     handleGenerateLink();
  //   }
  // }, [createExam.examType, createExam.examName]);


  const deleteExam = (examId) => {
    if (window.confirm("Are you sure want to delete exam with:- " + examId)) {
      Service.delete(`/deleteExam/${examId}`)
        .then((res) => {
          console.log(res.data);
          alert("Deleted successfully");
          getExamsList();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Deletion cancelled");
    }
  };


  const handleGenerateLink = () => {
    if (!createExam.examName) {
      setErrors({ examName: "Exam Name is required to generate the link." });
      return;
    }
    const baseUrl = "http://localhost:3000/exam";
    const generatedLink = `${baseUrl}/${createExam.examName.replace(/\s+/g, "-").toLowerCase()}`;
    setExamLink(generatedLink);
  };


  const copyToClipboard = () => {
    navigator.clipboard.writeText(examLink);
    alert("Link copied to clipboard!");
  };


  const updateExam = (e) => {
    e.preventDefault();
    console.log("Update Exam funtion");

    Service.put("/updateExam", createExam).then((res) => {
      console.log(res.data);
      getExamsList();
      alert("exam Details Updated Successfully");
      setEditExamModal(!editExamModal);

    })
      .catch((err) => {
        console.log(err);
      })
  };


  const getExamPreview = (examID) => {
    navigate(`/exam/${examID}`);
  }

  const handleBack = () => {
    setShowExams(true);
    setMeritList(null);
    setExamHistory(null);
    setExamSummary(null);
  };


  const backToDomains = () => {
    setShowDomains(true);
  };

  const getMeritList = (examID, examName) => {
    Service.get(`/getMeritList/${examID}`)
      .then((res) => {
        console.log("API response:", res.data);
        setMeritList(res.data.meritList || []);
        if (res.data.result && res.data.result.length == 0)
          alert(`No responses found for ${examName} exam`)

      })
      .catch((err) => {
        console.error("Error fetching exam history:", err);
      });
  }

  if (meritList && meritList.length > 0) {
    return <MeritList meritList={meritList} onBack={handleBack} />;
  }

  const getExamHistory = (examID, examName) => {
    Service.get(`/getAssignedExams/${examID}`)
      .then((res) => {
        console.log("API response:", res.data);
        setExamHistory(res.data.result || []);
        if (res.data.result.length == 0)
          alert(`No responses found for ${examName} exam`)

      })
      .catch((err) => {
        console.error("Error fetching exam history:", err);
      });

  };

  if (examHistory && examHistory.length > 0) {
    return <ExamsHistory examHistory={examHistory} onBack={handleBack} />;
  }


  const getExamSumary = (examID, examName) => {
    Service.get(`/getExamByID/${examID}`)
      .then((res) => {
        console.log("API response:", res.data.result);
        setExamSummary(res.data.result || []);
        if (res.data.result.length == 0)
          alert(`No responses found for ${examName} exam`)

      })
      .catch((err) => {
        console.error("Error fetching exam history:", err);
      });
  }

  if (examSummary) {
    return <ExamSummary examSummary={examSummary} onBack={handleBack} />;
  }

  return (
    <div style={{ width: "78vw", margin: "0 auto" }}>
      {showDomains ? <Domains /> : (
        <div style={{ marginTop: "-10px", height: "auto" }} className='p-2'>
          <div>
            <section>
              <div className="d-flex justify-content-between p-3 align-items-center">
                <button style={{ width: "70px", height: "35px", justifyContent: "center", fontSize: "15px", border: "1px solid black", borderRadius: "3px", background: "#f2eded" }} onClick={backToDomains}> <FaAngleLeft style={{ marginRight: "-5px", marginBottom: "3px" }} /> Back</button>
                <Button variant="contained" color="success" onClick={handleToggle}>
                  {isCreateMode ? (
                    <>
                      <MenuIcon /> <small className="ms-2">List</small>
                    </>
                  ) : (
                    'Create'
                  )}
                </Button>
              </div>

              {isCreateMode &&
                <section>
                  <form onSubmit={handleSubmit} style={{ margin: 'auto', padding: '20px', borderRadius: '8px', }}>
                    <p style={{ fontWeight: 'bold', fontSize: '20px', borderBottom: '2px solid black', paddingBottom: '10px', textAlign: 'left' }}>Enter Exam Information</p>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: "20px" }}>
                      <TextField fullWidth label="Exam Name" variant="outlined" name="examName" value={createExam.examName} onChange={handleChange} error={!!errors.examName} helperText={errors.examName} sx={{ mb: 2, flex: 1 }} />
                      <TextField fullWidth label="Unique Exam Token" variant="outlined" name="examToken" value={createExam.examToken} onChange={handleChange} error={!!errors.examToken} helperText={errors.examToken} disabled sx={{ mb: 2, flex: 2 }} />
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: "20px" }}>
                      <FormControl variant="outlined" sx={{ flex: 1, mb: 2 }} error={!!errors.questions}>
                        <InputLabel htmlFor="questions">No of Questions</InputLabel>
                        <OutlinedInput
                          id="questions"
                          name="questions"
                          onChange={(e) => {
                            const value = Math.max(1, Number(e.target.value));
                            handleChange({ target: { name: "questions", value } });
                          }}
                          type="number"
                          value={createExam.questions}
                          label="No of Questions"
                        />
                      </FormControl>


                      <FormControl variant="outlined" sx={{ flex: 1 }}>
                        <InputLabel>Section</InputLabel>
                        <Select name="section" value={createExam.section} onChange={handleChange} label="Section">
                          {sectionsList.map((section) => (
                            <MenuItem
                              key={section.section}
                              value={section.section}
                            >
                              {`${section.section} (${section.total_questions} questions)`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>


                      <FormControl variant="outlined" sx={{ flex: 1, mb: 2 }}>
                        <InputLabel>Question Picking</InputLabel>
                        <Select name="questionPick" value={createExam.questionPick} onChange={handleChange} label="Question Picking">
                          <MenuItem value='sameQuestions'>Same Questions For all Candidates</MenuItem>
                          <MenuItem value='Randomize'>Randomize Questions and Options</MenuItem>
                        </Select>
                      </FormControl>
                    </div>


                    <div style={{ display: 'flex', gap: '16px', marginBottom: "20px" }}>
                      <FormControl fullWidth variant="outlined" sx={{ mb: 2, flex: 2 }} error={!!errors.duration}>
                        <InputLabel>Exam Duration (HH:MM)</InputLabel>
                        <Select name='duration' value={createExam.duration} onChange={handleChange} label="Exam Duration (HH:MM)">
                          {durationOptions.map((item, index) => (
                            <MenuItem key={index} value={item.name}>{item.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>


                      <FormControl variant="outlined" sx={{ flex: 2, mb: 2 }} error={!!errors.totalMarks}>
                        <InputLabel htmlFor="totalMarks">Total Marks</InputLabel>
                        <OutlinedInput id="totalMarks" name="totalMarks" type="number" value={createExam.totalMarks} label="Total Marks"
                          onChange={(e) => {
                            const value = Math.max(1, Number(e.target.value));
                            handleChange({ target: { name: "totalMarks", value } });
                          }}
                        />
                      </FormControl>

                      <FormControl variant="outlined" sx={{ flex: 2, mb: 2 }} error={!!errors.correctAnswerMarks}>
                        <InputLabel htmlFor="totalMarks">Marks For Correct Answer</InputLabel>
                        <OutlinedInput
                          id="correctAnswerMarks"
                          name="correctAnswerMarks"
                          onChange={(e) => {
                            const value = Math.max(1, Number(e.target.value));
                            handleChange({ target: { name: "correctAnswerMarks", value } });
                          }}
                          type="number"
                          value={createExam.correctAnswerMarks}
                          label="Marks For Correct Answer"
                        />
                      </FormControl>

                      <FormControl fullWidth variant="outlined" sx={{ mb: 2, flex: 2 }} error={!!errors.negativeMarks}>
                        <InputLabel>Marks For Wrong Answer</InputLabel>
                        <Select name='negativeMarks' value={createExam.negativeMarks} onChange={handleChange} label="Marks For Wrong Answer">
                          <MenuItem value='0'>Do not Apply</MenuItem>
                          <MenuItem value='25%'>Apply 25% negative marks</MenuItem>
                          <MenuItem value='50%'>Apply 50% negative marks</MenuItem>
                          <MenuItem value='100%'>Apply 100% negative marks</MenuItem>
                        </Select>
                      </FormControl>

                    </div>

                    <div className="col-4 d-flex">
                      <FormControl variant="outlined" className="w-100" error={!!errors.examType}>
                        <InputLabel>Exam Type</InputLabel>
                        <Select name="examType" value={createExam.examType} onChange={handleChange} label="Exam Type">
                          <MenuItem value="Internal">Internal Exam</MenuItem>
                          <MenuItem value="Global">Link Based Exam</MenuItem>
                        </Select>
                        {errors.examType && <p className="text-danger">{errors.examType}</p>}
                      </FormControl>
                    </div>

                    {/* Conditional Rendering for Internal Exam */}
                    {createExam.examType === "Internal" && (
                      <div className="mt-3" style={{ marginBottom: "20px" }}>
                        <FormControl variant="outlined" className="w-100">
                          <InputLabel>Select Batches</InputLabel>
                          <Select
                            label="Select Batches"
                            multiple
                            value={createExam.batches}
                            onChange={(e) => setCreateExam({ ...createExam, batches: e.target.value })}
                            renderValue={(selected) => selected.join(", ")}
                          >
                            {batchList.map((batch) => (
                              <MenuItem key={batch.id} value={batch.batchNo}>
                                <Checkbox checked={createExam.batches.includes(batch.batchNo)} />
                                {batch.batchNo}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {errors.batches && <span className="text-danger">{errors.batches}</span>}
                      </div>
                    )}

                    {/* {createExam.examType === "Global" && (
                      <div className="mt-3">
                        <TextField
                          label="Exam Name"
                          variant="outlined"
                          className="w-100"
                          value={createExam.examName}
                          disabled
                          onChange={(e) => setCreateExam({ ...createExam, examName: e.target.value })}
                        />
                        {errors.examName && <p className="text-danger">{errors.examName}</p>}

                        <Button variant="contained" color="primary" onClick={handleGenerateLink} className="mt-3">
                          Generate Link
                        </Button>
                        {examLink && (
                          <div className="mt-3 d-flex align-items-center">
                            <TextField
                              variant="outlined"
                              size="small"
                              className="w-75"
                              value={examLink}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            <IconButton onClick={copyToClipboard} className="ms-2">
                              <ContentCopyIcon />
                            </IconButton>
                          </div>
                        )}
                        {errors.examLink && <p className="text-danger">{errors.examLink}</p>}
                      </div>
                    )} */}

                    {createExam.examType === "Global" && (
                      <div className="mt-3">
                        {examLink && (
                          <div className="mt-3 d-flex align-items-center">
                            <TextField
                              variant="outlined"
                              size="small"
                              className="w-75"
                              value={examLink}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            <IconButton onClick={copyToClipboard} className="ms-2">
                              <ContentCopyIcon />
                            </IconButton>
                          </div>
                        )}

                        {/* If examLink is not generated, create a link using examToken */}
                        {!examLink && createExam.examToken && (
                          <div className="mt-3 d-flex align-items-center">
                            <TextField
                              variant="outlined"
                              size="small"
                              className="w-75"
                              value={`http://localhost:5173/exam/${createExam.examToken}`}  // Update this with your desired URL format
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            <IconButton onClick={copyToClipboard} className="ms-2">
                              <ContentCopyIcon />
                            </IconButton>
                          </div>
                        )}

                        {errors.examLink && <p className="text-danger">{errors.examLink}</p>}
                      </div>
                    )}


                    <FormControl fullWidth sx={{ mb: 2, mt: 4, ml: 1 }}>
                      <span className='text-bold fw-bold'>Auto Submit Exam</span>
                      <RadioGroup row name="autoSubmit" value={createExam.autoSubmit} onChange={handleChange} label="Auto Submit Exam">
                        <FormControlLabel value="1" control={<Radio />} label="Yes" />
                        <FormControlLabel value="0" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2, mt: 2, ml: 1 }}>
                      <span className='text-bold fw-bold'>Exam Availability</span>
                      <RadioGroup row name="examAvailability" value={createExam.examAvailability} onChange={handleChange}>
                        <FormControlLabel value="Always available" control={<Radio />} label="Always available" />
                        <FormControlLabel value="Available on specific time" control={<Radio />} label="Available on specific time" />
                      </RadioGroup>
                    </FormControl>

                    {createExam.examAvailability === 'Available on specific time' && (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker label="Start Date and Time" name="startDateTime" value={dayjs(createExam.startDateTime)} onChange={(newValue) => handleChangeDateTime(newValue, 'startDateTime')} />
                        <DateTimePicker label="End Date and Time" name="endDateTime" value={dayjs(createExam.endDateTime)} onChange={(newValue) => handleChangeDateTime(newValue, 'endDateTime')} />
                      </LocalizationProvider>
                    )}


                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: "20vw", paddingLeft: "20vw" }}>
                      <Button variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>
                      <Button variant="contained" color="success" type="submit">Save Exam</Button>
                    </div>
                  </form>
                </section>
              }

              {showExams && <ExamsTable onMenuItemClick={onMenuItemClick} examsList={examsList} />}
              <Modal
                size="lg"
                show={editExamModal}
                // show={false}
                onHide={() => setEditExamModal(false)}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title> Update Exam Information </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={updateExam}>
                    <div className="p-2">
                      <div className="row">
                        <div className='col-12 mb-4'>
                          <TextField
                            className='w-100'
                            label="Exam Name"
                            variant="standard"
                            name="examName"
                            value={createExam.examName}
                            onChange={handleChange}
                            error={!!errors.examName}
                            helperText={errors.examName}
                          />
                        </div>
                        <div className="col-4">
                          <FormControl variant="standard" className="w-100" error={!!errors.questions}>
                            <InputLabel>No of Questions</InputLabel>
                            <Select name='questions' value={createExam.questions} onChange={handleChange}>
                              {questionOptions.map((item, index) => (
                                <MenuItem key={index} value={item.count}>{item.count}</MenuItem>
                              ))}
                            </Select>
                            {errors.questions && <p className="text-danger">{errors.questions}</p>}
                          </FormControl>
                        </div>
                        <div className="col-4">
                          <FormControl variant="standard" className="w-100" error={!!errors.duration}>
                            <InputLabel>Duration (HH:MM)</InputLabel>
                            <Select name='duration' value={createExam.duration} onChange={handleChange}>
                              {durationOptions.map((item, index) => (
                                <MenuItem key={index} value={item.name}>{item.name}</MenuItem>
                              ))}
                            </Select>
                            {errors.duration && <p className="text-danger">{errors.duration}</p>}
                          </FormControl>
                        </div>
                        <div className="col-4">
                          <FormControl variant="standard" className="w-100" error={!!errors.negativeMarks}>
                            <InputLabel>Negative Marks</InputLabel>
                            <Select name='negativeMarks' value={createExam.negativeMarks} onChange={handleChange}>
                              <MenuItem value='0'>Do not Apply</MenuItem>
                              <MenuItem value='1'>Apply for this exam</MenuItem>
                            </Select>
                            {errors.negativeMarks && <p className="text-danger">{errors.negativeMarks}</p>}

                          </FormControl>

                        </div>
                      </div>

                      <div className='mt-5'>
                        <span className='text-bold fw-bold'>Auto Submit Exam</span>
                        <RadioGroup row name="autoSubmit" value={createExam.autoSubmit} onChange={handleChange} error={!!errors.autoSubmit}>
                          <FormControlLabel value="1" control={<Radio />} label="Yes" className='me-5 ms-3' />
                          <FormControlLabel value="0" control={<Radio />} label="No" className='ms-5' />
                        </RadioGroup>
                        {errors.autoSubmit && <p className="text-danger">{errors.autoSubmit}</p>}
                      </div>

                      <div className='mt-5'>
                        <span className='text-bold fw-bold'>Exam Availability</span>
                        <RadioGroup row name="examAvailability" value={createExam.examAvailability} onChange={handleChange}>
                          <FormControlLabel value="Always available" control={<Radio />} label="Always available" className='ms-3' />
                          <FormControlLabel value="Available on specific time" control={<Radio />} label="Available on specific time" className='' />
                        </RadioGroup>
                        {errors.examAvailability && <p className="text-danger">{errors.examAvailability}</p>}
                        {createExam.examAvailability === 'Available on specific time' &&
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="container-fluid m-2">
                              <div className="row dateTimePicker">
                                <div className="col-6">
                                  <DateTimePicker
                                    label="Start Date and Time"
                                    name="startDateTime"
                                    value={dayjs(exam.startDateTime)}
                                    // defaultValue={dayjs(new Date())}
                                    minDateTime={dayjs()} // Minimum date is current date/time
                                    onChange={(newValue) => handleChangeDateTime(newValue, 'startDateTime')}
                                  />
                                </div>
                                <div className="col-6">
                                  <DateTimePicker
                                    label="End Date and Time"
                                    name="endDateTime"
                                    // defaultValue={dayjs(new Date())}
                                    value={dayjs(createExam.endDateTime)} // Convert back to dayjs for display
                                    minDateTime={dayjs(createExam.startDateTime) || dayjs()}
                                    onChange={(newValue) => handleChangeDateTime(newValue, 'endDateTime')}
                                  />
                                </div>
                              </div>
                            </div>
                          </LocalizationProvider>
                        }
                      </div>

                      <div className='mt-5'>
                        <span className='text-bold fw-bold'>Display countdown</span>
                        <RadioGroup row name="countDown" value={createExam.countDown} onChange={handleChange}>
                          <FormControlLabel value="1" control={<Radio />} label="Yes" className='me-5 ms-3' />
                          <FormControlLabel value="0" control={<Radio />} label="No" className='ms-5' />
                        </RadioGroup>
                        {errors.countDown && <p className="text-danger">{errors.countDown}</p>}
                      </div>

                      <div className='mt-5'>
                        <span className='text-bold fw-bold'>Select Section </span>
                        <FormControl size="small" className='col-12 mt-3'>
                          <InputLabel>Section</InputLabel>
                          <Select
                            label="Section"
                            value={createExam.section}
                            name="section"
                            onChange={handleChange}
                          >
                            {sectionsList.map((section, index) => (
                              <MenuItem key={section.Section} value={section.Section}>
                                {section.Section}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.section && <span className="text-danger">{errors.section}</span>}
                        </FormControl>
                      </div>


                      <div className='mt-5 d-flex justify-content-around align-items-center'>
                        <Button variant="contained" color='light' onClick={() => setEditExamModal(!editExamModal)}>Cancel</Button>
                        <Button variant="contained" color="success" type='submit'>Save Exam</Button>
                      </div>
                    </div>
                  </form>
                </Modal.Body>
              </Modal>

            </section>
          </div>
        </div >)
      }
    </div>

  );
}

export default Exams;
