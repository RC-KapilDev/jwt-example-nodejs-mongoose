const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateJWT = (user) => {
    const payload = {
        user: {
            id: user.id,
        },
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Signup controller function
exports.signup = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            password,
            email
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const token = generateJWT(user);

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login controller function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log('req', req);

    try {
        let user = await User.findOne({ email });

        console.log('user', user);

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        console.log('isMatch', isMatch);

        if (!isMatch) {
            console.log('pwd', !isMatch);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = generateJWT(user);
        console.log('token', token);

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
