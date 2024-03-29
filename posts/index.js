const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const { default: axios } = require("axios");

// to store all posts in-memory
const posts = {};

const app = express();
// to parse request bodies, just like body-parser, infact uses
// body-parser under the hood
app.use(cors());
app.use(express.json());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Please supply a post title" });
  }
  const id = randomBytes(4).toString("hex");
  posts[id] = { id, title };
  await axios.post("http://localhost:4005/events", {
    type: "Post Created",
    data: { id, title },
  });
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  res.send({});
});

app.listen(4000, () => console.log("Posts listening on 4000"));
