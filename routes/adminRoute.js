const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const electionController = require("../controllers/electionController");
const partyController = require("../controllers/partyController");
const candidateController = require("../controllers/candidateController");
const electionCandidateController = require("../controllers/electionCandidateController");
const castVoteController = require("../controllers/castVoteController");
const userDetailsController = require("../controllers/userDetailsController");

router.get("/dashboard", async (req, res) => {
  try {
    const elections = await electionController.getAllElectionName();
    const telections = await electionController.getTotalNumberOfElections();
    const tCandidates = await candidateController.getTotalNumberOfCandidate();
    const tUser = await userController.getTotalNumberOfUser();

    res.render("adminNavbar", {
      page: "adminDashboard",
      elections,
      telections,
      tCandidates,
      tUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/candidate", async (req, res) => {
  try {
    const candidates = await candidateController.getAllCandidate();
    const parties = await partyController.getAllPartiesName();
    res.render("adminNavbar", {
      page: "adminCandidate",
      candidates,
      parties,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/voters", async (req, res) => {
  try {
    const votes = await castVoteController.getAllCastVote(req);
    res.render("adminNavbar", {
      page: "adminVoter",
      votes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/election", async (req, res) => {
  try {
    const elections = await electionController.getAllElection();
    res.render("adminNavbar", { page: "adminElection", elections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/party", async (req, res) => {
  try {
    const parties = await partyController.getAllParties();
    res.render("adminNavbar", { page: "adminParty", parties });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/electionresult", async (req, res) => {
  try {
    const elections = await electionController.getAllElection();
    res.render("adminNavbar", { page: "adminElection", elections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/electionCandidate", async (req, res) => {
  try {
    const elections = await electionController.getAllElectionName();
    const candidates = await candidateController.getAllCandidateName();
    const electionCandidates =
      await electionCandidateController.getAllElectionCandidates();
    res.render("adminNavbar", {
      page: "adminElectionCandidate",
      elections,
      candidates,
      electionCandidates,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/verification", async (req, res) => {
  try {
    const users = await userController.getUserDataWithDetails();
    const tUsers =
      await userController.getCountOfUnverifiedUsersWithRoleIdOne();
    res.render("adminNavbar", {
      page: "adminVerification",
      users,
      tUsers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/account", async (req, res) => {
  try {
    const details = await userDetailsController.getUserDetails(req);
    res.render("adminNavbar", { page: "adminAccount", details: [details] }); // Ensure details is an array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
