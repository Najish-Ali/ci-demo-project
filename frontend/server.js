const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

app.use(express.static('views'));

app.get("/api/stress", (req, res) => {
    const backend = process.env.BACKEND_URL;
    fetch(`${backend}/stress`)
        .then(r => r.json())
        .then(d => res.json(d))
        .catch(e => res.json({ error: e.toString() }));
});

app.listen(8081, () => console.log("Frontend running on 8081"));
