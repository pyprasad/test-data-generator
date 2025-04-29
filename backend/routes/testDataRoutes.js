const express = require('express');
const router = express.Router();
const { generateTestData } = require('../controllers/testDataController');

router.post('/generate', generateTestData);

module.exports = router;
