const Transaction = require("../models/Transaction");

exports.getTransactions = async (req, res) => {
  const { userId } = req.query;
  const transactions = await Transaction.find({ userId });
  res.json(transactions);
};
const addTransaction = async (req, res) => {
  console.log("Incoming body:", req.body);  // 👈 add here
  try {
    const { description, category, amount, userId } = req.body;
    const transaction = new Transaction({ description, category, amount, userId });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.addTransaction = addTransaction;

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  await Transaction.findByIdAndDelete(id);
  res.json({ msg: "Deleted" });
};
