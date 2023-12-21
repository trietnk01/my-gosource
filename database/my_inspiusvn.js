/*
 Navicat MongoDB Data Transfer

 Source Server         : My inspiusvn
 Source Server Type    : MongoDB
 Source Server Version : 70002 (7.0.2)
 Source Host           : localhost:4021
 Source Schema         : my_inspiusvn

 Target Server Type    : MongoDB
 Target Server Version : 70002 (7.0.2)
 File Encoding         : 65001

 Date: 02/11/2023 21:01:21
*/


// ----------------------------
// Collection structure for users
// ----------------------------
db.getCollection("users").drop();
db.createCollection("users");

// ----------------------------
// Documents of users
// ----------------------------
db.getCollection("users").insert([ {
    _id: ObjectId("653b270ac9502bf1dc0f4e52"),
    email: "nguyenkimdien02@gmail.com",
    displayName: "Nguyễn Kim Điền",
    password: "246357",
    phone: "988162753",
    avatar: "Iconarchive-Incognito-Animals-Rabbit-Avatar.512.png",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzEyZGExNzg3ZTc4NzM2ZjBiZTcyNSIsImlhdCI6MTY5NzcyMjE2OSwiZXhwIjoxNjk3NzU4MTY5fQ.xtD9WAKRubHzWBCBhEJ4DzHu43fMooJs4nWE545qKHM"
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b270ac9502bf1dc0f4e53"),
    email: "tranthithusuong@dienkim.vn",
    displayName: "Trần Thị Thu Sương",
    password: "246357",
    phone: "912121212",
    avatar: "Iconarchive-Incognito-Animals-Owl-Avatar.512.png",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1M2IyNzBhYzk1MDJiZjFkYzBmNGU1MyIsImlhdCI6MTY5ODkzMDExNSwiZXhwIjoxNjk4OTY2MTE1fQ.DDkJ_3bqPKxtUs7dYSBpfKcbV-RAyFO_0c176vgj32s"
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b270ac9502bf1dc0f4e54"),
    email: "nguyenthihuong@dienkim.vn",
    displayName: "Nguyễn Thị Hương",
    password: "246357",
    phone: "901234567",
    avatar: "Iconarchive-Incognito-Animals-Mouse-Avatar.512.png",
    token: ""
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b270ac9502bf1dc0f4e55"),
    email: "dothitrinh@dienkim.vn",
    displayName: "Đỗ Thị Trinh",
    password: "246357",
    phone: "956702341",
    avatar: "Iconarchive-Incognito-Animals-Monkey-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b270ac9502bf1dc0f4e56"),
    email: "tranthingocmai@dienkim.vn",
    displayName: "Trần Thị Ngọc Mai",
    password: "246357",
    phone: "967082341",
    avatar: "Iconarchive-Incognito-Animals-Meerkat-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e57"),
    email: "lythuongkiet123@dienkim.vn",
    displayName: "Lý Thường Kiệt",
    password: "246357",
    phone: "902345671",
    avatar: "Iconarchive-Incognito-Animals-Mammoth-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e58"),
    email: "lythaito@dienkim.vn",
    displayName: "Lý Thái Tổ",
    password: "246357",
    phone: "956702381",
    avatar: "Iconarchive-Incognito-Animals-Lion-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e59"),
    email: "dienbienphu@dienkim.vn",
    displayName: "Điện Biên Phủ",
    password: "246357",
    phone: "912356708",
    avatar: "Iconarchive-Incognito-Animals-Leopard-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e5a"),
    email: "nguyenthaihoc@dienkim.vn",
    displayName: "Nguyễn Thái Học",
    password: "246357",
    phone: "905678231",
    avatar: "Iconarchive-Incognito-Animals-Koala-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e5b"),
    email: "tranthingocmai@dienkim.vn",
    displayName: "Trần Thị Ngọc Mai",
    password: "246357",
    phone: "967082341",
    avatar: "Iconarchive-Incognito-Animals-Meerkat-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e5c"),
    email: "buidinhcuong@dienkim.vn",
    displayName: "Bùi Đình Cường",
    password: "246357",
    phone: "904567841",
    avatar: "Iconarchive-Incognito-Animals-Lama-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e5d"),
    email: "buixuanthuan@dienkim.vn",
    displayName: "Bùi Xuân Thuận",
    password: "246357",
    phone: "924567081",
    avatar: "Iconarchive-Incognito-Animals-Kangaroo-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e5e"),
    email: "phamhonganh@dienkim.vn",
    displayName: "Phạm Hồng Anh",
    password: "246357",
    phone: "945078231",
    avatar: "Iconarchive-Incognito-Animals-Horse-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e5f"),
    email: "dangvanthanh@dienkim.vn",
    displayName: "Đặng Văn Thành",
    password: "246357",
    phone: "987023641",
    avatar: "Iconarchive-Incognito-Animals-Hedgehog-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e60"),
    email: "tranthingocmai@dienkim.vn",
    displayName: "Trần Thị Ngọc Mai",
    password: "246357",
    phone: "967082341",
    avatar: "Iconarchive-Incognito-Animals-Meerkat-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e61"),
    email: "danghonganh@dienkim.vn",
    displayName: "Đặng Hồng Anh",
    password: "246357",
    phone: "923456789",
    avatar: "Iconarchive-Incognito-Animals-Gorilla-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("653b30fdc9502bf1dc0f4e68"),
    email: "dinhbolinh@dienkim.vn",
    displayName: "Đinh Bộ Lĩnh",
    password: "246357",
    phone: "902356781",
    avatar: "Iconarchive-Incognito-Animals-Bison-Avatar.512.png",
    token: null,
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("65439ed09ef09e15c8cc6974"),
    email: "nguyenvanchien@dienkim.vn",
    displayName: "Nguyễn Văn Chiến",
    password: "246357",
    phone: "0923574861",
    avatar: "Martin-Berube-Character-Devil.256.png",
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("65439f94b2edf562545d94e4"),
    email: "ledinhhac@dienkim.vn",
    displayName: "Lê Đình Hạc",
    password: "246357",
    phone: "0946782351",
    avatar: "Iconarchive-Incognito-Animals-Rabbit-Avatar.512.png",
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6543a0278b89575cbc7843aa"),
    email: "buithidiem@dienkim.vn",
    displayName: "Bùi Thị Diễm",
    password: "246357",
    phone: "0592134802",
    avatar: "Iconarchive-Incognito-Animals-Owl-Avatar.512.png",
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6543a22a13be458768d2e824"),
    email: "luudinhnghe@gmail.com",
    displayName: "Lưu Đình Nghệ",
    password: "246357",
    phone: "0926783451",
    avatar: "Iconarchive-Incognito-Animals-Mouse-Avatar.512.png",
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6543a2ac13be458768d2e82e"),
    email: "buithiphi@dienkim.vn",
    displayName: "Bùi Thị Phi",
    password: "246357",
    phone: "0234780157",
    avatar: "Iconarchive-Incognito-Animals-Lion-Avatar.512.png",
    __v: NumberInt("0")
} ]);
