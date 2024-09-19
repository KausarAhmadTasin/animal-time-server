const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Animal time server is running");
});

app.listen(port, () => {
  console.log(`Animal server is running on port: ${port}`);
});
