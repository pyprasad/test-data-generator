const { generateDataFromFields } = require('../services/openaiService');

const generateTestData = async (req, res) => {
  try {
    const { fields, types, constraints, strategy } = req.body;
    const data = await generateDataFromFields(fields, types, constraints, strategy);
    if (!data || data.length === 0) {
      return res.status(500).json({ error: 'No data generated' });
    }
    res.json({ data });
  } catch (error) {
    console.error('Error in generateTestData:', error);
    if (error.response) {
      // OpenAI API error
      console.error('OpenAI API response:', error.response.data);
      res.status(500).json({ error: 'OpenAI API error', details: error.response.data });
    } else {
      res.status(500).json({ error: 'Failed to generate test data', details: error.message });
    }
  }
};

module.exports = { generateTestData };
