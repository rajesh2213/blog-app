require('dotenv').config()
const jwt = require('jsonwebtoken')

const user = {
  id: 'cmaw2vbci0000u1x4fb3sowvj',
  email: 'admin@gmail.com',
  role: 'admin',
};

const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '1h'})

console.log('Bearer ' + token);
