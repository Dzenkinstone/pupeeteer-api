const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const pageRouter = require("./routes/api/page");

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cors());

app.use("/page", pageRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Iternal server error" } = err;
  res.status(status).json({ message });
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
