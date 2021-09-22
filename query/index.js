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
    const { id, content, postId } = event.data;
    if (postsAndComments[postId]) {
      postsAndComments[postId].comments.push({ id, content });
    }
  }
  res.send({});
});

app.listen(4002, () => console.log("Query listening on 4002"));
