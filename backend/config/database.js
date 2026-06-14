import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, '..', 'database.json');

// Safely read the database JSON file
export const readDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], products: [], orders: [] }, null, 2));
  }
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw);
};

// Safely write the database JSON file
export const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Mock Sequelize connection interface
export const sequelize = {
  authenticate: async () => {
    readDB();
    return true;
  },
  sync: async (options = {}) => {
    if (options.force) {
      writeDB({ users: [], products: [], orders: [] });
    } else {
      readDB();
    }
    return true;
  }
};

export default sequelize;
