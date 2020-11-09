// npm package at the top of the file
const express = require('express');
// setting an environment variable for Heroku to run the app (if set, and if not default to 80)
const PORT = process.env.PORT || 3001;
// instantiates the server
const app = express();
// requiring the data from our server
const { animals } = require('./data/animals');

// setting filter functionality apart, takes in req.query and filters through the data returning a new filtered array; also ensures that query.personalityTraits is always an array before the '.forEach' method executes
function filterByQuery(query, animalsArray) {
    console.log('filterByQuery')
    let personalityTraitsArray;
    // filtered results of animalsArray are saved here:
    let filteredResults = animalsArray;
    // handles situation of request for multiple or single personality traits
    if (query.personalityTraits) {
        // save personality traits as a dedicated array
        // if personalityTraits is a string, place and save within new array
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
            console.log('personalityTraitsArray1: ', personalityTraitsArray)
        } else {
            personalityTraitsArray = query.personalityTraits;
            console.log('personalityTraitsArray2: ', personalityTraitsArray)
        }
        // loop through each trait of the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
        // Check trait against each animal in filteredResults array. Recall: it is initially a copy of animalsArray, but we're updating it for each trait in the loop; for each trait targeted by the filter, the filteredResults array will then contain only the entries including that trait: at the end pf the forEach() loop we'll have an array of animals each of which have every one of the traits requested.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // returns the filtered results:
    return filteredResults;
}

// takes in the array of animals and id and returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// the route by which the front-end can request data; the two inputs are required: 
// the 1st is a string (short for 'request') describing the route from which the client will fetch; 
// the 2nd is a callback function (short for 'response') that will execute every time there's a GET request
// note: using 'send' method from res parameter to send string/data to client
app.get('/api/animals', (req, res) => {
    let results = animals;
    // calling filterByQuery function in app.get callback:
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// note that a 'param' route must come after the other GET route; the specification of (unique) id should return only a single animal
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// creates a server route that listens for 'post' requests: accepts user input to be stored on the server
app.post('/api/animals', (req, res) => {
    // 'req.body' is where the incoming, packaged content will be
    console.log('req.body:', req.body);
    // sending the data back to the client
    res.json(req.body);
});

// parse incoming string or array of data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// telling the server to listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});