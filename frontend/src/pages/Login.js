import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
// ADD useLocation
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // <--- Initialize hook
    
    // Check if we have a message from the previous page (Register)
    const successMsg = location.state?.successMessage;

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.username, formData.password);
            navigate('/'); 
        } catch (err) {
            setError('Invalid username or password.');
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            
            {/* --- SUCCESS MESSAGE (If redirected from Register) --- */}
            {successMsg && (
                <div style={successStyle}>
                    {successMsg}
                </div>
            )}

            {/* --- HEADER --- */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={headingStyle}>Welcome Back</h1>
                <p style={subHeadingStyle}>Please sign in to access your account.</p>
            </div>

            {/* --- ERROR MESSAGE --- */}
            {error && <div style={errorStyle}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                {/* ... Inputs ... */}
                <div style={groupStyle}>
                    <label style={labelStyle}>USERNAME</label>
                    <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} style={inputStyle} placeholder="Enter your username" required />
                </div>
                <div style={groupStyle}>
                    <label style={labelStyle}>PASSWORD</label>
                    <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={inputStyle} placeholder="Enter your password" required />
                </div>

                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#666', textDecoration: 'none' }}>
                        Forgot Password?
                    </Link>
                </div>

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'SIGNING IN...' : 'SIGN IN'}
                </button>
            </form>

            <div style={{ marginTop: '30px' }}>
                <p style={footerTextStyle}>
                    New to Shoe Steraj? <Link to="/register" style={linkStyle}>Create an Account</Link>
                </p>
            </div>

            <style>{`
                body { font-family: 'Lato', sans-serif; }
                input::placeholder { color: #ccc; font-weight: 300; }
                input:focus { border-bottom: 1px solid #000 !important; }
            `}</style>
        </div>
    );
};

// ... Existing Styles + Success Style ...
const containerStyle = { maxWidth: '400px', margin: '80px auto', padding: '40px', textAlign: 'center' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: '0 0 10px 0', color: '#111', fontWeight: '400' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.9rem', margin: 0 };
const groupStyle = { marginBottom: '25px', textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#999', letterSpacing: '1px', marginBottom: '5px', fontWeight: '700' };
const inputStyle = { width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent' };
const buttonStyle = { width: '100%', padding: '15px', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px', transition: 'opacity 0.2s' };
const errorStyle = { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', fontSize: '0.9rem', marginBottom: '20px', borderRadius: '4px' };
const footerTextStyle = { color: '#666', fontSize: '0.9rem' };
const linkStyle = { color: '#111', fontWeight: 'bold', textDecoration: 'underline', marginLeft: '5px', cursor: 'pointer' };

// NEW SUCCESS STYLE
const successStyle = {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '15px',
    marginBottom: '30px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    border: '1px solid #c8e6c9'
};

export default Login;