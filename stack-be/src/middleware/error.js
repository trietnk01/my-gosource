var ErrorResponse = require("@helpers/ErrorResponse");
const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	console.log("err = ", err);
	if (error.name === "CastError") {
		let message = "ERROR_CASTERROR";
		error = new ErrorResponse(404, message);
	}
	res.status(error.statusCode || 500).json({
		success: false,
		message: error.message || "SERVER ERROR"
	});
};

module.exports = errorHandler;
