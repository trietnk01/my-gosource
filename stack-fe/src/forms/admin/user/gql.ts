import { gql } from "@apollo/client";
const getUsers = gql`
	query Users($keyword: String) {
		users(keyword: $keyword) {
			id
			email
			displayName
			phone
			avatar
			token
		}
	}
`;
export { getUsers };
