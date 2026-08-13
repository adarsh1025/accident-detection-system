const express = require("express");
const cors = require("cors");
const locationRoutes = require("./routes/locationRoutes");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const alertRoutes = require("./routes/alertRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/hospitals", hospitalRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;
