// server.js - is necessary for running node server.js on heroku server for production mode.
const express = require('express');
const http = require('http');
const path = require('path');
let app = express();
// the __dirname is the current directory from where the script is running
// app.use(express.static(__dirname));

app.use(express.static(path.join(__dirname, 'build')));
const api_uri = process.env.API_URI || 'localhost:5000';
console.log("API_URI:", api_uri);
const port = process.env.PORT || '8080';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`app.js: Running on localhost:${port}`));

// I have to compile this with npm run-script build
// Then run: node app.js
// This launches in production mode
