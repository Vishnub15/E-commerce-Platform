import { readDB, writeDB } from '../config/database.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

class UserInstance {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.isAdmin = !!data.isAdmin;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  async save() {
    const db = readDB();
    const index = db.users.findIndex(u => u.id === this.id);
    this.updatedAt = new Date().toISOString();
    
    // Hash password if modified
    if (index !== -1 && db.users[index].password !== this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    if (index !== -1) {
      db.users[index] = {
        id: this.id,
        name: this.name,
        email: this.email,
        password: this.password,
        isAdmin: this.isAdmin,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    } else {
      db.users.push({
        id: this.id,
        name: this.name,
        email: this.email,
        password: this.password,
        isAdmin: this.isAdmin,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      });
    }
    writeDB(db);
    return this;
  }
}

export const User = {
  findOne: async ({ where }) => {
    const db = readDB();
    const email = where.email;
    const raw = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return raw ? new UserInstance(raw) : null;
  },

  findByPk: async (id) => {
    const db = readDB();
    const raw = db.users.find(u => u.id === id);
    return raw ? new UserInstance(raw) : null;
  },

  create: async (data) => {
    const db = readDB();
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      isAdmin: !!data.isAdmin,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDB(db);
    return new UserInstance(newUser);
  },

  findAll: async () => {
    const db = readDB();
    return db.users.map(u => new UserInstance(u));
  }
};

export default User;
