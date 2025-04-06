const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

/**
 * Builds a query based on provided parameters and executes it on the given collection.
 *
 * @param {Object} collection - The MongoDB collection to query.
 * @param {Object} params - The parameters to build the query.
 * @returns {Array|number} - The query result, either an array of documents or a count.
 */
async function queryBuilder(collection, params) {
  try {
    // Construct the filter conditions based on provided parameters
    const filterConditions = {};
    for (const [key, value] of Object.entries(params)) {
      // Exclude pagination and sorting parameters from filter
      if (!['sortBy', 'sortOrder', 'page', 'limit', 'countOnly'].includes(key)) {
        filterConditions[key] = value;
      }
    }

    // Initialize sorting conditions
    const sortConditions = {};
    if (params.sortBy && params.sortOrder) {
      // Set sorting order based on 'sortOrder' parameter
      sortConditions[params.sortBy] = params.sortOrder === 'asc' ? 1 : -1;
    }

    // Set pagination options
    const paginationOptions = {};
    if (params.page && params.limit) {
      // Calculate the number of documents to skip based on the current page
      paginationOptions.skip = (params.page - 1) * params.limit;
      paginationOptions.limit = params.limit;
    }

    let result;
    if (params.countOnly) {
      // If 'countOnly' is true, return the count of matching documents
      result = await collection.countDocuments(filterConditions);
    } else {
      // Retrieve documents with applied filters, sorting, and pagination
      result = await collection.find(filterConditions)
        .sort(sortConditions)
        .skip(paginationOptions.skip || 0)
        .limit(paginationOptions.limit || 0)
        .toArray();
    }

    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

/**
 * Retrieves trade documents based on provided parameters.
 *
 * @param {Object} params - The parameters to build the query.
 * @returns {Array|number} - The query result, either an array of documents or a count.
 */
async function getTrades(params) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    const collection = client.db('trading').collection('trades');

    // Use the queryBuilder to execute the query
    return await queryBuilder(collection, params);
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

module.exports = { getTrades };
