import { gql } from "@apollo/client";
const loginMutation = gql`
	mutation login($email: String, $password: String) {
		login(email: $email, password: $password) {
			status
			item {
				id
				email
				displayName
				phone
				avatar
				token
			}
		}
	}
`;
const logoutMutation = gql`
	mutation Logout($id: String) {
		logout(id: $id) {
			status
			item {
				id
				email
				displayName
				phone
				avatar
				token
			}
		}
	}
`;
const checkValidTokenMutation = gql`
	mutation CheckValidToken($token: String) {
		checkValidToken(token: $token) {
			status
			item {
				id
				email
				displayName
				phone
				avatar
				token
			}
		}
	}
`;
export { loginMutation, logoutMutation, checkValidTokenMutation };
