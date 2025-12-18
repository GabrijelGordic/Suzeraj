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
    <div style={styles.container}>
      
      <div style={styles.card}>
        <div style={styles.header}>
            <h1 style={styles.title}>Sell Your Kicks</h1>
            <p style={styles.subtitle}>Turn your rotation into cash.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
            
            {/* --- SECTION 1: DETAILS --- */}
            <div style={styles.row}>
                <div style={styles.group}>
                    <label style={styles.label}>Ad Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="e.g. Jordan 1 High Chicago" 
                        onChange={handleChange} 
                        required 
                        style={styles.input} 
                    />
                </div>
                <div style={styles.group}>
                    <label style={styles.label}>Brand</label>
                    <select name="brand" onChange={handleChange} required style={styles.select}>
                        <option value="">Select Brand</option>
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

            <div style={styles.row}>
                <div style={styles.group}>
                    <label style={styles.label}>Size (EU)</label>
                    <input 
                        type="number" 
                        step="0.5" 
                        name="size" 
                        placeholder="42.5" 
                        onChange={handleChange} 
                        required 
                        style={styles.input} 
                    />
                </div>
                <div style={styles.group}>
                    <label style={styles.label}>Condition</label>
                    <select name="condition" onChange={handleChange} required style={styles.select}>
                        <option value="">Select Condition</option>
                        <option value="New">New / Deadstock</option>
                        <option value="Used">Used / Worn</option>
                    </select>
                </div>
            </div>

            {/* --- SECTION 2: PRICE --- */}
            <div style={styles.row}>
                <div style={{...styles.group, flex: 2}}>
                    <label style={styles.label}>Price</label>
                    <input 
                        type="number" 
                        name="price" 
                        placeholder="0.00" 
                        onChange={handleChange} 
                        required 
                        style={styles.input} 
                    />
                </div>
                <div style={{...styles.group, flex: 1}}>
                    <label style={styles.label}>Currency</label>
                    <select name="currency" onChange={handleChange} style={styles.select}>
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                </div>
            </div>

            {/* --- SECTION 3: IMAGE UPLOAD --- */}
            <div style={styles.group}>
                <label style={styles.label}>Photo</label>
                <div style={styles.fileUploadWrapper}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        required 
                        style={styles.fileInput} 
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" style={styles.fileLabel}>
                        {preview ? (
                            <img src={preview} alt="Preview" style={styles.previewImage} />
                        ) : (
                            <div style={{textAlign:'center'}}>
                                <span style={{fontSize:'2rem', display:'block', marginBottom:'10px'}}>📷</span>
                                <span style={{fontFamily:'Lato', color:'#666'}}>Click to upload photo</span>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            <div style={styles.group}>
                <label style={styles.label}>Description (Optional)</label>
                <textarea 
                    name="description" 
                    rows="4" 
                    placeholder="Tell us about flaws, box condition, etc." 
                    onChange={handleChange} 
                    style={styles.textarea}
                ></textarea>
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'POSTING...' : 'PUBLISH LISTING'}
            </button>

        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
    container: {
        backgroundColor: '#FCFCFC',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
    },
    card: {
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: '600px',
        padding: '50px',
        borderRadius: '8px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    title: {
        fontFamily: 'Playfair Display',
        fontSize: '2.5rem',
        margin: '0 0 10px 0',
        color: '#111',
    },
    subtitle: {
        fontFamily: 'Lato',
        color: '#888',
        fontSize: '1rem',
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
    },
    row: {
        display: 'flex',
        gap: '20px',
    },
    group: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    label: {
        fontFamily: 'Lato',
        fontSize: '0.75rem',
        fontWeight: '800',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '8px',
        color: '#333',
    },
    input: {
        padding: '12px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        fontSize: '1rem',
        fontFamily: 'Lato',
        backgroundColor: '#FCFCFC',
        outline: 'none',
        transition: 'border 0.2s',
    },
    select: {
        padding: '12px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        fontSize: '1rem',
        fontFamily: 'Lato',
        backgroundColor: '#FCFCFC',
        outline: 'none',
        cursor: 'pointer',
    },
    textarea: {
        padding: '12px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        fontSize: '1rem',
        fontFamily: 'Lato',
        backgroundColor: '#FCFCFC',
        resize: 'vertical',
        outline: 'none',
    },
    // Custom File Upload
    fileUploadWrapper: {
        position: 'relative',
        height: '200px',
        border: '2px dashed #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
        transition: 'background 0.2s',
    },
    fileInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer',
        zIndex: 2,
    },
    fileLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    submitBtn: {
        backgroundColor: '#111',
        color: '#fff',
        border: 'none',
        padding: '18px',
        fontSize: '1rem',
        fontWeight: '700',
        fontFamily: 'Lato',
        letterSpacing: '2px',
        cursor: 'pointer',
        marginTop: '20px',
        transition: 'opacity 0.2s',
    }
};

export default Sell;