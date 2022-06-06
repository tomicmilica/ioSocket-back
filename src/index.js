const express = require("express");
const http = require("http");
const cors = require("cors");
var { Server } = require("socket.io");
const { sequelize } = require("./models");
const app = express();

//database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
app.use(cors());
const server = http.createServer(app);

server.listen(3001, () => {
  console.log(`listening on port 3001`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);
  socket.on("join_room", (data) => {
    console.log(`user with ID: ${socket.id},'join the room with id: ${data}`);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconected: ", socket.id);
  });
});
