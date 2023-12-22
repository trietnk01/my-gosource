var express = require("express");
var router = express.Router();
const exportRoute = () => {
	router.use("/users", require("./users"));
	router.use("/transaction", require("./transaction"));
	return router;
};
module.exports = exportRoute;
