const express = require('express');
const router = express.Router();
const { createCollege, getCollegeById } = require('../controllers/collegeController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createCollege);
router.get('/:id', getCollegeById);

module.exports = router;
