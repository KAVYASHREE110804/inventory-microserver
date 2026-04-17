require('dotenv').config();
const app = require('./config/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[Server] Inventory Alert Microservice running on port ${PORT} [${process.env.NODE_ENV}]`);
});
