const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const electionController = require("../controllers/electionController");
const castVoteController = require("../controllers/castVoteController");
const userDetailsController = require("../controllers/userDetailsController");
const electionResultController = require("../controllers/electionResultController"); // Import the election result controller

// Route to create a new candidate
router.post("/candidates", candidateController.createCandidate);

// Route to get all candidates in JSON format
router.get("/candidates", candidateController.getAllCandidatesJSON);

// Route to get all candidates with populated fields (e.g., for display purposes)
router.get("/candidates/all", async (req, res) => {
  try {
    const candidates = await candidateController.getAllCandidate();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update a candidate by ID
router.put("/candidates/:id", candidateController.updateCandidate);

// Route to delete a candidate by ID
router.delete("/candidates/:id", candidateController.deleteCandidate);

// Route to get all candidate names
router.get("/candidates/names", async (req, res) => {
  try {
    const names = await candidateController.getAllCandidateName();
    res.json(names);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get the total number of candidates
router.get("/candidates/total", async (req, res) => {
  try {
    const total = await candidateController.getTotalNumberOfCandidate();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get user dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const votes = await castVoteController.getMyCastVote(req);
    res.render("userNavbar", { page: "userDashboard", votes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get cast vote page
router.get("/castVote", async (req, res) => {
  try {
    const elections = await electionController.getAllElectionName();
    const candidates = await candidateController.getAllCandidateName();
    res.render("userNavbar", {
      page: "userCastVote",
      elections,
      candidates,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get user account details
router.get("/account", async (req, res) => {
  try {
    const details = await userDetailsController.getUserDetails(req);
    res.render("userNavbar", { page: "userAccount", details });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get election details
router.get("/electionDetails", async (req, res) => {
  try {
    const electionDetails = await electionController.getAllElection();
    res.render("userNavbar", { page: "userElectionDetails", electionDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get candidate details
router.get("/candidateDetails", async (req, res) => {
  try {
    const candidates = await candidateController.getAllCandidate();
    res.render("userNavbar", { page: "userCandidateDetails", candidates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get election results
router.get("/user/electionResult", async (req, res) => {
  try {
    const results = await electionResultController.getElectionResults();
    res.render("electionResults", { results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
