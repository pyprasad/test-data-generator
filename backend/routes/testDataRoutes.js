const express = require('express');
const router = express.Router();
const { generateTestData, generateJsonFromSchema } = require('../controllers/testDataController');

router.post('/generate', generateTestData);
router.post('/generate-json', generateJsonFromSchema);

module.exports = router;
