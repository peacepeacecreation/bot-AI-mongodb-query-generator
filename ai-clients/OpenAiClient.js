require('dotenv').config();
const { OpenAI } = require('openai');

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1', // OpenAI API base URL
});

/**
 * Sends a request to OpenAI's chat completions endpoint
 *
 * @param {Object} params - Parameters for the request
 * @param {Array} params.messages - Array of message objects to send to the model
 * @param {Array} [params.tools] - Optional array of tools for the model
 * @param {string} params.model - The model to be used for the request
 * @returns {Promise<Object>} - OpenAI's API response
 */
async function askOpenAI({ messages, tools = [], model }) {
  if (!messages || !Array.isArray(messages)) {
    throw new Error('messages must be an array');
  }

  const response = await openai.chat.completions.create({
    model,
    messages,
    tools,
  });

  return response;
}

module.exports = { askOpenAI }
