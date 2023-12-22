const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
	sku: {
		type: String
	}
});
const model = mongoose.model("transactions", transactionSchema);
module.exports = model;
