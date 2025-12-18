import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const EditProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '' // Read-only
  });

  // Load current user data
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        username: user.username || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      // Standard Djoser endpoint to update 'me'
      await api.patch('/auth/users/me/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      });
      
      setSuccessMsg('Profile updated successfully.');
      setLoading(false);
      
      // Optional: Refresh page or context after a short delay
      setTimeout(() => {
          setSuccessMsg('');
      }, 3000);

    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <div style={styles.header}>
            <h1 style={styles.title}>Settings</h1>
            <p style={styles.subtitle}>Update your personal details.</p>
        </div>

        {successMsg && <div style={styles.successBanner}>{successMsg}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
            
            {/* USERNAME (Read Only) */}
            <div style={styles.group}>
                <label style={styles.label}>Username</label>
                <input 
                    type="text" 
                    value={formData.username} 
                    disabled 
                    style={{...styles.input, backgroundColor: '#f0f0f0', color: '#888', cursor: 'not-allowed'}} 
                />
                <span style={{fontSize:'0.75rem', color:'#aaa', marginTop:'5px'}}>Username cannot be changed.</span>
            </div>

            {/* FULL NAME ROW */}
            <div style={styles.row}>
                <div style={styles.group}>
                    <label style={styles.label}>First Name</label>
                    <input 
                        type="text" 
                        name="first_name" 
                        value={formData.first_name} 
                        onChange={handleChange} 
                        style={styles.input} 
                    />
                </div>
                <div style={styles.group}>
                    <label style={styles.label}>Last Name</label>
                    <input 
                        type="text" 
                        name="last_name" 
                        value={formData.last_name} 
                        onChange={handleChange} 
                        style={styles.input} 
                    />
                </div>
            </div>

            {/* EMAIL */}
            <div style={styles.group}>
                <label style={styles.label}>Email Address</label>
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    style={styles.input} 
                />
            </div>

            <button type="submit" style={styles.saveBtn} disabled={loading}>
                {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>

            <div style={styles.divider}></div>

            {/* DANGER ZONE */}
            <div style={{textAlign: 'center'}}>
                <button 
                    type="button" 
                    onClick={() => { logout(); navigate('/'); }} 
                    style={styles.logoutBtn}
                >
                    Log Out
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
    container: {
        backgroundColor: '#FCFCFC',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
    },
    card: {
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: '500px',
        padding: '50px',
        borderRadius: '8px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    title: {
        fontFamily: 'Playfair Display',
        fontSize: '2.5rem',
        margin: '0 0 10px 0',
        color: '#111',
    },
    subtitle: {
        fontFamily: 'Lato',
        color: '#888',
        fontSize: '1rem',
        margin: 0,
    },
    successBanner: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '10px',
        borderRadius: '4px',
        textAlign: 'center',
        marginBottom: '20px',
        fontFamily: 'Lato',
        fontSize: '0.9rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    row: {
        display: 'flex',
        gap: '20px',
    },
    group: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    label: {
        fontFamily: 'Lato',
        fontSize: '0.75rem',
        fontWeight: '800',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '8px',
        color: '#333',
    },
    input: {
        padding: '12px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        fontSize: '1rem',
        fontFamily: 'Lato',
        backgroundColor: '#FCFCFC',
        outline: 'none',
        transition: 'border 0.2s',
    },
    saveBtn: {
        backgroundColor: '#111',
        color: '#fff',
        border: 'none',
        padding: '15px',
        fontSize: '0.9rem',
        fontWeight: '700',
        fontFamily: 'Lato',
        letterSpacing: '1px',
        cursor: 'pointer',
        marginTop: '10px',
        borderRadius: '4px',
    },
    divider: {
        height: '1px',
        backgroundColor: '#eee',
        margin: '10px 0',
    },
    logoutBtn: {
        background: 'none',
        border: 'none',
        color: '#d32f2f',
        fontSize: '0.9rem',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontFamily: 'Lato',
    }
};

export default EditProfile;