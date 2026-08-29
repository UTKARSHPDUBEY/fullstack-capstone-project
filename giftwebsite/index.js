const express = require("express");
const path = require("path");

const app = express();
const PORT = 9000;

app.use(express.static(path.join(__dirname, "build")));

app.get("/home.html", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "home.html"));
});

app.listen(PORT, () => {
    console.log(`GiftWebsite running on port ${PORT}`);
});