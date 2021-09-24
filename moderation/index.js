const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "Comment Created") {
    console.log("data received", data);
    const status = data.content.includes("orange") ? "rejected" : "approved";
    await axios.post("http://localhost:4005/events", {
      type: "Comment Moderated",
      data: { ...data, status },
    });
  }

  res.send({});
});

app.listen(4003, () => console.log("Moderation running on 4003"));
