import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const PublishShoe = () => {
    const navigate = useNavigate();
    
    // State for the form inputs
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null); // File object
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Create FormData (Required for file uploads)
        const data = new FormData();
        data.append('title', title);
        data.append('brand', brand);
        data.append('size', size);
        data.append('price', price);
        
        // Only append image if one was selected
        if (image) {
            data.append('image', image);
        } else {
            setError("Please select an image");
            return;
        }

        try {
            // 2. Send to Backend
            // Content-Type header is usually auto-set by Axios when seeing FormData, 
            // but the browser handles the "boundary" parts automatically.
            await api.post('/api/shoes/', data);
            
            alert('Shoe Published Successfully!');
            navigate('/'); // Go back to Home
        } catch (err) {
            console.error(err);
            setError('Failed to publish. Make sure all fields are filled.');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Sell Your Kicks</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div style={groupStyle}>
                    <label>Title (e.g. Jordan 1 High):</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} required />
                </div>

                <div style={groupStyle}>
                    <label>Brand:</label>
                    <input type="text" value={brand} onChange={e => setBrand(e.target.value)} style={inputStyle} required />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={groupStyle}>
                        <label>Size (US):</label>
                        <input type="number" step="0.5" value={size} onChange={e => setSize(e.target.value)} style={inputStyle} required />
                    </div>
                    <div style={groupStyle}>
                        <label>Price ($):</label>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} required />
                    </div>
                </div>

                <div style={groupStyle}>
                    <label>Photo:</label>
                    {/* Input type="file" is special. We read e.target.files[0] */}
                    <input type="file" onChange={e => setImage(e.target.files[0])} style={inputStyle} accept="image/*" required />
                </div>

                <button type="submit" style={btnStyle}>Publish</button>
            </form>
        </div>
    );
};

const groupStyle = { marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' };

export default PublishShoe;