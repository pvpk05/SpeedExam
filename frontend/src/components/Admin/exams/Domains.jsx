/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Service from '../../../service/Service';
import Exams from './Exams';

function Domains() {
    const [domainList, setDomainList] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(null);


    const fetchDomains = async () => {
        try {
            const res = await Service.get('/Domains');
            console.log(res.data.result);
            setDomainList(res.data.result || []);
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
    };

    useEffect(() => {
        fetchDomains();
    }, []);

    const handleCardClick = (domain) => {
        setSelectedDomain(domain);
    };

    if (selectedDomain) {
        return <Exams domain={selectedDomain} />;
    }

    return (
        <div className="container">
            <div className="row">
                {domainList.length === 0 && (
                    <span className="text-center fw-bold">No domains added as of now</span>
                )}
                {domainList.map((item, index) => (
                    <div className="col-3 p-3" key={index}>
                        <div
                            className="card text-dark text-center p-3"
                            style={{
                                cursor:"pointer",
                                background:"#f2eded", 
                                borderRadius: '10px',
                                position: 'relative',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                height: '150px',
                            }}
                            onClick={() => handleCardClick(item.domain)}
                        >
                            <div className="mt-5 fw-bolder">{item.domain}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default Domains;

