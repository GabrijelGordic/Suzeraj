import React, { useContext } from 'react';
// FIX: Unified import
import { Link, useNavigate } from 'react-router-dom'; 
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  return (
    <nav style={styles.nav}>
      
      {/* --- LOGO SECTION --- */}
      <div style={styles.logoContainer}>
        <Link to="/" style={styles.logoLink}>
            <span style={{ fontWeight: '900' }}>ŠUZ</span>
            <span style={{ fontWeight: '400' }}>ERAJ</span>
        </Link>
      </div>

      {/* --- LINKS SECTION --- */}
      <div style={styles.links}>
        <Link to="/" className="nav-item">SHOP</Link>
        
        {user ? (
            <>
                <Link to="/sell" className="nav-item nav-sell">SELL</Link>
                <Link to="/mylistings" className="nav-item">MY KICKS</Link>
                <Link to="/profile/edit" className="nav-item">SETTINGS</Link>
                <button onClick={handleLogout} className="nav-item nav-logout">LOGOUT</button>
            </>
        ) : (
            <>
                <Link to="/login" className="nav-item">LOGIN</Link>
                <Link to="/register" className="nav-item">JOIN</Link>
            </>
        )}
      </div>

      {/* --- CSS FOR HOVER EFFECTS --- */}
      <style>{`
        .nav-item {
            font-family: 'Lato', sans-serif;
            color: #333;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 10px 16px;
            border-radius: 4px;
            transition: all 0.2s ease;
            background-color: transparent;
            border: none;
            cursor: pointer;
        }

        .nav-item:hover {
            background-color: #f0f0f0;
            color: #000;
        }

        .nav-sell {
            border: 1px solid #000;
            margin-right: 5px;
        }
        .nav-sell:hover {
            background-color: #000;
            color: #fff;
        }

        .nav-logout {
            color: #666;
        }
        .nav-logout:hover {
            background-color: #ffebee;
            color: #d32f2f;
        }
      `}</style>
    </nav>
  );
};

// --- STATIC STYLES ---
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 40px',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logoLink: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '2rem',
    color: '#000',
    textDecoration: 'none',
    letterSpacing: '0px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center'
  },
  links: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  }
};

export default Navbar;