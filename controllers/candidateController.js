const Candidate = require('../models/candidate');
const CandidateAudit = require('../models/candidateAudit'); // Import CandidateAudit model
const { getUser } = require('../utils/auth');

// Function to create a new candidate
async function createCandidate(req, res) {
    try {
        const { firstName, lastName, dob, cnic, phoneNumber, province, city, region, address, party } = req.body;
        const token = req.cookies.uid;
        const User = getUser(token);
        const userId = User._id; // Accessing the _id field

        const newCandidate = new Candidate({
            FirstName: firstName,
            LastName: lastName,
            DOB: dob,
            CNIC: cnic,
            PhoneNumber: phoneNumber,
            Province: province,
            City: city,
            Region: region,
            Address: address,
            CreatedBy: userId,
            PartyId: party      
        });

        // Save the new candidate to the database
        await newCandidate.save();
        res.status(201).json(newCandidate);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Function to get all candidates with populated fields
const getAllCandidate = async () => {
    try {
        const candidates = await Candidate.find({})
            .populate('CreatedBy', 'UserName')
            .populate('PartyId', 'Name Sign'); // Adjust fields based on your model

        const formattedCandidates = candidates.map(candidate => {
            const age = new Date().getFullYear() - new Date(candidate.DOB).getFullYear();
            return {
                ...candidate.toObject(),
                PartyName: candidate.PartyId ? candidate.PartyId.Name : 'N/A',
                Age: age,
                Description: candidate.Description || 'N/A'
            };
        });

        return formattedCandidates;
    } catch (err) {
        throw new Error(err.message);
    }
};

// Function to get all candidates as JSON (for API response)
async function getAllCandidatesJSON(req, res) {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Function to update a candidate by ID
async function updateCandidate(req, res) {
    try {
        const { firstName, lastName, dob, cnic, phoneNumber, province, city, region, address, party } = req.body;
        const { id } = req.params;

        const existingCandidate = await Candidate.findById(id);

        const oldData = {
            FirstName: existingCandidate.FirstName,
            LastName: existingCandidate.LastName,
            DOB: existingCandidate.DOB,
            CNIC: existingCandidate.CNIC,
            PhoneNumber: existingCandidate.PhoneNumber,
            Province: existingCandidate.Province,
            City: existingCandidate.City,
            Region: existingCandidate.Region,
            Address: existingCandidate.Address,
            Party: existingCandidate.Party,
        };

        const updatedCandidate = {
            FirstName: firstName,
            LastName: lastName,
            DOB: dob,
            CNIC: cnic,
            PhoneNumber: phoneNumber,
            Province: province,
            City: city,
            Region: region,
            Address: address,
            Party: party,
        };

        const auditTrail = new CandidateAudit({
            candidateId: id,
            oldData: oldData,
            newData: updatedCandidate
        });

        await auditTrail.save();

        const updated = await Candidate.findByIdAndUpdate(id, updatedCandidate, { new: true });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Function to delete a candidate by ID
async function deleteCandidate(req, res) {
    try {
        const { id } = req.params;
        const deletedCandidate = await Candidate.findByIdAndDelete(id);
        res.json(deletedCandidate);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Function to get all candidate names
const getAllCandidateName = async () => {
    try {
        const candidates = await Candidate.find({});
        const formattedCandidates = candidates.map(candidate => ({
            id: candidate._id,
            formattedName: `${candidate.FirstName} ${candidate.LastName}`
        }));
        return formattedCandidates;
    } catch (err) {
        throw new Error(err.message);
    }
};

// Function to get total number of candidates
const getTotalNumberOfCandidate = async () => {
    try {
        const totalCandidate = await Candidate.countDocuments({});
        return totalCandidate;
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = {
    createCandidate,
    getAllCandidate,
    deleteCandidate,
    updateCandidate,
    getAllCandidatesJSON,
    getAllCandidateName,
    getTotalNumberOfCandidate
};
