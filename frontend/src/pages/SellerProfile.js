import React, { useEffect, useState, useContext, useCallback } from 'react'; 
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const SellerProfile = () => {
    const { username } = useParams();
    const { user } = useContext(AuthContext); 
    const location = useLocation();
    
    const [profile, setProfile] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const successMsg = location.state?.successMessage;

    const fetchProfile = useCallback(() => {
        api.get(`/api/profiles/${username}/`)
            .then(res => { 
                setProfile(res.data); 
                setLoading(false); 
            })
            .catch(err => {
                console.error("Error fetching profile", err);
                setLoading(false);
            });
    }, [username]); 

    useEffect(() => { 
        fetchProfile(); 
    }, [fetchProfile]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/reviews/', { 
                seller: profile.user_id, 
                rating: reviewForm.rating, 
                comment: reviewForm.comment 
            });
            setMessage('Review submitted successfully!');
            setReviewForm({ rating: 5, comment: '' }); 
            fetchProfile(); 
        } catch (error) {
            setMessage('Failed to submit review.');
        }
    };

    if (loading) return (
        <div style={{...containerStyle, display:'flex', justifyContent:'center', alignItems:'center', height:'80vh'}}>
            <p style={{fontFamily: 'Lato', fontWeight:'bold', fontSize:'1.2rem', color:'#111'}}>ACCESSING PROFILE...</p>
        </div>
    );
    
    if (!profile) return (
        <div style={{...containerStyle, display:'flex', justifyContent:'center', alignItems:'center', height:'80vh'}}>
             <h3 style={{fontFamily: '"Bebas Neue", sans-serif', fontSize:'3rem'}}>USER NOT FOUND.</h3>
        </div>
    );

    return (
        <div style={containerStyle}>
            {successMsg && <div style={successStyle}>{successMsg}</div>}

            {/* --- PROFILE HEADER CARD --- */}
            <div style={streetwearBox}>
                <div style={headerSection}>
                    <div style={{ position: 'relative' }}>
                        <img src={profile.avatar} alt={profile.username} style={avatarStyle} />
                        <div style={ringStyle}></div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={usernameStyle}>{profile.username}</h1>
                        <p style={locationStyle}>{profile.location || "LOCATION HIDDEN"}</p>
                        <div style={ratingBadge}>
                            <span style={{ fontSize: '1.5rem', marginRight: '5px' }}>★</span> {profile.seller_rating} 
                            <span style={reviewCountStyle}> / {profile.review_count} REVIEWS</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ height: '40px' }}></div>

            {/* --- REVIEW FORM SECTION --- */}
            <div style={streetwearBox}>
                <h3 style={sectionTitle}>LEAVE FEEDBACK</h3>
                
                {message && <div style={msgStyle}>{message}</div>}

                {user && user.username !== profile.username ? (
                    <form onSubmit={handleSubmitReview}>
                        <div style={groupStyle}>
                            <label style={labelStyle}>RATING:</label>
                            <div style={selectWrapper}>
                                <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: e.target.value})} style={selectStyle}>
                                    <option value="5">★★★★★ (EXCELLENT)</option>
                                    <option value="4">★★★★☆ (GOOD)</option>
                                    <option value="3">★★★☆☆ (AVERAGE)</option>
                                    <option value="2">★★☆☆☆ (POOR)</option>
                                    <option value="1">★☆☆☆☆ (TERRIBLE)</option>
                                </select>
                            </div>
                        </div>

                        <div style={groupStyle}>
                            <label style={labelStyle}>COMMENT:</label>
                            <textarea placeholder="HOW WAS THE DEAL?" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} style={textareaStyle} rows="3" required />
                        </div>

                        <button type="submit" style={buttonStyle}>POST REVIEW</button>
                    </form>
                ) : (
                    <div style={disabledBox}>
                        {user ? "YOU CANNOT REVIEW YOURSELF." : <><Link to="/login" style={{color:'#111', fontWeight:'900', textDecoration:'underline'}}>LOGIN</Link> TO LEAVE A REVIEW.</>}
                    </div>
                )}
            </div>

            <div style={{ margin: '60px 0', borderBottom: '2px solid #111', opacity: 0.1 }}></div>

            {/* --- PAST REVIEWS --- */}
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={{...sectionTitle, textAlign: 'left', marginBottom:'40px', fontSize:'1.5rem'}}>RECENT HISTORY</h3>
                {profile.reviews_list && profile.reviews_list.length > 0 ? (
                    <div>
                        {profile.reviews_list.map((rev, index) => (
                            <div key={index} style={reviewItem}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={reviewerName}>{rev.reviewer_username}</span>
                                    <span style={starsStyle}>{'★'.repeat(rev.rating)}</span>
                                </div>
                                <p style={commentStyle}>"{rev.comment}"</p>
                                <small style={dateStyle}>{new Date(rev.created_at).toLocaleDateString()}</small>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#555', fontFamily: 'Lato', fontSize:'1.1rem', fontWeight:'bold', textAlign:'center', padding:'40px' }}>NO REVIEWS YET.</p>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
                body { background-color: #b1b1b1ff; font-family: 'Lato', sans-serif; }
                
                /* INPUT FOCUS */
                textarea:focus, select:focus { 
                    border-bottom: 2px solid #111 !important; 
                    background-color: rgba(255,255,255,0.3);
                }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const containerStyle = { maxWidth: '800px', margin: '0 auto', padding: '60px 20px' };
const successStyle = { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '15px', marginBottom: '40px', border: '1px solid #c8e6c9', textAlign: 'center', fontFamily: 'Lato', fontWeight:'bold' };

// --- CARDS ---
const streetwearBox = { 
    backgroundColor: '#fff', // White card for contrast against grey background
    border: '2px solid #111', 
    boxShadow: '8px 8px 0px rgba(0,0,0,0.1)', // Hard Shadow
    padding: '40px', 
    maxWidth: '600px', 
    margin: '0 auto' 
};

// --- HEADER ---
const headerSection = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
const avatarStyle = { width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #fff', position: 'relative', zIndex: 2 };
const ringStyle = { position: 'absolute', top: -5, left: -5, right: -5, bottom: -5, borderRadius: '50%', border: '2px solid #111', zIndex: 1 };

const usernameStyle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '3.5rem', margin: '20px 0 5px 0', color: '#111', lineHeight: 1, letterSpacing: '1px' };
const locationStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.9rem', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900' };

const ratingBadge = { fontFamily: '"Lato", sans-serif', fontWeight: '900', fontSize: '1.2rem', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const reviewCountStyle = { opacity: 0.5, fontWeight: '700', fontSize: '0.8rem', marginLeft: '5px' };

// --- TITLES ---
const sectionTitle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.5rem', letterSpacing: '1px', color: '#111', textTransform: 'uppercase', textAlign: 'center', marginBottom: '30px', margin: 0 };

// --- FORM INPUTS ---
const groupStyle = { marginBottom: '25px' };
const labelStyle = { display: 'block', fontSize: '0.9rem', color: '#111', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900', fontFamily: 'Lato' };

const selectWrapper = { position: 'relative', width: '100%' };
const selectStyle = { 
    width: '100%', 
    border: 'none', 
    borderBottom: '1px solid #999', 
    padding: '12px 0', 
    fontSize: '1rem', 
    outline: 'none', 
    fontFamily: '"Lato", sans-serif', 
    backgroundColor: 'transparent', 
    color: '#111', 
    cursor: 'pointer', 
    fontWeight: 'bold',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0 center',
    backgroundSize: '16px',
};

const textareaStyle = { 
    width: '100%', 
    border: 'none', 
    borderBottom: '1px solid #999', 
    padding: '12px 0', 
    fontSize: '1rem', 
    outline: 'none', 
    fontFamily: '"Lato", sans-serif', 
    backgroundColor: 'transparent', 
    resize: 'vertical', 
    color: '#111',
    fontWeight: 'bold'
};

const buttonStyle = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: '2px solid #111', fontSize: '1rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px', textTransform: 'uppercase' };

const msgStyle = { textAlign: 'center', padding: '15px', backgroundColor: '#f5f5f5', marginBottom: '20px', fontFamily: 'Lato', fontSize: '0.9rem', fontWeight:'bold' };
const disabledBox = { textAlign: 'center', padding: '30px', backgroundColor: '#f9f9f9', color: '#666', fontFamily: 'Lato', fontSize: '0.9rem', fontWeight:'bold', letterSpacing:'1px' };

// --- REVIEW LIST ---
const reviewItem = { marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #999' };
const reviewerName = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.4rem', color: '#111', letterSpacing:'1px' };
const starsStyle = { color: '#111', letterSpacing: '2px', fontSize: '0.9rem' };
const commentStyle = { fontFamily: '"Lato", sans-serif', fontSize: '1rem', color: '#333', lineHeight: '1.6', margin: '10px 0', fontWeight:'500' };
const dateStyle = { fontFamily: '"Lato", sans-serif', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', fontWeight:'700' };

export default SellerProfile;