const mongoose = require("mongoose");
const authorSchema = new mongoose.Schema({
	email: {
		type: String
	},
	displayName: {
		type: String
	},
	password: {
		type: String
	},
	phone: {
		type: String
	},
	avatar: {
		type: String
	},
	token: {
		type: String
	}
});
const model = mongoose.model("users", authorSchema);
module.exports = model;
