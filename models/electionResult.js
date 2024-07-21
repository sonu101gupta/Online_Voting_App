const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const electionResultSchema = new Schema(
  {
    ElectionId: {
      type: Schema.Types.ObjectId,
      ref: "Election", // Reference to the Election model
      required: true,
    },
    CandidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate", // Reference to the Candidate model
      required: true,
    },
    Votes: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("ElectionResult", electionResultSchema);
