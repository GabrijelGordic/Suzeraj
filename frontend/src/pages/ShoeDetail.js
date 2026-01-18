import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const ShoeDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [mainImage, setMainImage] = useState('');
  const [allImages, setAllImages] = useState([]);

  const [isLiked, setIsLiked] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    api.get(`/api/shoes/${id}/`)
      .then(res => {
        setShoe(res.data);
        
        // --- FIX: REMOVE DUPLICATES ---
        const mainImg = res.data.image;
        
        // 1. Get gallery images (if any)
        const galleryImgs = (res.data.images && Array.isArray(res.data.images)) 
            ? res.data.images.map(imgObj => imgObj.image) 
            : [];

        // 2. Create a Set to automatically remove duplicate URLs
        // We put the main image first, then the gallery images
        const uniqueImages = [...new Set([mainImg, ...galleryImgs])];

        setAllImages(uniqueImages);
        setMainImage(mainImg);
        // ------------------------------

        setIsLiked(res.data.is_liked);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleWishlistToggle = async () => {
      if (!user) { navigate('/login'); return; }
      if (wishlistLoading) return;
      const previousState = isLiked;
      setIsLiked(!isLiked);
      setWishlistLoading(true);
      try {
          await api.post(`/api/shoes/${id}/toggle_wishlist/`);
          setWishlistLoading(false);
      } catch (err) {
          console.error(err);
          setIsLiked(previousState);
          setWishlistLoading(false);
      }
  };

  const getCurrencySymbol = (code) => {
    if (code === 'USD') return '$';
    if (code === 'GBP') return '£';
    return '€';
  };

  const getWhatsAppLink = (number) => {
      if (!number) return '#';
      const cleanNumber = number.replace(/[^0-9]/g, ''); 
      return `https://wa.me/${cleanNumber}`;
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'80vh', backgroundColor:'#fff' }}>
        <p style={{fontFamily: 'Lato', fontWeight:'bold', fontSize:'1.2rem'}}>OPENING VAULT...</p>
    </div>
  );

  if (!shoe) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'80vh', backgroundColor:'#fff' }}>
        <h3 style={{fontFamily: '"Bebas Neue", sans-serif', fontSize:'3rem'}}>ITEM NOT FOUND.</h3>
    </div>
  );

  return (
    <div className="page-container">
      
      <div className="grid-container">
        
        {/* --- LEFT: IMAGES --- */}
        <div className="image-section">
            <div className="main-image-container">
                <img src={mainImage} alt={shoe.title} className="main-img" />
                
                {user && user.username !== shoe.seller_username && (
                    <button onClick={handleWishlistToggle} className="heart-btn" title="Add to Wishlist">
                        <svg 
                            width="24" height="24" viewBox="0 0 24 24" 
                            fill={isLiked ? "#d32f2f" : "none"} 
                            stroke={isLiked ? "#d32f2f" : "#111"} 
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                )}
            </div>
            
            {allImages.length > 1 && (
                <div style={thumbnailGrid}>
                    {allImages.map((img, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setMainImage(img)}
                            style={{
                                ...thumbContainer,
                                border: mainImage === img ? '1px solid #111' : '1px solid #eee',
                                opacity: mainImage === img ? 1 : 0.6
                            }}
                        >
                            <img src={img} alt="thumb" style={thumbImgStyle} />
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* --- RIGHT: DETAILS --- */}
        <div className="details-section">
            
            <div style={{ marginBottom: '30px' }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                    <h2 style={brandStyle}>{shoe.brand}</h2>
                    <div style={viewCountStyle}>
                        👁 {shoe.views} <span style={{fontSize:'0.7rem', fontWeight:'400', marginLeft:'5px'}}>VIEWS</span>
                    </div>
                </div>
                
                <h1 style={titleStyle}>{shoe.title}</h1>
                <div style={priceBlock}>
                    {getCurrencySymbol(shoe.currency)}{shoe.price}
                </div>
            </div>

            <div style={divider}></div>

            <div style={infoGrid}>
                <div style={infoItem}>
                    <span style={labelStyle}>SIZE</span>
                    <span style={valueStyle}>EU {shoe.size}</span>
                </div>
                <div style={infoItem}>
                    <span style={labelStyle}>CONDITION</span>
                    <span style={valueStyle}>{shoe.condition}</span>
                </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <span style={labelStyle}>DESCRIPTION</span>
                <p style={descText}>{shoe.description || "No description provided."}</p>
            </div>

            <div style={sellerSection}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div>
                        <span style={labelStyle}>SOLD BY</span>
                        <Link to={`/seller/${shoe.seller_username}`} style={sellerLink}>
                            @{shoe.seller_username}
                        </Link>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={labelStyle}>RATING</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        ★ {shoe.seller_rating > 0 ? shoe.seller_rating : '-'}
                    </div>
                </div>
            </div>

            {user && user.username === shoe.seller_username ? (
                <div style={ownItemBox}>THIS IS YOUR LISTING.</div>
            ) : (
                <>
                    {!showContact ? (
                        <button onClick={() => setShowContact(true)} style={buyBtn}>
                            CONTACT SELLER / BUY
                        </button>
                    ) : (
                        <div style={contactBox}>
                            <h3 style={{ fontFamily: 'Bebas Neue', fontSize:'1.5rem', margin:'0 0 10px 0', color: '#111' }}>SELLER CONTACT</h3>
                            
                            {shoe.seller_phone ? (
                                <>
                                    <div style={{ fontSize:'1.2rem', fontFamily:'Lato', fontWeight:'bold', marginBottom:'15px', color: '#333' }}>
                                        {shoe.seller_phone}
                                    </div>
                                    <a 
                                        href={getWhatsAppLink(shoe.seller_phone)} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        style={whatsappBtn}
                                    >
                                        OPEN WHATSAPP
                                    </a>
                                </>
                            ) : (
                                <p style={{color:'#666', fontStyle:'italic'}}>No phone number provided by seller.</p>
                            )}
                            
                            <button onClick={() => setShowContact(false)} style={closeContactBtn}>Cancel</button>
                        </div>
                    )}
                </>
            )}

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        body { font-family: 'Lato', sans-serif; margin: 0; }
        
        .page-container { background-color: #ffffff; min-height: 100vh; padding: 60px 20px; }
        
        /* DESKTOP LAYOUT (Default) */
        .grid-container { 
            max-width: 1200px; 
            margin: 0 auto; 
            display: flex; 
            flex-wrap: wrap; 
            gap: 60px; 
            align-items: flex-start; 
        }
        
        .image-section { 
            flex: 1.2; 
            min-width: 300px; 
            position: sticky; 
            top: 100px; 
        }

        .details-section { 
            flex: 1; 
            min-width: 300px; 
            padding-top: 20px; 
        }

        .main-image-container { 
            width: 100%; 
            aspect-ratio: 1/1; 
            background-color: #fff; 
            margin-bottom: 20px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            position: relative; 
            border: 1px solid #b75784; 
        }
        
        .main-img { width: 100%; height: 100%; object-fit: contain; padding: 20px; }
        
        /* --- FIXED HEART BUTTON CSS --- */
        .heart-btn {
            position: absolute; 
            top: 20px; 
            right: 20px; 
            
            /* FORCE TRANSPARENCY & REMOVE BORDERS */
            background-color: transparent !important; 
            border: none !important; 
            outline: none !important;
            box-shadow: none !important;
            
            width: 50px; 
            height: 50px; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            
            /* Remove mobile tap highlight */
            -webkit-tap-highlight-color: transparent; 
            
            transition: transform 0.2s;
        }
        
        .heart-btn:active {
            transform: scale(0.9);
            background-color: transparent !important;
        }
        
        .heart-btn:focus {
            outline: none !important;
            background-color: transparent !important;
        }

        /* --- MOBILE OPTIMIZATION (@media) --- */
        @media (max-width: 768px) {
            .page-container { padding: 20px 10px; }
            
            .grid-container { 
                flex-direction: column; 
                gap: 30px; 
            }

            .image-section { 
                width: 100%; 
                position: static; /* Unstick on mobile */
            }

            .details-section { 
                width: 100%; 
                padding-top: 0; 
            }
            
            .main-image-container { border: none; } /* Optional: cleaner look on mobile */
        }
      `}</style>
    </div>
  );
};

// --- STATIC STYLES ---
const thumbnailGrid = { display: 'flex', gap: '15px', overflowX: 'auto' };
const thumbContainer = { width: '80px', height: '80px', cursor: 'pointer', padding: '5px', backgroundColor:'#fff', transition: 'all 0.2s' };
const thumbImgStyle = { width: '100%', height: '100%', objectFit: 'contain' };

const brandStyle = { fontFamily: 'Lato', fontSize: '1rem', color: '#b75784', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 };
const titleStyle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '4rem', margin: '0 0 15px 0', lineHeight: '0.9', color: '#111' };
const priceBlock = { fontSize: '2rem', fontFamily: 'Lato', fontWeight: '900', color: '#111' };
const viewCountStyle = { fontFamily: 'Lato', fontSize: '0.8rem', color: '#999', fontWeight: 'bold', display: 'flex', alignItems: 'center' };
const divider = { height: '1px', backgroundColor: '#eee', margin: '30px 0' };
const infoGrid = { display: 'flex', gap: '60px', marginBottom: '40px' };
const infoItem = { display: 'flex', flexDirection: 'column' };
const labelStyle = { fontSize: '0.75rem', color: '#888', fontWeight: '900', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' };
const valueStyle = { fontSize: '1.2rem', fontFamily: 'Lato', fontWeight: 'bold' };
const descText = { fontFamily: 'Lato', lineHeight: '1.6', color: '#444', fontSize: '1rem' };
const sellerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#fafafa', border: '1px solid #eee', marginBottom: '40px' };
const sellerLink = { display:'block', fontSize: '1.2rem', fontFamily: '"Bebas Neue", sans-serif', textDecoration:'none', color:'#111', letterSpacing:'1px', lineHeight: '1' };
const ownItemBox = { width: '100%', padding: '20px', backgroundColor: '#eee', color: '#555', textAlign: 'center', fontWeight: 'bold', fontFamily: 'Lato', letterSpacing: '1px', fontSize: '0.9rem' };
const buyBtn = { width: '100%', padding: '20px', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', textTransform: 'uppercase', transition: 'background-color 0.2s' };
const contactBox = { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '25px', textAlign: 'center', borderRadius: '4px', animation: 'fadeIn 0.3s ease-out' };
const whatsappBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#25D366', color: '#fff', padding: '15px', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Lato', borderRadius: '4px', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '10px' };
const closeContactBtn = { background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#666', fontSize: '0.8rem', fontWeight: 'bold' };

export default ShoeDetail;