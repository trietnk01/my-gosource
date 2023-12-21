var multer = require("multer");
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file) {
			cb(null, __IMAGES);
		}
	},
	filename: function (req, file, cb) {
		if (file && file.originalname) {
			cb(null, file.originalname);
		}
	}
});
var uploadImage = multer({ storage });
module.exports = uploadImage;
