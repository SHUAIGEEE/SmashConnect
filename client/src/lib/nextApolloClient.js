import { auth } from "@/../auth";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

const httpLink = new HttpLink({
	uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
	const session = await auth();

	return {
		headers: {
			...headers,
			authorization: `Bearer ${session?.accessToken}`,
		},
	};
});

export const { getClient } = registerApolloClient(() => {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: authLink.concat(httpLink),
	});
});
