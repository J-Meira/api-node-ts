import express from "express";

const server = express();

server.get("/", (_, res) => res.send("Hi!"));

export { server };
