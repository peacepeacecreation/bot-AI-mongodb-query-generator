require('dotenv').config();
const { OpenAI } = require('openai');

// Initialize the Together client with the API key
const client = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
});

/**
 * Sends a request to Together's chat completions endpoint
 *
 * @param {Object} params - Parameters for the request
 * @param {Array} params.messages - Array of message objects to send to the model
 * @param {Array} [params.tools] - Optional array of tools for the model
 * @param {string} params.model - The model to be used for the request
 * @returns {Promise<Object>} - Together's API response
 */
async function askTogether({ messages, tools = [], model }) {
  if (!messages || !Array.isArray(messages)) {
    throw new Error('messages must be an array');
  }

  const response = await client.completions.create({
    model,
    messages,
    tools,
    tool_choice: "auto", // Including tool_choice in the request
    //stream: true,
  });

  console.log('response', response)

  return response;
}

module.exports = { askTogether };
