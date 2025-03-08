/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Service from '../../../service/Service';
import Exams from './Exams';
import { TextField, Button } from '@mui/material';
import { Modal } from 'react-bootstrap';
import { PiDotsThreeVerticalBold } from "react-icons/pi";


function Domains() {
    const [domainList, setDomainList] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(null); // State to track selected domain
    const navigate = useNavigate();
    const [domain, setDomain] = useState('');
    const [editDomain, setEditDomain] = useState('');
    const [modalType, setModalType] = useState(''); // Handles both Add and Update modals
    const [err, setErr] = useState('');
    const regex = /^[A-Za-z][A-Za-z. ]{1,28}[A-Za-z]$/;

    const fetchDomains = async () => {
        try {
            const res = await Service.get('/getAllDomains');
            setDomainList(res.data.result || []);
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
    };


    // Domain validation
    const domainHandleChange = (e) => {
        const value = e.target.value;
        setDomain(value);
        setErr(regex.test(value) ? '' : 'Invalid Domain Format');
    };

    useEffect(() => {
        fetchDomains();
    }, []);

    const handleCardClick = (domain) => {
        setSelectedDomain(domain);
    };

    const handleDomainSubmit = async () => {
        if (err || domain.trim() === '') {
            console.log('Validation error occurred.');
            return;
        }

        try {
            const payload = modalType === 'update'
                ? { existingDomain: editDomain, newDomain: domain }
                : { domain };
            const endpoint = modalType === 'update' ? '/editDomain' : '/addDomain';
            const method = modalType === 'update' ? Service.put : Service.post;

            const res = await method(endpoint, payload);
            alert(res.data.message);
            setDomain(''); // Clear input
            setModalType(''); // Close modal
            fetchDomains(); // Refresh list
        } catch (error) {
            console.error(`Error ${modalType === 'update' ? 'updating' : 'adding'} domain:`, error);
            alert(error.response?.data || `Error ${modalType === 'update' ? 'updating' : 'adding'} domain`);
        }
    };

    // Delete domain
    const handleDelete = async (domain) => {
        try {
            await Service.delete(`/deleteDomain/${domain}`);
            fetchDomains();
        } catch (error) {
            console.error('Error deleting domain:', error);
        }
    };

    // Prepare edit
    const prepareEdit = (existingDomain) => {
        setEditDomain(existingDomain);
        setDomain(existingDomain);
        setModalType('update');
    };

    if (selectedDomain) {
        return <Exams domain={selectedDomain} />;
    }

    return (
        // <div className="container p-5">
        //     <div className="row">
        //         {domainList.length === 0 ? (
        //             <span className="text-center fw-bold">No domains added as of now</span>
        //         ) : (
        //             domainList.map((item, index) => (
        //                 <div className="col-3 p-3" key={index}>
        //                     <div
        //                         className="card p-5 bg-secondary text-center"
        //                         onClick={() => handleCardClick(item.Domain)}
        //                         style={{ cursor: 'pointer' }}
        //                     >
        //                         <span className="fw-bold">{item.Domain}</span>
        //                     </div>
        //                 </div>
        //             ))
        //         )}
        //     </div>
        // </div>

        <div className='container mt-5 '>
            <div className='d-flex justify-content-end'>
                <Button variant="contained" color="success" onClick={() => setModalType('add')}>ADD</Button>
            </div>

            <Modal show={!!modalType} onHide={() => setModalType('')} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    {modalType === 'add' ? 'Add Domain' : 'Update Domain'}
                </Modal.Header>
                <Modal.Body className='p-3'>
                    <TextField
                        name="domain"
                        label="Domain"
                        variant="outlined"
                        onChange={domainHandleChange}
                        value={domain}
                    />
                    <Button variant="contained" color="success" onClick={handleDomainSubmit} className='ms-5 mt-2'>
                        {modalType === 'add' ? 'ADD' : 'UPDATE'} Domain
                    </Button>
                    {err && <div className='text-danger ms-3 mt-2'>{err}</div>}
                </Modal.Body>
            </Modal>

            <div className="row">
                {domainList.length === 0 && (
                    <span className='text-center fw-bold'>No domains added as of now</span>
                )}
                {domainList.map((item, index) => (
                    <div className="col-3 p-3" key={index}>
                        <div className="card pb-4 bg-secondary w-100 h-100">
                            <div className="dropend text-end">
                                <button className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                    <PiDotsThreeVerticalBold />
                                </button>
                                <ul className="dropdown-menu">
                                    <li className='text-center'>
                                        <button className='btn btn-link' onClick={() => prepareEdit(item.Domain)}>Edit</button>
                                    </li>
                                    <li className='text-center'>
                                        <button className='btn btn-link' onClick={() => handleDelete(item.Domain)}>Delete</button>
                                    </li>
                                </ul>
                            </div>
                            {/* <Link to={`/exams/create/${item.Domain}`} className='text-decoration-none'> */}
                            <div className="card-body text-center fw-bold fs-5 text-dark" onClick={() => handleCardClick(item.Domain)}>{item.Domain}</div>
                            {/* </Link> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Domains;

