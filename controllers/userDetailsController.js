const UserDetail = require('../models/userDetails');
const UserDetailsAudit = require('../models/userDetailsAudit');
const { getUser } = require('../utils/auth');

async function createUserDetail(req, res) {
    try {
        const { firstName, lastName, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Create a new user instance based on the User schema
        const newUser = new UserDetail({
            FirstName: firstName,
            LastName: lastName
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: 'User Detail Added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getUserDetails(req, res) {
    try {
        const token = req.cookies.uid;
        const User = getUser(token);
        const userId = User._id; // Accessing the _id field

        // Fetch user details based on the user ID
        const userDetailEntries = await UserDetail.find({ UserId: userId }).populate('UserId');
        
        if (!userDetailEntries || userDetailEntries.length === 0) {
            return res.status(404).json({ error: 'No user details found' });
        }

        return userDetailEntries; // Return or send the response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateUserDetails(req, res) {
    try {
        const {
            firstName,
            lastName,
            dob,
            cnic,
            phoneNumber,
            province,
            city,
            region,
            address,
        } = req.body;

        const { id } = req.params;
        const token = req.cookies.uid;
        const User = getUser(token);
        const userId = User._id;

        // Ensure user ID is correctly used
        const existingUserDetails = await UserDetail.findOne({ UserId: userId });
        
        if (!existingUserDetails) {
            return res.status(404).json({ error: 'User details not found' });
        }

        const updatedUserDetail = {
            FirstName: firstName,
            LastName: lastName,
            DOB: dob,
            CNIC: cnic,
            PhoneNumber: phoneNumber,
            Address: address,
            Province: province,
            City: city,
            Region: region,
        };

        const auditTrail = new UserDetailsAudit({
            userDetailsId: id,
            oldData: existingUserDetails,
            newData: updatedUserDetail
        });

        await auditTrail.save();

        const updated = await UserDetail.findOneAndUpdate(
            { UserId: userId }, // Search criteria based on UserId
            { $set: updatedUserDetail }, // Fields to update
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Failed to update user details' });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateUserDetailsToVerified = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID and update the isVerified status to true
        const updatedUser = await UserDetail.findByIdAndUpdate(id, { isVerified: true }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User verification updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createUserDetail,
    getUserDetails,
    updateUserDetails,
    updateUserDetailsToVerified,
};
