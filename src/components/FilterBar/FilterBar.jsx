import styles from './FilterBar.module.scss';

const FilterBar = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className={styles.filterContainer}>
      {/* Categories Buttons */}
      <div className={styles.categories}>
        
        {/* We map through ALL categories (including 'all') here */}
        {categories.map(cat => (
          <button 
            key={cat}
            className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {/* If category is 'all', display 'All', otherwise display the category name */}
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className={styles.searchWrapper}>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>
    </div>
  );
};

export default FilterBar;