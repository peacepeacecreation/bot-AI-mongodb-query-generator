const ToolGenerator = require('./ToolGenerator');
const { generateQueryParamsFromSchema } = require('./ParamsGeneratorFromSchema');
// Import Mongoose schema
const tradeSchema = require('./schemas/trades');


const toolGen = new ToolGenerator();
// Create a params definition for trades
const tradeParams = generateQueryParamsFromSchema(tradeSchema);

module.exports = [
    toolGen.createFunctionTool(
        'get_trades',
        'Retrieve trades with filters',
        tradeParams,
    ),
    toolGen.createFunctionTool(
        'create_risk_rule',
        'Create risk rule',
        {
            condition: { type: 'string' },
            action: { type: 'string' },
            threshold: { type: 'number' },
            time_period: { type: 'string' }
        }
    ),
];

