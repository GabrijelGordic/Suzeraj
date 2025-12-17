import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const EditProfile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.get(`/api/profiles/${user.username}/`).then(res => {
                setLocation(res.data.location || '');
                setPhone(res.data.phone_number || '');
                setPreview(res.data.avatar);
                setLoading(false);
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('location', location);
        data.append('phone_number', phone); 
        if (avatar) data.append('avatar', avatar);

        try {
            await api.patch(`/api/profiles/${user.username}/`, data);
            navigate(`/seller/${user.username}`, { state: { successMessage: "Profile updated." } });
        } catch (err) { console.error("Error"); }
    };

    if (loading) return <div style={centerMsg}>LOADING...</div>;

    return (
        <div style={pageWrapper}>
            <div style={streetwearCard}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={headingStyle}>Settings</h1>
                    <p style={subHeadingStyle}>UPDATE YOUR PERSONA.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={avatarContainer}>
                            {preview ? <img src={preview} alt="Avatar" style={avatarImg} /> : <div style={avatarPlaceholder}>{user.username[0]}</div>}
                        </div>
                        <label style={uploadLabel}>
                            CHANGE PHOTO
                            <input type="file" style={{ display: 'none' }} onChange={e => { if(e.target.files[0]) { setAvatar(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }}} accept="image/*" />
                        </label>
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>LOCATION</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} placeholder="E.G. ZAGREB, CROATIA" />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>PHONE NUMBER</label>
                        <div className="custom-phone-input">
                            <PhoneInput country={'hr'} value={phone} onChange={phone => setPhone(phone)} inputProps={{ required: true }} />
                        </div>
                    </div>

                    <button type="submit" style={buttonStyle}>SAVE CHANGES</button>
                </form>
            </div>
            <style>{`
                body { background-color: #FCFCFC; font-family: 'Lato', sans-serif; }
                .custom-phone-input .react-tel-input .form-control { width: 100% !important; background: transparent !important; border: none !important; border-bottom: 1px solid #e0e0e0 !important; border-radius: 0 !important; box-shadow: none !important; font-family: 'Lato', sans-serif !important; font-size: 1rem !important; font-weight: bold; color: #111 !important; }
                .custom-phone-input .react-tel-input .form-control:focus { border-bottom: 2px solid #000 !important; }
                .custom-phone-input .react-tel-input .flag-dropdown { background: transparent !important; border: none !important; }
                input:focus { border-bottom: 2px solid #000 !important; }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const pageWrapper = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' };
const centerMsg = { textAlign: 'center', marginTop: '100px', fontFamily: 'Lato', color: '#888', fontWeight: 'bold' };
const streetwearCard = { backgroundColor: '#fff', border: '2px solid #111', boxShadow: '8px 8px 0px rgba(0,0,0,0.15)', padding: '40px', width: '100%', maxWidth: '450px' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', margin: '0 0 5px 0', color: '#111', fontStyle: 'italic' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.8rem', margin: 0, letterSpacing: '2px', fontWeight: '700' };
const avatarContainer = { width: '80px', height: '80px', margin: '0 auto 15px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #eee' };
const avatarImg = { width: '100%', height: '100%', objectFit: 'cover' };
const avatarPlaceholder = { width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#ccc' };
const uploadLabel = { fontFamily: '"Lato", sans-serif', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px', color: '#111', cursor: 'pointer', borderBottom: '1px solid #111' };
const groupStyle = { marginBottom: '30px', textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '0.7rem', color: '#111', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900' };
const inputStyle = { width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent', color: '#111', fontWeight: 'bold' };
const buttonStyle = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: '2px solid #111', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px', textTransform: 'uppercase' };

export default EditProfile;