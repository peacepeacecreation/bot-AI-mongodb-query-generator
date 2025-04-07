
const { askOpenAI } = require('./ai-clients/OpenAiClient')
const { askTogether } = require('./ai-clients/TogetherClient')

// Models AI
const TOGETHER_AI_MODEL = 'meta-llama/Llama-4-Scout-17B-16E-Instruct';
const OPEN_AI_MODEL = 'gpt-4o-Mini'; //gpt-4 // 'gpt-4-1106-preview'

//'meta-llama/Llama-3-8b-chat-hf' - not support tools

// Default Model
const defaultModel = TOGETHER_AI_MODEL;

/**
 * Adapter function to choose between OpenAI and Together based on the model
 *
 * @param {Object} params - Parameters for the request
 * @param {string} params.model - The model to be used for the request
 * @param {Array} params.messages - Array of message objects to send to the model
 * @param {Array} [params.tools] - Optional array of tools for the model
 * @returns {Promise<Object>} - Response from the selected API
 */
async function ask({ messages, tools = [] }) {
  const model = defaultModel;
  // Determine if the model is for OpenAI (e.g., models with 'gpt' in the name)
  const isOpenAiModel = model.includes('gpt') || model.includes('GPT');

  console.log(model);

  if (isOpenAiModel) {
    // Use OpenAI API for GPT models
    return await askOpenAI({ messages, tools, model });
  } else {
    // Use Together API for other models (e.g., Llama models)
    return await askTogether({ messages, tools, model });
  }
}
/**
 * Extracts the first tool call from a chat completion response
 *
 * @param {Object} response - OpenAI response object
 * @returns {Object|null} - Tool call or null if not found
 */
function extractToolCall(response) {
  const message = response?.choices?.[0]?.message;
  console.log('tools', message?.tool_calls?.[0])
  return message?.tool_calls?.[0] || null
}

/**
 * Extracts plain AI message content from a chat completion response
 *
 * @param {Object} response - OpenAI response object
 * @returns {string|null} - Content or null if not found
 */
function extractAiMessage(response) {
  return response?.choices?.[0]?.message?.content || null
}

module.exports = {
  ask,
  extractToolCall,
  extractAiMessage,
}
