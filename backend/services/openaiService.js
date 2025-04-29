const axios = require('axios');

const generateDataFromFields = async (fields, types, strategy) => {
  const prompt = `
  You are a test data generator.

  Given these fields: ${JSON.stringify(fields)}
  and types: ${JSON.stringify(types)}
  Generate ${strategy} test data. Create 10 sample rows.

  Return only JSON array.
  `;

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

  const message = response.data.choices[0].message.content;

  // Remove Markdown code block if present
  const cleaned = message.replace(/```json|```/g, '').trim();

  return JSON.parse(cleaned);
};

module.exports = { generateDataFromFields };
