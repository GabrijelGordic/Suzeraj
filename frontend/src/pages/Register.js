import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Country, City } from 'country-state-city';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    re_password: ''
  });

  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [city, setCity] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  // 1. GET AND SORT COUNTRIES (A-Z)
  const countries = Country.getAllCountries().sort((a, b) => a.name.localeCompare(b.name));
  
  // Get cities only if a country is selected
  const cities = countryCode ? City.getCitiesOfCountry(countryCode).sort((a, b) => a.name.localeCompare(b.name)) : [];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. FIXED HANDLER (Prevents Crash)
  const handleCountryChange = (e) => {
      const code = e.target.value;
      
      if (!code) {
          // User selected the placeholder "Select Country"
          setCountryCode('');
          setCountryName('');
          setCity('');
          return;
      }

      const countryData = Country.getCountryByCode(code);
      if (countryData) {
          setCountryCode(code);
          setCountryName(countryData.name);
          setCity(''); 
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.re_password) {
      setError("Passwords do not match");
      return;
    }
    if (!countryName || !city) {
        setError("Please select your location.");
        return;
    }

    setLoading(true);
    setError('');

    const fullLocation = `${city}, ${countryName}`;
    const payload = { ...formData, location: fullLocation };

    try {
      await api.post('/auth/users/', payload);
      navigate('/login', { state: { successMessage: "Account created! Please log in." } });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
          const firstKey = Object.keys(err.response.data)[0];
          const msg = Array.isArray(err.response.data[firstKey]) 
            ? err.response.data[firstKey][0] 
            : err.response.data[firstKey];
          setError(`${firstKey}: ${msg}`);
      } else {
          setError('Registration failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={streetwearCard}>
        
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <h1 style={headingStyle}>Join The Club</h1>
            <p style={subHeadingStyle}>CREATE AN ACCOUNT TO START TRADING.</p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            
            <div style={groupStyle}>
                <label style={labelStyle}>USERNAME:</label>
                <input type="text" name="username" placeholder="CHOOSE A USERNAME" onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={groupStyle}>
                <label style={labelStyle}>EMAIL:</label>
                <input type="email" name="email" placeholder="NAME@EXAMPLE.COM" onChange={handleChange} required style={inputStyle} />
            </div>

            {/* LOCATION DROPDOWNS */}
            <div style={rowStyle}>
                <div style={groupStyle}>
                    <label style={labelStyle}>COUNTRY:</label>
                    <div style={selectWrapper}>
                        <select 
                            value={countryCode} 
                            onChange={handleCountryChange} 
                            required 
                            style={selectStyle}
                        >
                            <option value="">SELECT COUNTRY</option>
                            {countries.map((c) => (
                                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>CITY:</label>
                    <div style={selectWrapper}>
                        <select 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            required 
                            style={selectStyle}
                            disabled={!countryCode} 
                        >
                            <option value="">{countryCode ? "SELECT CITY" : "CHOOSE COUNTRY FIRST"}</option>
                            {cities.length > 0 ? (
                                cities.map((c) => (
                                    <option key={c.name} value={c.name}>{c.name}</option>
                                ))
                            ) : (
                                <option value="Other">Other / Not Listed</option>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            <div style={groupStyle}>
                <label style={labelStyle}>PASSWORD:</label>
                <div style={passwordWrapper}>
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="CREATE PASSWORD" onChange={handleChange} required style={inputStyle} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtn}>
                        {showPassword ? <EyeOpenIcon/> : <EyeClosedIcon/>}
                    </button>
                </div>
            </div>

            <div style={groupStyle}>
                <label style={labelStyle}>CONFIRM PASSWORD:</label>
                <div style={passwordWrapper}>
                    <input type={showRePassword ? "text" : "password"} name="re_password" placeholder="REPEAT PASSWORD" onChange={handleChange} required style={inputStyle} />
                    <button type="button" onClick={() => setShowRePassword(!showRePassword)} style={eyeBtn}>
                         {showRePassword ? <EyeOpenIcon/> : <EyeClosedIcon/>}
                    </button>
                </div>
            </div>

            <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
            </button>

            <div style={{ marginTop: '30px', textAlign: 'center', borderTop:'1px solid #ccc', paddingTop:'20px' }}>
                <p style={footerTextStyle}>
                    ALREADY A MEMBER? <Link to="/login" style={linkStyle}>LOGIN HERE</Link>
                </p>
            </div>

        </form>
      </div>
      <style>{`
        body { background-color: #b1b1b1ff; font-family: 'Lato', sans-serif; }
        input::placeholder { color: #555; font-weight: 300; font-size: 0.8rem; }
        input:focus, select:focus { border-bottom: 2px solid #111 !important; background-color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
};

// ... (ICONS AND STYLES REMAIN THE SAME)
const EyeOpenIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>);
const EyeClosedIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>);
const pageWrapper = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const streetwearCard = { backgroundColor: '#ddddddff', border: '2px solid #111', boxShadow: '8px 8px 0px rgba(0,0,0,0.15)', padding: '40px', width: '100%', maxWidth: '500px' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', margin: '0 0 5px 0', color: '#111', fontStyle: 'italic' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.8rem', margin: 0, letterSpacing: '2px', fontWeight: '700' };
const groupStyle = { marginBottom: '25px', width: '100%' };
const rowStyle = { display: 'flex', gap: '20px', marginBottom: '0' };
const labelStyle = { display: 'block', fontSize: '1.1rem', color: '#111', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900' };
const inputStyle = { width: '100%', border: 'none', borderBottom: '1px solid #999', padding: '12px 0', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent', fontWeight: 'bold', color: '#111' };
const selectWrapper = { position: 'relative', width: '100%' };
const selectStyle = { 
    ...inputStyle, 
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0 center',
    backgroundSize: '16px',
};
const buttonStyle = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: '2px solid #111', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase' };
const errorStyle = { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', fontSize: '0.85rem', marginBottom: '20px', border: '1px solid #ef9a9a', fontWeight: 'bold', textAlign: 'center' };
const footerTextStyle = { color: '#666', fontSize: '0.85rem', margin: 0 };
const linkStyle = { color: '#111', fontWeight: '900', textDecoration: 'underline', marginLeft: '5px', cursor: 'pointer' };
const passwordWrapper = { position: 'relative', display: 'flex', alignItems: 'center' };
const eyeBtn = { position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' };

export default Register;