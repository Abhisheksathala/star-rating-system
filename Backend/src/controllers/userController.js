const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.getStores = async (req, res) => {
  const userId = req.user.id;
  const { name = '', address = '' } = req.query;

  try {
    const stores = await prisma.store.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        address: address ? { contains: address, mode: 'insensitive' } : undefined,
      },
      include: {
        ratings: true,
      },
    });

    const results = await Promise.all(
      stores.map(async (store) => {
        const userRating = await prisma.rating.findUnique({
          where: {
            userId_storeId: {
              userId,
              storeId: store.id,
            },
          },
        });

        const avgRating = store.ratings.length
          ? (store.ratings.reduce((a, b) => a + b.rating, 0) / store.ratings.length).toFixed(1)
          : 'N/A';

        return {
          id: store.id,
          name: store.name,
          address: store.address,
          overallRating: avgRating,
          userRating: userRating?.rating || null,
        };
      }),
    );

    res.json(results);
  } catch (err) {
    console.error('Error in getStores:', err);
    res.status(500).json({ message: err.message });
  }
};

// Submit a new rating (1-5)
exports.submitRating = async (req, res) => {
  const userId = req.user.id;
  const { storeId, score } = req.body;

  if (score < 1 || score > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const existing = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: 'Rating already exists. Use modify instead.' });
    }

    const rating = await prisma.rating.create({
      data: {
        rating: score,
        userId,
        storeId,
      },
    });

    res.status(201).json({ message: 'Rating submitted', rating });
  } catch (err) {
    console.error('Error in submitRating:', err);
    res.status(500).json({ message: err.message });
  }
};

// Modify existing rating
exports.modifyRating = async (req, res) => {
  const userId = req.user.id;
  const { storeId, score } = req.body;

  if (score < 1 || score > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const rating = await prisma.rating.update({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      data: {
        rating: score,
      },
    });

    res.status(200).json({ message: 'Rating updated', rating });
  } catch (err) {
    res.status(500).json({ message: 'Rating not found or update failed' });
  }
};
