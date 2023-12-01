import express from "express";
const app = express();
import cors from "cors";
import routes from "./src/routes";
import http from 'http';
import { Server } from "socket.io";

const server = http.createServer(app);

export const io = new Server(server, { cors: { origin: '*' } });
export let clients = [];

io.on('connection', (client) => {
  clients.push(client);

  client.on("waiter_message", (message) => {
    for (let client of clients) {
      client.emit("waiter_message", message);
    }
  })

  client.on('disconnect', () => {
    clients.splice(clients.indexOf(client), 1);
  })
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(routes);

server.listen(3000, () => {
  console.log("listening 3000 port");
});
