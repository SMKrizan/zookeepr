// node dependencies
const fs = require('fs');
const path = require('path');

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
        path.join(__dirname, '../data/animals.json'),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
}
