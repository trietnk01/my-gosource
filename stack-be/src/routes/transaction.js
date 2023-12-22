var express = require("express");
var router = express.Router();
var transactionModel = require("@models/transaction");
var checkAuthorization = require("@helpers/check-authorization");
router.get("/list", async (req, res) => {
	let status = true;
	let msg = "";
	let items = [];
	let total = 0;
	try {
		const valid = await checkAuthorization(req);
		if (!valid) {
			status = false;
			msg = "Invalid token";
		} else {
			const query = Object.assign({}, req.query);
			const perpage = query.perpage ? parseInt(query.perpage) : 20;
			const currentPage = query.page ? parseInt(query.page) : 1;
			let where = {};
			if (query.keyword) {
				let keyword = query.keyword;
				where["sku"] = { $regex: new RegExp(keyword), $options: "i" };
			}
			if (query.dateCreated) {
				let dateCreated = query.dateCreated;
				where["dateCreated"] = dateCreated;
			}
			console.log("where = ", where);
			total = await transactionModel.find(where).countDocuments();
			let position = (currentPage - 1) * perpage;
			items = await transactionModel.aggregate([
				{
					$match: where
				},
				{
					$project: {
						sku: 1,
						dateCreated: 1,
						price: 1
					}
				},
				{
					$skip: position
				},
				{
					$limit: perpage
				}
			]);
		}
	} catch (err) {
		msg = err.message;
		status = false;
	}
	res.status(200).json({ status, msg, items, total });
});
module.exports = router;
