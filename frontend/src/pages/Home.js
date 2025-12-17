import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import Meta from '../components/Meta';
// MAKE SURE THIS IMAGE EXISTS IN YOUR ASSETS FOLDER
import heroBanner from '../assets/hero-shoes.png'; 

const Home = () => {
  const location = useLocation();

  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- TOGGLE STATE ---
  const [showFilters, setShowFilters] = useState(false); 

  // --- FILTER STATES ---
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  // --- PAGINATION STATES ---
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // --- ACCORDION STATE ---
  const [openSections, setOpenSections] = useState({
    sort: true,
    price: true,
    brand: false,
    size: false,
    condition: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SIZE_OPTIONS = [];
  for (let i = 35; i <= 49.5; i += 0.5) {
      SIZE_OPTIONS.push(i);
  }

  const getCurrencySymbol = (code) => {
      if (code === 'USD') return '$';
      if (code === 'GBP') return '£';
      return '€';
  };

  const fetchShoes = () => {
    setLoading(true);
    let query = `/api/shoes/?page=${page}&page_size=${pageSize}`;
    
    if (search) query += `&search=${search}`;
    if (brand) query += `&brand=${brand}`;
    if (size) query += `&size=${size}`;
    if (condition) query += `&condition=${condition}`;
    if (minPrice) query += `&min_price=${minPrice}`;
    if (maxPrice) query += `&max_price=${maxPrice}`;
    if (currencyFilter) query += `&currency=${currencyFilter}`;
    if (ordering) query += `&ordering=${ordering}`;

    api.get(query)
      .then(res => {
        setShoes(res.data.results);
        setTotalPages(Math.ceil(res.data.count / pageSize));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  // Listen for URL changes from Navbar (Search)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const sizeParam = params.get('page_size');
    if (searchParam !== null) setSearch(searchParam);
    if (sizeParam !== null) setPageSize(Number(sizeParam));
  }, [location.search]);

  // Fetch when filters change
  useEffect(() => {
    setPage(1); 
    fetchShoes();
    // eslint-disable-next-line
  }, [brand, size, condition, ordering, minPrice, maxPrice, currencyFilter, pageSize, search]); 

  // Fetch when page changes
  useEffect(() => {
    fetchShoes();
    // eslint-disable-next-line
  }, [page]);

  const clearFilters = () => {
    setBrand(''); setSize(''); setCondition('');
    setMinPrice(''); setMaxPrice(''); setCurrencyFilter('');
    setOrdering('-created_at'); setSearch('');
  };

  return (
    <div style={{ backgroundColor: '#b1b1b1ff', minHeight: '100vh', paddingBottom: '50px' }}>
      <Meta /> 

      {/* --- HERO BANNER --- */}
      <div style={{ width: '100%', height: '400px', marginBottom: '40px', position: 'relative' }}>
          <img 
            src={heroBanner} 
            alt="Sneaker Collection" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          
          <div style={{
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(252, 247, 247, 0.90)', 
              padding: '30px 60px',
              textAlign: 'center',
              color: 'black',
              borderRadius: '2px', 
              display: 'inline-block',
              whiteSpace: 'nowrap'
          }}>
              <h1 style={{ 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  fontSize: '5rem', 
                  margin: '0 0 10px 0', 
                  lineHeight: '0.9',
                  fontStyle: 'normal', 
                  letterSpacing: '2px'
              }}>
                  BUY. SELL. TRADE. 
              </h1>
              <p style={{ 
                  fontFamily: 'Lato, sans-serif', 
                  fontSize: '1.2rem', 
                  fontWeight: '700', 
                  margin: 0, 
                  letterSpacing: '4px', 
                  textTransform: 'uppercase',
                  color: '#333'
              }}>
                  Built by sneakerheads, for sneakerheads.
              </p>
          </div>
      </div>

      {/* --- CONTENT WRAPPER --- */}
      <div style={{ padding: '0 40px' }}>
          
          {/* --- TOP BAR --- */}
          <div style={topBarStyle}>
                
                {/* 1. Show Filters Button */}
                <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    style={filterToggleBtn}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}>
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    {showFilters ? 'HIDE FILTERS' : 'SHOW FILTERS'}
                </button>

                {/* 2. Right Side: Pagination & Count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    
                    {/* Items Per Page Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Lato', fontSize: '1.1rem', color: '#000000ff' }}>
                        <span style={{ marginRight: '8px' }}>Show:</span>
                        <select 
                            value={pageSize} 
                            onChange={(e) => setPageSize(Number(e.target.value))} 
                            style={{ padding: '5px', border: '1px solid #5d5d5dff', borderRadius: '4px', cursor: 'pointer',fontSize: '1.1rem' }}
                        >
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="48">48</option>
                        </select>
                    </div>

                    <span style={{ fontFamily: 'Lato', color: '#000000ff', fontSize: '1.1rem' }}>
                        {shoes.length} Results
                    </span>
                </div>
          </div>

          {/* --- MAIN FLEX LAYOUT --- */}
          <div style={flexContainerStyle}>
            
            {/* 1. STICKY SIDEBAR (UPDATED) */}
            <aside style={stickyWrapperStyle}>
                <div 
                    style={{
                        ...animatedSidebarStyle,
                        width: showFilters ? '280px' : '0px', // Made slightly wider
                        opacity: showFilters ? 1 : 0,
                        marginRight: showFilters ? '40px' : '0px',
                    }}
                >
                    <div style={{ width: '100%', paddingRight: '10px' }}> 
                        
                        {/* Header Area */}
                        <div style={{
                            display:'flex', 
                            justifyContent:'space-between', 
                            alignItems:'baseline', 
                            marginBottom: '25px', 
                            borderBottom: '2px solid #000', 
                            paddingBottom: '10px'
                        }}>
                            <h3 style={{ 
                                fontFamily: '"Bebas Neue", sans-serif', 
                                fontSize: '2rem', 
                                margin: 0, 
                                lineHeight: 1,
                                letterSpacing: '1px'
                            }}>
                                FILTERS
                            </h3>
                            <button 
                                onClick={clearFilters} 
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: '#000000ff', 
                                    fontSize: '0.8rem', 
                                    textDecoration: 'underline', 
                                    cursor: 'pointer', 
                                    fontFamily: 'Lato',
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold'
                                }}
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Accordion List - UPDATED WITH CUSTOM CLASSES */}
                        <FilterAccordion title="SORT BY" isOpen={openSections.sort} onToggle={() => toggleSection('sort')}>
                            <div className="custom-select-wrapper">
                                <select className="custom-select" value={ordering} onChange={e => setOrdering(e.target.value)}>
                                    <option value="-created_at">Newest First</option>
                                    <option value="created_at">Oldest First</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="-price">Price: High to Low</option>
                                </select>
                            </div>
                        </FilterAccordion>

                        <FilterAccordion title="PRICE RANGE" isOpen={openSections.price} onToggle={() => toggleSection('price')}>
                            <div style={{display: 'flex', gap: '10px', marginBottom:'10px'}}>
                                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="custom-input" />
                                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="custom-input" />
                            </div>
                            <div className="custom-select-wrapper">
                                <select className="custom-select" value={currencyFilter} onChange={e => setCurrencyFilter(e.target.value)}>
                                    <option value="">Any Currency</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                        </FilterAccordion>

                        <FilterAccordion title="BRAND" isOpen={openSections.brand} onToggle={() => toggleSection('brand')}>
                            <div className="custom-select-wrapper">
                                <select className="custom-select" value={brand} onChange={e => setBrand(e.target.value)}>
                                    <option value="">All Brands</option>
                                    <option value="Nike">Nike</option>
                                    <option value="Adidas">Adidas</option>
                                    <option value="Jordan">Jordan</option>
                                    <option value="Yeezy">Yeezy</option>
                                    <option value="New Balance">New Balance</option>
                                    <option value="Asics">Asics</option>
                                    <option value="Converse">Converse</option>
                                </select>
                            </div>
                        </FilterAccordion>

                        <FilterAccordion title="SIZE (EU)" isOpen={openSections.size} onToggle={() => toggleSection('size')}>
                            <div className="custom-select-wrapper">
                                <select className="custom-select" value={size} onChange={e => setSize(e.target.value)}>
                                    <option value="">Any Size</option>
                                    {SIZE_OPTIONS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </FilterAccordion>

                        <FilterAccordion title="CONDITION" isOpen={openSections.condition} onToggle={() => toggleSection('condition')}>
                            <div className="custom-select-wrapper">
                                <select className="custom-select" value={condition} onChange={e => setCondition(e.target.value)}>
                                    <option value="">Any Condition</option>
                                    <option value="New">New / Deadstock</option>
                                    <option value="Used">Used / Worn</option>
                                </select>
                            </div>
                        </FilterAccordion>
                    </div>
                </div>
            </aside>

            {/* --- RIGHT CONTENT (GRID) --- */}
            <div style={{ flex: 1 }}>
                {loading ? (
                    <p style={{textAlign:'center', padding:'50px'}}>Updating results...</p>
                ) : (
                    <div style={gridStyle}>
                        {shoes.length > 0 ? shoes.map((shoe, index) => (
                            <div key={shoe.id} className="product-card" style={{animationDelay: `${index * 0.05}s`}}>
                                <Link to={`/shoes/${shoe.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={imageContainerStyle}>
                                        <img src={shoe.image} alt={shoe.title} style={imageStyle} className="product-image" />
                                    </div>
                                    <div style={{ padding: '15px 0', textAlign: 'center' }}>
                                        <p style={brandStyle}>{shoe.brand}</p>
                                        <h3 style={titleStyle}>{shoe.title}</h3>
                                        <p style={priceStyle}>
                                            {getCurrencySymbol(shoe.currency)}{shoe.price}
                                        </p>
                                        <p style={sellerStyle}>
                                            Sold by {shoe.seller_username}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        )) : (
                            <div style={{textAlign:'center', padding:'50px', gridColumn: '1/-1'}}>
                                <h3 style={{fontFamily: '"Bebas Neue", sans-serif', fontSize: '2rem'}}>No shoes match your filters.</h3>
                                <button onClick={clearFilters} style={{background:'none', border:'none', textDecoration:'underline', cursor:'pointer', color:'blue'}}>
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '60px 0' }}>
                        <button disabled={page === 1} onClick={() => {setPage(page - 1); window.scrollTo(0,0)}} style={pageBtn}>PREV</button>
                        <span style={{alignSelf:'center', fontFamily:'Lato'}}>Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => {setPage(page + 1); window.scrollTo(0,0)}} style={pageBtn}>NEXT</button>
                    </div>
                )}
            </div>
          </div>
      </div>
      
      <style>{`
        /* IMPORT BEBAS NEUE HERE */
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        body { font-family: 'Lato', sans-serif; }

        /* --- NEW SIDEBAR STYLING --- */
        
        /* Wrapper to hold the custom arrow */
        .custom-select-wrapper {
            position: relative;
            width: 100%;
        }

        /* The actual select element */
        .custom-select {
            width: 100%;
            padding: 12px 15px;
            appearance: none; /* Hides default browser arrow */
            -webkit-appearance: none;
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 0px; /* Sharp corners for industrial look */
            font-family: 'Lato', sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
            color: #333;
            cursor: pointer;
            transition: all 0.2s ease;
            
            /* Custom Arrow SVG encoded as background */
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 16px;
        }

        /* Hover/Focus states */
        .custom-select:hover, .custom-input:hover {
            border-color: #000; /* Black border on hover */
        }
        .custom-select:focus, .custom-input:focus {
            outline: none;
            border-color: #000;
            background-color: #fafafa;
        }

        /* Inputs (Min/Max) */
        .custom-input {
            width: 100%;
            padding: 12px 15px;
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 0px;
            font-family: 'Lato', sans-serif;
            font-size: 0.95rem;
            color: #333;
            transition: all 0.2s ease;
        }

        /* --- ANIMATIONS --- */
        .product-card { opacity: 0; animation: fadeInUp 0.5s ease-out forwards; cursor: pointer; }
        .product-card:hover .product-image { transform: scale(1.05); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        div::-webkit-scrollbar { width: 6px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb { background-color: #ddd; border-radius: 20px; }
      `}</style>
    </div>
  );
};

// --- COMPONENT: ACCORDION (UPDATED STYLING) ---
const FilterAccordion = ({ title, children, isOpen, onToggle }) => {
    return (
      <div style={{ borderBottom: '1px solid #eee', marginBottom: '20px', paddingBottom: '20px' }}>
        <div 
          onClick={onToggle} 
          style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer', 
          }}
        >
          {/* Made title uppercase and bolder */}
          <h4 style={{ 
              margin: 0, 
              fontSize: '0.9rem', 
              fontWeight: '900', 
              letterSpacing: '1px', 
              textTransform: 'uppercase',
              color: '#000'
          }}>
              {title}
          </h4>
          
          {/* Simple plus/minus indicator */}
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000' }}>
              {isOpen ? '−' : '+'}
          </span>
        </div>
        {isOpen && <div style={{ marginTop: '15px' }}>{children}</div>}
      </div>
    );
};

// --- STYLES ---

const topBarStyle = {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '30px',
    width: '100%' 
};

const flexContainerStyle = { 
    display: 'flex', 
    alignItems: 'flex-start', // Important for Sticky Sidebar
    width: '100%',
};

// 1. STICKY WRAPPER
const stickyWrapperStyle = {
    position: 'sticky',
    top: '120px', 
    alignSelf: 'flex-start', // This prevents the sidebar from stretching
    zIndex: 50, 
};

// 2. ANIMATED CONTAINER 
const animatedSidebarStyle = {
    overflowX: 'hidden', 
    overflowY: 'auto',   
    maxHeight: 'calc(100vh - 150px)', 
    transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)', 
    whiteSpace: 'nowrap', 
};

const filterToggleBtn = {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '1px',
    fontFamily: 'Lato',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
    transition: 'opacity 0.2s ease',
};

// Removed old styles that are no longer used (selectStyle, smallInput, filterTitle) to keep it clean.
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '50px 40px' };
const imageContainerStyle = { overflow: 'hidden', backgroundColor: '#fff', aspectRatio: '1 / 1.1', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const imageStyle = { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' };

const brandStyle = { margin: '0 0 5px', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' };
const titleStyle = { margin: '0 0 10px', fontFamily: '"Lato", sans-serif', fontSize: '1.2rem', fontWeight: '900', color: '#111' };
const priceStyle = { margin: '0', fontFamily: '"Lato", sans-serif', fontSize: '1rem', fontWeight: 'bold', color: '#333' };
const sellerStyle = { margin: '15px 0 0', fontSize: '0.8rem', color: '#aaa', fontStyle: 'italic' };

const pageBtn = { padding: '10px 20px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' };

export default Home;