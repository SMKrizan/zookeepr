// npm packages at the top of the file: keep in mind 'require' for importing data or functionality only reads and creates a copy of the data to use -- manipulation of the data supplied will not impact content of the file from which the data came
// facilitates GET / POST functionality
const express = require('express');
// facilitates copy / read / write functionality
const fs = require('fs');
// facilitates ease of working with file/directory paths (particularly helpful when working in production environments such as Heroku)
const path = require('path');
// setting an environment variable for Heroku to run the app (if set, and if not default to 80)
const PORT = process.env.PORT || 3001;
// instantiates the server
const app = express();
// requiring the data from our server
const { animals } = require('./data/animals');

// setting filter functionality apart, takes in req.query and filters through the data returning a new filtered array; also ensures that query.personalityTraits is always an array before the '.forEach' method executes
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray;
    // filtered results of animalsArray are saved here:
    let filteredResults = animalsArray;
    // handles situation of request for multiple or single personality traits
    if (query.personalityTraits) {
        // save personality traits as a dedicated array
        // if personalityTraits is a string, place and save within new array
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
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

// separate function to handle POST route functionality (taking data from req.body and adding to animals.json file)
function createNewAnimal(body, animalsArray) {
    // main code
    const animal = body;
    animalsArray.push(animal);
    // synchronous version of writeFile and does not require callback function (for a larger dataset, the ansynch version would be better)
    fs.writeFileSync(
        // joins value of '_dirname' (representing directory within which file code is executed) with path to the animals.json file
        path.join(__dirname, './data/animals.json'),
        // Javascript data array needs to be saved as json, so here it is converted; the other two arguments help keep the data formatted: 'null' indicates we do not want to edit existing data and '2' indicates we want to creates white space between values for readability
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    
    // return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
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

// the POST request will pass through both 'app.use' 'middlewear' functions before getting to intended endpoint;both need to be set up every time you create a server looking to accept POST data in the form of JSON.
// first one converts incoming POST data to key/value pairs; 'extended: true' tells server there may be nested data, so it needs to look deep in order to parse correctly.
app.use(express.urlencoded({ extended: true }));
// ...second one parses incoming JSON data into req.body object
app.use(express.json());

// creates a server route that listens for 'post' requests: accepts user input to be stored on the server
app.post('/api/animals', (req, res) => {
    // set new id to be one greater than the current highest index/id value (list order within array = index value: NOTE this method works only if datum are not removed from the array)
    req.body.id = animals.length.toString();

    // if an object is missing key data or is input incorrectly, send back 404 error
    if (!validateAnimal(req.body)) {
        // response method that relays message to client making request
        res.status(400).send('The animal data is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

// telling the server to listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});