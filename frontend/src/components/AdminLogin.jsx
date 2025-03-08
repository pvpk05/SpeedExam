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
        <div className="d-flex justify-content-center align-items-center" style={{ height: "77.1vh" }}>
            <div className="w-100 px-3" style={{ maxWidth: '500px' }}>
                <div className="border rounded shadow p-3 d-flex flex-column align-items-center bg-none">
                    <h4 className='fw-bold mb-4 mt-2 text-light' style={{ fontFamily: 'monospace' }}>
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
                        InputLabelProps={{
                            style: { color: '#ffffff' } // Label color
                        }}
                        InputProps={{
                            style: {
                                color: '#ffffff',          // Text color
                                borderColor: '#ffffff'     // Outline color
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#ffffff', // Default border color
                                },
                                '&:hover fieldset': {
                                    borderColor: '#ffffff', // Hover border color
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ffffff', // Focused border color
                                },
                            },
                        }} />

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
                        // InputLabelProps={{ className: 'fw-bold text-secondary' }}

                        InputLabelProps={{
                            style: { color: '#ffffff' } // Label color
                        }}
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
                            style: {
                                color: '#ffffff',          // Text color
                                borderColor: '#ffffff'     // Outline color
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#ffffff', // Default border color
                                },
                                '&:hover fieldset': {
                                    borderColor: '#ffffff', // Hover border color
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ffffff', // Focused border color
                                },
                            },
                        }}
                    />

                    <Button
                        style={{color:"white"}}
                        variant="outlined"
                        color="white"
                        onClick={handleSubmit}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </div>

    );
};




export default AdminLogin;
