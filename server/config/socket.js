import { Server as SocketIOServer } from "socket.io";
import { authenticateSocket } from "../middlewares/auth.js";
import { graphql } from "graphql";
import schema from "../schemas/schema.js";

let io;

export const configureSocketIO = (server) => {
	io = new SocketIOServer(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.use((socket, next) => {
		authenticateSocket(socket, next);
	});

	io.on("connection", (socket) => {
		console.log(`User connected: ${socket.user.id}`.green.bold);

		// Join a room identified by the user's ID
		socket.join(socket.user.id);

		socket.on("private_message", async ({ recipientId, content }) => {
			const query = `
				mutation SendMessage($recipientId: ID!, $content: String!) {
						sendMessage(recipientId: $recipientId, content: $content) {
								_id
								sender {
										_id
										username
								}
								recipient {
										_id
										username
								}
								content
								createdAt
						}
				}
			`;
			const variables = { recipientId, content };

			const context = { req: { user: socket.user } };

			const result = await graphql(
				schema,
				query,
				null,
				context,
				variables
			);

			if (result.errors) {
				console.error(result.errors);
				return;
			}

			const chatMessage = result.data.sendMessage;

			// Emit the message to the recipient's room
			io.to(recipientId).emit("private_message", chatMessage);

			// Acknowledge the sender
			socket.emit("private_message", chatMessage);
		});

		socket.on("update_message", async ({ messageId, content }) => {
			console.log("Update message received:", { messageId, content });
			const query = `
				mutation UpdateMessage($messageId: ID!, $content: String!) {
					updateMessage(messageId: $messageId, content: $content) {
						_id
						sender {
							_id
							username
						}
						recipient {
							_id
							username
						}
						content
						createdAt
					}
				}
			`;
			const variables = { messageId, content };
			const context = { req: { user: socket.user } };

			const result = await graphql(
				schema,
				query,
				null,
				context,
				variables
			);

			if (result.errors) {
				console.error(result.errors);
				return;
			}

			const updatedMessage = result.data.updateMessage;

			// Emit the updated message to the recipient's room
			io.to(updatedMessage.recipient._id).emit(
				"update_message",
				updatedMessage
			);
		});

		socket.on("delete_message", async ({ messageId }) => {
			console.log("Delete message received:", { messageId });
			const query = `
				mutation DeleteMessage($messageId: ID!) {
					deleteMessage(messageId: $messageId) {
						_id
						sender {
							_id
							username
						}
						recipient {
							_id
							username
						}
						content
						createdAt
					}
				}
			`;
			const variables = { messageId };
			const context = { req: { user: socket.user } };

			const result = await graphql(
				schema,
				query,
				null,
				context,
				variables
			);

			if (result.errors) {
				console.error(result.errors);
				return;
			}

			const deletedMessage = result.data.deleteMessage;

			// Emit the deleted message info to the recipient's room
			io.to(deletedMessage.recipient._id).emit(
				"delete_message",
				deletedMessage
			);
		});

		socket.on("message_read", async ({ messageId }) => {
			const message = await ChatMessage.findById(messageId);
			if (message) {
				message.read = true;
				await message.save();
				io.to(message.sender).emit("message_read", {
					messageId,
					readerId: socket.user.id,
				});
			}
		});

		socket.on("disconnect", () => {
			console.log(`User disconnected: ${socket.user.id}`.red.bold);
		});
	});

	return io;
};

export { io };
