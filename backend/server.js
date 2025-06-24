const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoute');
const postRoutes = require('./routes/postRoute');
const commentRoutes = require('./routes/commentRoute');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://13.202.22.78', 
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
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
