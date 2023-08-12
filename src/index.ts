import { createServer } from "net";
import { echo, get, ping, remove, set } from "./commands";

const server = createServer();

server.listen(6379, "127.0.0.1", () => {
  console.log("started LiteCache server");
});

server.on("connection", (socket) => {
  socket.setEncoding("utf-8");
  console.log("client connected");
  socket.write("connected to LiteCache server\r\n");

  const db = new Map();
  const expiryStore = new Map();

  socket.on("data", (data: string) => {
    const commands = data.trim().split(" ");
    const [action, ...args] = commands;

    switch (action.toLowerCase()) {
      case "ping": {
        const output = ping();
        socket.write(output);
        break;
      }
      case "echo": {
        try {
          const output = echo(args);
          socket.write(`+${output}\r\n`);
        } catch (error: unknown) {
          socket.write(`-${error}\r\n`);
        }
        break;
      }
      case "set": {
        const [key, value, _, duration] = args;
        const output = set(db, expiryStore, key, value, duration);
        socket.write(output);
        break;
      }
      case "get": {
        const [key] = args;
        const output = get(db, expiryStore, key);
        socket.write(output);
        break;
      }
      case "delete": {
        const [key] = args;
        const output = remove(db, key);
        socket.write(output);
        break;
      }
      default:
        socket.write("-Error: unknown command\r\n");
    }
  });

  socket.on("end", () => console.log("client disconnected"));
});
