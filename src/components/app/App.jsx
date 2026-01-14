import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../store/cartSlice'; // Ensure this path is correct

import ProductCard from '../ProductCard/ProductCard';
import FilterBar from '../FilterBar/FilterBar';
import Cart from '../Cart/Cart';
import styles from './App.module.scss';

function App() {
  const dispatch = useDispatch();

  // --- REDUX STATE ---
  // Access cart items from the Redux store
  const cartItems = useSelector(state => state.cart.items);

  // Calculate total quantity dynamically based on Redux state
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- LOCAL STATE ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Cart UI state (visibility)
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- DATA FETCHING ---
  // Fetch data from API and multiply it to simulate a larger store
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        // Data multiplication logic (20 -> 80 items)
        const repeatedProducts = [];

        // Loop 4 times to create 4 sets of the original 20 products
        for (let i = 0; i < 4; i++) {
          data.forEach(item => {
            repeatedProducts.push({
              ...item,
              // Generate unique ID for each copy to prevent React key errors
              // Set 1: 1-20, Set 2: 21-40, Set 3: 41-60, Set 4: 61-80
              id: item.id + (20 * i)
            });
          });
        }

        setProducts(repeatedProducts);
        setLoading(false);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  // --- CART HANDLERS (Passed to Cart Modal) ---
  
  // Handler for the "+" button in the Cart modal
  const handleAddOne = (item) => {
    dispatch(addToCart(item));
  };

  // Handler for the "-" or "Remove" button in the Cart modal
  const handleRemoveOne = (id) => {
    dispatch(removeFromCart(id));
  };

  // --- FILTERING LOGIC ---
  // Extract unique categories from the expanded product list
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reset page to 1 when filters change
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

  // Navigation: Previous / Next Buttons
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
        {/* Display total quantity calculated from Redux */}
        <button className={styles.cartBtn} onClick={() => setIsCartOpen(true)}>
           Cart ({totalQuantity})
        </button>
      </header>

      {/* Cart Modal */}
      {isCartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          // Pass handlers that dispatch Redux actions
          onRemove={handleRemoveOne}
          onAdd={handleAddOne}
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
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
          <h3>No products found matching your criteria.</h3>
        </div>
      ) : (
        <main className={styles.grid}>
          {currentItems.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              // Note: We do NOT pass addToCart here. 
              // ProductCard uses useDispatch internally.
            />
          ))}
        </main>
      )}

      {/* --- PAGINATION UI --- */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {/* BACK Button */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`${styles.arrowBtn} ${currentPage === 1 ? styles.disabled : ''}`}
          >
            &lt;
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
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default App;