import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import Meta from '../components/Meta';
import heroBanner from '../assets/unnamed.jpg'; 

const Home = () => {
  const location = useLocation();

  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); 

  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [openSections, setOpenSections] = useState({
    sort: true, price: true, brand: false, size: false, condition: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SIZE_OPTIONS = [];
  for (let i = 35; i <= 49.5; i += 0.5) { SIZE_OPTIONS.push(i); }

  const getCurrencySymbol = (code) => {
      if (code === 'USD') return '$';
      if (code === 'GBP') return '£';
      return '€';
  };

  const fetchShoes = useCallback(() => {
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
      .catch(err => { console.error(err); setLoading(false); });
  }, [page, pageSize, search, brand, size, condition, minPrice, maxPrice, currencyFilter, ordering]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const sizeParam = params.get('page_size');
    if (searchParam !== null) setSearch(searchParam);
    if (sizeParam !== null) setPageSize(Number(sizeParam));
  }, [location.search]);

  useEffect(() => { 
    setPage(1); 
    fetchShoes(); 
  }, [brand, size, condition, ordering, minPrice, maxPrice, currencyFilter, pageSize, search, fetchShoes]); 

  useEffect(() => { 
    fetchShoes(); 
  }, [page, fetchShoes]);

  const clearFilters = () => {
    setBrand(''); setSize(''); setCondition(''); setMinPrice(''); setMaxPrice(''); setCurrencyFilter(''); setOrdering('-created_at'); setSearch('');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '50px', overflowX: 'hidden' }}>
      <Meta /> 

      {/* HERO BANNER */}
      <div className="hero-container">
          <img src={heroBanner} alt="Sneaker Collection" className="hero-image" />
          <div className="hero-text-box">
              <h1 className="hero-title">
                  BUY. SELL. TRADE. 
              </h1>
              <p className="hero-subtitle">
                  Built by sneakerheads, for sneakerheads.
              </p>
          </div>
      </div>

      <div className="main-content-pad">
          
          {/* TOP BAR */}
          <div className="top-bar-container">
                <button onClick={() => setShowFilters(!showFilters)} className="filter-toggle-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}>
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    {showFilters ? 'HIDE FILTERS' : 'SHOW FILTERS'}
                </button>
                
                <div className="top-bar-right">
                    <div className="page-size-selector">
                        <span style={{ marginRight: '6px' }}>Show:</span>
                        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="page-select">
                            <option value="12">12</option><option value="24">24</option><option value="48">48</option>
                        </select>
                    </div>
                    <span className="results-text">{shoes.length} Results</span>
                </div>
          </div>

          <div style={flexContainerStyle}>
            
            {/* SIDEBAR - NOW USING CSS CLASS TOGGLING */}
            <aside className={`filter-sidebar ${showFilters ? 'open' : ''}`}>
                
                {/* MOBILE CLOSE BUTTON */}
                <div className="mobile-close-header" onClick={() => setShowFilters(false)}>
                    <span>FILTERS</span>
                    <span>✕</span>
                </div>

                <div style={{ width: '100%' }}> 
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: '25px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                        <h3 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '2rem', margin: 0, lineHeight: 1, letterSpacing: '1px' }}>FILTERS</h3>
                        <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#000000ff', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'Lato', textTransform: 'uppercase', fontWeight: 'bold' }}>Clear All</button>
                    </div>

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
                                {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
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
            </aside>

            {/* RIGHT CONTENT */}
            <div style={{ flex: 1 }}>
                {loading ? (
                    <p style={{textAlign:'center', padding:'50px'}}>Updating results...</p>
                ) : (
                    <div className="grid-responsive">
                        {shoes.length > 0 ? shoes.map((shoe, index) => (
                            <div key={shoe.id} className="product-card" style={{animationDelay: `${index * 0.05}s`}}>
                                <Link to={`/shoes/${shoe.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={imageContainerStyle}>
                                        <img src={shoe.image} alt={shoe.title} style={imageStyle} className="product-image" />
                                    </div>
                                    <div style={{ padding: '15px 0', textAlign: 'center' }}>
                                        <p style={brandStyle}>{shoe.brand}</p>
                                        <h3 style={titleStyle}>{shoe.title}</h3>
                                        <p style={priceStyle}>{getCurrencySymbol(shoe.currency)}{shoe.price}</p>
                                        <p style={sellerStyle}>Sold by {shoe.seller_username}</p>
                                    </div>
                                </Link>
                            </div>
                        )) : (
                            <div style={{textAlign:'center', padding:'50px', gridColumn: '1/-1'}}>
                                <h3 style={{fontFamily: '"Bebas Neue", sans-serif', fontSize: '2rem'}}>No shoes match your filters.</h3>
                                <button onClick={clearFilters} style={{background:'none', border:'none', textDecoration:'underline', cursor:'pointer', color:'blue'}}>Clear all filters</button>
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        body { font-family: 'Lato', sans-serif; margin: 0; padding: 0; }
        * { box-sizing: border-box; }

        /* --- HERO SECTION --- */
        .hero-container { 
            width: 100vw; 
            margin-left: calc(50% - 50vw); 
            height: 800px; 
            margin-bottom: 40px; 
            position: relative; 
        }
        .hero-image { width: 100%; height: 100%; object-fit: cover; }
        .hero-text-box {
            position: absolute; 
            top: 50%; left: 50%; transform: translate(-50%, -50%); 
            background-color: rgba(252, 247, 247, 0.90); 
            text-align: center; color: black; border-radius: 2px; padding: 30px 60px;
            display: inline-block; z-index: 10;
        }
        .hero-title { font-family: 'Bebas Neue', sans-serif; font-size: 5rem; margin: 0 0 10px 0; line-height: 0.9; letter-spacing: 2px; opacity: 0; animation: flicker 2s linear forwards 0.5s; }
        .hero-subtitle { font-family: 'Lato', sans-serif; fontWeight: 700; margin: 0; letterSpacing: 4px; text-transform: uppercase; color: rgba(194, 84, 141); opacity: 0; animation: simpleFadeIn 1s ease-out forwards 1.5s; fontSize: 1.2rem; }

        .main-content-pad { padding: 0 40px; }

        /* --- SIDEBAR STYLES (New) --- */
        .filter-sidebar {
            /* Desktop Default */
            position: sticky;
            top: 120px;
            align-self: flex-start;
            z-index: 50;
            height: calc(100vh - 150px);
            overflow-y: auto;
            background: #fff;
            
            /* Hidden State Desktop */
            width: 0;
            opacity: 0;
            margin-right: 0;
            padding-right: 0;
            overflow-x: hidden;
            transition: all 0.4s ease;
        }

        .filter-sidebar.open {
            /* Open State Desktop */
            width: 320px;
            opacity: 1;
            margin-right: 40px;
            padding-right: 20px;
        }

        .mobile-close-header { display: none; }

        /* --- MOBILE STYLES --- */
        @media (max-width: 768px) {
            .hero-container { height: 500px; } 
            .hero-text-box { padding: 20px 20px; width: 90%; }
            .hero-title { font-size: 3.5rem !important; } 
            .hero-subtitle { font-size: 0.8rem !important; }

            .top-bar-container { flex-wrap: wrap; gap: 15px; }
            .top-bar-right { gap: 10px; }
            .main-content-pad { padding: 0 15px !important; }
            .grid-responsive { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px 15px; }

            /* SIDEBAR MOBILE OVERRIDE */
            .filter-sidebar {
                position: fixed !important;
                top: 0; left: 0;
                height: 100vh !important;
                width: 100vw !important;
                z-index: 9999;
                margin: 0 !important;
                padding: 20px !important;
                
                /* Hidden State Mobile (Slide out) */
                transform: translateX(-100%);
                opacity: 1; /* Keep opacity 1 so it doesn't fade, just slides */
                width: 100vw !important;
            }

            .filter-sidebar.open {
                /* Open State Mobile (Slide in) */
                transform: translateX(0);
                width: 100vw !important;
            }

            /* Show Close Button on Mobile */
            .mobile-close-header { 
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #000;
                font-family: 'Bebas Neue', sans-serif; fontSize: 1.5rem; cursor: pointer;
            }
        }

        @media (max-width: 400px) {
            .hero-title { font-size: 2.8rem !important; }
        }

        /* --- OTHER STYLES --- */
        .top-bar-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; width: 100%; }
        .top-bar-right { display: flex; align-items: center; gap: 20px; }
        .filter-toggle-btn { background-color: #000; color: #fff; border: none; padding: 12px 25px; fontSize: 0.9rem; fontWeight: 700; cursor: pointer; letter-spacing: 1px; fontFamily: 'Lato'; display: flex; alignItems: center; border-radius: 4px; }
        
        .custom-select-wrapper { position: relative; width: 100%; }
        .custom-select { width: 100%; padding: 12px 15px; appearance: none; -webkit-appearance: none; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 0px; font-family: 'Lato', sans-serif; fontSize: 0.9rem; font-weight: 500; color: #333; cursor: pointer; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 10px center; background-size: 16px; }
        .custom-input { width: 100%; padding: 12px 15px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 0px; font-family: 'Lato', sans-serif; fontSize: 0.95rem; color: #333; }

        .product-card { opacity: 0; animation: fadeInUp 0.5s ease-out forwards; cursor: pointer; border: 1px solid #b75784}
        .product-card:hover .product-image { transform: scale(1.1); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flicker { 0% { opacity: 0; } 6% { opacity: 1; } 7% { opacity: 0; } 9% { opacity: 1; } 11% { opacity: 1; } 16% { opacity: 0; } 17% { opacity: 1; } 40% { opacity: 1; } 41% { opacity: 0.8; } 42% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes simpleFadeIn { to { opacity: 1; } }
      `}</style>
    </div>
  );
};

const FilterAccordion = ({ title, children, isOpen, onToggle }) => {
    return (
      <div style={{ borderBottom: '1px solid #eee', marginBottom: '20px', paddingBottom: '20px' }}>
        <div onClick={onToggle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', color: '#000' }}>{title}</h4>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000' }}>{isOpen ? '−' : '+'}</span>
        </div>
        {isOpen && <div style={{ marginTop: '15px' }}>{children}</div>}
      </div>
    );
};

// STYLES
const flexContainerStyle = { display: 'flex', alignItems: 'flex-start', width: '100%' };
const imageContainerStyle = { overflow: 'hidden', backgroundColor: '#fff', aspectRatio: '1 / 1.1', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const imageStyle = { width: '100%', height: '100%', objectFit: 'contain', padding: '10px', transition: 'transform 0.5s ease' };
const brandStyle = { margin: '0 0 5px', color: '#764a6aff', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' };
const titleStyle = { margin: '0 0 10px', fontFamily: '"Lato", sans-serif', fontSize: '1.2rem', fontWeight: '900', color: '#111' };
const priceStyle = { margin: '0', fontFamily: '"Lato", sans-serif', fontSize: '1rem', fontWeight: 'bold', color: '#333' };
const sellerStyle = { margin: '15px 0 0', fontSize: '1rem', color: '#000000ff', fontStyle: 'italic' };
const pageBtn = { padding: '10px 20px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' };

export default Home;