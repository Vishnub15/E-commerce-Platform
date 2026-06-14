import { readDB, writeDB } from '../config/database.js';
import crypto from 'crypto';

class OrderInstance {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.totalAmount = Number(data.totalAmount);
    this.status = data.status || 'Pending';
    this.paymentMethod = data.paymentMethod || 'Card';
    
    // In our Sequelize model, we stored these as TEXT.
    // In this pure JS DB, we can just save them as objects/arrays directly!
    // But since the router might read them expecting objects, let's keep them as objects.
    this.shippingAddress = typeof data.shippingAddress === 'string' 
      ? JSON.parse(data.shippingAddress) 
      : (data.shippingAddress || {});
      
    this.items = typeof data.items === 'string'
      ? JSON.parse(data.items)
      : (data.items || []);
      
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  async save() {
    const db = readDB();
    const index = db.orders.findIndex(o => o.id === this.id);
    this.updatedAt = new Date().toISOString();
    
    const plainData = {
      id: this.id,
      userId: this.userId,
      totalAmount: this.totalAmount,
      status: this.status,
      paymentMethod: this.paymentMethod,
      shippingAddress: this.shippingAddress,
      items: this.items,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    if (index !== -1) {
      db.orders[index] = plainData;
    } else {
      db.orders.push(plainData);
    }
    writeDB(db);
    return this;
  }
}

export const Order = {
  findAll: async ({ where, order } = {}) => {
    const db = readDB();
    let list = db.orders;
    if (where && where.userId) {
      list = list.filter(o => o.userId === where.userId);
    }
    
    // Sorting by order: [['createdAt', 'DESC']]
    if (order && order[0] && order[0][0] === 'createdAt' && order[0][1] === 'DESC') {
      list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list.map(o => new OrderInstance(o));
  },

  findByPk: async (id) => {
    const db = readDB();
    const raw = db.orders.find(o => o.id === id);
    return raw ? new OrderInstance(raw) : null;
  },

  create: async (data) => {
    const db = readDB();
    const newOrder = {
      id: crypto.randomUUID(),
      userId: data.userId,
      totalAmount: Number(data.totalAmount),
      status: data.status || 'Pending',
      paymentMethod: data.paymentMethod || 'Card',
      shippingAddress: data.shippingAddress,
      items: data.items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.orders.push(newOrder);
    writeDB(db);
    return new OrderInstance(newOrder);
  }
};

export default Order;
