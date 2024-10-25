import { connect } from "mongoose";

const connectDB = async () => {
	try {
		const conn = await connect(process.env.MONGO_URI);

		console.log(
			`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
		);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

export default connectDB;
