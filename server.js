// requiring the data from our server
const { animals } = require('./data/animals');

const express = require('express');
// setting an environment variable for Heroku to run the app (if set, and if not default to 80)
const PORT = process.env.PORT || 3001;
const app = express();

// setting filter functionality apart, takes in req.query and filters through the data returning a new filtered array; also ensures that query.personalityTraits is always an array before the '.forEach' method executes
console.log('filterByQuery')
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
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
                animal => animal.PersonalityTraits.indexOf(trait) !== -1
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
// 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

