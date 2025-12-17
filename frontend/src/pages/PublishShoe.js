import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Meta from '../components/Meta';

const PublishShoe = () => {
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('EUR'); 
    const [condition, setCondition] = useState('New');
    const [description, setDescription] = useState('');
    const [contact, setContact] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const SIZE_OPTIONS = [];
    for (let i = 35; i <= 49.5; i += 0.5) { SIZE_OPTIONS.push(i); }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        if (!title || !brand || !size || !price || !contact) { setError("Fill all fields marked with *"); setLoading(false); return; }
        if (!coverImage) { setError("Main Cover Photo is required *"); setLoading(false); return; }
        
        const data = new FormData();
        data.append('title', title); data.append('brand', brand); data.append('size', size);
        data.append('price', price); data.append('currency', currency); data.append('condition', condition);
        data.append('description', description); data.append('contact_info', contact); data.append('image', coverImage);
        for (let i = 0; i < gallery.length; i++) { data.append('gallery_images', gallery[i]); }

        try {
            await api.post('/api/shoes/', data);
            navigate('/mylistings', { state: { successMessage: "Listing published successfully!" } }); 
        } catch (err) { setError('Failed to publish. Check your connection.'); } 
        finally { setLoading(false); }
    };

    return (
        <div style={containerStyle}>
            <Meta title="Sell Your Kicks | Šuzeraj" />

            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={headingStyle}>List a Product</h1>
                <p style={subHeadingStyle}>SHARE YOUR COLLECTION WITH THE WORLD.</p>
            </div>

            {error && <div style={errorStyle}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ maxWidth: '700px', margin: '0 auto' }}>
                
                <div style={groupStyle}>
                    <label style={labelStyle}>PRODUCT TITLE <span style={reqStar}>*</span></label>
                    <input type="text" placeholder="E.G. JORDAN 1 HIGH CHICAGO" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} required />
                </div>

                <div style={rowStyle}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>BRAND <span style={reqStar}>*</span></label>
                        <select value={brand} onChange={e => setBrand(e.target.value)} style={selectStyle} required>
                            <option value="">SELECT...</option>
                            <option value="Nike">Nike</option>
                            <option value="Adidas">Adidas</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Yeezy">Yeezy</option>
                            <option value="New Balance">New Balance</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>CONDITION <span style={reqStar}>*</span></label>
                        <select value={condition} onChange={e => setCondition(e.target.value)} style={selectStyle}>
                            <option value="New">NEW / DEADSTOCK</option>
                            <option value="Used">USED / WORN</option>
                        </select>
                    </div>
                </div>

                <div style={rowStyle}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>SIZE (EU) <span style={reqStar}>*</span></label>
                        <select value={size} onChange={e => setSize(e.target.value)} style={selectStyle} required>
                            <option value="">SELECT SIZE</option>
                            {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>PRICE <span style={reqStar}>*</span></label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...selectStyle, width: '80px', fontWeight: '900' }}>
                                <option value="EUR">€</option>
                                <option value="USD">$</option>
                                <option value="GBP">£</option>
                            </select>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} placeholder="0.00" required />
                        </div>
                    </div>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>DESCRIPTION <span style={optionalText}>(OPTIONAL)</span></label>
                    <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} style={textareaStyle} placeholder="Add details..." />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>CONTACT NUMBER <span style={reqStar}>*</span></label>
                    <div className="custom-phone-input">
                        <PhoneInput country={'hr'} value={contact} onChange={phone => setContact(phone)} inputProps={{ required: true }} />
                    </div>
                </div>

                <div style={{ margin: '50px 0', borderTop: '2px solid #eee' }}></div>

                <div style={groupStyle}>
                    <label style={labelStyle}>MAIN COVER PHOTO <span style={reqStar}>*</span></label>
                    <label style={uploadBtn}>
                        {coverImage ? `SELECTED: ${coverImage.name}` : '+ UPLOAD COVER IMAGE'}
                        <input type="file" onChange={e => setCoverImage(e.target.files[0])} style={{display:'none'}} accept="image/*" required />
                    </label>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>GALLERY PHOTOS <span style={optionalText}>(OPTIONAL)</span></label>
                    <label style={uploadBtn}>
                        {gallery.length > 0 ? `SELECTED ${gallery.length} FILES` : '+ UPLOAD GALLERY IMAGES'}
                        <input type="file" onChange={e => setGallery(e.target.files)} style={{display:'none'}} accept="image/*" multiple />
                    </label>
                </div>

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'PUBLISHING...' : 'PUBLISH LISTING'}
                </button>
            </form>

            <style>{`
                body { background-color: #FCFCFC; font-family: 'Lato', sans-serif; }
                input:focus, select:focus, textarea:focus { border-bottom: 2px solid #000 !important; }
                .custom-phone-input .react-tel-input .form-control {
                    width: 100% !important; background: transparent !important; border: none !important;
                    border-bottom: 1px solid #e0e0e0 !important; border-radius: 0 !important; box-shadow: none !important;
                    font-family: 'Lato', sans-serif !important; font-size: 1rem !important; font-weight: bold; color: #111 !important;
                }
                .custom-phone-input .react-tel-input .form-control:focus { border-bottom: 2px solid #000 !important; }
                .custom-phone-input .react-tel-input .flag-dropdown { background: transparent !important; border: none !important; }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const containerStyle = { maxWidth: '800px', margin: '60px auto', padding: '40px' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: '0 0 10px 0', color: '#111', fontStyle: 'italic' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.8rem', margin: 0, letterSpacing: '2px', fontWeight: '700' };
const groupStyle = { marginBottom: '35px', textAlign: 'left' };
const rowStyle = { display: 'flex', gap: '40px', marginBottom: '35px' };
const labelStyle = { display: 'block', fontSize: '0.7rem', color: '#111', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900' };
const reqStar = { color: '#d32f2f' };
const optionalText = { fontSize:'0.6rem', color:'#aaa', fontWeight:'normal', marginLeft:'5px' };
const inputStyle = { width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent', color: '#111', fontWeight: 'bold' };
const selectStyle = { ...inputStyle, cursor: 'pointer' };
const textareaStyle = { ...inputStyle, resize: 'none' };
const uploadBtn = { display: 'block', width: '100%', padding: '20px', border: '2px dashed #ccc', textAlign: 'center', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', fontWeight: '900', color: '#555', backgroundColor: '#f9f9f9', transition: 'all 0.2s', letterSpacing: '1px' };
const buttonStyle = { width: '100%', padding: '20px', backgroundColor: '#111', color: '#fff', border: '2px solid #111', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', marginTop: '20px', textTransform: 'uppercase' };
const errorStyle = { backgroundColor: '#ffebee', color: '#c62828', padding: '15px', fontSize: '0.9rem', marginBottom: '30px', border: '1px solid #ef9a9a', textAlign: 'center', fontWeight: 'bold' };

export default PublishShoe;