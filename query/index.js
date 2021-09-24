const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const postsAndComments = {};

const handleEvent = (event) => {
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
};

app.get("/posts", (req, res) => {
  res.send(postsAndComments);
});

app.post("/events", (req, res) => {
  const event = req.body;
  handleEvent(event);
  res.send({});
});

app.listen(4002, async () => {
  console.log("Query listening on 4002");
  const res = await axios.get("http://localhost:4005/events");
  const events = res.data;
  for (const event of events) {
    handleEvent(event);
  }
});
