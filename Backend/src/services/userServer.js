import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createuser = async (username, password, email, role) => {
  const user = await prisma.user.create({
    data: {
      username: username,
      password: password,
      email: email,
      role: role,
    },
  });
  if (!user) {
    throw new Error('User creation failed');
  }
  return user;
};
