const express = require("express");
const router = express.Router();
const { getTransactions, addTransaction, deleteTransaction } = require("../Controllers/transactionController");

router.get("/", getTransactions);
router.post("/", addTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;

