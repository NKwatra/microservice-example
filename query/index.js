const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const postsAndComments = {};

app.get("/posts", (req, res) => {
  res.send(postsAndComments);
});

app.post("/events", (req, res) => {
  const event = req.body;
  if (event.type === "Post Created") {
    const { id, title } = event.data;
    postsAndComments[id] = { id, title, comments: [] };
  } else if (event.type === "Comment Created") {
    const { id, content, postId, status } = event.data;
    if (postsAndComments[postId]) {
      postsAndComments[postId].comments.push({ id, content, status });
    }
  } else if (event.type === "Comment Updated") {
    const { postId, id, content, status } = event.data;
    const comments = postsAndComments[postId].comments;
    const commentIndex = comments.findIndex((comment) => comment.id === id);
    comments[commentIndex] = {
      id: id,
      content: content,
      status: status,
    };
  }
  res.send({});
});

app.listen(4002, () => console.log("Query listening on 4002"));
