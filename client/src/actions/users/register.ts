"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { RegisterFormValue } from "@/schemas";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const registerMutation = gql`
	mutation REGISTER($username: String!, $email: String!, $password: String!) {
		register(username: $username, email: $email, password: $password) {
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
	}
`;

export async function signUp(credentials: RegisterFormValue) {
	try {
		const { data } = await getClient().mutate({
			mutation: registerMutation,
			variables: {
				username: credentials.username,
				email: credentials.email,
				password: credentials.password,
			},
		});

		const user = data.register;

		return { user };
	} catch (error: unknown) {
		logoutIfTokenInvalid(error);
		return { error: getErrorMessage(error) };
	}
}
