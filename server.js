import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRouts.js";
import chatRoutes from "./routes/conversationRoutes.js";
import cors from "cors";
import tutorRoutes from "./routes/tutorRoutes.js";
import { Server } from "socket.io";
import { log } from "console";
import Chat from "./models/chatModel.js";
import Conversation from "./models/ConversationModel.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'https://educflex.netlify.app',
  'http://localhost:3000' 
];

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// app.use((req, res, next)=> {
//   res.header('Access-Control-Allow-')
// })

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", 'https://educflex.netlify.app' );
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

const io = new Server(server, {
  pingTimeout: 6000,
  cors: {
    origin: '*',
  },
});



io.on('connection', (socket) => {
  console.log("user connected", socket.id);


    socket.on("setup", (userData) => {
    socket.join(userData?._id, 'userid');
    console.log(userData?._id);
    // socket.emit("connected");
  });


  socket.on('join-chat', async (conversationId) => {
    socket.join(conversationId);
    console.log('user joined ', conversationId);
  });


  socket.on('message', async (data) => {
    try {
      const newChat = new Chat(data);
      await newChat.save();

      // Emit the message to the conversation room
      io.to(data.conversation).emit('new message', newChat);
      
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });

      // Emit a confirmation to the sender
      socket.emit('message sent', newChat);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // socket.on('message', async (data) => {
  //   try {
  //     const newChat = new Chat(data);
  //     await newChat.save();

  //     // Emit the message to the conversation
  //     io.to(data.conversation).emit('message', newChat);

  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //   }
  // });
});