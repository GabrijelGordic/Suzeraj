import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom'; 

const MyListings = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation(); 
    
    const [shoes, setShoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState(location.state?.successMessage || '');
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    useEffect(() => {
        if (user) {
            api.get(`/api/shoes/?seller__username=${user.username}&page_size=100`).then(res => {
                setShoes(res.data.results ? res.data.results : res.data); setLoading(false);
            }).catch(err => setLoading(false));
        }
    }, [user]);

    useEffect(() => {
        if (location.state?.successMessage) {
            setSuccessMsg(location.state.successMessage);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/shoes/${deleteModal.id}/`);
            setShoes(shoes.filter(shoe => shoe.id !== deleteModal.id));
            setSuccessMsg("Listing deleted successfully.");
        } catch (error) { alert("Failed to delete."); } 
        finally { setDeleteModal({ show: false, id: null }); }
    };

    if (!user) return <div style={centerMsg}>PLEASE LOGIN.</div>;
    if (loading) return <div style={centerMsg}>LOADING VAULT...</div>;

    return (
        <div style={containerStyle}>
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={headingStyle}>My Collection</h1>
                <p style={subHeadingStyle}>MANAGE YOUR ROTATION.</p>
            </div>

            {successMsg && <div style={successStyle}>{successMsg}</div>}

            {shoes.length === 0 ? (
                <div style={emptyStateBox}>
                    <p style={{ fontFamily: 'Lato', color: '#666', marginBottom: '20px', fontWeight: 'bold' }}>THE VAULT IS EMPTY.</p>
                    <Link to="/sell" style={startSellingBtn}>START SELLING</Link>
                </div>
            ) : (
                <div style={{ borderTop: '2px solid #111' }}>
                    {shoes.map(shoe => (
                        <div key={shoe.id} className="listing-row">
                            <img src={shoe.image} alt={shoe.title} className="listing-image" />
                            <div style={{ flex: 1, padding: '0 25px' }}>
                                <h3 style={titleStyle}>{shoe.title}</h3>
                                <p style={metaStyle}>{shoe.brand} | EU {shoe.size}</p>
                                <p style={priceStyle}>{shoe.currency === 'USD' ? '$' : shoe.currency === 'GBP' ? '£' : '€'}{shoe.price}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Link to={`/shoes/${shoe.id}`} className="action-btn view-btn">VIEW</Link>
                                <button onClick={() => setDeleteModal({ show: true, id: shoe.id })} className="action-btn delete-btn">DELETE</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- CUSTOM MODAL (Streetwear Dark Style) --- */}
            {deleteModal.show && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <h2 style={modalHeading}>CONFIRM REMOVAL</h2>
                        <p style={modalText}>Are you sure you want to delete this listing?<br/>This action cannot be undone.</p>
                        <div style={modalActions}>
                            <button onClick={() => setDeleteModal({show:false, id:null})} style={modalCancelBtn}>CANCEL</button>
                            <button onClick={confirmDelete} style={modalConfirmBtn}>DELETE</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                body { background-color: #FCFCFC; }
                .listing-row { display: flex; align-items: center; padding: 25px 0; border-bottom: 1px solid #eee; }
                .listing-image { width: 100px; height: 100px; object-fit: cover; border: 1px solid #eee; }
                .action-btn { font-family: 'Lato', sans-serif; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; text-decoration: none; cursor: pointer; border: none; padding: 10px 20px; text-transform: uppercase; transition: all 0.2s; }
                .view-btn { background: #fff; border: 2px solid #111; color: #111; }
                .view-btn:hover { background: #111; color: #fff; }
                .delete-btn { background: transparent; color: #999; }
                .delete-btn:hover { color: #d32f2f; text-decoration: underline; }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const containerStyle = { maxWidth: '900px', margin: '60px auto', padding: '0 20px' };
const centerMsg = { textAlign: 'center', marginTop: '100px', fontFamily: 'Lato', color: '#888', fontWeight: '900', letterSpacing: '2px' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: '0 0 10px 0', color: '#111', fontStyle: 'italic' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.8rem', margin: 0, letterSpacing: '2px', fontWeight: '700' };
const successStyle = { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '15px', marginBottom: '30px', border: '1px solid #c8e6c9', textAlign: 'center', fontFamily: 'Lato' };
const emptyStateBox = { textAlign: 'center', padding: '80px', backgroundColor: '#fff', border: '2px dashed #eee' };
const titleStyle = { fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', margin: '0 0 5px 0', color: '#111' };
const metaStyle = { fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', color: '#999', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' };
const priceStyle = { fontFamily: '"Lato", sans-serif', fontSize: '1.1rem', color: '#111', margin: 0, fontWeight: '900' };
const startSellingBtn = { display: 'inline-block', backgroundColor: '#111', color: '#fff', padding: '15px 30px', textDecoration: 'none', fontFamily: 'Lato', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '2px' };

// --- MODAL (DARK BOX) ---
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' };
const modalBoxStyle = { backgroundColor: '#1a1a1a', padding: '40px', width: '90%', maxWidth: '400px', textAlign: 'center', border: '2px solid #fff', boxShadow: '10px 10px 0px rgba(0,0,0,0.2)', color: '#fff' };
const modalHeading = { fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', margin: '0 0 15px 0', color: '#fff', fontStyle: 'italic' };
const modalText = { fontFamily: '"Lato", sans-serif', fontSize: '0.9rem', color: '#ccc', margin: '0 0 30px 0', lineHeight: '1.6' };
const modalActions = { display: 'flex', justifyContent: 'center', gap: '15px' };
const modalCancelBtn = { padding: '12px 25px', backgroundColor: 'transparent', border: '1px solid #666', color: '#ccc', fontFamily: '"Lato", sans-serif', fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '1px' };
const modalConfirmBtn = { padding: '12px 25px', backgroundColor: '#fff', border: '1px solid #fff', color: '#000', fontFamily: '"Lato", sans-serif', fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '1px' };

export default MyListings;