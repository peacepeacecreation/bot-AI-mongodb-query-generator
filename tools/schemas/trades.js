const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Trade schema
const tradeSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  strategyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Strategy', default: null },
  review: { type: Boolean, default: false },
  mistakes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mistake' }],
  positionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Position' }],
  openDate: { type: Date },
  closeDate: { type: Date },
  side: { type: String, enum: ['long', 'short', null], default: null },
  symbol: { type: String },
  profitLoss: { type: Number },
  pnlPercent: { type: Number },
  volume: { type: Number },
  avgOpenPrice: { type: Number, default: null },
  avgClosePrice: { type: Number, default: null },
  stopLoss: { type: Number, default: null },
  takeProfit: { type: Number, default: null },
  tradeNoticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TradeNotice', default: null },
  uniqueInstrumentsId: { type: mongoose.Schema.Types.ObjectId, ref: 'TradeUniqueInstruments', default: null },
  has_archived: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = tradeSchema;
