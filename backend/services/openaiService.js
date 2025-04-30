const axios = require('axios');

const generateDataFromFields = async (fields, types, constraints, strategy) => {
    let fieldDescriptions = fields.map((name, index) => {
        let type = types[index];
        let constraint = constraints[index];
        let details = constraint && Object.keys(constraint).length > 0
            ? `, Constraints: ${JSON.stringify(constraint)}`
            : "";

        return `Field: ${name}, Type: ${type}${details}`;
    }).join("\n");

    const prompt = `
You are a test data generator.

Generate ${strategy} test data for the following fields:
${fieldDescriptions}

If a field includes the constraint "specialChars", ensure every value contains at least one of those characters.

Create exactly 2 unique JSON rows (no duplicates). Return a JSON array with only those 2 rows, and nothing else. Do not include markdown, code blocks, or explanations.
`;

    console.log("Prompt sent to OpenAI:", prompt);
    // Call OpenAI API
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    const message = response.data.choices[0].message.content;

    // Remove Markdown code block if present
    const cleaned = message.replace(/```json|```/g, '').trim();
    let parsed = JSON.parse(cleaned);
    // Ensure only 2 rows and no duplicates
    if (Array.isArray(parsed)) {
        // Remove duplicates by stringifying each row
        const unique = Array.from(new Set(parsed.map(row => JSON.stringify(row)))).map(str => JSON.parse(str));
        parsed = unique.slice(0, 2);
    }
    return parsed;
};

const callOpenAI = async (prompt) => {
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data.choices[0].message.content;
};

module.exports = { generateDataFromFields, callOpenAI };
