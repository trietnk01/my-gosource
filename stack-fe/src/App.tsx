import { JWTProvider as AuthProvider } from "contexts/JWTContext";
import React from "react";
import Routes from "routes";
import LoadingSpinner from "ui-component/LoadingSpinner";
import Locales from "ui-component/Locales";
import Snackbar from "ui-component/Snackbar";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from "@apollo/client";
import { END_POINT } from "configs";
const client = new ApolloClient({
	uri: END_POINT.API_ENDPOINT,
	cache: new InMemoryCache()
});
const App = () => {
	return (
		<ApolloProvider client={client}>
			<Locales>
				<AuthProvider>
					<React.Fragment>
						<Routes />
						<Snackbar />
						<LoadingSpinner />
					</React.Fragment>
				</AuthProvider>
			</Locales>
		</ApolloProvider>
	);
};

export default App;
