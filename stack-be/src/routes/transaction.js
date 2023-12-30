var express = require("express");
var router = express.Router();
var asyncHandler = require("@middleware/async");
var checkAuth = require("@middleware/auth");
var transactionModel = require("@models/transaction");
var redisClient = require("@helpers/redisClient");
router.get(
	"/list",
	checkAuth,
	asyncHandler(async (req, res) => {
		let status = true;
		let message = "";
		let items = [];
		let total = 0;
		let position = 0;
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
		if (query.amount) {
			let amount = query.amount;
			where["amount"] = parseInt(amount);
		}
		total = await transactionModel.find(where).countDocuments();
		position = (currentPage - 1) * perpage;
		items = await transactionModel.aggregate([
			{
				$match: where
			},
			{
				$project: {
					sku: 1,
					dateCreated: 1,
					amount: 1
				}
			},
			{
				$skip: position
			},
			{
				$limit: perpage
			}
		]);
		const key = `transaction-${perpage}-${currentPage}`;
		let dataCached = await redisClient.get(key);
		if (dataCached) {
			items = JSON.parse(dataCached);
		} else {
			await redisClient.set(key, JSON.stringify(items));
		}
		res.status(200).json({ status, message, items, total });
	})
);
router.post(
	"/create",
	checkAuth,
	asyncHandler(async (req, res) => {
		let status = true;
		let message = "";
		let insertId = "";
		const item = Object.assign({}, req.body);
		const dataMatched = await transactionModel.find({ sku: item.sku });
		if (dataMatched && dataMatched.length > 0) {
			status = false;
			message = "Transaction is exist";
		}
		if (status) {
			if (item.sku && item.dateCreated && item.amount) {
				let model = new transactionModel({ sku: item.sku, dateCreated: item.dateCreated, amount: parseInt(item.amount) });
				const itemCreated = await model.save();
				insertId = itemCreated._id;
			}
		}
		res.status(200).json({ status, message, insertId });
	})
);
router.patch(
	"/update/:id",
	checkAuth,
	asyncHandler(async (req, res) => {
		let status = true;
		let message = "";
		let item = Object.assign({}, req.body);
		const id = req.params.id ? req.params.id : "";
		const dataMatched = await transactionModel.find({ sku: item.sku, _id: { $ne: id } });
		if (dataMatched && dataMatched.length > 0) {
			status = false;
			message = "Transaction is exist";
		}
		if (status) {
			await transactionModel.updateOne({ _id: id }, item);
		}
		res.status(200).json({ status, message });
	})
);
router.get(
	"/show/:id",
	checkAuth,
	asyncHandler(async (req, res) => {
		let status = true;
		let message = "";
		let item = null;
		const params = Object.assign({}, req.params);
		const id = params.id ? params.id : "";
		item = await transactionModel.findOne({ _id: id });
		res.status(200).json({ status, message, item });
	})
);
router.post(
	"/add",
	checkAuth,
	asyncHandler(async (req, res) => {
		let status = true;
		for (var i = 0; i < 1000; i++) {
			let j = i + 1;
			let sku = "TRANS" + j.toString().padStart(6, "0");
			let dateCreated = "2022-01-01";
			let amount = j.toString().padEnd(6, "0");
			let model = new transactionModel({ sku, dateCreated, amount });
			let item = await model.save();
		}
		res.status(200).json({ status });
	})
);
module.exports = router;
