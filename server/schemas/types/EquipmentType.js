import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLFloat,
	GraphQLList,
	GraphQLNonNull,
	GraphQLInt,
} from "graphql";

const EquipmentType = new GraphQLObjectType({
	name: "Equipment",
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLNonNull(GraphQLString) },
		type: { type: GraphQLNonNull(GraphQLString) },
		brand: { type: GraphQLNonNull(GraphQLString) },
		price: { type: GraphQLFloat },
		picture: { type: GraphQLString },
		link: { type: GraphQLString },
		flexibility: { type: GraphQLString },
		frame: { type: GraphQLString },
		shaft: { type: GraphQLString },
		weightGrip: { type: GraphQLList(GraphQLString) },
		stringTension: { type: GraphQLList(GraphQLString) },
		balance: { type: GraphQLString },
		gauge: { type: GraphQLString },
		length: { type: GraphQLString },
		coreMaterial: { type: GraphQLString },
		outerMaterial: { type: GraphQLString },
		coating: { type: GraphQLString },
		durability: { type: GraphQLInt },
		repulsionPower: { type: GraphQLInt },
		control: { type: GraphQLInt },
		hittingSound: { type: GraphQLInt },
		upperMaterial: { type: GraphQLString },
		midsoleMaterial: { type: GraphQLString },
		outsoleMaterial: { type: GraphQLString },
		technology: { type: GraphQLString },
		colors: { type: GraphQLList(GraphQLString) },
		playerStyle: { type: GraphQLString },
		playerLevel: { type: GraphQLString },
		averageRating: { type: GraphQLFloat },
		userRatingsTotal: { type: GraphQLInt },
	}),
});

export default EquipmentType;
