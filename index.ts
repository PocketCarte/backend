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
  console.log(`Cliente no WS conectado ${client.id}`)
  clients.push(client);

  client.on('disconnect', () => {
    clients.splice(clients.indexOf(client), 1);
    console.log(`Cliente no WS desconectado ${client.id}`)
  })
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(routes);

server.listen(3000, () => {
  console.log("listening 3000 port");
});
