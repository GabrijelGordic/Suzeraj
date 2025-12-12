import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [shoes, setShoes] = useState([]);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  // Function to fetch shoes with filters
  const fetchShoes = () => {
    // Build the query string: /api/shoes/?search=Nike&brand=Adidas
    let query = '/api/shoes/?';
    if (search) query += `search=${search}&`;
    if (brandFilter) query += `brand=${brandFilter}&`;

    api.get(query)
      .then(res => setShoes(res.data))
      .catch(err => console.error(err));
  };

  // Fetch initial data
  useEffect(() => {
    fetchShoes();
    // eslint-disable-next-line
  }, []); // Run once on load

  // Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchShoes();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Search Bar Section */}
      <div style={searchBarStyle}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '600px' }}>
            <input 
                type="text" 
                placeholder="Search kicks..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={inputStyle}
            />
            <select 
                value={brandFilter} 
                onChange={(e) => setBrandFilter(e.target.value)}
                style={selectStyle}
            >
                <option value="">All Brands</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Jordan">Jordan</option>
                <option value="New Balance">New Balance</option>
                <option value="Yeezy">Yeezy</option>
            </select>
            <button type="submit" style={btnStyle}>Search</button>
            
            {/* Clear Button */}
            {(search || brandFilter) && (
                <button 
                    type="button" 
                    onClick={() => { setSearch(''); setBrandFilter(''); window.location.reload(); }}
                    style={{...btnStyle, background: '#666'}}
                >
                    Clear
                </button>
            )}
        </form>
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Latest Kicks</h1>
      
      {/* Grid Section (Same as before) */}
      <div style={gridStyle}>
        {shoes.length > 0 ? shoes.map(shoe => (
          <div key={shoe.id} style={cardStyle}>
            <Link to={`/shoes/${shoe.id}`} style={{ display: 'block' }}>
                <img src={shoe.image} alt={shoe.title} style={imageStyle} />
            </Link>
            <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                    <Link to={`/shoes/${shoe.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                        {shoe.title}
                    </Link>
                </h3>
                <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>
                    {shoe.brand} | Size: {shoe.size}
                </p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#888' }}>
                    Seller: <Link to={`/seller/${shoe.seller_username}`} style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>
                        {shoe.seller_username}
                    </Link>
                </p>
                <div style={{ marginTop: '15px' }}>
                    <h4 style={{ margin: '0', color: 'green', fontSize: '1.1rem' }}>${shoe.price}</h4>
                </div>
            </div>
          </div>
        )) : (
            <p style={{ textAlign: 'center', gridColumn: '1/-1', fontSize: '1.2rem', color: '#888' }}>
                No shoes found. Try a different search.
            </p>
        )}
      </div>
    </div>
  );
};

// Styles
const searchBarStyle = {
    display: 'flex', 
    justifyContent: 'center', 
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
};

const inputStyle = {
    flex: 2, padding: '10px', borderRadius: '4px', border: '1px solid #ccc'
};
const selectStyle = {
    flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc'
};
const btnStyle = {
    padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '30px',
  marginTop: '20px'
};
const cardStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  backgroundColor: 'white',
  transition: 'transform 0.2s',
};
const imageStyle = {
    width: '100%', height: '250px', objectFit: 'cover', cursor: 'pointer', borderBottom: '1px solid #eee'
};

export default Home;