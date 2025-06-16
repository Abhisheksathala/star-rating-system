const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createToken, hashPassword, comparePassword } = require('../utils/authUtils');
const {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress,
} = require('../utils/validators.js');

exports.signup = async (req, res) => {
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
      data: {
        name,
        email,
        address,
        password: hashed,
        role: role || 'USER',
      },
    });

    const token = createToken({ id: user.id, role: user.role });
    res.status(201).json({ user: { id: user.id, name: user.name, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken({ id: user.id, role: user.role });
    res.status(200).json({ user: { id: user.id, name: user.name, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await comparePassword(oldPassword, user.password)))
      return res.status(401).json({ message: 'Incorrect old password' });

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ message: 'New password does not meet criteria' });
    }

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
