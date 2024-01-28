const usersModel = require("@models/users");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const resolvers = {
	Query: {
		users: async (parents, { keyword }) => {
			let objWhere = {};
			if (keyword) {
				objWhere["displayName"] = new RegExp(keyword, "i");
			}
			let list = await usersModel.find(objWhere);
			return list;
		},
		user: async (parent, { id }) => {
			return usersModel.findById(id);
		}
	},
	Mutation: {
		createUser: async (parent, args) => {
			const item = new usersModel(args);
			return item.save();
		},
		updateUser: async (parent, { id, email, displayName, phone }) => {
			await usersModel.updateOne(
				{ _id: id },
				{
					email,
					displayName,
					phone
				}
			);
			const item = await usersModel.findById(id);
			return item;
		},
		checkValidToken: async (parent, { token }) => {
			let userItem = await usersModel.findOne({ token });
			let status = userItem ? true : false;
			let data = {
				status,
				item: userItem
			};
			return data;
		},
		checkAuthorization: async (parent, { bearerHeader }) => {
			let valid = true;
			if (!bearerHeader) {
				valid = false;
			}
			if (valid) {
				const bearerData = bearerHeader.split(" ");
				const bearerTxt = bearerData[0];
				const token = bearerData[1];
				const userList = await usersModel.find({ token });
				if (userList.length === 0 || bearerTxt !== "Bearer") {
					valid = false;
				}
			}
			return valid;
		},
		logout: async (parent, { id }) => {
			let status = true;
			await usersModel.updateOne({ _id: id }, { token: null });
			let data = {
				status,
				item: null
			};
			return data;
		},
		login: async (parent, { email, password }) => {
			let userItem = await usersModel.findOne({ email, password });
			let status = true;
			if (userItem) {
				let id = userItem._id;
				/* begin set random string */
				const characters = uuidv4();
				let randomTxt = "";
				const charactersLength = characters.length;
				for (let i = 0; i < 30; i++) {
					randomTxt += characters.charAt(Math.floor(Math.random() * charactersLength));
				}
				/* end set random string */
				let token = jwt.sign({ id }, randomTxt, {
					expiresIn: "10h"
				});
				await usersModel.updateOne({ _id: id }, { token });
				userItem = await usersModel.findById(id);
			} else {
				status = false;
			}
			return {
				status,
				item: userItem
			};
		}
	}
};
module.exports = resolvers;
