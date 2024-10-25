import cors from "cors";
import colors from 'colors';
import dotenv from "dotenv";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { configureSocketIO } from "./config/socket.js";
import logger from "./middlewares/logger.js";
import uploadRoutes from "./routes/upload.js";
import schema from "./schemas/schema.js";
import { verifyToken } from "./middlewares/auth.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Init Middleware
app.use(logger);

// Connect to database
connectDB();

app.use(cors());

// Define Routes
app.use("/assets", express.static(path.join(__dirname, "public", "assets")));

app.use(
	"/graphql",
	graphqlHTTP((req, res) => ({
		schema,
		context: { req, res },
		graphiql: process.env.NODE_ENV === "development",
	}))
);

// Upload routes for profile and post images
app.use("/upload", verifyToken, uploadRoutes);

configureSocketIO(server);

server.listen(port, console.log(`Server is running on port ${port}`));
