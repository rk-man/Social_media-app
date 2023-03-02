const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const photoRouter = require("./routes/photoRoutes");
const app = express();

app.use(cors());
app.use(
    express.json({
        limit: "50mb",
    })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/photos", photoRouter);

module.exports = app;
