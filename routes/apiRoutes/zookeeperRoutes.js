// router
const router = require('express').Router();

// file imports
const { filterByQuery, findById, createNewZookeeper, validateZookeeper } = require('../../lib/zookeepers');
const { zookeepers } = require('../../data/zookeepers');

// the route by which the front-end can request data; two inputs are required: 
// 1st: short for 'request', this is a string describing the route from which the client will fetch; 
// 2nd: short for 'response', this is a callback function that will execute every time there's a GET request
// note: using 'send' method from res parameter to send string/data to client
router.get('/zookeepers', (req, res) => {
    let results = zookeepers;
    // calling filterByQuery function in router.get callback:
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// note that a 'param' route must come after the other GET route; the specification of (unique) id should return only a single animal
router.get('/zookeepers/:id', (req, res) => {
    const result = findById(req.params.id, zookeepers);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// creates a server route that listens for 'post' requests: accepts user input to be stored on the server
router.post('/zookeepers', (req, res) => {
    // set new id to be one greater than the current highest index/id value (list order within array = index value: NOTE this method works only if data are not removed from the array)
    req.body.id = zookeepers.length.toString();

    // if an object is missing key data or is input incorrectly, send back 404 error
    if(validateZookeeper(req.body)) {
        // response method that relays message to client making request
        res.status(400).send('Your entry is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const zookeeper = createNewZookeeper(req.body, zookeepers);
        res.json(zookeeper);
    }
});

module.exports = router;
