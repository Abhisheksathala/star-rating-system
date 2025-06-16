const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password) => {
  return /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(password);
};

const isValidName = (name) => {
  return typeof name === 'string' && name.trim().length >= 20 && name.trim().length <= 60;
};

const isValidAddress = (address) => {
  return typeof address === 'string' && address.trim().length <= 400;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress,
};
