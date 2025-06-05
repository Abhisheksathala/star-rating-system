require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const userRoutes = require('./src/routes/userRoutes');
const storeOwnerRoutes = require('./src/routes/storeOwnerRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); // signup, login, password update
app.use('/api/admin', adminRoutes); // admin dashboard + manage users/stores
app.use('/api/user', userRoutes); // view/search stores, submit/modify rating
app.use('/api/store-owner', storeOwnerRoutes); // view ratings, average

// SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
