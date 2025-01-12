const College = require('../models/College');

exports.createCollege = async (req, res) => {
    const { name, location, description } = req.body;

    try {
        const newCollege = new College({
            name,
            location,
            description,
        });

        const college = await newCollege.save();
        res.json(college);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getCollegeById = async (req, res) => {
    try {
        const college = await College.findById(req.params.id);
        if (!college) {
            return res.status(404).json({ msg: 'College not found' });
        }
        res.json(college);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'College not found' });
        }
        res.status(500).send('Server error');
    }
};
