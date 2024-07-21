const ElectionResult = require("../models/electionResult");

// Function to get all election results
async function getElectionResults(req, res) {
  try {
    const results = await ElectionResult.find({})
      .populate("ElectionId", "Name") // Populate with election names
      .populate("CandidateId", "FirstName LastName"); // Populate with candidate names

    // Format the results to include readable names and votes
    const formattedResults = results.map(result => ({
      electionName: result.ElectionId ? result.ElectionId.Name : "Unknown Election",
      candidateName: result.CandidateId
        ? `${result.CandidateId.FirstName} ${result.CandidateId.LastName}`
        : "Unknown Candidate",
      votes: result.Votes || 0
    }));

    res.render('admin/electionResults', { electionResults: formattedResults }); // Render the EJS view with data
  } catch (err) {
    console.error("Error fetching election results:", err.message);
    res.status(500).send("Failed to fetch election results. Please try again later.");
  }
}

module.exports = {
  getElectionResults,
};
