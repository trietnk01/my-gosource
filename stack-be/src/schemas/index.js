const { mergeTypeDefs } = require("@graphql-tools/merge");
const userSchema = require("@schemas/users");
const typeDefs = mergeTypeDefs([userSchema]);
module.exports = typeDefs;
