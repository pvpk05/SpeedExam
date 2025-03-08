/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react'
import { TextField, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Modal, Table } from 'react-bootstrap';

import { PiDotsThreeVerticalBold } from "react-icons/pi";
import Service from '../../service/Service';

const regex = /^[A-Za-z][A-Za-z. ]{1,28}[A-Za-z]$/;

function Sections() {
    const [section, setSection] = useState('');
    const [editSection, setEditSection] = useState('');
    const [SectionList, setSectionList] = useState([]);
    const [modalType, setModalType] = useState('');
    const [err, setErr] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [examData, setExamData] = useState([]);

    // Domain validation
    const SectionHandleChange = (e) => {
        const value = e.target.value;
        setSection(value);
        setErr(regex.test(value) ? '' : 'Invalid Section Format');
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
            alert(res.data.message);
            setSection(''); // Clear input
            setModalType(''); // Close modal
            fetchSections(); // Refresh list
        } catch (error) {
            console.error(`Error ${modalType === 'update' ? 'updating' : 'adding'} Section:`, error);
            alert(error.response?.data || `Error ${modalType === 'update' ? 'updating' : 'adding'} Section`);
        }
    };

    // Delete domain
    const handleDelete = async (section) => {
        try {
            await Service.delete(`/deleteSection/${section}`);
            fetchSections();
        } catch (error) {
            console.error('Error deleting Section:', error);
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


    // Prepare edit
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

            <Modal show={!!modalType} onHide={() => setModalType('')} backdrop="static">
                <Modal.Header closeButton>
                    {modalType === 'add' ? 'Add Section' : 'Update Section'}
                </Modal.Header>
                <Modal.Body className='p-3'>
                    <TextField
                        name="domain"
                        label="Section"
                        variant="outlined"
                        onChange={SectionHandleChange}
                        value={section}
                    />
                    <Button variant="contained" color="success" onClick={handleSectionSubmit} className='ms-5 mt-2'>
                        {modalType === 'add' ? 'ADD' : 'UPDATE'} Section
                    </Button>
                    {err && <div className='text-danger ms-3 mt-2'>{err}</div>}
                </Modal.Body>
            </Modal>

            <div className="row">
                {SectionList.length === 0 && (
                    <span className='text-center fw-bold'>No Sections added as of now</span>
                )}
                {SectionList.map((item, index) => (
                    <div className="col-3 p-3" key={index}>
                        <div className="card pb-4 w-100 h-100" style={{ background: "#f2eded" }}>
                            <div className="text-end">
                                <button className="btn dropdown-toggle" style={{ background: "#f2eded" }} data-bs-toggle="dropdown" aria-expanded="false">
                                    <PiDotsThreeVerticalBold />
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ minWidth: '150px' }}>
                                    <li className="text-center" style={{textDecoration:"none"}}>
                                        <Button onClick={() => prepareEdit(item.Section)}>Edit</Button>
                                    </li>
                                    <li className="text-center">
                                        <Button className="btn btn-link" onClick={() => handleShowUsedIn(item.Section)}>Used In</Button>
                                    </li>
                                    <li className="text-center">
                                        <Button className="btn btn-link" onClick={() => handleDelete(item.Section)}>Delete</Button>
                                    </li>
                                </ul>
                            </div>

                            {/* <Link to={`/exams/create/${item.Domain}`} className='text-decoration-none'> */}
                            <div className="card-body text-center fw-bold fs-6 text-dark">{item.Section}</div>
                            {/* </Link> */}
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
                                {examData.map((exam, index) => (
                                    <tr key={index}>
                                        <td align='center'>{exam.ID}</td>
                                        <td>{exam.examName}</td>
                                        <td>{exam.domainName}</td>
                                        <td align='center'>{exam.examType}</td>
                                        <td>{exam.duration} Hrs</td>
                                        <td><a href="#" target="_blank" rel="noopener noreferrer">Details</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default Sections