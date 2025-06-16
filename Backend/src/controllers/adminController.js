const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hashPassword } = require('../utils/authUtils');
const {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress,
} = require('../utils/validators.js');

// Dashboard: Get counts
exports.getDashboard = async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const storeCount = await prisma.store.count();
    const ratingCount = await prisma.rating.count();
    res.json({ userCount, storeCount, ratingCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new user (normal or admin)
exports.addUser = async (req, res) => {
  const { name, email, address, password, role } = req.body;

  try {
    if (
      !isValidEmail(email) ||
      !isValidPassword(password) ||
      !isValidName(name) ||
      !isValidAddress(address)
    ) {
      return res.status(400).json({ message: 'Invalid input fields' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, address, password: hashed, role: role || 'USER' },
    });

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new store (store owner must exist)
exports.addStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;

  try {
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== 'STORE_OWNER') {
      return res.status(400).json({ message: 'Invalid store owner' });
    }

    const store = await prisma.store.create({
      data: { name, email, address, ownerId: owner.id },
    });

    res.status(201).json({ message: 'Store added', store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// View stores
exports.getStores = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        ratings: true,
        owner: true,
      },
    });

    const response = stores.map((store) => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      rating: store.ratings.length
        ? (store.ratings.reduce((a, b) => a + b.score, 0) / store.ratings.length).toFixed(1)
        : 'N/A',
      owner: store.owner?.name,
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// View users with filters
exports.getUsers = async (req, res) => {
  const { name, email, address, role } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        email: email ? { contains: email, mode: 'insensitive' } : undefined,
        address: address ? { contains: address, mode: 'insensitive' } : undefined,
        role: role ? role : undefined,
      },
      include: {
        store: {
          include: { ratings: true },
        },
      },
    });

    const response = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      rating:
        user.role === 'STORE_OWNER' && user.store && user.store.ratings.length
          ? (
              user.store.ratings.reduce((a, b) => a + b.score, 0) / user.store.ratings.length
            ).toFixed(1)
          : undefined,
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
