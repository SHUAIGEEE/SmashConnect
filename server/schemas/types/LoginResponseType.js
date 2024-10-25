import { GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "./UserType.js";

const LoginResponseType = new GraphQLObjectType({
	name: "LoginResponse",
	fields: () => ({
		user: { type: UserType },
		token: { type: GraphQLString },
	}),
});

export default LoginResponseType;