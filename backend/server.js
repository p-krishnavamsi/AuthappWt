const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('./db');
const User = require('./Model/User');

const app = express();
app.use(express.json());
app.use(cors());

let sessions = {};

app.post('/register', async (req, res) => {
  const { username, password, email, age, gender, location } = req.body;
  try {
    const user = new User({ username, password, email, age, gender, location });
    await user.save();
    res.json({ success: true, message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Username or email already exists' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    const token = Math.random().toString(36).substring(2);
    sessions[token] = user._id;
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/user', async (req, res) => {
  const token = req.headers.authorization;
  const userId = sessions[token];

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

app.listen(3000, () => console.log('Auth server running on port 3000'));
