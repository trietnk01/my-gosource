var usersModel = require("@models/users");
const checkAuth = async (req, res, next) => {
	let valid = true;
	let message = "";
	const bearerHeader = req.headers["authorization"];
	if (!bearerHeader) {
		valid = false;
		message = "token_is_required";
	} else {
		const bearerData = bearerHeader.split(" ");
		const bearerTxt = bearerData[0];
		const token = bearerData[1];
		const data = await usersModel.find({ token });
		if (!data || data.length === 0 || bearerTxt !== "Bearer") {
			valid = false;
			message = "invalid_token";
		}
	}
	if (valid === false) {
		res.status(500).json({
			success: false,
			message
		});
	}
	next();
};
module.exports = checkAuth;
