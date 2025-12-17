import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ username: '', email: '', password: '', re_password: '' });
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.re_password) { setError("Passwords do not match."); return; }
        setLoading(true);
        try {
            await api.post('/auth/users/', formData);
            if (avatar) {
                const loginRes = await api.post('/auth/token/login/', { username: formData.username, password: formData.password });
                const imgData = new FormData();
                imgData.append('avatar', avatar);
                await api.patch(`/api/profiles/${formData.username}/`, imgData, {
                    headers: { 'Authorization': `Token ${loginRes.data.auth_token}`, 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/login', { state: { successMessage: "Account created successfully! Please sign in." } });
        } catch (err) {
            console.error(err.response);
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.email) setError(data.email[0]);
                else if (data.username) setError(data.username[0]);
                else if (data.password) setError(data.password[0]);
                else setError("Registration failed.");
            } else { setError("Registration failed."); }
        } finally { setLoading(false); }
    };

    return (
        <div style={pageWrapper}>
            <div style={streetwearCard}>
                
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h1 style={headingStyle}>Join the Club</h1>
                    <p style={subHeadingStyle}>CREATE YOUR LEGACY.</p>
                </div>

                {error && <div style={errorStyle}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={avatarContainer}>
                            {preview ? <img src={preview} alt="Avatar" style={avatarImg} /> : <div style={avatarPlaceholder}>+</div>}
                        </div>
                        <label style={uploadLabel}>
                            UPLOAD PHOTO
                            <input type="file" style={{ display: 'none' }} onChange={e => { if(e.target.files[0]) { setAvatar(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }}} accept="image/*" />
                        </label>
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>USERNAME <span style={reqStar}>*</span></label>
                        <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} style={inputStyle} required />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>EMAIL <span style={reqStar}>*</span></label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} required />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>PASSWORD <span style={reqStar}>*</span></label>
                        <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={inputStyle} required />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>CONFIRM PASSWORD <span style={reqStar}>*</span></label>
                        <input type="password" value={formData.re_password} onChange={(e) => setFormData({...formData, re_password: e.target.value})} style={inputStyle} required />
                    </div>

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center' }}>
                    <p style={footerTextStyle}>
                        ALREADY A MEMBER? <Link to="/login" style={linkStyle}>SIGN IN</Link>
                    </p>
                </div>
            </div>
            <style>{`
                body { background-color: #b1b1b1ff; font-family: 'Lato', sans-serif; }
                input:focus { border-bottom: 2px solid #000 !important; }
            `}</style>
        </div>
    );
};

// Reuse styles from Login for consistency
const pageWrapper = { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' };
const streetwearCard = { backgroundColor: '#ddddddff', border: '2px solid #111', boxShadow: '8px 8px 0px rgba(0,0,0,0.15)', padding: '40px', width: '100%', maxWidth: '500px' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', margin: '0 0 5px 0', color: '#111', fontStyle: 'italic' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.8rem', margin: 0, letterSpacing: '2px', fontWeight: '700' };
const avatarContainer = { width: '80px', height: '80px', margin: '0 auto 10px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #eee', cursor: 'pointer' };
const avatarImg = { width: '100%', height: '100%', objectFit: 'cover' };
const avatarPlaceholder = { width: '100%', height: '100%', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#ccc' };
const uploadLabel = { fontFamily: '"Lato", sans-serif', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px', color: '#111', cursor: 'pointer', borderBottom: '1px solid #111' };
const groupStyle = { marginBottom: '20px', textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '1.1rem', color: '#111', letterSpacing: '1px', marginBottom: '5px', fontWeight: '900' };
const reqStar = { color: '#d32f2f', marginLeft: '3px' };
const inputStyle = { width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent', fontWeight: 'bold' };
const buttonStyle = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: '2px solid #111', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px', textTransform: 'uppercase' };
const errorStyle = { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', fontSize: '0.85rem', marginBottom: '20px', border: '1px solid #ef9a9a', textAlign: 'center' };
const footerTextStyle = { color: '#666', fontSize: '0.85rem' };
const linkStyle = { color: '#111', fontWeight: '900', textDecoration: 'underline', marginLeft: '5px' };

export default Register;