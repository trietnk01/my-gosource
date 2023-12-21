var multer = require("multer");
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __DOCUMENTS);
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
var uploadDocument = multer({ storage });
module.exports = uploadDocument;
