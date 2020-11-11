// adding this middleware so that our app knows about the routes in animalRoutes.js
const router = require('express').Router();
// apiRoutes becomes central hub for all routing functions - as/if application evolves, this will become an effective mechanism for managing routing code and keeping it modularized.
const animalRoutes = require('./animalRoutes');
router.use(animalRoutes);

// note: the two lines above may be condensed into one line as follows:
router.use(require('./zookeeperRoutes'));

module.exports = router;