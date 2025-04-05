
module.exports = [
  {
    type: "function",
    function: {
      name: "get_trades",
      description: "Отримати трейди з фільтрами",
      parameters: {
        type: "object",
        properties: {
          profit: {
            type: "object",
            properties: {
              lt: { type: "number" },
              gt: { type: "number" }
            }
          },
          date: {
            type: "object",
            properties: {
              gte: { type: "string", format: "date" },
              lte: { type: "string", format: "date" }
            }
          }
        }
      }
    },
  {
    type: "function",
    function: {
      name: "create_risk_rule",
      description: "Створити правило ризику",
      parameters: {
        type: "object",
        properties: {
          condition: { type: "string" },
          action: { type: "string" }
        },
        required: ["condition", "action"]
      }
    }
  }
]
