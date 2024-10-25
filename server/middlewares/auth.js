import jwt from "jsonwebtoken";

export const authenticate = (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];
	try {
		if (!token) {
			throw new Error("Authentication required");
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		console.log("User Authenticated!".green.bold.underline);
	} catch (error) {
		throw new Error("Invalid Token! Please login again!");
	}
};

export const verifyToken = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	try {
		if (!token) {
			throw new Error("Authentication required"); // 401
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		console.log("User Authenticated!".green.bold.underline);
		next();
	} catch (error) {
		throw new Error("Invalid Token! Please login again!"); // 401
	}
};

export const authenticateSocket = (socket, next) => {
	const token = socket.handshake.auth.token;
	try {
		if (!token) {
			return next(new Error("Authentication required"));
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		socket.user = decoded;
		console.log("Socket User Authenticated!".green.bold.underline);
		next();
	} catch (error) {
		return next(new Error("Invalid Token! Please login again!"));
	}
};

export const authorize = (...roles) => {
	return (req, res) => {
		if (!roles.includes(req.user.role)) {
			throw new Error("Access denied"); // 403
		}
	};
};
