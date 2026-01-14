import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../store/cartSlice';
import styles from './Cart.module.scss';

const Cart = ({ onClose }) => {
  const items = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER (Fixed) */}
        <div className={styles.header}>
          <h2>Your Cart</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">&times;</button>
        </div>

        {/* ITEMS LIST (Scrollable area) */}
        <div className={styles.itemsList}>
          {items.length === 0 ? (
            <p className={styles.empty}>Your cart is currently empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles.item}>
                <img src={item.image} alt={item.title} />
                
                <div className={styles.itemInfo}>
                  <h4>{item.title.substring(0, 30)}...</h4>
                  <p>${item.price}</p>
                </div>
                
                <div className={styles.controls}>
                  <button onClick={() => dispatch(removeFromCart(item.id))}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch(addToCart(item))}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER (Fixed at bottom) */}
        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <button className={styles.checkoutBtn} onClick={() => alert("Proceeding to checkout...")}>
            Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;