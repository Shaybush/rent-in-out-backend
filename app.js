const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const { routesInit } = require("./routers/config_routes");
const { sockets } = require("./routers/socket");

require("dotenv").config();
require("./db/mongoconnect");

const app = express();

// configuration urls to orgin
const originUrls = [
  "https://rentinout.onrender.com",
  "http://rentinout.onrender.com",
  "http://localhost:3000",
  "https://rentinout.netlify.app",
  "http://rentinout.netlify.app",
  "http://localhost:5173",
  "https://rent-in-out.netlify.app",
  "https://rent-in-out-front.vercel.app",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: originUrls,
    credentials: true,
  })
);
app.use(fileUpload({ limits: { fileSize: 1024 * 1024 * 5 } }));
app.use(express.json());
app.use(session({ secret: "cats" }));
app.use(express.static(path.join(__dirname, "public")));
routesInit(app);

const server = http.createServer(app);
//socket io
const io = new Server(server, {
  cors: {
    origin: originUrls,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
app.get("/", (req, res) => {
  res.json("Socket ready");
});
let port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
io.on("connection", sockets);
