var ErrorResponse = require("@helpers/ErrorResponse");
const errorHandler = (err, req, res, next) => {
	let error = new ErrorResponse(404, err);
	res.status(error.statusCode).json({
		success: false,
		message: error.message || "SERVER ERROR"
	});
};

module.exports = errorHandler;
