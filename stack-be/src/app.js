var http = require("http");
require("dotenv").config();
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
require("module-alias/register");
const mongoose = require("mongoose");
var apiRoute = require("@routes/api")();
let port = process.env.PORT;
let username = process.env.DB_USERNAME;
let password = process.env.DB_PASSWORD;
let dbPort = process.env.DB_PORT;
let dbName = process.env.DB_NAME;
let mongodbStr = `mongodb://${username}:${password}@localhost:${dbPort}/${dbName}`;
console.log("mongodbStr = ", mongodbStr);
global.__IMAGES = path.join(__dirname, "public/images");
global.__DOCUMENTS = path.join(__dirname, "public/documents");
let db = null;
const mongooseConnect = async () => {
	await mongoose.connect(mongodbStr, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
	db = mongoose.connection;
	db.on("error", () => {
		console.log("Connection fail");
	});
	db.once("open", () => {
		console.log("Connected");
	});
};
mongooseConnect();
var app = express();
app.use("/", express.static("src/public"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use("/api", apiRoute);
app.set("port", port);
var serverHttp = http.createServer(app);
serverHttp.listen(port);
