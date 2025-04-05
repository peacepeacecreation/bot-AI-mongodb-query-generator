
const { OpenAI } = require('openai')
const tools = require('./tools')
const { getTrades } = require('./mongo')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function runAgent(userInput) {
  const messages = [
    {
      role: 'system',
      content: 'Ти — трейдинг-асистент. Працюєш з трейдами та ризик-правилами.',
    },
    {
      role: 'user',
      content: userInput,
    }
  ]

  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages,
    tools,
    tool_choice: "auto"
  })

  const toolCall = response.choices[0].message.tool_calls?.[0]

  if (!toolCall) {
    console.log('GPT:', response.choices[0].message.content)
    return
  }

  const { name, arguments: argsRaw } = toolCall.function
  const args = JSON.parse(argsRaw)

  if (name === 'get_trades') {
    const trades = await getTrades(args)

    // Тепер запит GPT ще раз із трейдами
    messages.push({
      role: 'assistant',
      tool_calls: [toolCall],
    })

    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      name: name,
      content: JSON.stringify(trades),
    })

    const followUp = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages,
      tools,
      tool_choice: "auto"
    })

    const followTool = followUp.choices[0].message.tool_calls?.[0]

    if (followTool && followTool.function.name === "create_risk_rule") {
      const rule = JSON.parse(followTool.function.arguments)
      console.log('🔧 GPT хоче створити правило ризику:', rule)
    } else {
      console.log('📊 GPT-аналітика:', followUp.choices[0].message.content)
    }
  }
}

module.exports = { runAgent }
