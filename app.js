const express = require("express");
const app = express();

app.use("/", (req, res) => {
  console.log("HI");
  res.send("I'm Deployed!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  "Server Started!";
});
