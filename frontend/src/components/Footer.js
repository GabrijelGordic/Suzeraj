import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        {/* Brand Section */}
        <div style={{ flex: 1, marginBottom: '20px' }}>
          <h3 style={styles.logo}>ŠUZERAJ</h3>
          <p style={styles.text}>The curated marketplace for rare footwear.</p>
        </div>

        {/* Links Section */}
        <div style={styles.links}>
            <Link to="/legal" style={styles.link}>Privacy Policy</Link>
            <Link to="/legal" style={styles.link}>Terms of Service</Link>
            <Link to="/legal" style={styles.link}>Cookie Policy</Link>
        </div>

        {/* Copyright */}
        <div style={styles.copy}>
            &copy; {new Date().getFullYear()} ŠUZERAJ Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#111',
    color: '#bb5484',
    padding: '60px 20px',
    marginTop: 'auto', // Pushes footer to bottom
    textAlign: 'center'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px'
  },
  logo: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.5rem',
    margin: '0 0 10px 0',
    letterSpacing: '2px'
  },
  text: {
    fontFamily: '"Lato", sans-serif',
    color: '#888',
    fontSize: '0.9rem',
    margin: 0
  },
  links: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: '"Lato", sans-serif',
    opacity: 0.8,
    transition: 'opacity 0.2s'
  },
  copy: {
    borderTop: '1px solid #333',
    width: '100%',
    paddingTop: '20px',
    fontSize: '0.75rem',
    color: '#555',
    marginTop: '20px'
  }
};

export default Footer;