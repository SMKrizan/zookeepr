// router
const router = require('express').Router();

// node dependencies
const path = require('path');

// adding a route to handle the index.html to be the homepage, as indicated by the convention: '/'
router.get('/', (req, res) => {
    // this GET has one job: to respond with html file to display in browser; the use of path module will ensure that correct html location is found regardless of server environment
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// adding route to handle transfer of an html page, as indicated by the convention: '/someString'
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// router.get -> a method on "router" which is likely a variable containing Express, a router that controls requests
// ('/api/zookeepers', <-- the URL route to match
// (req, res) => { ....} <-- the function to execute when that route recieves the matching request 
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
  });

  module.exports = router;