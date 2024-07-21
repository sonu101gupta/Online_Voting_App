const express = require('express');
const router = express.Router();
const electionResultController = require('../controllers/electionResultController');

// Route to get all election results
router.get('/', electionResultController.getElectionResults);

module.exports = router;
