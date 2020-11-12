// router
const router = require('express').Router();

// file imports
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

// the route by which the front-end can request data; the two inputs are required: 
// the 1st is a string (short for 'request') describing the route from which the client will fetch; 
// the 2nd is a callback function (short for 'response') that will execute every time there's a GET request
// note: using 'send' method from res parameter to send string/data to client
router.get('/animals', (req, res) => {
    let results = animals;
    // calling filterByQuery function in router.get callback:
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// note that a 'param' route must come after the other GET route; the specification of (unique) id should return only a single animal
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// creates a server route that listens for 'post' requests: accepts user input to be stored on the server
router.post('/animals', (req, res) => {
    // set new id to be one greater than the current highest index/id value (list order within array = index value: NOTE this method works only if datum are not removed from the array)
    req.body.id = animals.length.toString();

    // if an object is missing key data or is input incorrectly, send back 404 error
    if (!validateAnimal(req.body)) {
        // response method that relays message to client making request
        res.status(400).send('The animal data is not properly formatted.');
    } else {
        // add animal to json file and animals array
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

module.exports = router;
