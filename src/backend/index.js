const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');
const routes = require('./routes/routes.js');

app.use(cors());
app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`API at http://localhost:${port}`)
})