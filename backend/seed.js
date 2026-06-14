import sequelize from './config/database.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

const products = [
  {
    name: 'Aura Wireless Headphones',
    description: 'Immersive sound experience with active hybrid noise cancelling, smart audio transparency mode, and ultra-comfortable memory foam earcups.',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category: 'Audio',
    countInStock: 12,
  },
  {
    name: 'Chronos Smart Watch S2',
    description: 'Sleek design featuring an Always-On AMOLED screen, advanced fitness trackers, blood oxygen sensor, and up to 10 days of continuous battery life.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    category: 'Wearables',
    countInStock: 8,
  },
  {
    name: 'Tactile Mechanical Keyboard',
    description: 'Precision mechanical switches with hot-swappable sockets, custom RGB double-shot keycaps, and a sleek brushed aluminum casing.',
    price: 129.50,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    category: 'Accessories',
    countInStock: 15,
  },
  {
    name: 'Nomad Leather Backpack',
    description: 'Water-resistant full-grain leather backpack featuring a 16-inch padded laptop sleeve, quick-access pockets, and ergonomic shoulder straps.',
    price: 159.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    category: 'Lifestyle',
    countInStock: 5,
  },
  {
    name: 'Nova RGB Gaming Mouse',
    description: 'Ultra-lightweight design weighing only 58 grams, featuring a 26,000 DPI optical sensor, low latency wireless connection, and optical switch clicks.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    category: 'Accessories',
    countInStock: 20,
  },
  {
    name: 'Lumina Desk Lamp Pro',
    description: 'Smart task lighting with adjustable color temperature, high CRI color rendering, integrated wireless fast charging base, and voice assistant support.',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    category: 'Lifestyle',
    countInStock: 10,
  },
];

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');

    console.log('Creating users...');
    // Create users - password hashing will run automatically via model hooks
    await User.create({
      name: 'John Doe',
      email: 'user@store.com',
      password: 'user123',
      isAdmin: false,
    });

    await User.create({
      name: 'Admin User',
      email: 'admin@store.com',
      password: 'admin123',
      isAdmin: true,
    });

    console.log('Users created successfully.');

    console.log('Creating products...');
    await Product.bulkCreate(products);
    console.log('Products seeded successfully.');

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
