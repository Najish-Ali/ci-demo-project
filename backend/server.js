const express = require("express");
const stress = require("./stress");

const app = express();

app.get("/", (req, res) => res.send("Backend Alive"));

app.get("/stress", (req, res) => {
    const result = stress();
    res.json({ message: result, timestamp: Date.now() })
});

app.listen(3000, () => console.log("Backend running on 3000"));
