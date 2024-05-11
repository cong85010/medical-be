require("./src/config/conn");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const path = require("path");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const dayjs = require("dayjs");
dayjs.extend(customParseFormat);

const app = express();
app.use(fileUpload());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authRoute = require("./src/routes/auth.routes");
const fileRoute = require("./src/routes/file.routes");
const userRoute = require("./src/routes/user.routes");
const appointmentRoute = require("./src/routes/appointment.routes");
const medicineRoute = require("./src/routes/medicine.routes");
const medicalRecordRoute = require("./src/routes/medicalRecord.routes");
const orderRoute = require("./src/routes/order.routes");
const meetingRoute = require("./src/routes/meeting.routes");
const statisticRoute = require("./src/routes/statistic.routes");
const chatRoutes = require("./src/routes/chat.routes");
const conversationRoutes = require("./src/routes/conversation.routes");

app.use("/user", userRoute);
app.use("/file", fileRoute);
app.use("/auth", authRoute);
app.use("/appointment", appointmentRoute);
app.use("/medicine", medicineRoute);
app.use("/medical-record", medicalRecordRoute);
app.use("/order", orderRoute);
app.use("/meeting", meetingRoute);
app.use("/statistic", statisticRoute);
app.use("/chat", chatRoutes);
app.use("/conversation", conversationRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/view/serverRunning.html"));
});

const port = 5000;
const portSocket = 3000;
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createChat } = require("./src/controllers/chat/chat.controller");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("newConversation", (conversation) => {
    console.log("newConversation");
    io.emit("newConversation", conversation);
  });

  socket.on("message", async (data) => {
    const { roomId, message } = data;
    console.log("Message", {
      roomId,
      message,
    });

    const newChat = await createChat(message);
    // Handle incoming chat messages
    io.to(roomId).emit("message", newChat); // Broadcast the message to all connected clients
  });

  socket.on("joinRoom", (roomId) => {
    console.log("roomId", roomId);
    socket.join(roomId);
  });
});

httpServer.listen(portSocket);
app.listen(port, () => {
  console.log("Server is Running on " + port);
});
