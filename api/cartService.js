// cartService.js
import { api } from '../utils/api';

export const cartService = {
  addToCart: async (cartData) => {
    try {
      const response = await api.post('/cart/add', cartData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add to cart');
    }
  },

  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cart');
    }
  },

  updateCartItem: async (itemData) => {
    try {
      const response = await api.put('/cart/item', itemData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  },

  updateTip: async (tipAmount) => {
    try {
      const response = await api.put('/cart/tip', { tipAmount });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update tip');
    }
  },

  proceedToCheckout: async () => {
    try {
      const response = await api.post('/cart/checkout');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to proceed to checkout');
    }
  }
};