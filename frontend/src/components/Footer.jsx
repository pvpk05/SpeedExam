/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import './Footer.css'
import { Link } from 'react-router-dom'
const Footer = () => {
    const letters = ['R', 'A', 'M', 'A', 'N', 'A', 'S', 'O', 'F', 'T'];
    const [activeIndexes, setActiveIndexes] = useState([]);

    const handleMouseEnter = () => {
        setActiveIndexes(letters.map((_, index) => index));
    };

    const handleMouseLeave = () => {
        // When mouse leaves the container, deactivate all the letters.
        setActiveIndexes([]);
    };

    useEffect(() => {
        const timeouts = letters.map((_, index) =>
            setTimeout(() => {
                setActiveIndexes((prev) => [...prev, index]);
            }, 750 * (index + 1))
        );

        return () => timeouts.forEach((timeout) => clearTimeout(timeout));
    }, [letters.length]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            backgroundColor: 'black',
            color: 'white',
            fontWeight: 'bold',
            marginTop: "0px"  // Remove margin to ensure full centering works
        }}>
            <div className='container' style={{ textAlign: 'center' }}>
                <div className='row justify-content-center'>
                    <div className='col-6 col-md-6 col-lg-2'>
                        <div className='footer-link'>
                            <Link style={{ color: "#999999", cursor: "pointer", textDecoration: "none" }} to="https://ramanasoft.com/privacy-policy">Privacy Statement</Link>
                        </div>
                    </div>
                    <div className='col-6 col-md-6 col-lg-2'>
                        <div className='footer-link'>
                            <Link style={{ color: "#999999", cursor: "pointer", textDecoration: "none" }} to="https://ramanasoft.com/security">Terms & Conditions</Link>
                        </div>
                    </div>
                    <div className='col-6 col-md-6 col-lg-2'>
                        <div className='footer-link'>
                            <div className='mb-3 footer-link'><Link style={{ color: "#999999", cursor: "pointer", textDecoration: "none" }} to="https://ramanasoft.com/cookies">Cookie Policy</Link></div>
                        </div>
                    </div>
                    <div className='col-6 col-md-6 col-lg-2'>
                        <div className='footer-link'>
                            <div className='mb-3 footer-link'><Link style={{ color: "#999999", cursor: "pointer", textDecoration: "none" }} to="https://ramanasoft.com/accessibility">Accessibility</Link></div>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '5px', marginBottom:"10px"}}>
                    A Project by <a href="https://ramanasoft.com" style={{ color: "#999", textDecoration: "none" }}>RamanaSoft</a> Consulting Services
                </div>
                <div className='row justify-content-center'>
                    <div className='footer-rights-text col pb-3'>
                        © 2025 RamanaSoft. All rights reserved.
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Footer;


// import { useState, useEffect } from 'react';

// const Footer = () => {
//     const letters = ['R', 'A', 'M', 'A', 'N', 'A', 'S', 'O', 'F', 'T'];
//     const [activeIndexes, setActiveIndexes] = useState([]);

//     // const handleMouseEnter = (index) => {
//     //     setActiveIndexes((prev) => [...prev, index]);
//     // };

//     // const handleMouseLeave = (index) => {
//     //     setActiveIndexes((prev) => prev.filter((i) => i !== index));
//     // };

//     const handleMouseEnter = () => {
//         // When hovering over the container, activate all the letters.
//         setActiveIndexes(letters.map((_, index) => index));
//     };

//     const handleMouseLeave = () => {
//         // When mouse leaves the container, deactivate all the letters.
//         setActiveIndexes([]);
//     };


//     useEffect(() => {
//         const timeouts = letters.map((_, index) =>
//             setTimeout(() => {
//                 setActiveIndexes((prev) => [...prev, index]);
//             }, 750 * (index + 1))
//         );

//         return () => timeouts.forEach((timeout) => clearTimeout(timeout));
//     }, [letters.length]);

//     return (
//         <div style={{ width: '100%', height: '300px', marginTop: "50px", backgroundColor: 'black', color: 'white' }}>
//             <div className='container'>
//                 <div className='row py-3'>
//                     <div className='col-2'>
//                         <div className='mb-3'>Preference Center</div>
//                         <div className='mb-3'>Careers</div>
//                         <div className='mb-3'>About Us</div>
//                         <div className='mb-3'>Contact Us</div>
//                         <div className='mb-3'>Locations</div>
//                     </div>
//                     <div className='col-2'>
//                         <div className='mb-3'>Privacy Statement</div>
//                         <div className='mb-3'>Terms & Conditions</div>
//                         <div className='mb-3'>Cookie Policy/Settings</div>
//                         <div>Accessibility Statement</div>
//                     </div>
//                     <div className='col d-flex justify-content-center align-items-center'>
//                         <div className="logo-container">
//                             {/* <div className="logo-text">
//                                 {letters.split('').map((letter, index) => (
//                                     <span
//                                         key={index}
//                                         className={`letter ${letter === 'A' && index === 4 ? 'A' : ''} ${hoveredIndex === index ? 'hovered' : ''}`}
//                                         onMouseEnter={() => handleMouseEnter(index)}
//                                         onMouseLeave={handleMouseLeave}
//                                         style={{ animationDelay: `${index * 0.1}s` }}
//                                     >
//                                         {letter}
//                                     </span>
//                                 ))}
//                             </div> */}
//                             <div>
//                                 <div
//                                 className="word"
//                                 onMouseEnter={handleMouseEnter}
//                                 onMouseLeave={handleMouseLeave}

//                                 >
//                                     {letters.map((letter, index) => (
//                                         <span
//                                             key={index}
//                                             className={activeIndexes.includes(index) ? `active nth-child-${index + 1}` : ''}
//                                             onMouseEnter={() => handleMouseEnter(index)}
//                                             onMouseLeave={() => handleMouseLeave(index)}
//                                             style={{ animationDelay: `${index * 0.1}s` }}
//                                         >
//                                             {letter}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="subtitle text-end">Consulting Services</div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className='row'>
//                     <div className='col'>
//                         ©2024 RamanaSoft. All rights reserved.
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Footer;
