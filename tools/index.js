
const ToolGenerator = require('./ToolGenerator');

const toolGen = new ToolGenerator();

module.exports = [
    toolGen.createFunctionTool(
        'get_trades',
        'Отримати трейди з фільтрами',
        {
            profit: {
                lt: { type: 'number' },
                gt: { type: 'number' }
            },
            date: {
                gte: { type: 'string', format: 'date' },
                lte: { type: 'string', format: 'date' }
            },
            status: { type: 'string' }
        }
    ),
    toolGen.createFunctionTool(
        'create_risk_rule',
        'Створити правило ризику',
        {
            condition: { type: 'string' },
            action: { type: 'string' },
            threshold: { type: 'number' },
            time_period: { type: 'string' }
        }
    ),
];
