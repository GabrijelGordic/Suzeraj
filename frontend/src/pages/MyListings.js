import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const MyListings = () => {
  const { user } = useContext(AuthContext);
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NEW: MODAL STATE ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      api.get(`/api/shoes/?seller_username=${user.username}`) 
        .then(res => {
          setShoes(res.data.results || res.data); 
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  // 1. TRIGGER THE MODAL
  const promptDelete = (id) => {
      setItemToDelete(id);
      setShowDeleteModal(true);
  };

  // 2. ACTUALLY DELETE ON CONFIRM
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await api.delete(`/api/shoes/${itemToDelete}/`);
      setShoes(shoes.filter(shoe => shoe.id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      alert("Failed to delete item.");
      console.error(err);
      setShowDeleteModal(false);
    }
  };

  const getCurrencySymbol = (code) => {
    if (code === 'USD') return '$';
    if (code === 'GBP') return '£';
    return '€';
  };

  if (loading) return (
    <div style={{...styles.container, display:'flex', justifyContent:'center', alignItems:'center'}}>
        <p style={{fontFamily: 'Lato', fontWeight:'bold', fontSize:'1.2rem'}}>ACCESSING VAULT...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      
      {/* --- HEADER --- */}
      <div style={styles.header}>
        <h1 style={styles.title}>My Rotation</h1>
        <p style={styles.subtitle}>MANAGE YOUR ACTIVE LISTINGS.</p>
      </div>

      {shoes.length === 0 ? (
        <div style={styles.emptyState}>
          <h3 style={{fontFamily: '"Bebas Neue", sans-serif', fontSize:'2.5rem', marginBottom:'20px'}}>
              YOUR VAULT IS EMPTY.
          </h3>
          <Link to="/sell" style={styles.sellBtn}>START SELLING</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {shoes.map((shoe, index) => (
            <div key={shoe.id} className="product-card" style={{...styles.card, animationDelay: `${index * 0.05}s`}}>
              
              {/* Image Area */}
              <Link to={`/shoes/${shoe.id}`} style={{textDecoration:'none', display:'block'}}>
                <div style={styles.imageContainer}>
                    <img src={shoe.image} alt={shoe.title} style={styles.image} className="product-image" />
                </div>
              </Link>

              {/* Info Area */}
              <div style={styles.info}>
                <p style={styles.brand}>{shoe.brand}</p>
                <h3 style={styles.cardTitle}>{shoe.title}</h3>
                <p style={styles.price}>{getCurrencySymbol(shoe.currency)}{shoe.price}</p>
                
                {/* DELETE BUTTON (Triggers Modal) */}
                <button 
                    onClick={() => promptDelete(shoe.id)} 
                    style={styles.deleteBtn}
                    className="delete-btn-hover"
                >
                    DELETE LISTING
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
            <div style={modalStyles.overlay}>
                <div style={modalStyles.content}>
                    <h2 style={modalStyles.header}>DELETE LISTING?</h2>
                    <p style={modalStyles.text}>This action cannot be undone.</p>
                    <div style={modalStyles.actions}>
                        <button onClick={() => setShowDeleteModal(false)} style={modalStyles.cancelBtn}>CANCEL</button>
                        <button onClick={confirmDelete} style={modalStyles.confirmBtn}>DELETE</button>
                    </div>
                </div>
            </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        body { font-family: 'Lato', sans-serif; }
        
        .product-card { opacity: 0; animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .product-image { transition: transform 0.5s ease; }
        .product-card:hover .product-image { transform: scale(1.05); }

        .delete-btn-hover:hover {
            background-color: #d32f2f !important;
            color: #fff !important;
        }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: {
    padding: '60px 40px',
    backgroundColor: '#ffffffff', 
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  title: {
    fontFamily: '"Bebas Neue", sans-serif',
    fontSize: '4rem',
    margin: '0 0 10px 0',
    color: '#111',
    letterSpacing: '2px',
    lineHeight: '0.9',
  },
  subtitle: {
    fontFamily: 'Lato',
    color: 'rgba(194, 84, 141)', 
    fontSize: '1rem',
    fontWeight: '700',
    letterSpacing: '4px',
    textTransform: 'uppercase',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '50px 40px',
  },
  card: {
    backgroundColor: 'transparent',
    cursor: 'default',
  },
  imageContainer: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    aspectRatio: '1 / 1.1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    border: '1px solid #b75784',
  },
  image: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'contain', 
    padding: '10px',      
    transition: 'transform 0.5s ease' 
  },
  info: {
      textAlign: 'center',
  },
  brand: {
    margin: '0 0 5px',
    color: '#b75784',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '700',
    fontFamily: 'Lato',
  },
  cardTitle: {
    margin: '0 0 10px',
    fontFamily: '"Lato", sans-serif', 
    fontSize: '1.2rem',
    fontWeight: '900',
    color: '#111',
    textTransform: 'uppercase',
  },
  price: {
    margin: '0 0 15px 0',
    fontFamily: '"Lato", sans-serif',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
  },
  deleteBtn: {
      backgroundColor: 'transparent',
      border: '2px solid #b75784',
      color: '#b75784',
      padding: '10px 20px',
      fontSize: '0.8rem',
      fontWeight: '900',
      letterSpacing: '1px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '5px',
      textTransform: 'uppercase',
      fontFamily: 'Lato',
  },
  emptyState: {
      textAlign: 'center',
      padding: '100px 0',
      color: '#333',
  },
  sellBtn: {
      display: 'inline-block',
      marginTop: '20px',
      backgroundColor: '#111',
      color: '#fff',
      padding: '15px 35px',
      textDecoration: 'none',
      fontFamily: 'Lato',
      fontWeight: '900',
      letterSpacing: '2px',
      border: '2px solid #111',
      textTransform: 'uppercase',
  }
};

// --- MODAL STYLES (MATCHING NAVBAR) ---
const modalStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 },
    content: { backgroundColor: '#fff', padding: '40px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '1px solid #111' },
    header: { fontFamily: '"Bebas Neue", sans-serif', fontSize: '2.5rem', margin: '0 0 10px 0', color: '#111', lineHeight: 1 },
    text: { fontFamily: 'Lato, sans-serif', fontSize: '1rem', color: '#555', marginBottom: '30px', fontWeight: 'bold' },
    actions: { display: 'flex', gap: '20px', justifyContent: 'center' },
    cancelBtn: { padding: '12px 25px', backgroundColor: 'transparent', border: '1px solid #ccc', color: '#111', fontFamily: 'Lato, sans-serif', fontWeight: '900', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'uppercase' },
    confirmBtn: { padding: '12px 25px', backgroundColor: '#d32f2f', border: '1px solid #d32f2f', color: '#fff', fontFamily: 'Lato, sans-serif', fontWeight: '900', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'uppercase' }
};

export default MyListings;