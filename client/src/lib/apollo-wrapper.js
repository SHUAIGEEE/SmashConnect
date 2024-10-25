"use client";
import { ApolloLink, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink
} from "@apollo/experimental-nextjs-app-support";
import { useSession } from "next-auth/react";

function makeClient(session) {
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: session ? `Bearer ${session.accessToken}` : ""
      }
    };
  });

  const link = authLink.concat(httpLink);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true
            }),
            link
          ])
        : link
  });
}

export function ApolloWrapper({ children }) {
  const { data: session } = useSession();

  return (
    <ApolloNextAppProvider makeClient={() => makeClient(session)}>
      {children}
    </ApolloNextAppProvider>
  );
}
