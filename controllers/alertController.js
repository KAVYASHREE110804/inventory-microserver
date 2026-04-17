const store = require('../data/store');

const getAlerts = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, count: store.alerts.length, data: store.alerts });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAlerts };
