![AI-schema](https://github.com/user-attachments/assets/6932bcea-a2c6-480b-a2c5-cefabcd54a93)

# Trading Assistant AI

This project implements a trading assistant powered by AI. It accepts user input, generates a query using AI, retrieves data from a database, and returns the relevant information back to the user. The workflow is designed for handling trading data and applying risk management rules.

## Overview

1. **User Input**: The user provides a text prompt (e.g., "Show me all losing trades for March").
2. **AI Processing**: The prompt is passed to an AI model (OpenAI or Together AI). The AI processes the request and generates a query based on predefined tools and schemas.
3. **Database Query**: The AI response may include parameters that form a database query, which is then sent to a MongoDB database.
4. **Data Retrieval**: The database returns the relevant data, which is passed back to the AI for further analysis.
5. **Final Response**: The AI performs any additional analysis and sends the final response to the user.

## Project Structure

The project is composed of the following core components:

### 1. **AI Client (aiClient.js)**

The AI client sends user input to OpenAI or Together AI, receives their responses, and processes function calls (tool calls) based on the AI's instructions.

### 2. **Agent (agent.js)**

The agent handles the entire workflow, including the interaction with the AI and database. It processes the user’s request, extracts tool calls from the AI's response, queries the database, and passes data back to the AI for analysis.

### 3. **Tools (tools.js)**

Tools define the various functions (like fetching trades or creating risk rules) that the AI can use. These functions are described with schemas that the AI can understand and use to generate queries.

### 4. **Database Integration (mongo.js)**

The database integration allows the system to interact with a MongoDB database to retrieve trade data or perform other operations (e.g., count trades, create risk rules).

## Setup

### Requirements

- Node.js
- MongoDB
- API Keys for Together AI and OpenAI (if used)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and set the following environment variables:
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   TOGETHER_API_KEY=your_together_api_key
   MONGO_URI=your_mongo_database_uri
   ```
4. Run the agent:
   ```bash
   node runAgent.js "Show me all losing trades for March"
   ```

## How It Works
The AI first processes the user input to generate a query using either the `OpenAI` or `Together API`. Based on the input, it chooses the correct API model.

For example, if the input includes `"gpt"` or `"GPT"`, the system uses `OpenAI`, otherwise, it defaults to `Together AI`.

After the query is generated, it is passed to the database to fetch the required information (e.g., trade data). The data is then returned to the AI model, where additional analysis is performed before sending the final response back to the user.

### Example of Query Parameters
For instance, when the AI determines that the user wants to get all trades from a specific date range, it generates the following query:
   ```json
   {
      "arguments": "{\"openDate\":{\"gte\":\"2022-01-01T00:00:00\",\"lte\":\"2022-01-31T23:59:59\"}}",
      "name": "get_trades"
   }
   ```
### Database Query
The MongoDB query builder uses the provided parameters to fetch the relevant data from the database:
   ```js
   const { MongoClient } = require('mongodb');
   const uri = process.env.MONGO_URI;
   const client = new MongoClient(uri);

   async function queryBuilder(collection, params) {
      const filterConditions = {};
      for (const [key, value] of Object.entries(params)) {
         if (!['sortBy', 'sortOrder', 'page', 'limit', 'countOnly'].includes(key)) {
            filterConditions[key] = value;
         }
      }

      const sortConditions = {};
      if (params.sortBy && params.sortOrder) {
         sortConditions[params.sortBy] = params.sortOrder === 'asc' ? 1 : -1;
      }

      const paginationOptions = {};
      if (params.page && params.limit) {
         paginationOptions.skip = (params.page - 1) * params.limit;
         paginationOptions.limit = params.limit;
      }

      let result;
      if (params.countOnly) {
         result = await collection.countDocuments(filterConditions);
      } else {
         result = await collection.find(filterConditions)
            .sort(sortConditions)
            .skip(paginationOptions.skip || 0)
            .limit(paginationOptions.limit || 0)
            .toArray();
      }

      return result;
   }

   async function getTrades(params) {
      await client.connect();
      const collection = client.db('trading').collection('trades');
      return await queryBuilder(collection, params);
   }
   ```

## Workflow Example
1. User Input: "Show me all losing trades for March".

2. AI Processes: The AI model recognizes the query type and uses the appropriate tools to fetch the data from the database.

3. Query Execution: The query builder fetches the trades that match the given parameters from MongoDB.

4. Return Response: The AI processes the fetched trades and returns the results to the user.

### Conclusion

This system integrates AI for intelligent querying of trade data, offering traders a powerful tool for analyzing past trades and managing risk.

