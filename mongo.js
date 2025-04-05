
const { MongoClient } = require('mongodb')
const uri = process.env.MONGO_URI
const client = new MongoClient(uri)

async function getTrades({ profit, date }) {
  await client.connect()
  const collection = client.db('trading').collection('trades')

  const query = {}
  if (profit?.lt !== undefined) query.profit = { $lt: profit.lt }
  if (profit?.gt !== undefined) query.profit = { $gt: profit.gt }

  if (date?.gte || date?.lte) {
    query.date = {}
    if (date.gte) query.date.$gte = new Date(date.gte)
    if (date.lte) query.date.$lte = new Date(date.lte)
  }

  const trades = await collection.find(query).toArray()
  return trades
}

module.exports = { getTrades }
