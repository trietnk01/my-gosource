const { gql } = require("apollo-server-express");
const typeDefs = gql`
	type User {
		id: String
		email: String
		displayName: String
		phone: String
		avatar: String
		token: String
	}
	type Result {
		status: Boolean
		item: User
	}
	type Query {
		users(keyword: String): [User]
		user(id: String): User
	}
	type Mutation {
		createUser(email: String, displayName: String, password: String, phone: String, avatar: String, token: String): User
		updateUser(id: String!, email: String, displayName: String, phone: String): User
		login(email: String, password: String): Result
		checkAuthorization(bearerHeader: String): Result
		checkValidToken(token: String): Result
		logout(id: String): Result
	}
`;
module.exports = typeDefs;
