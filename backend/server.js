const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // <-- import cors here
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoute');
const postRoutes = require('./routes/postRoute');
const commentRoutes = require('./routes/commentRoute');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // allow frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({alter:true})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
