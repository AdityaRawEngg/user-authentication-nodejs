const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRouter = require("./routes/userRouters");
const protectedRoute = require("./middlewares/protectRoute");
const app = express();
dotenv.config({ path: "./config.env" });

app.use(cors());
app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());

mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, connection) => {
    if (err) {
      return console.log("Error in connection", err);
    }
    app.get("/", (req, resp) => {
      resp.send("User Authentication server");
    });
    app.get("/dashboard", protectedRoute);
    app.use("/users", userRouter);
    app.listen(process.env.PORT, () => {
      console.log(`Server Running on Port ${process.env.PORT}`);
    });
  }
);
