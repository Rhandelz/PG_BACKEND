const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDb = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const allowed = require("./config/corsOption");

const port = process.env.PORT || 3500;

connectDb();

app.use(express.json());

app.use(cors(allowed));

app.use(cookieParser());

app.use("/auth", require("./routes/authRouter"));
app.use("/post", require("./routes/postRoute"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening to port :  http://localhost:${port}`);
});
