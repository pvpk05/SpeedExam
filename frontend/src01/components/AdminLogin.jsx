/* eslint-disable no-unused-vars */

import React, { useState, useEffect, } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Service from '../service/Service'
import img1 from '../assets/AdminLogin.jpg';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        const SAid = Cookies.get('SAid');
        const verified = Cookies.get('verified');
        if (SAid && verified === 'true') {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({ username: '', password: '' });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'username' && !value) {
            setErrors({ ...errors, username: 'Username is required' });
        } else if (name === 'password' && !value) {
            setErrors({ ...errors, password: 'Password is required' });
        } else {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async () => {
        if (formData.username && formData.password) {
            try {
                const response = await Service.post('/api/SAlogin', {
                    username: formData.username,
                    password: formData.password
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                toast.success('Logged in successfully!', { autoClose: 5000 });

                const expiresInThirtyDays = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

                Object.keys(Cookies.get()).forEach(cookieName => {
                    Cookies.remove(cookieName);
                });

                // Set new cookies
                Cookies.set('role', 'SA', { expires: expiresInThirtyDays });
                Cookies.set('verified', true, { expires: expiresInThirtyDays });
                Cookies.set('name', response.data.name, { expires: expiresInThirtyDays });
                Cookies.set('SAid', response.data.SAid, { expires: expiresInThirtyDays });


                navigate('/admin/dashboard');
            } catch (error) {
                console.error('Login error:', error.response?.data || error.message);
                toast.error('Invalid credentials', { autoClose: 5000 });
            }
        } else {
            setErrors({
                username: !formData.username ? 'Username is required' : '',
                password: !formData.password ? 'Password is required' : ''
            });
        }
    };

    return (
        <div style={styles.container}>
            {/* Left Section */}
            <div style={styles.leftSection}>
                <img src={img1} alt='img01' style={{ width: "800px" }} />
            </div>

            <div className="container d-flex flex-column justify-content-center" style={{ height: '80vh' }}>
                <div className="border rounded shadow p-3 d-flex flex-column align-items-center bg-none" style={{ width: '100%', maxWidth: '500px' }}>
                    <h4 className='fw-bold mb-4 mt-2 text-nowrap' style={{ fontFamily: 'monospace' }}>
                        Admin Login
                    </h4>

                    <TextField
                        label="Username"
                        variant="outlined"
                        className="w-100 mb-4"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                        InputLabelProps={{ className: 'fw-bold text-secondary' }}
                    />

                    <TextField
                        label="Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        className="w-100 mb-5"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        InputLabelProps={{ className: 'fw-bold text-secondary' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        style={{
                                            padding: '8px',
                                            borderRadius: '50%',
                                        }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>

                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
};


const styles = {
    container: {
        display: 'flex',
        height: '90vh',
        fontFamily: 'Arial, sans-serif',
    },
    leftSection: {
        flex: 1,
        // backgroundColor: '#3b3db8',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // padding: '40px',
        textAlign: 'center',
    },
    welcomeTitle: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
    },
    description: {
        fontSize: '1rem',
        marginTop: '20px',
        lineHeight: '1.6',
    },
    footer: {
        marginTop: 'auto',
        fontSize: '0.85rem',
        opacity: 0.7,
    },
    rightSection: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: "100px",
        backgroundColor: '#fff',
    },
    title: {
        fontSize: '1.8rem',
        marginBottom: '10px',
        color: '#78addf'
    },
    createAccountText: {
        fontSize: '0.9rem',
        marginBottom: '30px',
    },
    link: {
        color: '#3b3db8',
        textDecoration: 'underline',
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    loginButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#78addf',
        color: 'white',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    googleButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#f1f1f1',
        color: 'black',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '20px',
    },
    forgotPasswordLink: {
        fontSize: '0.9rem',
        textDecoration: 'none',
        color: 'black',
    },
};

export default AdminLogin;
