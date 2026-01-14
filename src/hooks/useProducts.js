import { useState, useEffect } from 'react';
import axios from 'axios';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(res => {
        const originalData = res.data;
        
        // DUPLICATING DATA to simulate a large database (4x items)
        // We create a new array with 80 items instead of 20
        const repeatedData = [
          ...originalData, 
          ...originalData, 
          ...originalData, 
          ...originalData
        ].map((item, index) => ({
          ...item,
          // Generate a unique ID for each duplicate to avoid React key warnings
          id: index + 1000 
        }));

        setProducts(repeatedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  return { products, loading };
};