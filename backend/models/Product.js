import { readDB, writeDB } from '../config/database.js';
import crypto from 'crypto';

class ProductInstance {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = Number(data.price);
    this.image = data.image;
    this.category = data.category;
    this.countInStock = Number(data.countInStock);
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  async save() {
    const db = readDB();
    const index = db.products.findIndex(p => p.id === this.id);
    this.updatedAt = new Date().toISOString();
    
    const plainData = {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      image: this.image,
      category: this.category,
      countInStock: this.countInStock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    if (index !== -1) {
      db.products[index] = plainData;
    } else {
      db.products.push(plainData);
    }
    writeDB(db);
    return this;
  }

  async destroy() {
    const db = readDB();
    db.products = db.products.filter(p => p.id !== this.id);
    writeDB(db);
    return true;
  }
}

export const Product = {
  findAll: async ({ where } = {}) => {
    const db = readDB();
    let list = db.products;
    
    if (where) {
      if (where.category) {
        list = list.filter(p => p.category === where.category);
      }
      if (where.name) {
        // Handle Sequelize [Op.like] search mapping
        const nameQuery = where.name;
        // Check if nameQuery is an object or string
        let term = '';
        if (typeof nameQuery === 'object') {
          // get the first symbol value or search value
          const keys = Object.getOwnPropertySymbols(nameQuery);
          if (keys.length > 0) {
            term = nameQuery[keys[0]];
          } else {
            // Check properties
            const val = Object.values(nameQuery)[0];
            if (typeof val === 'string') term = val;
          }
        } else if (typeof nameQuery === 'string') {
          term = nameQuery;
        }

        if (term) {
          const cleanTerm = term.replace(/%/g, '').toLowerCase();
          list = list.filter(p => p.name.toLowerCase().includes(cleanTerm));
        }
      }
    }
    
    return list.map(p => new ProductInstance(p));
  },

  findByPk: async (id) => {
    const db = readDB();
    const raw = db.products.find(p => p.id === id);
    return raw ? new ProductInstance(raw) : null;
  },

  create: async (data) => {
    const db = readDB();
    const newProduct = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      price: Number(data.price),
      image: data.image,
      category: data.category,
      countInStock: Number(data.countInStock),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.products.push(newProduct);
    writeDB(db);
    return new ProductInstance(newProduct);
  },

  bulkCreate: async (dataList) => {
    const db = readDB();
    const newProducts = dataList.map(data => ({
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      price: Number(data.price),
      image: data.image,
      category: data.category,
      countInStock: Number(data.countInStock),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    db.products.push(...newProducts);
    writeDB(db);
    return newProducts.map(p => new ProductInstance(p));
  }
};

export default Product;
