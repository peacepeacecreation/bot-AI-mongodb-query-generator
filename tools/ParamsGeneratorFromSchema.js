const ToolGenerator = require('./ToolGenerator');

/**
 * Generates query parameters from a Mongoose schema.
 * This function analyzes the schema's paths and constructs an object
 * representing potential query operators for each field, based on its type.
 *
 * @param {mongoose.Schema} schema - The Mongoose schema to analyze.
 * @returns {Object} An object mapping each field to its applicable query operators.
 */
function generateQueryParamsFromSchema(schema) {
  const fields = schema.paths;
  const queryParams = {};

  // Iterate over each field in the schema
  for (const key in fields) {
    // Skip internal fields commonly added by Mongoose
    if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) continue;

    const field = fields[key];
    // Determine the field's data type
    const instance = field.instance || (field.options?.type?.name ?? 'String');

    const operators = {};

    // Assign appropriate query operators based on the field's data type
    switch (instance) {
      case 'Number':
        Object.assign(operators, {
          gt: { type: 'number' },  // Greater than
          lt: { type: 'number' },  // Less than
          eq: { type: 'number' },  // Equal to
        });
        break;
      case 'String':
        Object.assign(operators, {
          eq: { type: 'string' },   // Equal to
          regex: { type: 'string' },// Matches a regular expression
          in: { type: 'array', items: { type: 'string' } }, // Included in an array of values
        });
        break;
      case 'Date':
        Object.assign(operators, {
          gte: { type: 'string', format: 'date-time' }, // Greater than or equal to
          lte: { type: 'string', format: 'date-time' }, // Less than or equal to
        });
        break;
      case 'Boolean':
        Object.assign(operators, {
          eq: { type: 'boolean' }, // Equal to
        });
        break;
      case 'ObjectID':
        Object.assign(operators, {
          eq: { type: 'string' }, // Equal to (expects a string representation of ObjectID)
        });
        break;
      case 'Array':
        Object.assign(operators, {
          in: { type: 'array', items: { type: 'string' } }, // Array contains any of these values
        });
        break;
    }

    // If operators were assigned, add them to the queryParams object
    if (Object.keys(operators).length > 0) {
      queryParams[key] = operators;
    }
  }

  return queryParams;
}

/**
 * Creates a tool definition from a Mongoose schema using the ToolGenerator.
 * This function utilizes the schema to generate query parameters and then
 * defines a tool with the provided name and description.
 *
 * @param {mongoose.Schema} schema - The Mongoose schema to generate the tool from.
 * @param {string} name - The name of the tool.
 * @param {string} description - A brief description of the tool's purpose.
 * @returns {Object} The generated tool definition.
 */
function createToolFromMongooseSchema(schema, name, description) {
  const toolGen = new ToolGenerator();
  const queryParams = generateQueryParamsFromSchema(schema);
  return toolGen.createFunctionTool(name, description, queryParams);
}

module.exports = {
  generateQueryParamsFromSchema,
  createToolFromMongooseSchema,
};
