import React from 'react';

const Legal = () => {
    return (
        <div style={{ padding: '60px 40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Lato' }}>
            <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', margin: '0 0 40px', color: '#111' }}>Legal Information</h1>
            <p style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Updated: {new Date().toLocaleDateString()}</p>
            <div style={{ borderTop: '2px solid #111', margin: '20px 0 50px' }}></div>
            
            <div style={{ marginBottom: '40px' }}>
                <h3 style={title}>TERMS OF SERVICE</h3>
                <p style={text}>By using Shoe Steraj, you agree to facilitate transactions lawfully. We are a venue for connecting buyers and sellers.</p>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <h3 style={title}>PRIVACY POLICY</h3>
                <p style={text}>We collect standard user data (email, username) to provide marketplace services. We do not sell your data to third parties.</p>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <h3 style={title}>COOKIE POLICY</h3>
                <p style={text}>We use local storage tokens to manage your login session. We do not use tracking cookies for advertising.</p>
            </div>
            
            <style>{`body { background-color: #FCFCFC; }`}</style>
        </div>
    );
};

const title = { fontFamily: 'Lato', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '1rem', marginBottom: '10px' };
const text = { fontFamily: 'Lato', color: '#555', lineHeight: '1.6' };

export default Legal;