import { cartModel } from "../dao/mongo/models/cart.model.js";

export default class CartsManager {
  async getCarts() {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (err) {
      return `Error while getting carts: ${err}`;
    }
  }

  async addCart() {
    try {
      const newCart = await cartModel.create({
        products: []
      });
      return `Cart added with ID ${newCart._id}`;
    } catch (err) {
      return `Error while adding the cart: ${err}`;
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartModel.findById(id);
      if (!cart) {
        return `There's no cart with ID ${id}`;
      }
      return cart.products;
    } catch (err) {
      return `Error while getting cart ${id}: ${err}`;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return `There's no cart with ID ${cartId}`;
      }

      const product = cart.products.find(product => product.product.toString() === productId);
      if (product) {
        product.quantity += 1;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1
        });
      }

      await cart.save();
      return `Product ${productId} added to cart ${cartId}`;
    } catch (err) {
      return `Error while adding the product ${productId} to cart ${cartId}: ${err}`;
    }
  }

  async deleteCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return `There's no cart with ID ${cartId}`;
      }

      const productIndex = cart.products.findIndex(product => product.product.toString() === productId);
      if (productIndex === -1) {
        return `There's no product ${productId} in cart ${cartId}`;
      }

      cart.products.splice(productIndex, 1);
      await cart.save();
      return `Product ${productId} deleted from cart ${cartId}`;
    } catch (err) {
      return `Error while deleting the cart ${cartId}: ${err}`;
    }
  }
}
