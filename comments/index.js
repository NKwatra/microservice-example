const express = require("express");
const { randomBytes } = require("crypto");

// store comments in memory
const commentsByPostId = {};

const app = express();
app.use(express.json());

app.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  res.send(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Please supply a comment content" });
  }
  const commentId = randomBytes(4).toString("hex");
  const { id: postId } = req.params;
  const newComment = { id: commentId, content };
  const existingComments = commentsByPostId[postId] || [];
  commentsByPostId[postId] = [...existingComments, newComment];
  res.status(201).send(newComment);
});

app.listen(4001, () => console.log("Comments listening on 4001"));
