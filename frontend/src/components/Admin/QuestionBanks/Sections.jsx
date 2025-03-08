/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react'
import { TextField, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Modal, Table } from 'react-bootstrap';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';


import MoreVertIcon from "@mui/icons-material/MoreVert"; // MUI icon alternative

import Service from '../../../service/Service';
import Questions from './Questions';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faShare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const regex = /^[A-Za-z0-9 ]{3,25}$/;

function Sections() {
    const navigate = useNavigate();
    const [section, setSection] = useState('');
    const [editSection, setEditSection] = useState('');
    const [SectionList, setSectionList] = useState([]);
    const [modalType, setModalType] = useState('');
    const [err, setErr] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [examData, setExamData] = useState([]);
    const [showQuestions, setShowQuestions] = useState(false);

    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);

    const handleMenuOpen = (event, section) => {
        event.stopPropagation();
        setMenuAnchor(event.currentTarget);
        setSelectedSection(section);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedSection(null);
    };

    // Domain validation
    const SectionHandleChange = (e) => {
        const value = e.target.value;
        setSection(value);
        setErr(regex.test(value) ? '' : 'Invalid Section Format. <br /> A valid section contains 3-25 characters');
    };

    const fetchSections = async () => {
        try {
            const res = await Service.get('/getAllSections');
            setSectionList(res.data.result || []);
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
    };
    // Fetch domains on mount
    useEffect(() => {
        fetchSections();
    }, []);

    // Add or Update domain
    const handleSectionSubmit = async () => {
        if (err || section.trim() === '') {
            console.log('Validation error occurred.');
            return;
        }

        try {
            const payload = modalType === 'update'
                ? { existingSection: editSection, newSection: section }
                : { section };
            const endpoint = modalType === 'update' ? '/editSection' : '/addSection';
            const method = modalType === 'update' ? Service.put : Service.post;

            const res = await method(endpoint, payload);
            toast.success(res.data.message);
            setSection(''); // Clear input
            setModalType(''); // Close modal
            fetchSections(); // Refresh list
        } catch (error) {
            console.error(`Error ${modalType === 'update' ? 'updating' : 'adding'} Section:`, error);
            toast.error(error.response?.data || `Error ${modalType === 'update' ? 'updating' : 'adding'} Section`);
        }
    };

    const handleDelete = async (section) => {
        try {
            const res = await Service.delete(`/deleteSection/${section}`);
            console.log(res);

            toast.success("Section deleted successfully");
            fetchSections();
        } catch (error) {
            console.error("Error deleting section:", error);
            toast.error(error.response?.data?.message || "Failed to delete section");
        }
    };


    const handleShowUsedIn = async (section) => {
        try {
            const res = await Service.get(`/Section_UsedIn/${section}`);
            console.log(res.data);  // Checking the response

            setExamData(res.data);  // Set the response data into state
            setShowModal(true);  // Show the modal
        } catch (error) {
            console.error('Error fetching exam data:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);  // Close the modal
    };

    const handleBack = () => {
        setShowQuestions(false);
    }

    if (showQuestions) {
        // navigate(`/Admin/sections/Questions/${selectedSection}`)
        return <Questions selectedSection={selectedSection} onBack={handleBack} />
    }

    const prepareEdit = (existingSection) => {
        setEditSection(existingSection);
        setSection(existingSection);
        setModalType('update');
    };

    return (
        <div className='container'>
            <div className='d-flex justify-content-end'>
                <Button variant="contained" color="success" onClick={() => setModalType('add')}>ADD</Button>
            </div>

            <Dialog open={!!modalType} onClose={() => setModalType('')} disableBackdropClick>
                <DialogTitle>{modalType === 'add' ? 'Add Section' : 'Update Section'}</DialogTitle>
                <DialogContent>
                    <TextField
                        name="domain"
                        label="Section"
                        variant="outlined"
                        onChange={SectionHandleChange}
                        value={section}
                        fullWidth
                        margin="dense"
                    />
                    {/* {err && <div className='text-danger mt-2'>{err}</div>} */}
                    {err && <div className="text-danger mt-2" style={{ fontSize: "15px" }} dangerouslySetInnerHTML={{ __html: err }} />}

                </DialogContent>
                <DialogActions >
                    <Button onClick={() => setModalType('')} color="black" style={{ fontSize: "12px" }}>Cancel</Button>
                    <Button onClick={handleSectionSubmit} variant="outlined" color="black" style={{ fontSize: "12px", border: "none" }}>
                        {modalType === 'add' ? 'ADD' : 'UPDATE'}
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="row">
                {SectionList.length === 0 && (
                    <span className='text-center fw-bold'>No Sections added as of now</span>
                )}
                {SectionList.map((item, index) => (
                    <div className="col-3 p-3" key={index}>
                        <div className="card w-100 h-100" style={{ background: "#f2eded" }}>
                            <div
                                className="card text-dark text-center p-3"
                                style={{
                                    cursor: "pointer",
                                    background: "#f2eded",
                                    borderRadius: "10px",
                                    position: "relative",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    height: "150px",
                                }}
                                onClick={() => {
                                    setSelectedSection(item.Section);
                                    setShowQuestions(true);
                                }}
                            >
                                <div className="text-end">
                                    <IconButton
                                        onClick={(event) => handleMenuOpen(event, item.Section)}
                                        style={{ background: "transparent" }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>

                                    <Menu
                                        anchorEl={menuAnchor}
                                        open={Boolean(menuAnchor) && selectedSection === item.Section}
                                        onClose={handleMenuClose}
                                        PaperProps={{ style: { minWidth: "110px" } }}
                                    >
                                        <MenuItem
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleMenuClose();
                                                prepareEdit(item.Section);
                                            }}
                                            style={{ fontWeight: "bolder" }}
                                        >
                                            <FontAwesomeIcon icon={faEdit} style={{ width: "16px", height: "16px", marginRight: "8px" }} /> Edit
                                        </MenuItem>
                                        <MenuItem
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleMenuClose();
                                                handleShowUsedIn(item.Section);
                                            }}
                                            style={{ fontWeight: "bolder" }}
                                        >
                                            <FontAwesomeIcon icon={faShare} style={{ width: "16px", height: "16px", marginRight: "8px" }} /> Used In
                                        </MenuItem>
                                        <MenuItem
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleMenuClose();
                                                handleDelete(item.Section);
                                            }}
                                            style={{ fontWeight: "bolder" }}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} style={{ width: "16px", height: "16px", marginRight: "8px" }} /> Delete
                                        </MenuItem>
                                    </Menu>
                                </div>
                                <div className="mt-2 fw-bolder">{item.Section}</div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>


            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Exams Related to Section</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {examData.length === 0 ? (
                        <p>No exams available for this section.</p>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Exam Id</th>
                                    <th>Exam Name</th>
                                    <th>Domain</th>
                                    <th>Exam Type</th>
                                    <th>Duration</th>
                                    <th>More</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Exams Section */}
                                <tr className="table-primary">
                                    <td colSpan="6" align="center"><strong>Internal Exams</strong></td>
                                </tr>
                                {examData.exams?.length > 0 ? (
                                    examData.exams.map((exam, index) => (
                                        <tr key={`exam-${index}`}>
                                            <td align='center'>{exam.ID}</td>
                                            <td>{exam.examName}</td>
                                            <td>{exam.domainName}</td>
                                            <td align='center'>{exam.examType}</td>
                                            <td>{exam.duration} Hrs</td>
                                            <td><a href="#" target="_blank" rel="noopener noreferrer">Details</a></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" align="center">No Internal Exams Found</td>
                                    </tr>
                                )}

                                {/* Global Exams Section */}
                                <tr className="table-success">
                                    <td colSpan="6" align="center"><strong>Global Exams</strong></td>
                                </tr>
                                {examData.globalExams?.length > 0 ? (
                                    examData.globalExams.map((exam, index) => (
                                        <tr key={`global-${index}`}>
                                            <td align='center'>{exam.ID}</td>
                                            <td>{exam.examName}</td>
                                            <td>{exam.domainName}</td>
                                            <td align='center'>{exam.examType}</td>
                                            <td>{exam.duration} mins</td>
                                            <td><a href="#" target="_blank" rel="noopener noreferrer">Details</a></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" align="center">No Global Exams Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                    )}
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default Sections