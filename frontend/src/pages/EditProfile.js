import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Country, City } from 'country-state-city';

// Prevent re-creation of country list on re-renders
const COUNTRIES_LIST = Country.getAllCountries().sort((a, b) => a.name.localeCompare(b.name));
// Sort phone codes numerically
const PHONE_CODES = [...COUNTRIES_LIST].sort((a, b) => parseInt(a.phonecode) - parseInt(b.phonecode));

const EditProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false); // New state to track if we fetched data
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    bio: '' 
  });

  // Location & Phone State
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [city, setCity] = useState('');
  const [dialCode, setDialCode] = useState(''); 
  const [phoneDigits, setPhoneDigits] = useState('');

  // Avatar State
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  // Password State
  const [passLoading, setPassLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
      current_password: '',
      new_password: '',
      re_new_password: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Memoize Cities to prevent lag
  const cities = useMemo(() => {
      return countryCode 
        ? City.getCitiesOfCountry(countryCode).sort((a, b) => a.name.localeCompare(b.name)) 
        : [];
  }, [countryCode]);

  useEffect(() => {
    // Only fetch if we have a user (logged in)
    if (user) {
        // CHANGED: Fetch from /auth/users/me/ because your UserSerializer 
        // contains ALL the fields (first_name, last_name, location, phone, bio).
        api.get('/auth/users/me/')
            .then(res => {
                const data = res.data;
                
                // 1. Populate Text Fields
                setFormData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    username: data.username || '',
                    bio: data.bio || ''
                });

                // 2. Populate Avatar
                if (data.avatar) {
                    setPreview(data.avatar);
                }

                // 3. Populate Location (Parse "City, Country")
                if (data.location) {
                    const parts = data.location.split(',');
                    if (parts.length >= 2) {
                        const existingCity = parts[0].trim();
                        const existingCountry = parts[1].trim();
                        
                        // Find country object to get ISO Code (needed for city list)
                        const foundCountry = COUNTRIES_LIST.find(c => c.name === existingCountry);
                        
                        if (foundCountry) {
                            setCountryCode(foundCountry.isoCode);
                            setCountryName(foundCountry.name);
                            setCity(existingCity);
                            
                            // Set default dial code if phone is missing
                            if (!data.phone_number) setDialCode(foundCountry.phonecode);
                        }
                    }
                }

                // 4. Populate Phone (Parse "+CodeDigits")
                if (data.phone_number) {
                    const raw = data.phone_number.replace('+', '');
                    // Find which country code this number starts with
                    // We reverse sort by length so we match "1242" before "1" to be accurate
                    const matchedCountry = PHONE_CODES
                        .sort((a,b) => b.phonecode.length - a.phonecode.length)
                        .find(c => raw.startsWith(c.phonecode));
                        
                    if (matchedCountry) {
                        setDialCode(matchedCountry.phonecode);
                        setPhoneDigits(raw.replace(matchedCountry.phonecode, ''));
                    } else {
                        setPhoneDigits(raw);
                    }
                }
                
                setDataLoaded(true);
            })
            .catch(err => {
                console.error("Error fetching profile:", err);
                // Optional: navigate('/login') if 401
            });
    }
  }, [user]);

  const handleCountryChange = (e) => {
      const code = e.target.value;
      if (!code) {
          setCountryCode(''); setCountryName(''); setCity(''); return;
      }
      const cData = Country.getCountryByCode(code);
      if (cData) {
        setCountryCode(code);
        setCountryName(cData.name);
        setCity('');
        if (!phoneDigits) setDialCode(cData.phonecode);
      }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setAvatar(file);
          setPreview(URL.createObjectURL(file));
      }
  };

  const handlePasswordChange = (e) => {
      setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const renderAvatarPreview = () => {
      if (preview) return <img src={preview} alt="preview" style={avatarStyle} />;
      // Safe check for username to prevent crash
      const initial = formData.username ? formData.username.charAt(0).toUpperCase() : '?';
      return <div style={initialsAvatar}>{initial}</div>;
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const fullLocation = countryName && city ? `${city}, ${countryName}` : '';
    const fullPhoneNumber = dialCode && phoneDigits ? `+${dialCode}${phoneDigits}` : '';

    const uploadData = new FormData();
    uploadData.append('first_name', formData.first_name);
    uploadData.append('last_name', formData.last_name);
    // Usually email is read-only in Djoser, but if your setting allows update:
    // uploadData.append('email', formData.email); 
    uploadData.append('bio', formData.bio);
    
    // DRF UserSerializer expects these mapped to 'profile' via mapping, 
    // but your PATCH endpoint likely handles flattened data if using the default Djoser endpoint structure,
    // OR if you are using your custom ViewSet, ensure it accepts these fields.
    // Based on serializers.py, the UserSerializer handles mapping automatically.
    uploadData.append('location', fullLocation);
    uploadData.append('phone_number', fullPhoneNumber);

    if (avatar) {
        uploadData.append('avatar', avatar);
    }

    try {
      await api.patch('/auth/users/me/', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccessMsg('Details saved successfully.');
      setLoading(false);
      // Reload to reflect changes
      setTimeout(() => { window.location.reload(); }, 1000);

    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      setPasswordMsg({ type: '', text: '' });

      if (passwordData.new_password !== passwordData.re_new_password) {
          setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
          return;
      }

      setPassLoading(true);

      try {
          await api.post('/auth/users/set_password/', passwordData);
          setPasswordMsg({ type: 'success', text: 'Password updated successfully.' });
          setPasswordData({ current_password: '', new_password: '', re_new_password: '' });
          setPassLoading(false);
      } catch (err) {
          console.error(err);
          const errorData = err.response?.data;
          let errorText = 'Failed to update password.';
          if (errorData?.current_password) errorText = 'Current password is incorrect.';
          else if (errorData?.new_password) errorText = errorData.new_password[0];
          setPasswordMsg({ type: 'error', text: errorText });
          setPassLoading(false);
      }
  };

  // Loading State
  if (!user || !dataLoaded) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Account Settings...</div>;
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={titleStyle}>ACCOUNT SETTINGS</h1>
            <p style={subtitleStyle}>MANAGE YOUR PERSONAL DETAILS & SECURITY.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', marginBottom: '60px' }}>
            {successMsg && <div style={{...msgBase, backgroundColor: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0'}}>{successMsg}</div>}
            
            <div style={sectionBox}>
                <h3 style={sectionTitle}>IDENTITY</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '20px' }}>
                    {renderAvatarPreview()}
                    <div>
                        <label style={uploadBtn}>
                            CHANGE PHOTO
                            <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                        </label>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: '#999' }}>JPG, PNG. Max 2MB.</p>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>USERNAME</label>
                    <input type="text" value={formData.username} disabled className="custom-input" style={{ backgroundColor: '#f9f9f9', color: '#999', cursor: 'not-allowed' }} />
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>FIRST NAME</label>
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="custom-input" placeholder="First Name" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>LAST NAME</label>
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="custom-input" placeholder="Last Name" />
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>EMAIL ADDRESS</label>
                    <input type="email" name="email" value={formData.email} disabled className="custom-input" style={{ backgroundColor: '#f9f9f9', color: '#999', cursor: 'not-allowed' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>BIO</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="custom-input" placeholder="Tell others about yourself..." />
                </div>
            </div>

            <div style={sectionBox}>
                <h3 style={sectionTitle}>LOCATION & CONTACT</h3>
                
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>COUNTRY</label>
                        <div className="custom-select-wrapper">
                            <select value={countryCode} onChange={handleCountryChange} className="custom-select">
                                <option value="">Select Country</option>
                                {COUNTRIES_LIST.map((c) => (
                                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>CITY</label>
                        <div className="custom-select-wrapper">
                            <select value={city} onChange={(e) => setCity(e.target.value)} className="custom-select" disabled={!countryCode} style={{ opacity: !countryCode ? 0.5 : 1 }}>
                                <option value="">{countryCode ? "Select City" : "..."}</option>
                                {cities.map((c) => (
                                    <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>PHONE NUMBER (WHATSAPP)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ width: '130px', position: 'relative' }}>
                            <select value={dialCode} onChange={(e) => setDialCode(e.target.value)} className="custom-select" style={{ paddingRight: '0' }}>
                                <option value="">Code</option>
                                {PHONE_CODES.map((c) => (
                                    <option key={c.isoCode} value={c.phonecode}>+{c.phonecode} ({c.isoCode})</option>
                                ))}
                            </select>
                        </div>
                        <input type="tel" className="custom-input" placeholder="91 123 4567" value={phoneDigits} onChange={(e) => setPhoneDigits(e.target.value)} style={{ flex: 1 }} />
                    </div>
                </div>
            </div>

            <button type="submit" style={saveBtn} disabled={loading}>{loading ? 'SAVING...' : 'SAVE DETAILS'}</button>
        </form>

        <div style={{ height: '1px', backgroundColor: '#eee', marginBottom: '60px' }}></div>

        <form onSubmit={handlePasswordSubmit} style={{ width: '100%' }}>
            <div style={sectionBox}>
                <h3 style={sectionTitle}>SECURITY</h3>
                {passwordMsg.text && (
                    <div style={{...msgBase, backgroundColor: passwordMsg.type === 'error' ? '#fef2f2' : '#f0fdf4', color: passwordMsg.type === 'error' ? '#991b1b' : '#15803d', borderColor: passwordMsg.type === 'error' ? '#fecaca' : '#bbf7d0'}}>
                        {passwordMsg.text}
                    </div>
                )}
                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>CURRENT PASSWORD</label>
                    <input type="password" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} className="custom-input" placeholder="Required for security" required />
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>NEW PASSWORD</label>
                        <input type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} className="custom-input" placeholder="New Password" required minLength="8" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>CONFIRM NEW</label>
                        <input type="password" name="re_new_password" value={passwordData.re_new_password} onChange={handlePasswordChange} className="custom-input" placeholder="Repeat New Password" required />
                    </div>
                </div>
            </div>
            <button type="submit" style={{...saveBtn, backgroundColor: '#b75784'}} disabled={passLoading}>{passLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}</button>
        </form>

        <div style={{ marginTop: '60px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '30px' }}>
            <p style={{ fontFamily: 'Lato', fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>DONE FOR NOW?</p>
            <button type="button" onClick={() => { logout(); navigate('/'); }} style={logoutBtn}>LOG OUT</button>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        body { font-family: 'Lato', sans-serif; }
        .custom-select-wrapper { position: relative; width: 100%; }
        .custom-select { width: 100%; padding: 12px 15px; appearance: none; -webkit-appearance: none; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 0px; font-family: 'Lato', sans-serif; fontSize: 0.9rem; font-weight: 500; color: #333; cursor: pointer; transition: all 0.2s ease; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 10px center; background-size: 16px; }
        .custom-select:focus, .custom-input:focus { outline: none; border-color: #000; background-color: #fafafa; }
        .custom-input { width: 100%; padding: 12px 15px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 0px; font-family: 'Lato', sans-serif; fontSize: 0.95rem; color: #333; transition: all 0.2s ease; }
        .custom-input::placeholder { color: #aaa; font-weight: 400; }
        textarea.custom-input { font-family: 'Lato', sans-serif; }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const titleStyle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '4rem', margin: '0 0 5px 0', color: '#111', lineHeight: '0.9', letterSpacing: '2px' };
const subtitleStyle = { fontFamily: '"Lato", sans-serif', color: '#b75784', fontSize: '0.9rem', margin: 0, letterSpacing: '2px', fontWeight: '700', textTransform: 'uppercase' };
const sectionBox = { marginBottom: '40px' };
const sectionTitle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.5rem', color: '#111', margin: '0 0 20px 0', letterSpacing: '1px', borderBottom: '2px solid #111', display: 'inline-block', paddingBottom: '5px' };
const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#555', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900', fontFamily: 'Lato', textTransform: 'uppercase' };
const avatarStyle = { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ccc' };
const initialsAvatar = { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#b75784', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', fontFamily: '"Bebas Neue", sans-serif', border: '2px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' };
const uploadBtn = { display: 'inline-block', backgroundColor: '#eee', padding: '8px 15px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #ccc', textTransform: 'uppercase', transition: 'background 0.2s' };
const saveBtn = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', textTransform: 'uppercase', transition: 'background-color 0.2s' };
const logoutBtn = { background: 'none', border: '1px solid #d32f2f', color: '#d32f2f', padding: '10px 20px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Lato', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.2s' };
const msgBase = { marginBottom:'30px', padding: '15px', border: '1px solid', textAlign: 'center', fontFamily: 'Lato', fontWeight:'bold' };

export default EditProfile;