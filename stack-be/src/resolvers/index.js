const { mergeResolvers } = require("@graphql-tools/merge");
const userResolvers = require("@resolvers/users");
const resolvers = mergeResolvers([userResolvers]);
module.exports = resolvers;
