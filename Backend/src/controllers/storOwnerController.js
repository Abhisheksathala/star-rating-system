const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.getDashboard = async (req, res) => {
  const ownerId = req.user.id;

  try {
    // Find the store owned by this user
    const store = await prisma.store.findFirst({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!store) return res.status(404).json({ message: 'Store not found for this owner' });

    const ratings = store.ratings.map((rating) => ({
      id: rating.id,
      score: rating.score,
      submittedBy: rating.user,
      submittedAt: rating.createdAt,
    }));

    const avgRating = store.ratings.length
      ? (store.ratings.reduce((a, b) => a + b.rating, 0) / store.ratings.length).toFixed(1)
      : 'N/A';

    res.json({
      storeName: store.name,
      address: store.address,
      averageRating: avgRating,
      ratings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createOrUpdateStore = async (req, res) => {
  const ownerId = req.user.id;
  const { name, email, address } = req.body;

  try {
    let store = await prisma.store.findFirst({ where: { ownerId } });
    if (store) {
      store = await prisma.store.update({
        where: { id: store.id },
        data: { name, email, address },
      });
      return res.json({ message: 'Store updated', store });
    }
    store = await prisma.store.create({
      data: { name, email, address, ownerId },
    });
    res.status(201).json({ message: 'Store created', store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
