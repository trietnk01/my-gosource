var express = require("express");
var path = require("path");
const fs = require("fs");
var jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
var router = express.Router();
var asyncHandler = require("@middleware/async");
var checkAuth = require("@middleware/auth");
var uploadImage = require("@helpers/upload-image");
var usersModel = require("@models/users");
router.post(
	"/login",
	asyncHandler(async (req, res) => {
		let status = true;
		let msg = "";
		let userItem = null;
		const body = Object.assign({}, req.body);
		const email = body.email;
		const password = body.password;
		userItem = await usersModel.findOne({ $and: [{ email }, { password }] });
		if (!userItem) {
			status = false;
			msg = "Login failure";
		} else {
			let userId = userItem._id;
			/* begin set random string */
			const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			let randomTxt = "";
			const charactersLength = characters.length;
			for (let i = 0; i < 30; i++) {
				randomTxt += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			/* end set random string */
			let token = jwt.sign({ id: userId }, randomTxt, {
				expiresIn: "10h"
			});
			await usersModel.updateOne({ _id: userId }, { token });
			userItem = await usersModel.findById(userId);
		}
		res.status(200).json({
			status,
			msg,
			user: userItem
		});
	})
);
router.post(
	"/check-valid-token",
	asyncHandler(async (req, res) => {
		let status = true;
		let msg = "";
		let userItem = null;
		const token = req.body.token;
		userItem = await usersModel.findOne({ token });
		if (!userItem) {
			status = false;
			msg = "Valid token failure";
		}
		res.status(200).json({
			status,
			msg,
			user: userItem
		});
	})
);
router.post(
	"/logout",
	checkAuth,
	asyncHandler(async (req, res) => {
		let status = true;
		let msg = "";
		let body = Object.assign({}, req.body);
		const userId = body.userId;
		await usersModel.updateOne({ _id: userId }, { token: null });
		res.status(200).json({ status, msg });
	})
);
router.get(
	"/list",
	checkAuth,
	asyncHandler(async (req, res) => {
		let status = true;
		let msg = "";
		let items = [];
		let total = 0;
		const query = Object.assign({}, req.query);
		const perpage = query.perpage ? parseInt(query.perpage) : 20;
		const currentPage = query.page ? parseInt(query.page) : 1;
		const keyword = query.keyword ? query.keyword : "";
		let where = {};
		if (keyword) {
			where["displayName"] = { $regex: new RegExp(keyword), $options: "i" };
		}
		total = await usersModel.find(where).countDocuments();
		let position = (currentPage - 1) * perpage;
		items = await usersModel.aggregate([
			{
				$match: where
			},
			{
				$project: {
					email: 1,
					displayName: 1,
					phone: 1,
					avatar: 1
				}
			},
			{
				$skip: position
			},
			{
				$limit: perpage
			}
		]);
		res.status(200).json({ status, msg, items, total });
	})
);
router.post(
	"/create",
	checkAuth,
	uploadImage.single("avatar"),
	asyncHandler(async (req, res) => {
		let status = true;
		let msg = "";
		let insertId = "";
		const item = Object.assign({}, req.body);
		if (req.file && req.file.originalname) {
			item.avatar = req.file.originalname;
		}
		const dataMatched = await usersModel.find({ email: item.email });
		if (dataMatched && dataMatched.length > 0) {
			status = false;
			msg = "User is exist";
		}
		if (status) {
			let model = new usersModel({ email: item.email, displayName: item.displayName, password: item.password, phone: item.phone, avatar: item.avatar });
			const itemCreated = await model.save();
			insertId = itemCreated._id;
		}
		res.status(200).json({ status, msg, insertId });
	})
);
router.patch(
	"/update/:id",
	checkAuth,
	uploadImage.single("avatar"),
	asyncHandler(async (req, res) => {
		let status = true;
		let msg = "";
		let item = Object.assign({}, req.body);
		const id = req.params.id ? req.params.id : "";
		if (req.file && req.file.originalname) {
			item.avatar = req.file.originalname;
		}
		const dataMatched = await usersModel.find({ email: item.email, _id: { $ne: id } });
		if (dataMatched && dataMatched.length > 0) {
			status = false;
			msg = "User is exist";
		}
		if (status) {
			await usersModel.updateOne({ _id: ObjectId(id) }, item);
			const dataFindById = await usersModel.findOne({ _id: ObjectId(id) });
			const oldAvatar = dataFindById.avatar ? dataFindById.avatar : null;
			if (item.removed_avatar && item.removed_avatar === "true" && oldAvatar) {
				const avatarPath = path.join(__IMAGES, oldAvatar);
				if (fs.existsSync(avatarPath)) {
					await fs.unlink(avatarPath);
				}
			}
		}
		res.status(200).json({ status, msg });
	})
);
router.get(
	"/show/:id",
	checkAuth,
	asyncHandler(async (req, res) => {
		let status = true;
		let msg = "";
		let item = null;
		const params = Object.assign({}, req.params);
		const id = params.id ? params.id : "";
		item = await usersModel.findOne({ _id: ObjectId(id) });
		res.status(200).json({ status, msg, item });
	})
);
router.delete(
	"/delete/:id",
	checkAuth,
	asyncHandler(async (req, res) => {
		let status = true;
		let msg = "";
		const params = Object.assign({}, req.params);
		const userId = params.id;
		const data = await usersModel.deleteOne({ _id: ObjectId(userId) });
		if (parseInt(data.deletedCount) === 0) {
			status = false;
			msg = "No item deleted";
		}
		res.status(200).json({ status, msg });
	})
);
module.exports = router;
