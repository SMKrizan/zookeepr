// connecting to routing hub
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes'); 
// npm packages at the top of the file: keep in mind 'require' for importing data or functionality only reads and creates a copy of the data to use -- manipulation of the data supplied will not impact content of the file from which the data came
// facilitates GET / POST functionality
const express = require('express');
// setting an environment variable for Heroku to run the app (if set, and if not default to 80)
const PORT = process.env.PORT || 3001;
// instantiates the server
const app = express();
// // requiring the data from our server
// const { animals } = require('./data/animals');
// // facilitates copy / read / write functionality
// const fs = require('fs');
// // facilitates ease of working with file/directory paths (particularly helpful when working in production environments such as Heroku)
// const path = require('path');

// the POST request will pass through both 'app.use' 'middlewear' functions before getting to intended endpoint;both need to be set up every time you create a server looking to accept POST data in the form of JSON.
// first one converts incoming POST data to key/value pairs; 'extended: true' tells server there may be nested data, so it needs to look deep in order to parse correctly.
app.use(express.urlencoded({ extended: true }));
// ...second one parses incoming JSON data into req.body object
app.use(express.json());

// tells server to use apiRouting hub if client navigates to <host>/api
app.use('/api', apiRoutes);
// tells server to provide HTML routes if "/"" is endpoint 
app.use('/', htmlRoutes);

// instructs server to make specific files 'static resources', e.g. readily available (rather than gated behind server endpoint).   
app.use(express.static('public'));  

// tells the server to listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});