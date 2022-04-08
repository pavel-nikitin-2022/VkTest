const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } })
let messages = []
let archive = []

function check(array, i) {
  let res = true
  array.forEach(element => {
    if (element[1] == i[1]) {
      res = false
    }
  });
  console.log(res)
  return res
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("here");

  socket.on("send", (text) => {
    messages.push(text)
    socket.emit("messages", messages)
  })

  socket.on("get", () => {
    socket.emit("messages", messages)
  })

  socket.on("save", (data) => {
    if (check(archive, data) == true) {
      archive.push(data)
      socket.emit("archive", archive)
      socket.emit("add", true)
    }
    else {
      socket.emit("add", false)
    }
  })

  socket.on("get_archive", () => {
    socket.emit("archive", archive)
  })

  socket.on("del", (data) => {
    for (let i = 0; i < archive.length; i += 1) {
      if (data[1] == archive[i][1]) {
        archive.splice(i, 1)
        socket.emit("archive", archive)
      }
    }
  })
  
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});