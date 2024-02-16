require("./src/config/conn");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { connect } = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(fileUpload());
app.use(cors());

app.use(express.static(path.join(__dirname, "/uploads")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authRoute = require("./src/routes/auth.routes");
const fileRoute = require("./src/routes/file.routes");
const userRoute = require("./src/routes/user.routes");

app.use("/user", userRoute);
app.use("/file", fileRoute);
app.use("/auth", authRoute);

app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname, "/src/view/serverRunning.html"));
});

var port = process.env.PORT || 5000;

app.listen(port, () => {
 console.log("Server is Running on " + port);
});
