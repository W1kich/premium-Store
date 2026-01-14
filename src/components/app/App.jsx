import { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import FilterBar from '../FilterBar/FilterBar';
import Cart from '../Cart/Cart';
import styles from './App.module.scss';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Cart state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Fetch data from API
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  // --- CART LOGIC ---
  const addToCart = (product) => {
    setCartItems(prev => {
      const isExist = prev.find(item => item.id === product.id);
      if (isExist) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); 
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- FILTERING LOGIC ---
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logic: Previous / Next Buttons
  const handlePrev = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  // Generate "sliding window" for page numbers (e.g., [1, 2, 3, 4, 5])
  const getPageNumbers = () => {
    // Show fewer buttons on mobile (3), more on Desktop (5)
    const maxVisibleButtons = window.innerWidth < 768 ? 3 : 5; 
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    // Adjust if we are near the end of the list
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) return <h2 className={styles.loading}>Loading products...</h2>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Coffee Premium Store</h1>
        <button className={styles.cartBtn} onClick={() => setIsCartOpen(true)}>
           Cart ({totalQuantity})
        </button>
      </header>

      {/* Cart Modal */}
      {isCartOpen && (
        <Cart 
          items={cartItems} 
          onClose={() => setIsCartOpen(false)} 
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      )}

      {/* Filters */}
      <FilterBar 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
          <h3>No products found matching your criteria.</h3>
        </div>
      ) : (
        <main className={styles.grid}>
          {currentItems.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart}
            />
          ))}
        </main>
      )}

      {/* --- NEW PAGINATION UI --- */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {/* BACK Button */}
          <button 
            onClick={handlePrev} 
            disabled={currentPage === 1}
            className={`${styles.arrowBtn} ${currentPage === 1 ? styles.disabled : ''}`}
          >
            &lt; {/* Left Arrow Symbol */}
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((number) => (
            <button 
              key={number} 
              onClick={() => paginate(number)}
              className={`${styles.pageBtn} ${currentPage === number ? styles.active : ''}`}
            >
              {number}
            </button>
          ))}

          {/* NEXT Button */}
          <button 
            onClick={handleNext} 
            disabled={currentPage === totalPages}
            className={`${styles.arrowBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
          >
            &gt; {/* Right Arrow Symbol */}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;