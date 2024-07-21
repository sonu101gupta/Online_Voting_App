const Election = require('../models/election');
const ElectionAudit = require('../models/electionAudit');
const { getUser } = require('../utils/auth');

async function createElection(req, res) {
    try {
        const { electionName, startDate, endDate, province, city, region, electionType, description } = req.body;
        const token = req.cookies.uid;

        const User = getUser(token);
        const userId = User._id; // Accessing the _id field

        const newElection = new Election({
            Name: electionName,
            StartDate: startDate,
            EndDate: endDate,
            Province: province,
            City: city,
            Region: region,
            CreatedBy: userId,
            ElectionType: electionType,
            Description: description
        });

        // Save the new election to the database
        await newElection.save();
        setTimeout(() => {
            res.redirect("/admin/election");
        }, 100);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getAllElection = async () => {
    try {
        const elections = await Election.find({}).populate('CreatedBy', 'UserName');
        return elections;
    } catch (err) {
        throw new Error(err.message);
    }
};

const getAllElectionName = async () => {
    try {
        const elections = await Election.find({}).populate('CreatedBy', 'UserName');

        const formattedElections = elections.map(election => ({
            id: election._id,
            formattedValue: `${election.Name},${election.ElectionType}`
        }));

        return formattedElections;
    } catch (err) {
        throw new Error(err.message);
    }
};

const getTotalNumberOfElections = async () => {
    try {
        const totalElections = await Election.countDocuments({});
        return totalElections;
    } catch (err) {
        throw new Error(err.message);
    }
};

async function getAllElec(req, res) {
    try {
        const elections = await Election.find();
        res.json(elections);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateElection(req, res) {
    try {
        const { electionName, startDate, endDate, province, city, region, electionType, description } = req.body;
        const { id } = req.params;

        const existingElection = await Election.findById(id);

        const oldData = {
            Name: existingElection.Name,
            StartDate: existingElection.StartDate,
            EndDate: existingElection.EndDate,
            Province: existingElection.Province,
            City: existingElection.City,
            Region: existingElection.Region,
            ElectionType: existingElection.ElectionType,
            Description: existingElection.Description
        };

        const updatedElection = {
            Name: electionName,
            StartDate: startDate,
            EndDate: endDate,
            Province: province,
            City: city,
            Region: region,
            ElectionType: electionType,
            Description: description
        };

        const auditTrail = new ElectionAudit({
            electionId: id,
            oldData: oldData,
            newData: updatedElection
        });

        await auditTrail.save();

        const updated = await Election.findByIdAndUpdate(id, updatedElection, { new: true });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteElection(req, res) {
    try {
        const { id } = req.params;
        const deletedElection = await Election.findByIdAndDelete(id);
        res.json(deletedElection);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createElection,
    getAllElection,
    updateElection,
    deleteElection,
    getAllElec,
    getAllElectionName,
    getTotalNumberOfElections,
};
