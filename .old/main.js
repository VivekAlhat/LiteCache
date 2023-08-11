import { createServer } from "net";
import { addMilliseconds, compareAsc } from "date-fns";

const server = createServer();

server.on("connection", (socket) => {
  socket.setEncoding("utf-8");
  console.log("client connected");
  socket.write("connected to LiteCache server\r\n");

  const db = new Map();
  const transactions = new Map();

  socket.on("data", (data) => {
    const input = data.toString("utf-8").trim();
    const commands = input.split(" ");
    const [action, ...args] = commands;

    switch (action.toLowerCase()) {
      case "ping":
        socket.write("+PONG\r\n");
        break;
      case "echo":
        if (args.length >= 1) {
          const input = args.join(" ");
          socket.write(`+${input}\r\n`);
        } else {
          socket.write("-ERR expected 1 argument, received 0\r\n");
        }
        break;
      case "set":
        const [key, ...values] = args;
        const [val, _, expiryDuration] = values;
        db.set(key, val);

        const current = new Date();
        const expiry = addMilliseconds(current, expiryDuration);

        if (expiryDuration) {
          transactions.set(key, expiry);
        } else {
          transactions.delete(key);
        }
        socket.write("+OK\r\n");
        break;
      case "get":
        const [searchKey] = args;
        const value = db.get(searchKey);

        const today = new Date();
        const expirationDate = transactions.get(searchKey);

        if (expirationDate) {
          if (compareAsc(expirationDate, today) === 1) {
            value ? socket.write(`+${value}\r\n`) : socket.write("-Nil\r\n");
          } else {
            socket.write("-Nil\r\n");
          }
        } else {
          value ? socket.write(`+${value}\r\n`) : socket.write("-Nil\r\n");
        }
        break;
      case "delete":
        const [delKey] = args;
        db.delete(delKey);
        socket.write("+OK\r\n");
        break;
      default:
        socket.write("-ERR unknown command\r\n");
        break;
    }
  });

  socket.on("end", () => {
    console.log("client disconnected");
  });
});

server.listen(6379, "127.0.0.1", () => {
  console.log("started LiteCache server");
});
