const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../build')));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/react", (req, res) => {
  //res.sendFile(path.join("..", "/build/index.html"));
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});