const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const tradeSchema = new Schema({
  profit: Number,
  date: Date,
  order_type: String,
  position_size: Number,
  status: String,
});

const riskRuleSchema = new Schema({
  condition: String,
  action: String,
  threshold: Number,
  time_period: String,
});

const Trade = model("Trade", tradeSchema);
const RiskRule = model("RiskRule", riskRuleSchema);

class TradingBot {
  constructor(config = {}) {
    this.config = config;

    this.defaultConfig = {
      riskRuleThreshold: 1000,
      profitLimit: 10000,
      dateFormat: "YYYY-MM-DD",
    };
    this.config = {
      ...this.defaultConfig,
      ...this.config,
    };
  }

  async getTrades(filters = {}) {
    const { profit, date, order_type, position_size, status } = filters;

    let query = {};

    if (profit) {
      if (profit.lt)
        query.profit = {
          $lt: profit.lt,
        };
      if (profit.gt)
        query.profit = {
          $gt: profit.gt,
        };
    }

    if (date) {
      if (date.gte)
        query.date = {
          $gte: new Date(date.gte),
        };
      if (date.lte)
        query.date = {
          $lte: new Date(date.lte),
        };
    }

    if (order_type) query.order_type = order_type;
    if (position_size) {
      if (position_size.lt)
        query.position_size = {
          $lt: position_size.lt,
        };
      if (position_size.gt)
        query.position_size = {
          $gt: position_size.gt,
        };
    }

    if (status) query.status = status;

    return await Trade.find(query);
  }

  async createRiskRule(ruleData) {
    const { condition, action, threshold, time_period } = ruleData;

    if (!condition || !action || !threshold) {
      throw new Error(
        "Необхідно вказати умову, дію та поріг для правила ризику"
      );
    }

    const newRule = new RiskRule({
      condition,
      action,
      threshold: threshold || this.config.riskRuleThreshold,
      time_period: time_period || "all_time",
    });

    return await newRule.save();
  }

  async getStatistics(period = "all_time", aggregateBy = "profit") {
    const pipeline = [
      {
        $match: {
          date: {
            $gte: new Date(0),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: `%Y-%m-%d`,
              date: "$date",
            },
          },
          totalProfit: {
            $sum: "$profit",
          },
          totalLoss: {
            $sum: {
              $cond: [
                {
                  $lt: ["$profit", 0],
                },
                "$profit",
                0,
              ],
            },
          },
          totalTrades: {
            $count: {},
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];

    if (period !== "all_time") {
      const startDate = new Date();
      if (period === "daily") startDate.setDate(startDate.getDate() - 1);
      if (period === "weekly") startDate.setDate(startDate.getDate() - 7);
      if (period === "monthly") startDate.setMonth(startDate.getMonth() - 1);

      pipeline[0].$match.date.$gte = startDate;
    }

    const stats = await Trade.aggregate(pipeline);

    return stats.map((stat) => ({
      date: stat._id,
      profit: stat.totalProfit,
      loss: stat.totalLoss,
      totalTrades: stat.totalTrades,
    }));
  }

  async setTradingStrategy(strategyName, parameters) {
    // Для спрощення, просто зберігаємо нову стратегію
    console.log(
      `Стратегія ${strategyName} встановлена з параметрами:`,
      parameters
    );
    return {
      strategyName,
      parameters,
    };
  }
}

module.exports = TradingBot;
