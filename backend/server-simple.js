'use strict';

console.log('1. Starting server...');

const express = require("express");
console.log('2. Express loaded');

const db = require('./models');
console.log('3. DB loaded');

const app = express();
console.log('4. App created');

app.use(express.json());
console.log('5. JSON middleware added');

app.get('/test', (req, res) => {
  res.json({ message: 'OK' });
});
console.log('6. Test route added');

const PORT = 5000;

db.sequelize.authenticate()
  .then(() => {
    console.log('7. DB connected');
    app.listen(PORT, () => {
      console.log(`8. Server running on http://localhost:${PORT}`);
      console.log('✅ ALL SYSTEMS GO!');
    });
  })
  .catch(err => {
    console.error('❌ DB error:', err);
  });

// Error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

console.log('9. Setup complete, waiting for DB...');
