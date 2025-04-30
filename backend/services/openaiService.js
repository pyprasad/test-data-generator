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

Create 10 realistic JSON rows. Return JSON only.
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

    return JSON.parse(cleaned);
};

module.exports = { generateDataFromFields };
