import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const MyListings = () => {
  const { user } = useContext(AuthContext);
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only the logged-in user's shoes
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await api.delete(`/api/shoes/${id}/`);
        setShoes(shoes.filter(shoe => shoe.id !== id));
      } catch (err) {
        alert("Failed to delete item.");
        console.error(err);
      }
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
                
                {/* DELETE BUTTON */}
                <button 
                    onClick={() => handleDelete(shoe.id)} 
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        body { font-family: 'Lato', sans-serif; }
        
        /* CARD ANIMATIONS */
        .product-card { opacity: 0; animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        /* IMAGE ZOOM ON HOVER */
        .product-image { transition: transform 0.5s ease; }
        .product-card:hover .product-image { transform: scale(1.05); }

        /* DELETE BUTTON HOVER */
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
    backgroundColor: '#b1b1b1ff', // Matching Home/Login/Register
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
    color: 'rgba(194, 84, 141)', // Matching Home/Login accents
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
    // Removed border-radius to match the sharp "industrial" look
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
      textAlign: 'center',
  },
  brand: {
    margin: '0 0 5px',
    color: '#555',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '700',
    fontFamily: 'Lato',
  },
  cardTitle: {
    margin: '0 0 10px',
    fontFamily: '"Lato", sans-serif', // Changed from Playfair to match Home cards
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
      border: '2px solid #d32f2f',
      color: '#d32f2f',
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

export default MyListings;