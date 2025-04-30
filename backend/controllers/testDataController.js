const { generateDataFromFields, callOpenAI } = require('../services/openaiService');

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

const generateJsonFromSchema = async (req, res) => {
    try {
        const { prompt } = req.body;
        const raw = await callOpenAI(prompt);
        // Remove markdown code block if present
        const cleaned = raw.replace(/```json|```/g, '').trim();
        try {
            const data = JSON.parse(cleaned);
            res.json({ data });
        } catch (parseErr) {
            console.error('Failed to parse OpenAI response as JSON:', cleaned);
            res.json({ data: cleaned }); // Still return the string so the UI can show it
        }
    } catch (err) {
        console.error("JSON Schema gen failed:", err);
        res.status(500).json({ error: "Failed to generate from schema" });
    }
};

module.exports = { generateTestData, generateJsonFromSchema };
