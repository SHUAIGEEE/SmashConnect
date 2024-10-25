import { makeClient } from "@/lib/apolloClient";
import { isProfileComplete } from "@/lib/checkProfileCompleteness";
import { gql } from "@apollo/client";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

const loginMutation = gql`
  mutation LOGIN($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        _id
        username
        email
        role
        phone
        picture
        friends
        locationName
        location {
          coordinates
        }
        skillLevel
        playingStyle
        availability {
          day
          timeSlots {
            start
            end
          }
        }
      }
      token
    }
  }
`;

export const { auth, handlers, signOut, signIn } = NextAuth({
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          type: "email"
        },
        password: {
          type: "password"
        }
      },
      authorize: async (credentials) => {
        try {
          const client = makeClient();
          const { data } = await client.mutate({
            mutation: loginMutation,
            variables: {
              email: credentials.email,
              password: credentials.password
            }
          });

          // Extract user object and token from the response
          const user = data.login.user;
          const token = data.login.token;

          // If no error and we have user data, return it
          if (user && token) {
            return {
              ...user,
              token,
              isProfileComplete: isProfileComplete(user)
            };
          } else {
            // Return null if user data could not be retrieved
            return null;
          }
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session
    }: {
      token: any;
      user: any;
      trigger?: string | undefined;
      session?: any;
    }) {
      // Persist the user token (BE) to the JWT token (AuthJS)
      // User here will include the token from BE (return tgt in 'authorized' above)
      if (user) {
        token.user = user;
        token.accessToken = user.token;
        token.isProfileComplete = user.isProfileComplete;
      }
      // Update the JWT user if the user profile is updated
      if (trigger === "update" && session?.updatedUser) {
        console.log("Updating JWT user: ", session?.updatedUser.user);
        token.user = session.updatedUser.user;
        token.isProfileComplete = isProfileComplete(session.updatedUser.user);
      }
      // console.log("JWT Callback: ", { token, user });
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Add accessToken to session object
      session.user = { ...session.user, ...token.user };
      session.accessToken = token.user.token || token.accessToken;
      session.isProfileComplete = token.isProfileComplete;
      // console.log("Session Callback: ", { session, token });
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    }
  }
});
