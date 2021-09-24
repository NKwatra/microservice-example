const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const { default: axios } = require("axios");

// store comments in memory
const commentsByPostId = {};

const app = express();
app.use(cors());
app.use(express.json());

app.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  res.send(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Please supply a comment content" });
  }
  const commentId = randomBytes(4).toString("hex");
  const { id: postId } = req.params;
  const newComment = { id: commentId, content, status: "pending" };
  const existingComments = commentsByPostId[postId] || [];
  commentsByPostId[postId] = [...existingComments, newComment];
  await axios.post("http://localhost:4005/events", {
    data: { ...newComment, postId },
    type: "Comment Created",
  });
  res.status(201).send(newComment);
});

app.post("/events", async (req, res) => {
  const event = req.body;
  const { type, data } = event;
  if (type === "Comment Moderated") {
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];
    const commentIndex = comments.findIndex((item) => item.id === id);
    comments[commentIndex] = { ...comments[commentIndex], status };
    await axios.post("http://localhost:4005/events", {
      type: "Comment Updated",
      data: { ...comments[commentIndex], postId },
    });
  }
  res.send({});
});

app.listen(4001, () => console.log("Comments listening on 4001"));
