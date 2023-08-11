import { createServer } from "net";

const server = createServer();

server.listen(6379, "127.0.0.1", () => {
  console.log("started LiteCache server");
});

server.on("connection", (socket) => {
  socket.setEncoding("utf-8");
  console.log("client connected");
  socket.write("connected to LiteCache server\r\n");
});
