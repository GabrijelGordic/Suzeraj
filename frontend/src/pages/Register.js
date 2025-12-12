import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        username: '', email: '', password: '', re_password: '' 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.re_password) {
            alert("Passwords do not match");
            return;
        }

        try {
            // Djoser endpoint for registration
            await api.post('/auth/users/', formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (error) {
            console.error(error.response.data);
            alert("Registration failed. Check console for details.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" style={inputStyle}
                    onChange={(e) => setFormData({...formData, username: e.target.value})} />
                <input type="email" placeholder="Email" style={inputStyle}
                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <input type="password" placeholder="Password" style={inputStyle}
                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <input type="password" placeholder="Confirm Password" style={inputStyle}
                    onChange={(e) => setFormData({...formData, re_password: e.target.value})} />
                <button type="submit" style={{ padding: '10px 20px', background: 'green', color: 'white' }}>
                    Register
                </button>
            </form>
        </div>
    );
};

const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px' };

export default Register;