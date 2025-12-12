import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { FaStar } from 'react-icons/fa'; // Install this if needed, or use text stars

const SellerProfile = () => {
    const { username } = useParams();
    const { user } = useContext(AuthContext); // Logged in user
    
    const [profile, setProfile] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch Profile Data
        api.get(`/api/profiles/${username}/`)
            .then(res => setProfile(res.data))
            .catch(err => console.error("Error fetching profile", err));
    }, [username]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/reviews/', {
                seller: profile.user_id, // This is why we updated the serializer
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            setMessage('Review submitted successfully!');
            // Refresh profile to see new rating
            const res = await api.get(`/api/profiles/${username}/`);
            setProfile(res.data);
        } catch (error) {
            // Handle "You already reviewed this seller" error
            if (error.response && error.response.data.non_field_errors) {
                setMessage(error.response.data.non_field_errors[0]);
            } else {
                setMessage('Failed to submit review.');
            }
        }
    };

    if (!profile) return <div>Loading Profile...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            
            {/* Header Section */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <img 
                    src={profile.avatar} 
                    alt={profile.username} 
                    style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '20px' }}
                />
                <div>
                    <h1>{profile.username}</h1>
                    <div style={{ fontSize: '1.2rem', color: '#ffc107' }}>
                        ★ {profile.seller_rating} <span style={{ color: '#666', fontSize: '0.9rem' }}>({profile.review_count} reviews)</span>
                    </div>
                </div>
            </div>

            <hr />

            {/* Review Form Section */}
            <h3>Leave a Review</h3>
            {message && <p style={{ padding: '10px', background: '#e0f7fa', color: '#006064' }}>{message}</p>}

            {user && user.username !== profile.username ? (
                <form onSubmit={handleSubmitReview} style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Rating: </label>
                        <select 
                            value={reviewForm.rating} 
                            onChange={e => setReviewForm({...reviewForm, rating: e.target.value})}
                            style={{ padding: '5px' }}
                        >
                            <option value="5">5 Stars - Excellent</option>
                            <option value="4">4 Stars - Good</option>
                            <option value="3">3 Stars - Average</option>
                            <option value="2">2 Stars - Poor</option>
                            <option value="1">1 Star - Terrible</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <textarea 
                            placeholder="Write about your experience..." 
                            value={reviewForm.comment}
                            onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                            style={{ width: '100%', height: '80px', padding: '10px' }}
                            required
                        />
                    </div>

                    <button type="submit" style={{ padding: '10px 20px', background: '#ffc107', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        Submit Review
                    </button>
                </form>
            ) : (
                <p style={{ color: '#888', fontStyle: 'italic' }}>
                    {user ? "You cannot review yourself." : "Please login to leave a review."}
                </p>
            )}
        </div>
    );
};

export default SellerProfile;