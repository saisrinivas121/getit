const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/passwordsDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const passwordSchema = new mongoose.Schema({
  password: String,
});

const Password = mongoose.model('Password', passwordSchema);

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post('/save-password', async (req, res) => {
  const { password } = req.body;

  try {
    const newPasswordDocument = {
      password: password,
    };

    const insertResult = await Password.create(newPasswordDocument);
    console.log('Inserted password with id:', insertResult._id);

    res.status(201).json({ id: insertResult._id, password: password });
  } catch (error) {
    console.error('Error saving password to database:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add the following line to serve your client-side code (replace 'public' with your actual directory)
app.use(express.static('public'));
