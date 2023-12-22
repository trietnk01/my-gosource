var express = require("express");
var path = require("path");
const fs = require("fs");
var jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
var router = express.Router();
var checkAuthorization = require("@helpers/check-authorization");
var uploadImage = require("@helpers/upload-image");
var usersModel = require("@models/users");
router.post("/login", async (req, res) => {
	let status = true;
	let msg = "";
	let userItem = null;
	try {
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
			userItem = await usersModel.findOne({ _id: userId });
		}
	} catch (err) {
		msg = err.message;
		status = false;
	}
	res.status(200).json({
		status,
		msg,
		user: userItem
	});
});
router.post("/check-valid-token", async (req, res) => {
	let status = true;
	let msg = "";
	let userItem = null;
	try {
		const token = req.body.token;
		userItem = await usersModel.findOne({ token });
		if (!userItem) {
			status = false;
			msg = "Valid token failure";
		}
	} catch (err) {
		msg = err.message;
		status = false;
	}
	res.status(200).json({
		status,
		msg,
		user: userItem
	});
});
router.post("/logout", async (req, res) => {
	let status = true;
	let msg = "";
	try {
		const valid = await checkAuthorization(req);
		if (!valid) {
			status = false;
			msg = "Invalid token";
		} else {
			let body = Object.assign({}, req.body);
			const userId = body.userId;
			await usersModel.updateOne({ _id: userId }, { token: null });
		}
	} catch (err) {
		msg = err.message;
		status = false;
	}
	res.status(200).json({ status, msg });
});
router.get("/list", async (req, res) => {
	let status = true;
	let msg = "";
	let items = [];
	let total = 0;
	try {
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
	} catch (err) {
		msg = err.message;
		status = false;
	}
	res.status(200).json({ status, msg, items, total });
});
router.post("/create", uploadImage.single("avatar"), async (req, res) => {
	let status = true;
	let msg = "";
	let insertId = "";
	try {
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
	} catch (err) {
		msg = err.message;
		status = false;
	}
	res.status(200).json({ status, msg, insertId });
});
router.patch("/update/:id", uploadImage.single("avatar"), async (req, res) => {
	let status = true;
	let msg = "";
	try {
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
	} catch (err) {
		msg = err.message;
		status = false;
	}
	res.status(200).json({ status, msg });
});
router.get("/show/:id", async (req, res) => {
	let status = true;
	let msg = "";
	let item = null;
	try {
		const valid = await checkAuthorization(req);
		if (!valid) {
			status = false;
			msg = "Invalid token";
		}
		if (status) {
			const params = Object.assign({}, req.params);
			const id = params.id ? params.id : "";
			item = await usersModel.findOne({ _id: ObjectId(id) });
		}
	} catch (err) {
		status = false;
		msg = err.message;
	}
	res.status(200).json({ status, msg, item });
});
router.delete("/delete/:id", async (req, res) => {
	let status = true;
	let msg = "";
	try {
		const valid = await checkAuthorization(req);
		if (!valid) {
			status = false;
			msg = "Invalid token";
		} else {
			const params = Object.assign({}, req.params);
			const userId = params.id;
			const data = await usersModel.deleteOne({ _id: ObjectId(userId) });
			if (parseInt(data.deletedCount) === 0) {
				status = false;
				msg = "No item deleted";
			}
		}
	} catch (err) {
		msg = err.message;
		status = false;
	}
	res.status(200).json({ status, msg });
});
module.exports = router;
