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
        <button 
          className={`${styles.categoryBtn} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          All
        </button>
        
        {categories.map(cat => (
          <button 
            key={cat}
            className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
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