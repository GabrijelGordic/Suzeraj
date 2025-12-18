import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Country, City } from 'country-state-city';

// --- FIX: MOVE COUNTRIES LIST OUTSIDE THE COMPONENT ---
// This prevents it from being "re-created" on every render,
// so useEffect doesn't think it's a changing dependency.
const COUNTRIES_LIST = Country.getAllCountries().sort((a, b) => a.name.localeCompare(b.name));

const EditProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: ''
  });

  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [city, setCity] = useState('');

  // Cities still depend on the selected countryCode, so keep this here.
  // We use useMemo so it only recalculates when countryCode changes.
  const cities = useMemo(() => {
      return countryCode 
        ? City.getCitiesOfCountry(countryCode).sort((a, b) => a.name.localeCompare(b.name)) 
        : [];
  }, [countryCode]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        username: user.username || ''
      });

      if (user.location) {
          const parts = user.location.split(',');
          if (parts.length >= 2) {
              const existingCity = parts[0].trim();
              const existingCountry = parts[1].trim();

              // Use the static COUNTRIES_LIST here
              const foundCountry = COUNTRIES_LIST.find(c => c.name === existingCountry);
              if (foundCountry) {
                  setCountryCode(foundCountry.isoCode);
                  setCountryName(foundCountry.name);
                  setCity(existingCity);
              }
          }
      }
    }
  }, [user]); // No need to add COUNTRIES_LIST here because it's outside the component

  // SAFE GUARD HANDLER
  const handleCountryChange = (e) => {
      const code = e.target.value;
      
      if (!code) {
          setCountryCode('');
          setCountryName('');
          setCity('');
          return;
      }
      
      const cData = Country.getCountryByCode(code);
      if (cData) {
        setCountryCode(code);
        setCountryName(cData.name);
        setCity('');
      }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const fullLocation = countryName && city ? `${city}, ${countryName}` : '';

    try {
      await api.patch('/auth/users/me/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        location: fullLocation
      });
      
      setSuccessMsg('Profile updated successfully.');
      setLoading(false);
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={streetwearCard}>
        
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <h1 style={headingStyle}>Settings</h1>
            <p style={subHeadingStyle}>UPDATE YOUR PERSONAL DETAILS.</p>
        </div>

        {successMsg && <div style={successBanner}>{successMsg}</div>}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            
            <div style={groupStyle}>
                <label style={labelStyle}>USERNAME</label>
                <input type="text" value={formData.username} disabled style={{...inputStyle, opacity: 0.5, cursor: 'not-allowed', borderBottom: '1px dashed #999'}} />
                <span style={{fontSize:'0.7rem', color:'#888', marginTop:'5px', display:'block', fontFamily:'Lato'}}>Username cannot be changed.</span>
            </div>

            <div style={rowStyle}>
                <div style={groupStyle}>
                    <label style={labelStyle}>FIRST NAME</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} style={inputStyle} placeholder="ENTER FIRST NAME"/>
                </div>
                <div style={groupStyle}>
                    <label style={labelStyle}>LAST NAME</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} style={inputStyle} placeholder="ENTER LAST NAME"/>
                </div>
            </div>

            <div style={groupStyle}>
                <label style={labelStyle}>EMAIL ADDRESS</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="ENTER EMAIL"/>
            </div>

            {/* LOCATION */}
            <div style={rowStyle}>
                <div style={groupStyle}>
                    <label style={labelStyle}>COUNTRY</label>
                    <div style={selectWrapper}>
                        <select value={countryCode} onChange={handleCountryChange} style={selectStyle}>
                            <option value="">SELECT COUNTRY</option>
                            {COUNTRIES_LIST.map((c) => (
                                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>CITY</label>
                    <div style={selectWrapper}>
                        <select value={city} onChange={(e) => setCity(e.target.value)} style={selectStyle} disabled={!countryCode}>
                            <option value="">{countryCode ? "SELECT CITY" : "CHOOSE COUNTRY FIRST"}</option>
                            {cities.map((c) => (
                                <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <button type="submit" style={saveBtn} disabled={loading}>
                {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>

            <div style={divider}></div>

            <div style={{textAlign: 'center'}}>
                <button type="button" onClick={() => { logout(); navigate('/'); }} style={logoutBtn}>
                    LOG OUT
                </button>
            </div>

        </form>
      </div>
      <style>{`
        body { background-color: #b1b1b1ff; font-family: 'Lato', sans-serif; }
        input:focus, select:focus { border-bottom: 2px solid #111 !important; background-color: rgba(255,255,255,0.3); }
        input::placeholder { color: #555; font-weight: 300; font-size: 0.8rem; }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const pageWrapper = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' };
const streetwearCard = { backgroundColor: '#ddddddff', border: '2px solid #111', boxShadow: '8px 8px 0px rgba(0,0,0,0.15)', padding: '40px', width: '100%', maxWidth: '500px' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: '0 0 5px 0', color: '#111', fontStyle: 'italic' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.9rem', margin: 0, letterSpacing: '2px', fontWeight: '700' };
const successBanner = { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '15px', marginBottom: '20px', border: '1px solid #c8e6c9', textAlign: 'center', fontFamily: 'Lato', fontWeight: 'bold' };
const rowStyle = { display: 'flex', gap: '20px' };
const groupStyle = { display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '25px' };
const labelStyle = { display: 'block', fontSize: '0.9rem', color: '#111', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900', fontFamily: 'Lato' };
const inputStyle = { width: '100%', border: 'none', borderBottom: '1px solid #999', padding: '12px 0', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent', fontWeight: 'bold', color: '#111' };
const selectWrapper = { position: 'relative', width: '100%' };
const selectStyle = { 
    ...inputStyle, 
    cursor: 'pointer', 
    appearance: 'none', 
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: 'right 0 center', 
    backgroundSize: '16px' 
};
const saveBtn = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: '2px solid #111', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px', textTransform: 'uppercase' };
const divider = { height: '1px', backgroundColor: '#999', margin: '30px 0', opacity: 0.5 };
const logoutBtn = { background: 'none', border: 'none', color: '#d32f2f', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Lato', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' };

export default EditProfile;