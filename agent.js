const tools = require('./tools');
const { getTrades } = require('./mongo');
const { ask, extractToolCall, extractAiMessage } = require('./aiClient');

/**
 * Main agent function that handles user input and processes OpenAI's response
 *
 * @param {string} userInput - User prompt (question or instruction)
 */
async function runAgent(userInput) {
  // Initial system and user messages
  const messages = [
    {
      role: 'system',
      content: 'You are a trading assistant. You work with trades and risk rules.',
    },
    {
      role: 'user',
      content: userInput,
    }
  ];

  console.log(tools[0].function.parameters)
  // First GPT call
  const response = await ask({ messages, tools });

  console.log('response', response)

  // Try to extract tool call from GPT response
  const toolCall = extractToolCall(response);

  if (!toolCall) {
    // No tool call – return plain GPT response
    const message = extractAiMessage(response);
    console.log('🧠 GPT:', message);
    return;
  }

  // Parse tool call arguments
  const { name, arguments: argsRaw } = toolCall.function;
  const args = JSON.parse(argsRaw);

  if (name === 'get_trades') {
    // Call backend and update conversation with tool result
    const trades = await getTrades(args);

    messages.push({
      role: 'assistant',
      tool_calls: [toolCall],
    });

    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      name: name,
      content: JSON.stringify(trades),
    });

    // Follow-up GPT call with new context
    const followUp = await ask({ messages, tools });
    const followTool = extractToolCall(followUp);

    if (followTool?.function?.name === 'create_risk_rule') {
      const rule = JSON.parse(followTool.function.arguments);
      console.log('🔧 GPT wants to create a risk rule:', rule);
    } else {
      const message = extractAiMessage(followUp);
      console.log('📊 GPT analysis:', message);
    }
  }
}

module.exports = { runAgent }
