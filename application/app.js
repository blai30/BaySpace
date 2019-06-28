// Import NodeJS core module
const http = require('http');
const express = require("express");
const app = express();
const router = express.Router();

const path = __dirname + '/app/';

const port = 3000;

app.use('/', router);

router.get('/', function(req, res) {
    res.sendFile(path + '/index.html');
});

router.get('/about', function(req, res) {
    res.sendFile(path + '/about/index.html');
});

router.get('/signin', function(req, res) {
    res.sendFile(path + '/signin/index.html');
});

router.get('/about/Anwar', function(req, res) {
    res.sendFile(path + '/about/Anwar/index.html');
});

router.get('/about/Anya', function(req, res) {
    res.sendFile(path + '/about/Anya/index.html');
});

router.get('/about/Brian', function(req, res) {
    res.sendFile(path + '/about/Brian/index.html');
});

router.get('/about/Habtom', function(req, res) {
    res.sendFile(path + '/about/Habtom/index.html');
});

router.get('/about/Jonathan', function(req, res) {
    res.sendFile(path + '/about/Jonathan/index.html');
});

router.get('/about/Justin', function(req, res) {
    res.sendFile(path + '/about/Justin/index.html');
});

router.get('/about/Sandeep', function(req, res) {
    res.sendFile(path + '/about/Sandeep/index.html');
});

router.get('/about/Tianchen', function(req, res) {
    res.sendFile(path + '/about/Tianchen/index.html');
});

app.listen(port, function() {
    console.log(`Server running on Port: ${port}/`);
});
