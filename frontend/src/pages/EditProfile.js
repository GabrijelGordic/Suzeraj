import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import the Phone Input and its CSS
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const EditProfile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            api.get(`/api/profiles/${user.username}/`)
                .then(res => {
                    setLocation(res.data.location || '');
                    setPhone(res.data.phone_number || '');
                    setPreview(res.data.avatar);
                })
                .catch(err => console.error(err));
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        
        const data = new FormData();
        data.append('location', location);
        
        // Ensure phone is sent as a string (the library might give us numbers)
        data.append('phone_number', phone); 
        
        if (avatar) {
            data.append('avatar', avatar);
        }

        try {
            await api.patch(`/api/profiles/${user.username}/`, data);
            alert("Profile Updated Successfully!");
            navigate(`/seller/${user.username}`);
        } catch (err) {
            // Detailed Error Logging
            console.error("Update failed:", err.response);
            if (err.response && err.response.data) {
                // Show the specific error from Django (e.g., "Phone number too long")
                setError(JSON.stringify(err.response.data));
            } else {
                setError("Failed to update profile. Check console.");
            }
        }
    };

    if (!user) return <div>Please Login...</div>;

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Edit Profile</h2>
            
            {error && <div style={{background: '#ffebee', color: '#c62828', padding: '10px', marginBottom: '10px'}}>{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Avatar Section */}
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    {preview && (
                        <img 
                            src={preview} 
                            alt="Avatar Preview" 
                            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} 
                        />
                    )}
                    <br/>
                    <label style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                        Change Avatar
                        <input 
                            type="file" 
                            style={{ display: 'none' }} 
                            onChange={e => {
                                setAvatar(e.target.files[0]);
                                setPreview(URL.createObjectURL(e.target.files[0]));
                            }} 
                        />
                    </label>
                </div>

                {/* Location Input */}
                <div style={groupStyle}>
                    <label>Location (City, Country):</label>
                    <input 
                        type="text" 
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        style={inputStyle} 
                        placeholder="e.g. Zagreb, Croatia"
                    />
                </div>

                {/* Phone Number with Flags */}
                <div style={groupStyle}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Phone Number:</label>
                    <PhoneInput
                        country={'hr'} // Default country: Croatia
                        value={phone}
                        onChange={phone => setPhone(phone)}
                        inputStyle={{ width: '100%', height: '35px' }}
                    />
                </div>

                <button type="submit" style={btnStyle}>Save Changes</button>
            </form>
        </div>
    );
};

const groupStyle = { marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '10px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' };

export default EditProfile;