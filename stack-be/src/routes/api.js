var express = require("express");
var router = express.Router();
const exportRoute = () => {
	router.use("/users", require("@routes/users"));
	return router;
};
module.exports = exportRoute;
