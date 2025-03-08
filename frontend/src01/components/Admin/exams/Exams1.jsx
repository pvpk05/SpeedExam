/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
// import './Exams.css';
import { Button, FormControl, FormGroup, InputLabel, Select, Checkbox, IconButton, Table, TableContainer, TableBody, styled, TableCell, tableCellClasses, TableHead, TableRow, Paper, TablePagination, MenuItem, TextField, FormControlLabel, Radio, RadioGroup } from '@mui/material';
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
// import { v4 as uuidv4 } from 'uuid';


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

  const handleToggle = () => {
    setIsCreateMode((prev) => !prev);
  };

  const [createExam, setCreateExam] = useState({
    examName: '',
    questions: '',
    duration: '',
    negativeMarks: '',
    autoSubmit: '',
    examAvailability: '',
    countDown: '',
    domainName: domain,
    batches: [],
    section: '',
    startDateTime: '',
    endDateTime: ''
  });

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


  const validateForm = () => {
    let formErrors = {};
    if (!createExam.examName) formErrors.examName = 'Exam Name is required';
    if (!createExam.duration) formErrors.duration = 'Duration is required';
    if (!createExam.negativeMarks) formErrors.negativeMarks = 'Negative Marks selection is required';
    if (!createExam.autoSubmit) formErrors.autoSubmit = 'Auto Submit selection is required';
    if (!createExam.examAvailability) formErrors.examAvailability = 'Exam Availability selection is required';
    if (!createExam.countDown) formErrors.countDown = 'Countdown selection is required';
    if (!createExam.questions) formErrors.questions = 'questions is required';
    if (!createExam.section) formErrors.section = 'Section is required';
    if (createExam.examAvailability === "Available on specific time") {
      if (!createExam.startDateTime) formErrors.startDateTime = "startDateTime is required"
      if (!createExam.endDateTime) formErrors.endDateTime = "endDateTime is required"
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const [errors, setErrors] = useState({});

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setCreateExam({ ...createExam, [name]: value, examLink });
  //   setErrors({ ...errors, [name]: '' });
  //   console.log(name);
  //   console.log(value);
  // };


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (validateForm()) {

  //     console.log('Form submitted successfully', createExam);

  //     Service.post('/createExam', createExam).then((res) => {
  //       console.log(res.data);
  //       alert(res.data.message);
  //       getExamsList();
  //       handleCancel();
  //       setIsCreateMode(false);
  //     }).
  //       catch((err) => {
  //         console.log(err.response.message);
  //       })
  //   }
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  
  //   // Update the form state
  //   setCreateExam((prevState) => {
  //     const updatedState = { ...prevState, [name]: value };
  
  //     // Generate exam link if the examType is 'Global'
  //     if (name === "examType" && value === "Global") {
  //       const baseUrl = "http://localhost:3000/exam";
  //       updatedState.examLink = `${baseUrl}/${prevState.examName
  //         ?.replace(/\s+/g, "-")
  //         .toLowerCase()}`;
  //     } else if (name === "examType" && value === "Internal") {
  //       updatedState.examLink = ""; // Clear exam link for 'Internal'
  //     }
  
  //     return updatedState;
  //   });
  
  //   // Clear the specific error for the changed field
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [name]: "",
  //   }));
  
  //   console.log("Field Changed:", name, value);
  // };
  
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  
  //   // Validate form fields
  //   if (!validateForm()) return;
  
  //   console.log("Form submitted successfully", createExam);
  
  //   // Submit form data to the server
  //   Service.post("/createExam", createExam)
  //     .then((res) => {
  //       console.log("Response:", res.data);
  //       alert(res.data.message);
  
  //       // Refresh exams list and reset the form
  //       getExamsList();
  //       handleCancel();
  //       setIsCreateMode(false);
  //     })
  //     .catch((err) => {
  //       console.error("Error:", err.response?.message || err.message);
  //       alert("Failed to create exam. Please try again.");
  //     });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the form state
    setCreateExam((prevState) => {
        const updatedState = { ...prevState, [name]: value };

        // Generate exam link if the examType is 'Global'
        if (name === "examType" && value === "Global") {
            const baseUrl = "http://localhost:3000/exam";
            updatedState.examLink = `${baseUrl}/${prevState.examName
                ?.replace(/\s+/g, "-")
                .toLowerCase()}`;
        } else if (name === "examType" && value === "Internal") {
            updatedState.examLink = ""; // Clear exam link for 'Internal'
        }

        return updatedState;
    });

    // Clear the specific error for the changed field
    setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
    }));

    console.log("Field Changed:", name, value);
};

const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateForm()) return;

    console.log("Form submitted successfully", createExam);

    // Submit form data to the server
    Service.post("/createExam", createExam)
        .then((res) => {
            console.log("Response:", res.data);
            alert(res.data.message);

            // Refresh exams list and reset the form
            getExamsList();
            handleCancel();
            setIsCreateMode(false);
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
      duration: "",
      negativeMarks: "",
      autoSubmit: "",
      examAvailability: "",
      countDown: "",
      domainName: domain,
      batches: [],
      section: "",
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

  const [exam, setExam] = useState('');
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
  const [sectionsList, setSectionList] = useState([]);
  const sectionList = () => {
    Service.get('/getAllSections').then((res) => {
      console.log(res.data.result);
      setSectionList(res.data.result);
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
    // Convert dayjs object to native Date object and update state
    setCreateExam((prevState) => ({
      ...prevState,
      [fieldName]: value ? value.toDate() : null,
    }));
  };


  const [editExamModal, setEditExamModal] = useState(false);

  const examEdit = (examId) => {
    getExamsByID(examId);
    setEditExamModal(!editExamModal);

  }

  const deleteExam = (examId) => {
    if (window.confirm("Are you sure want to delete exam with:- " + examId)) {
      Service.delete(`/deleteExam/${examId}`)
        .then((res) => {
          console.log(res.data);
          getExamsList();
          alert("Deleted successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Deletion cancelled");
    }
  };

  // Generate the exam link
  const handleGenerateLink = () => {
    if (!createExam.examName) {
      setErrors({ examName: "Exam Name is required to generate the link." });
      return;
    }
    const baseUrl = "http://localhost:3000/exam";
    const generatedLink = `${baseUrl}/${createExam.examName.replace(/\s+/g, "-").toLowerCase()}`;
    setExamLink(generatedLink);
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(examLink);
    alert("Link copied to clipboard!");
  };


  const handleBatchChange = (batch) => {
    const isSelected = createExam.batches.includes(batch);
    const updatedBatches = isSelected
      ? createExam.batches.filter((b) => b !== batch)
      : [...createExam.batches, batch];
    setCreateExam({ ...createExam, batches: updatedBatches });
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

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredExams = searchTerm.trim()
    ? examsList.filter(
      (exam) =>
        exam.examName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : examsList;


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(searchTerm);

  const [showDomains, setShowDomains] = useState(false);

  const backToDomains = () => {
    setShowDomains(true); // Switch to the Domains component
  };

  if (showDomains) {
    return <Domains />; // Render Domains if showDomains is true
  }


  return (
    <div className="p-3">
      <Button onClick={backToDomains}>Back</Button>
      <div className="container-fluid bg-exams p-3 rounded">
        <section>

          <div className="d-flex justify-content-between align-items-center">
            <p className="text-muted fs-4">{isCreateMode ? 'Create New Exam' : 'Exams'}</p>
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

          {isCreateMode ? (
            <section>
              <form onSubmit={handleSubmit}>
                <div className="p-4">
                  <p className="fw-bold fs-5 border-bottom border-5 border-dark p-3">Enter Exam Information</p>
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

                  <div className="col-4">
                    <FormControl variant="standard" className="w-100" error={!!errors.examType}>
                      <InputLabel>Exam Type</InputLabel>
                      <Select name="examType" value={createExam.examType} onChange={handleChange}>
                        <MenuItem value="Internal">Internal Exam</MenuItem>
                        <MenuItem value="Global">Link Based Exam</MenuItem>
                      </Select>
                      {errors.examType && <p className="text-danger">{errors.examType}</p>}
                    </FormControl>
                  </div>

                  {/* Conditional Rendering for Internal Exam */}
                  {createExam.examType === "Internal" && (
                    <div className="mt-5">
                      <span className="text-bold fw-bold">Select Batches</span>
                      <FormControl variant="standard" className="w-100">
                        <InputLabel>Select Batches</InputLabel>
                        <Select
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

                  {/* Conditional Rendering for Global Exam */}
                  {createExam.examType === "Global" && (
                    <div className="mt-5">
                      <TextField
                        label="Exam Name"
                        variant="outlined"
                        className="w-100"
                        value={createExam.examName}
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
                  )}

                  {/* <div className="mt-5">
                    <span className="text-bold fw-bold">Select Batches</span>
                    <FormGroup>
                      {batchList.map((batch) => (
                        <FormControlLabel
                          key={batch.id}
                          control={
                            <Checkbox
                              checked={createExam.batches.includes(batch.batchNo)}
                              onChange={() => handleBatchChange(batch.batchNo)}
                            />
                          }
                          label={batch.batchNo}
                        />
                      ))}
                    </FormGroup>
                    {errors.batches && <span className="text-danger">{errors.batches}</span>}
                  </div> */}

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
                      <FormControlLabel value="Always available" control={<Radio />} label="Always available " className='ms-3' />
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
                                value={dayjs(createExam.startDateTime)} // Convert back to dayjs for display
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
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" className='me-5 ms-3' />
                      <FormControlLabel value="No" control={<Radio />} label="No" className='ms-5' />
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
                    <Button variant="contained" color='light' onClick={handleCancel}>Cancel</Button>
                    <Button variant="contained" color="success" type='submit'>Save Exam</Button>
                  </div>
                </div>
              </form>
            </section>
          ) : (
            <div>
              <TextField
                label="Search"
                placeholder='Serach with exam name'
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                autoComplete='off'
                onChange={(e) => setSearchTerm(e.target.value)}
              />



              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell align="center">ExamName</StyledTableCell>
                      <StyledTableCell align="center">Questions</StyledTableCell>
                      <StyledTableCell align="center">Duration</StyledTableCell>
                      <StyledTableCell align="left">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredExams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((exam, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell align="center">{exam.examName}</StyledTableCell>
                        <StyledTableCell align="center">{exam.questions}</StyledTableCell>
                        <StyledTableCell align="center">{exam.duration}</StyledTableCell>
                        <StyledTableCell align="center" >  <div className="dropend text-start">
                          <button className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
                            <SettingsIcon />
                          </button>
                          <ul className="dropdown-menu">
                            <li className='text-center'>
                              <button className='btn btn-link' onClick={() => examEdit(exam.ID)}>Edit</button>
                            </li>
                            <li className='text-center'>
                              <button className='btn btn-link' onClick={() => deleteExam(exam.ID)}>Delete</button>
                            </li>
                          </ul>
                        </div></StyledTableCell>

                      </StyledTableRow>
                    ))}
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
            </div>)}

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
                  {/* <p className="fw-bold fs-5 border-bottom border-5 border-dark p-3">Update Exam Information</p> */}
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
                                value={dayjs(exam.startDateTime)} // Convert back to dayjs for display
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
    </div >
  );
}

export default Exams;
