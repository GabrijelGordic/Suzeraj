import React, { useEffect, useState, useContext, useCallback } from 'react'; // 1. Added useCallback
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

    // 2. Wrapped in useCallback to stabilize the function reference
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
    }, [username]); // Only recreate if username changes

    // 3. Now it's safe to add fetchProfile to dependencies
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

    if (loading) return <div style={centerMsg}>LOADING PROFILE...</div>;
    if (!profile) return <div style={centerMsg}>USER NOT FOUND.</div>;

    return (
        <div style={containerStyle}>
            {successMsg && <div style={successStyle}>{successMsg}</div>}

            {/* --- HEADER --- */}
            <div style={headerSection}>
                <div style={{ position: 'relative' }}>
                    <img src={profile.avatar} alt={profile.username} style={avatarStyle} />
                    <div style={ringStyle}></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={usernameStyle}>{profile.username}</h1>
                    <p style={locationStyle}>{profile.location || "Location Hidden"}</p>
                    <div style={ratingBadge}>
                        <span style={{ fontSize: '1.5rem', marginRight: '5px' }}>★</span> {profile.seller_rating} 
                        <span style={reviewCountStyle}> / {profile.review_count} REVIEWS</span>
                    </div>
                </div>
            </div>

            <div style={divider}></div>

            {/* --- REVIEW FORM (STREETWEAR CARD STYLE) --- */}
            <div style={streetwearBox}>
                <h3 style={sectionTitle}>LEAVE FEEDBACK</h3>
                
                {message && <div style={msgStyle}>{message}</div>}

                {user && user.username !== profile.username ? (
                    <form onSubmit={handleSubmitReview}>
                        <div style={groupStyle}>
                            <label style={labelStyle}>RATING</label>
                            <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: e.target.value})} style={selectStyle}>
                                <option value="5">★★★★★ (Excellent)</option>
                                <option value="4">★★★★☆ (Good)</option>
                                <option value="3">★★★☆☆ (Average)</option>
                                <option value="2">★★☆☆☆ (Poor)</option>
                                <option value="1">★☆☆☆☆ (Terrible)</option>
                            </select>
                        </div>

                        <div style={groupStyle}>
                            <label style={labelStyle}>COMMENT</label>
                            <textarea placeholder="HOW WAS THE EXPERIENCE?" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} style={textareaStyle} rows="3" required />
                        </div>

                        <button type="submit" style={buttonStyle}>POST REVIEW</button>
                    </form>
                ) : (
                    <div style={disabledBox}>
                        {user ? "YOU CANNOT REVIEW YOURSELF." : <><Link to="/login" style={{color:'#000', fontWeight:'bold'}}>LOGIN</Link> TO LEAVE A REVIEW.</>}
                    </div>
                )}
            </div>

            <div style={{ margin: '60px 0', borderBottom: '2px solid #111' }}></div>

            {/* --- PAST REVIEWS --- */}
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={{...sectionTitle, textAlign: 'left'}}>RECENT HISTORY</h3>
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
                    <p style={{ color: '#999', fontStyle: 'italic', fontFamily: 'Lato' }}>No reviews yet.</p>
                )}
            </div>

            <style>{`
                body { background-color: #FCFCFC; font-family: 'Lato', sans-serif; }
                textarea:focus, select:focus { border-bottom: 2px solid #000 !important; }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const containerStyle = { maxWidth: '800px', margin: '60px auto', padding: '0 20px' };
const centerMsg = { textAlign: 'center', marginTop: '100px', fontFamily: 'Lato', color: '#888', fontWeight: 'bold', letterSpacing: '1px' };
const successStyle = { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '15px', marginBottom: '40px', border: '1px solid #c8e6c9', textAlign: 'center', fontFamily: 'Lato' };

const headerSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' };
const avatarStyle = { width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #fff', position: 'relative', zIndex: 2 };
const ringStyle = { position: 'absolute', top: -5, left: -5, right: -5, bottom: -5, borderRadius: '50%', border: '2px solid #111', zIndex: 1 };
const usernameStyle = { fontFamily: '"Playfair Display", serif', fontSize: '3rem', margin: '20px 0 5px 0', color: '#111', lineHeight: 1 };
const locationStyle = { fontFamily: '"Lato", sans-serif', color: '#999', fontSize: '0.8rem', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' };
const ratingBadge = { fontFamily: '"Lato", sans-serif', fontWeight: 'bold', fontSize: '1.2rem', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const reviewCountStyle = { opacity: 0.5, fontWeight: '400', fontSize: '0.9rem', marginLeft: '5px' };

const divider = { borderTop: '2px solid #111', margin: '50px 0', width: '100px', marginLeft: 'auto', marginRight: 'auto' };

const streetwearBox = { backgroundColor: '#fff', border: '2px solid #111', boxShadow: '8px 8px 0px rgba(0,0,0,0.1)', padding: '40px', maxWidth: '600px', margin: '0 auto' };
const sectionTitle = { fontFamily: '"Lato", sans-serif', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', color: '#111', textTransform: 'uppercase', textAlign: 'center', marginBottom: '30px' };
const groupStyle = { marginBottom: '25px' };
const labelStyle = { display: 'block', fontSize: '0.7rem', color: '#111', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900' };
const selectStyle = { width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '1rem', outline: 'none', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent', color: '#333', cursor: 'pointer', fontWeight: 'bold' };
const textareaStyle = { width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '1rem', outline: 'none', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent', resize: 'none', color: '#333' };
const buttonStyle = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: '2px solid #111', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px', textTransform: 'uppercase' };

const msgStyle = { textAlign: 'center', padding: '15px', backgroundColor: '#f9f9f9', marginBottom: '20px', fontFamily: 'Lato', fontSize: '0.9rem' };
const disabledBox = { textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', color: '#888', fontFamily: 'Lato', fontStyle: 'italic', fontSize: '0.9rem' };

const reviewItem = { marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #eee' };
const reviewerName = { fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: '#111', fontWeight: '700' };
const starsStyle = { color: '#111', letterSpacing: '2px', fontSize: '0.8rem' };
const commentStyle = { fontFamily: '"Lato", sans-serif', fontSize: '1rem', color: '#444', lineHeight: '1.6', margin: '10px 0' };
const dateStyle = { fontFamily: '"Lato", sans-serif', fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' };

export default SellerProfile;