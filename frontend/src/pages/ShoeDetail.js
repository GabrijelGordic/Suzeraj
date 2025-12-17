import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import Meta from '../components/Meta';

const ShoeDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    
    const [shoe, setShoe] = useState(null);
    const [mainImage, setMainImage] = useState(''); 
    const [showContact, setShowContact] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/shoes/${id}/`).then(res => { setShoe(res.data); setMainImage(res.data.image); setLoading(false); }).catch(err => setLoading(false));
    }, [id]);

    const getCurrencySymbol = (code) => { if (code === 'USD') return '$'; if (code === 'GBP') return '£'; return '€'; };
    const generateWhatsAppLink = (contactInfo, shoeTitle) => {
        const cleanNumber = contactInfo ? contactInfo.replace(/\D/g, '') : '';
        const text = `Hi, I saw your listing for "${shoeTitle}" on Šuzeraj.`;
        return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    };

    if (loading) return <div style={centerMsg}>LOADING...</div>;
    if (!shoe) return <div style={centerMsg}>NOT FOUND.</div>;

    return (
        <div style={pageWrapper}>
            <Meta title={`${shoe.title} | Šuzeraj`} ogImage={shoe.image} />

            <div style={{ marginBottom: '40px' }}>
                <Link to="/" style={backLink}>&larr; BACK TO SHOP</Link>
            </div>
            
            <div style={containerStyle}>
                
                {/* LEFT: IMAGERY */}
                <div style={imageSection}>
                    <div style={mainImageContainer}>
                        <img src={mainImage} alt={shoe.title} style={mainImgStyle} />
                    </div>
                    <div style={thumbnailRow}>
                        {[shoe.image, ...shoe.gallery.map(g => g.image)].map((img, idx) => (
                            <img key={idx} src={img} alt="Thumb" onClick={() => setMainImage(img)} style={{...thumbStyle, border: mainImage === img ? '2px solid #000' : '1px solid #eee'}} />
                        ))}
                    </div>
                </div>

                {/* RIGHT: DETAILS */}
                <div style={detailsSection}>
                    <h2 style={brandStyle}>{shoe.brand}</h2>
                    <h1 style={titleStyle}>{shoe.title}</h1>
                    <p style={priceStyle}>{getCurrencySymbol(shoe.currency)}{shoe.price}</p>

                    <div style={divider}></div>

                    <div style={specGrid}>
                        <div style={specItem}><span style={labelStyle}>SIZE (EU)</span><span style={valueStyle}>{shoe.size}</span></div>
                        <div style={specItem}><span style={labelStyle}>CONDITION</span><span style={valueStyle}>{shoe.condition}</span></div>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <h4 style={labelStyle}>DESCRIPTION</h4>
                        <p style={descStyle}>{shoe.description || "No description provided."}</p>
                    </div>

                    <div style={divider}></div>

                    <div style={sellerContainer}>
                        <span style={labelStyle}>SELLER</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                            <Link to={`/seller/${shoe.seller_username}`} style={sellerLink}>{shoe.seller_username}</Link>
                            <span style={ratingBadge}>★ {shoe.seller_rating > 0 ? shoe.seller_rating : 'New'}</span>
                        </div>
                    </div>

                    {/* --- ACTION BUTTON --- */}
                    {!showContact ? (
                        <button onClick={() => user ? setShowContact(true) : alert("Please Login.")} style={contactBtn}>
                            CONTACT SELLER
                        </button>
                    ) : (
                        // STREETWEAR BOX FOR CONTACT INFO
                        <div style={contactBox}>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: '#ccc', textTransform: 'uppercase', marginBottom: '10px', letterSpacing:'1px' }}>CONTACT DETAILS</p>
                            <p style={{ margin: '0 0 20px', fontSize: '1.2rem', fontWeight: 'bold' }}>{shoe.contact_info}</p>
                            <a href={generateWhatsAppLink(shoe.contact_info, shoe.title)} target="_blank" rel="noopener noreferrer" style={whatsappBtn}>
                                OPEN WHATSAPP
                            </a>
                        </div>
                    )}
                </div>
            </div>
            <style>{`body { background-color: #FCFCFC; }`}</style>
        </div>
    );
};

// --- STYLES ---
const pageWrapper = { maxWidth: '1200px', margin: '0 auto', padding: '60px 40px', minHeight: '80vh' };
const centerMsg = { textAlign: 'center', marginTop: '100px', fontFamily: 'Lato', color: '#888', fontWeight: 'bold' };
const backLink = { textDecoration: 'none', color: '#111', fontFamily: 'Lato', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: '900' };
const containerStyle = { display: 'flex', flexWrap: 'wrap', gap: '80px' };
const imageSection = { flex: '1.2', minWidth: '350px' };
const mainImageContainer = { backgroundColor: '#fff', marginBottom: '20px', border: '2px solid #111', boxShadow: '5px 5px 0px rgba(0,0,0,0.1)' };
const mainImgStyle = { width: '100%', height: 'auto', display: 'block', objectFit: 'cover', aspectRatio: '1/1' };
const thumbnailRow = { display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' };
const thumbStyle = { width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', transition: 'all 0.2s' };
const detailsSection = { flex: '1', minWidth: '300px', paddingTop: '10px' };
const brandStyle = { fontFamily: 'Lato', fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#666', margin: '0 0 10px 0', fontWeight: '900' };
const titleStyle = { fontFamily: '"Playfair Display", serif', fontSize: '3.5rem', lineHeight: '1', margin: '0 0 20px 0', color: '#111', fontStyle: 'italic' };
const priceStyle = { fontFamily: 'Lato', fontSize: '1.8rem', fontWeight: '300', color: '#111', margin: '0 0 30px 0' };
const divider = { height: '2px', backgroundColor: '#eee', margin: '40px 0' };
const specGrid = { display: 'flex', gap: '60px' };
const specItem = { display: 'flex', flexDirection: 'column' };
const labelStyle = { fontFamily: 'Lato', fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '900', color: '#111', marginBottom: '5px', textTransform: 'uppercase' };
const valueStyle = { fontFamily: 'Lato', fontSize: '1.1rem', fontWeight: '400', color: '#444' };
const descStyle = { fontFamily: 'Lato', fontSize: '1rem', lineHeight: '1.6', color: '#555', margin: 0 };
const sellerContainer = { marginBottom: '40px' };
const sellerLink = { textDecoration: 'none', fontFamily: 'Lato', fontSize: '1.1rem', fontWeight: '900', color: '#111', borderBottom: '2px solid #111' };
const ratingBadge = { marginLeft: '10px', backgroundColor: '#111', color: '#fff', fontSize: '0.75rem', padding: '4px 8px', fontFamily: 'Lato', fontWeight: 'bold' };
const contactBtn = { width: '100%', padding: '20px', backgroundColor: '#111', color: '#fff', border: '2px solid #111', fontFamily: 'Lato', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' };

// Dark Box for Contact Reveal
const contactBox = { width: '100%', padding: '30px', border: '2px solid #fff', textAlign: 'center', backgroundColor: '#1a1a1a', color: '#fff', boxShadow: '8px 8px 0px rgba(0,0,0,0.2)' };
const whatsappBtn = { display: 'block', width: '100%', padding: '15px', backgroundColor: '#25D366', color: '#fff', textDecoration: 'none', fontFamily: 'Lato', fontWeight: '900', boxSizing: 'border-box', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', border: '1px solid #25D366' };

export default ShoeDetail;