const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const authorization = require('../utils/authorizationMiddleware');
const electionResult = require('../models/electionResult');
const electionResultsss= require('../controllers/electionResultController');

router.get('/get', electionController.getAllElec);

router.get('/get',electionResultsss.getElectionResults);
router.post('/register', electionController.createElection);
router.put('/edit/:id', electionController.updateElection);
router.delete('/delete/:id', electionController.deleteElection);

module.exports = router;


// Add the route for the electionresult ass well 