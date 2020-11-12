const fs = require('fs');
const path = require('path');

// takes in req.query and filters through data to return new filtered array
function filterByQuery(query, zookeepers) {
    // results array is saved herein
    let filteredResults = zookeepers;
    if (query.name) {
        filteredResults = filteredResults.filter(zookeeper => zookeeper.name === query.name);
    }
    if (query.age) {
        // Since form data will be a string, and the JSON is storing age as a number, the query string must be converted to a number for the comparison to be performed
        filteredResults = filteredResults.filter((zookeeper) => zookeeper.age === Number(query.age));
    }
    if (query.favoriteAnimal) {
        filteredResults = filteredResults.filter(zookeeper => zookeeper.favoriteAnimal === query.favoriteAnimal);
    }
    return filteredResults;
}

// takes in the zookeeper array and returns a single zookeeper object
function findById(id, zookeepers) {
    const result = zookeepers.filter((zookeeper) => zookeeper.id === id)[0];
    return result;
}

// POST route functionality handler (taking data from req.body and adding to zookeepers.json file)
function createNewZookeeper(body, zookeepers) {
    //main code
    const zookeeper = body;
    zookeepers.push(zookeeper);
    // synchronous version of writeFile; does not require callback function (for a larger dataset, the ansynch version would be better)
    fs.writeFileSync(
        // joins '__dirname' value (representing directory within which file code is executed) to zookeepers.json filepath
        path.join(__dirname, '../data/zookeepers.json'),
        // Javascript data array is saved as json, so here it is converted; the other two arguments help keep the data formatted: 'null' indicates we do not want to edit existing data and '2' indicates we want to create white space between values for readability
        JSON.stringify({ zookeepers }, null, 2)
    );

    // return finished code to post route for response
    return zookeeper;
}

function validateZookeeper(zookeeper) {
    if (!zookeeper.name || typeof zookeeper.name !== 'string') {
        return false;
    }
    if (!zookeeper.age || typeof zookeeper.age !== 'number') {
        return false;
    }
    if (!zookeeper.favoriteAnimal || typeof zookeeper.favoriteAnimal !== 'string') {
        return false;
    }
    return true;
}

module.exports = {
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper
}