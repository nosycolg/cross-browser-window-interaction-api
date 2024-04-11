import express from "express";
import { Server, createServer } from "http";
import { Server as Io } from "socket.io";

export default class App {
  public app: express.Application;
  public server: Server;
  private socketIo: Io;
  private connectedUsers: Map<string, any>;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.socketIo = new Io(this.server, {
      cors: {
        origin: "*",
      },
    });
    this.connectedUsers = new Map<string, any>();

    this.socketIo.on("connection", (socket) => {
      console.log("user_connected", socket.id);

      this.connectedUsers.set(socket.id, socket);

      this.socketIo.emit("user_connected", Array.from(this.connectedUsers.keys()));

      socket.on("disconnect", () => {
        
        this.connectedUsers.delete(socket.id);
        console.log("user disconnected!", Array.from(this.connectedUsers.keys()));

        this.socketIo.emit("users_connected", Array.from(this.connectedUsers.keys()));
      });

      socket.on("alert", (userId) => {
        if (this.connectedUsers.has(userId)) {
          const userSocket = this.connectedUsers.get(userId);
          if (userSocket) {
            userSocket.emit("alert", userId);
          }
        } else {
          console.log("Usuário não encontrado!");
        }
      });
    });

    this.app.get("/monitors", (req, res) => {
      res.json(Array.from(this.connectedUsers.keys()));
    });
  }
}
