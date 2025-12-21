import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import AuthContext from '../context/AuthContext';
import logo from '../assets/šuzeraj_logo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const dropdownRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setShowDropdown(false);
    setShowLogoutModal(false);
    setMobileMenuOpen(false); 
  }, [location, user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerLogout = () => {
      setShowDropdown(false);
      setMobileMenuOpen(false);
      setShowLogoutModal(true);
  };

  const confirmLogout = () => {
      logout();
      setShowLogoutModal(false);
      navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(`/?search=${searchTerm}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const getAvatarContent = () => {
      if (!user) return null;
      const isDefault = user.avatar && user.avatar.includes('default.jpg');
      
      if (user.avatar && !isDefault) {
          return <img src={user.avatar} alt="profile" className="avatar-img" />;
      }

      return (
          <div className="avatar-placeholder">
              {user.username.charAt(0).toUpperCase()}
          </div>
      );
  };

  return (
    <>
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            
            <div className="nav-content">
                <Link to="/" className="logo-link">
                    <img src={logo} alt="ShoeSteraj Logo" className="logo-img" />
                </Link>

                <form onSubmit={handleSearch} className="search-form desktop-only">
                    <div className="input-wrapper">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b75784" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '15px'}}>
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search for kicks..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </form>

                <div className="desktop-links desktop-only">
                    <Link to="/" className="nav-item">SHOP</Link>
                    
                    {user ? (
                        <>
                            <Link to="/sell" className="nav-item nav-sell">sell on ŠUZERAJ</Link>
                            
                            <div style={{ position: 'relative' }} ref={dropdownRef}>
                                <button onClick={() => setShowDropdown(!showDropdown)} className="user-icon-btn">
                                    {getAvatarContent()}
                                </button>

                                {showDropdown && (
                                    <div className="dropdown-menu">
                                        <div className="user-info">
                                            <span style={{fontSize:'0.8rem', color:'#ffffffff'}}>Signed in as</span><br/>
                                            <strong style={{color:'#b75784'}}>{user.username}</strong>
                                        </div>
                                        <Link to="/mylistings" className="menu-item" onClick={() => setShowDropdown(false)}>My Kicks</Link>
                                        <Link to={`/seller/${user.username}`} className="menu-item" onClick={() => setShowDropdown(false)}>Public Profile</Link>
                                        <Link to="/edit-profile" className="menu-item" onClick={() => setShowDropdown(false)}>Settings</Link>
                                        <Link to="/wishlist" className="menu-item" onClick={() => setShowDropdown(false)}>My Wishlist</Link>
                                        <div className="divider"></div>
                                        <button onClick={triggerLogout} className="menu-item logout-btn">Log Out</button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-item">LOGIN</Link>
                            <Link to="/register" className="nav-item">JOIN</Link>
                        </>
                    )}
                </div>

                <button 
                    className="mobile-menu-btn" 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    )}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="mobile-menu-overlay">
                    
                    <form onSubmit={handleSearch} className="search-form mobile-search">
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" style={{background:'none', border:'none', paddingRight:'15px'}}>🔍</button>
                        </div>
                    </form>

                    <Link to="/" className="mobile-link">SHOP ALL</Link>

                    {user ? (
                        <>
                            <Link to="/sell" className="mobile-link highlight">SELL YOUR KICKS</Link>
                            <div className="mobile-divider"></div>
                            <span className="mobile-label">ACCOUNT ({user.username})</span>
                            <Link to="/mylistings" className="mobile-link small">My Listings</Link>
                            <Link to={`/seller/${user.username}`} className="mobile-link small">Public Profile</Link>
                            <Link to="/edit-profile" className="mobile-link small">Settings</Link>
                            <Link to="/wishlist" className="mobile-link small">Wishlist</Link>
                            <button onClick={triggerLogout} className="mobile-link logout">Log Out</button>
                        </>
                    ) : (
                        <>
                            <div className="mobile-divider"></div>
                            <Link to="/login" className="mobile-link">LOGIN</Link>
                            <Link to="/register" className="mobile-link highlight">REGISTER</Link>
                        </>
                    )}
                </div>
            )}

        </nav>

        {showLogoutModal && (
            <div style={modalStyles.overlay}>
                <div style={modalStyles.content}>
                    <h2 style={modalStyles.header}>LEAVING SO SOON?</h2>
                    <p style={modalStyles.text}>Are you sure you want to log out?</p>
                    <div style={modalStyles.actions}>
                        <button onClick={() => setShowLogoutModal(false)} style={modalStyles.cancelBtn}>CANCEL</button>
                        <button onClick={confirmLogout} style={modalStyles.confirmBtn}>LOG OUT</button>
                    </div>
                </div>
            </div>
        )}

        <style>{`
            .navbar {
                position: sticky; top: 0; z-index: 2000;
                background-color: rgba(22, 21, 21, 1);
                height: 110px;
                transition: all 0.4s ease;
                width: 100%;
            }
            .navbar.scrolled {
                background-color: rgba(22, 21, 21, 0.85);
                backdrop-filter: blur(12px);
                height: 90px;
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            }
            .nav-content {
                max-width: 1400px; margin: 0 auto;
                padding: 0 40px; height: 100%;
                display: flex; justify-content: space-between; align-items: center;
            }

            .logo-img { height: 90px; object-fit: contain; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
            .logo-img:hover { transform: scale(1.08) rotate(-3deg); }

            .search-form { flex: 1; max-width: 500px; margin: 0 40px; }
            .input-wrapper { display: flex; align-items: center; background-color: #f5f5f5; border-radius: 30px; padding: 5px; }
            .search-input { flex: 1; padding: 12px; fontSize: 1rem; border: none; background: transparent; outline: none; font-family: 'Lato'; }

            .desktop-links { display: flex; align-items: center; gap: 15px; }
            .nav-item { font-family: 'Lato', sans-serif; color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 10px 15px; transition: color 0.2s ease; cursor: pointer; }
            .nav-item:hover { color: #b75784; }
            .nav-sell { border: 1px solid #b75784; padding: 8px 20px; border-radius: 4px; }
            .nav-sell:hover { background-color: #b75784; color: #fff; }

            .user-icon-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; }
            .avatar-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #b75784; }
            .avatar-placeholder { width: 40px; height: 40px; border-radius: 50%; background: #b75784; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; border: 2px solid #fff; font-family: Lato; }
            
            .dropdown-menu { 
                position: absolute; top: 120%; right: 0; width: 200px; 
                background-color: rgb(22, 21, 21); border: 1px solid #000; border-radius: 8px; 
                box-shadow: 0 5px 15px rgba(0,0,0,0.1); padding: 10px 0; z-index: 2001; 
            }
            .user-info { padding: 10px 15px; border-bottom: 1px solid #b75784; font-family: 'Lato'; margin-bottom: 5px; }
            .menu-item { display: block; padding: 10px 15px; font-family: 'Lato'; font-size: 0.9rem; color: white; text-decoration: none; cursor: pointer; border: none; background: none; width: 100%; text-align: left; }
            .menu-item:hover { background-color: #333; }
            .divider { height: 1px; background-color: #b75784; margin: 5px 0; }
            .logout-btn { color: #d32f2f; }

            .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; }
            .mobile-menu-overlay { display: none; }

            @media (max-width: 900px) {
                .nav-content { padding: 0 20px; }
                .desktop-only { display: none !important; }
                .mobile-menu-btn { display: block; }
                
                .mobile-menu-overlay {
                    display: flex; flex-direction: column;
                    position: fixed; 
                    top: 90px; left: 0; right: 0; bottom: 0;
                    background-color: #111; 
                    padding: 30px;
                    z-index: 2002;
                    overflow-y: auto;
                    animation: slideDown 0.3s ease-out;
                    height: calc(100vh - 90px);
                }
                
                .mobile-search { 
                    width: 100%; 
                    max-width: none; 
                    margin: 0 0 30px 0; 
                    flex: 0; 
                }
                
                .mobile-link { 
                    font-family: 'Bebas Neue', sans-serif; 
                    font-size: 2rem; 
                    color: #fff; 
                    text-decoration: none; 
                    margin-bottom: 20px; 
                    display: block; 
                }
                .mobile-link.small { 
                    font-family: 'Lato'; 
                    font-size: 1.2rem; 
                    font-weight: bold; 
                    margin-bottom: 15px; 
                    color: #ccc; 
                }
                .mobile-link.highlight { color: #b75784; }
                
                .mobile-link.logout { 
                    font-family: 'Lato'; 
                    font-size: 1.2rem; 
                    font-weight: bold; 
                    margin-bottom: 15px; 
                    color: #d32f2f; /* Keep red but use matching font style */
                    background: none; 
                    border: none; 
                    text-align: left; 
                    padding: 0; 
                    cursor: pointer; 
                    margin-top: 0; 
                }
                
                .mobile-divider { height: 1px; background-color: #333; margin: 20px 0; width: 100%; }
                .mobile-label { font-family: 'Lato'; font-size: 0.8rem; color: #666; font-weight: 900; margin-bottom: 15px; display: block; letter-spacing: 1px; }

                @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
            }
        `}</style>
    </>
  );
};

const modalStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 },
    content: { backgroundColor: '#fff', padding: '40px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '1px solid #111' },
    header: { fontFamily: '"Bebas Neue", sans-serif', fontSize: '2.5rem', margin: '0 0 10px 0', color: '#111', lineHeight: 1 },
    text: { fontFamily: 'Lato, sans-serif', fontSize: '1rem', color: '#555', marginBottom: '30px', fontWeight: 'bold' },
    actions: { display: 'flex', gap: '20px', justifyContent: 'center' },
    cancelBtn: { padding: '12px 25px', backgroundColor: 'transparent', border: '1px solid #ccc', color: '#111', fontFamily: 'Lato, sans-serif', fontWeight: '900', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'uppercase' },
    confirmBtn: { padding: '12px 25px', backgroundColor: '#111', border: '1px solid #111', color: '#fff', fontFamily: 'Lato, sans-serif', fontWeight: '900', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'uppercase' }
};

export default Navbar;