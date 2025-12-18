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
      // Assuming your backend supports filtering by username or returns user's shoes at this endpoint
      // If this doesn't work, we might need to adjust the query based on your Django views
      api.get(`/api/shoes/?seller_username=${user.username}`) 
        .then(res => {
          setShoes(res.data.results || res.data); // Handle pagination or list
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
        // Remove from screen immediately
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

  if (loading) return <div style={styles.loading}>Loading your rotation...</div>;

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <h1 style={styles.title}>My Listings</h1>
        <p style={styles.subtitle}>Manage your active sales.</p>
      </div>

      {shoes.length === 0 ? (
        <div style={styles.emptyState}>
          <h3 style={{fontFamily: 'Playfair Display', fontSize:'1.5rem'}}>You haven't listed anything yet.</h3>
          <Link to="/sell" style={styles.sellBtn}>START SELLING</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {shoes.map((shoe) => (
            <div key={shoe.id} style={styles.card}>
              
              {/* Image Area */}
              <Link to={`/shoes/${shoe.id}`} style={{textDecoration:'none'}}>
                <div style={styles.imageContainer}>
                    <img src={shoe.image} alt={shoe.title} style={styles.image} />
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
                >
                    DELETE LISTING
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: {
    padding: '60px 40px',
    backgroundColor: '#FCFCFC',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  title: {
    fontFamily: 'Playfair Display',
    fontSize: '3rem',
    margin: '0 0 10px 0',
    color: '#111',
  },
  subtitle: {
    fontFamily: 'Lato',
    color: '#888',
    fontSize: '1.1rem',
  },
  loading: {
      textAlign: 'center',
      padding: '100px',
      fontFamily: 'Lato',
      color: '#999'
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
    borderRadius: '4px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  info: {
      textAlign: 'center',
  },
  brand: {
    margin: '0 0 5px',
    color: '#999',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '700',
    fontFamily: 'Lato',
  },
  cardTitle: {
    margin: '0 0 10px',
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.2rem',
    fontWeight: '400',
    color: '#111',
  },
  price: {
    margin: '0 0 15px 0',
    fontFamily: '"Lato", sans-serif',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#333',
  },
  deleteBtn: {
      backgroundColor: 'transparent',
      border: '1px solid #d32f2f',
      color: '#d32f2f',
      padding: '8px 15px',
      fontSize: '0.75rem',
      fontWeight: '700',
      letterSpacing: '1px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '5px',
  },
  emptyState: {
      textAlign: 'center',
      padding: '100px 0',
  },
  sellBtn: {
      display: 'inline-block',
      marginTop: '20px',
      backgroundColor: '#111',
      color: '#fff',
      padding: '15px 30px',
      textDecoration: 'none',
      fontFamily: 'Lato',
      fontWeight: 'bold',
      letterSpacing: '1px',
  }
};

export default MyListings;