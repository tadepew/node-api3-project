const express = require("express");
const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");
const server = express();

//global middleware
server.use(express.json());

server.get("/", logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/posts", logger, postRouter);

server.use("/api/users", logger, userRouter);

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} Request to ${req.originalUrl}`);

  next();
}

module.exports = server;
