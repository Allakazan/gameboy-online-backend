const express = require("express");
const app = express();
const file = require("./file");

app.use(express.json({ extended: false }));

app.use("/api/file", file);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));