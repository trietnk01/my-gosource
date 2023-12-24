const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
	sku: {
		type: String
	},
	dateCreated: {
		type: String
	},
	amount: {
		type: Number
	}
});
const model = mongoose.model("transactions", transactionSchema);
module.exports = model;
