
class ToolGenerator {
  constructor() {
    this.tools = [];
  }

  createFunctionTool(name, description, params = {}) {
    const tool = {
      type: 'function',
      function: {
        name,
        description,
        parameters: this.generateParameters(params),
      }
    };

    this.tools.push(tool);
    return tool;
  }

  generateParameters(params) {
    const parameters = {
      type: 'object',
      properties: {},
    };

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        parameters.properties[key] = {
          type: typeof params[key] === 'object' ? 'object' : typeof params[key],
          ...params[key],
        };
      }
    }

    return parameters;
  }

  getTools() {
    return this.tools;
  }
}

module.exports = ToolGenerator;
