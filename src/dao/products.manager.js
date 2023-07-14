import { productModel } from "../dao/mongo/models/product.model.js";

export default class ProductsManager {
  async getProducts() {
    try {
      const products = await productModel.find();
      return products;
    } catch (err) {
      return `Error while getting products: ${err}`;
    }
  }

  async addProduct(newProduct) {
    try {
      const product = await productModel.create(newProduct);
      return `Product ${product._id} added`;
    } catch (err) {
      return `Error while adding the product: ${err}`;
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.findById(id);
      if (!product) {
        return `There's no product with ID ${id}`;
      }
      return product;
    } catch (err) {
      return `Error while getting the product ${id}: ${err}`;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const product = await productModel.findById(id);
      if (!product) {
        return `There's no product with ID ${id}`;
      }

      for (const key in updatedFields) {
        if (key.toLowerCase() === "id") {
          return `You can't update the ID field`;
        }

        if (!product.hasOwnProperty(key)) {
          return `Some field/s doesn't exist/s`;
        }

        product[key] = updatedFields[key];
      }

      await product.save();
      return `Product ${id} updated`;
    } catch (err) {
      return `Error while updating the product ${id}: ${err}`;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await productModel.findById(id);
      if (!product) {
        return `There's no product with ID ${id}`;
      }

      await product.remove();
      return `Product ${id} deleted`;
    } catch (err) {
      return `Error while deleting the product ${id}: ${err}`;
    }
  }
}

       
		