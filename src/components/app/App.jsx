import { useState, useEffect, useMemo } from 'react'; // Added useMemo for performance
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ProductCard/ProductCard';
import Cart from '../Cart/Cart';
import FilterBar from '../FilterBar/FilterBar'; // Import new component
import { useSelector } from 'react-redux';
import styles from './App.module.scss';

function App() {
  const { products, loading } = useProducts();
  const cartItems = useSelector(state => state.cart.items);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- FILTER & SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- FILTERING LOGIC ---
  // We use useMemo to optimize: filtering runs only when products, search, or category changes
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Check Category
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      // 2. Check Search Text (case insensitive)
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Extract unique categories dynamically from data
  const categories = useMemo(() => {
    // Set removes duplicates
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  // --- RESET PAGINATION ---
  // When user searches or filters, always go back to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // --- PAGINATION LOGIC (Now using filteredProducts!) ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <h2 className={styles.loading}>Loading products...</h2>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Premium Store</h1>
        <button className={styles.cartBtn} onClick={() => setIsCartOpen(true)}>
           Cart ({totalQuantity})
        </button>
      </header>

      {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}

      {/* FILTER SECTION */}
      <FilterBar 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* RESULTS MESSAGE (If nothing found) */}
      {filteredProducts.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
          <h3>No products found matching your criteria.</h3>
        </div>
      ) : (
        <main className={styles.grid}>
          {currentItems.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </main>
      )}

      {/* Pagination (Hide if only 1 page or no results) */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button 
              key={i + 1} 
              onClick={() => paginate(i + 1)}
              className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.active : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;