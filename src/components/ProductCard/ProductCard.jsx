
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import styles from './ProductCard.module.scss';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <div className={styles.card}>
      {/* Container for image zoom effect */}
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.title} className={styles.image} />
      </div>
      
      <div className={styles.info}>
        {/* Category label */}
        <span className={styles.category}>{product.category}</span>
        
        <h3 className={styles.title}>{product.title}</h3>
        
        <div className={styles.footer}>
          <span className={styles.price}>${product.price}</span>
          <button 
            className={styles.btn}
            onClick={() => dispatch(addToCart(product))}
            aria-label={`Add ${product.title} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;