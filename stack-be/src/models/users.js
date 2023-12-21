const mongoose = require("mongoose");
const AuthorSchema = new mongoose.Schema({
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
const model = mongoose.model("users", AuthorSchema);
module.exports = model;
