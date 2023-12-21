var usersModel = require("@models/users");
const checkAuthorization = async req => {
	let valid = true;
	const bearerHeader = req.headers["authorization"];
	if (!bearerHeader) {
		valid = false;
	} else {
		const bearerData = bearerHeader.split(" ");
		const bearerTxt = bearerData[0];
		const token = bearerData[1];
		const data = await usersModel.find({ token });
		if (!data || data.length === 0 || bearerTxt !== "Bearer") {
			valid = false;
		}
	}
	return valid;
};
module.exports = checkAuthorization;
