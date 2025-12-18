import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Sell = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    size: '',
    condition: '',
    price: '',
    currency: 'EUR',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      await api.post('/api/shoes/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/'); // Redirect to home on success
    } catch (err) {
      console.error(err);
      alert('Failed to create listing. Please check all fields.');
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      
      <div style={streetwearCard}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={headingStyle}>Sell Your Kicks</h1>
            <p style={subHeadingStyle}>TURN YOUR ROTATION INTO CASH.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            
            {/* --- SECTION 1: DETAILS --- */}
            <div style={rowStyle}>
                <div style={groupStyle}>
                    <label style={labelStyle}>AD TITLE:</label>
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="E.G. JORDAN 1 CHICAGO" 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                </div>
                <div style={groupStyle}>
                    <label style={labelStyle}>BRAND:</label>
                    <div style={selectWrapper}>
                        <select name="brand" onChange={handleChange} required style={selectStyle}>
                            <option value="">SELECT BRAND</option>
                            <option value="Nike">Nike</option>
                            <option value="Adidas">Adidas</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Yeezy">Yeezy</option>
                            <option value="New Balance">New Balance</option>
                            <option value="Asics">Asics</option>
                            <option value="Converse">Converse</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={rowStyle}>
                <div style={groupStyle}>
                    <label style={labelStyle}>SIZE (EU):</label>
                    <input 
                        type="number" 
                        step="0.5" 
                        name="size" 
                        placeholder="42.5" 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                </div>
                <div style={groupStyle}>
                    <label style={labelStyle}>CONDITION:</label>
                    <div style={selectWrapper}>
                        <select name="condition" onChange={handleChange} required style={selectStyle}>
                            <option value="">SELECT CONDITION</option>
                            <option value="New">New / Deadstock</option>
                            <option value="Used">Used / Worn</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: PRICE --- */}
            <div style={rowStyle}>
                <div style={{...groupStyle, flex: 2}}>
                    <label style={labelStyle}>PRICE:</label>
                    <input 
                        type="number" 
                        name="price" 
                        placeholder="0.00" 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                </div>
                <div style={{...groupStyle, flex: 1}}>
                    <label style={labelStyle}>CURRENCY:</label>
                    <div style={selectWrapper}>
                        <select name="currency" onChange={handleChange} style={selectStyle}>
                            <option value="EUR">EUR (€)</option>
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- SECTION 3: IMAGE UPLOAD --- */}
            <div style={{ marginBottom: '30px' }}>
                <label style={labelStyle}>PHOTO:</label>
                <div style={fileUploadWrapper}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        required 
                        style={fileInput} 
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" style={fileLabel}>
                        {preview ? (
                            <img src={preview} alt="Preview" style={previewImage} />
                        ) : (
                            <div style={{textAlign:'center'}}>
                                <span style={{fontSize:'2.5rem', display:'block', marginBottom:'10px'}}>📷</span>
                                <span style={{fontFamily:'Lato', color:'#666', fontWeight:'bold', letterSpacing:'1px', textTransform:'uppercase'}}>Click to upload</span>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            <div style={groupStyle}>
                <label style={labelStyle}>DESCRIPTION (OPTIONAL):</label>
                <textarea 
                    name="description" 
                    rows="4" 
                    placeholder="TELL US ABOUT FLAWS, BOX CONDITION, ETC." 
                    onChange={handleChange} 
                    style={textareaStyle}
                ></textarea>
            </div>

            <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? 'POSTING...' : 'PUBLISH LISTING'}
            </button>

        </form>
      </div>

      <style>{`
        body { background-color: #b1b1b1ff; font-family: 'Lato', sans-serif; }
        
        /* PLACEHOLDER STYLING */
        input::placeholder, textarea::placeholder { color: #555; font-weight: 300; font-size: 0.8rem; }
        
        /* FOCUS ANIMATION */
        input:focus, select:focus, textarea:focus { 
            border-bottom: 2px solid #111 !important; 
            background-color: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const pageWrapper = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' };

const streetwearCard = {
    backgroundColor: '#ddddddff',
    border: '2px solid #111',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.15)', // Hard Shadow
    padding: '40px',
    width: '100%',
    maxWidth: '650px', // Slightly wider for the form
};

const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: '0 0 5px 0', color: '#111', fontStyle: 'italic' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.9rem', margin: 0, letterSpacing: '2px', fontWeight: '700' };

const rowStyle = { display: 'flex', gap: '20px', marginBottom: '10px' };
const groupStyle = { display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '0.9rem', color: '#111', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900', fontFamily: 'Lato' };

// --- INPUTS ---
const inputStyle = { 
    width: '100%', 
    border: 'none', 
    borderBottom: '1px solid #999', 
    padding: '12px 0', 
    fontSize: '1rem', 
    outline: 'none', 
    transition: 'all 0.3s ease', 
    fontFamily: '"Lato", sans-serif', 
    backgroundColor: 'transparent', 
    fontWeight: 'bold',
    color: '#111'
};

const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    border: '1px solid #999', // Full border for textarea usually looks better
    padding: '10px',
    backgroundColor: 'rgba(255,255,255,0.5)'
};

// --- SELECT DROPDOWN ---
const selectWrapper = { position: 'relative', width: '100%' };
const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none', // Remove default arrow
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0 center',
    backgroundSize: '16px',
};

// --- FILE UPLOAD ---
const fileUploadWrapper = {
    position: 'relative',
    height: '180px',
    border: '2px dashed #999',
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};
const fileInput = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 };
const fileLabel = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 };
const previewImage = { width: '100%', height: '100%', objectFit: 'contain' };

const buttonStyle = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: '2px solid #111', fontSize: '1rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', marginTop: '10px' };

export default Sell;