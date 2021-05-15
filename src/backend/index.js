const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');
const routes = require('./routes/routes.js');

// Pattern for routes
// First point of contact at index.js => route categories endpoints in routes.js => controller.js calls the actual Hacker News API

// Had to use CORS because I used create-react-app and it runs on a different IP than this Node server
app.use(cors());
app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`API at http://localhost:${port}`)
})