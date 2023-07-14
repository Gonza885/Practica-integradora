// Express
import express from "express";
const app = express();
const port = 8080;
const host = "0.0.0.0";

// Rutas
import productsRoute from "./routes/products.router.js";
import cartsRoute from "./routes/carts.router.js";
import viewsRoute from "./routes/views.router.js";
import messagesRoute from "./routes/messages.router.js";

// Data
import products from "./data/products.json" assert { type: "json" };

// Mongoose
import mongoose from "mongoose";
import { messageModel } from "./dao/mongo/models/messages.model.js";
mongoose.connect('mongodb+srv://GonzaloTor:olakease88@e-commerce.j0x2p.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handlebars
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);
app.use("/messages", messagesRoute);
app.use("/", viewsRoute);

// Socket & Server:
import { Server } from "socket.io";
import http from "http";
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.emit("products", products);

  socket.on("message", async (data) => {
    await messageModel.create({
      user: data.user,
      message: data.message,
    });

    const messagesDB = await messageModel.find();
    io.emit("messagesDB", messagesDB);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
