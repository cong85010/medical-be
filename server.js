require("./src/config/conn");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const path = require("path");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const dayjs = require("dayjs");
dayjs.extend(customParseFormat);

const app = express();
app.use(fileUpload());
app.use(
  cors({
    origin: "*",
  })
);

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authRoute = require("./src/routes/auth.routes");
const fileRoute = require("./src/routes/file.routes");
const userRoute = require("./src/routes/user.routes");
const appointmentRoute = require("./src/routes/appointment.routes");
const medicineRoute = require("./src/routes/medicine.routes");
const medicalRecordRoute = require("./src/routes/medicalRecord.routes");
const orderRoute = require("./src/routes/order.routes");
const meetingRoute = require("./src/routes/meeting.routes");

app.use("/user", userRoute);
app.use("/file", fileRoute);
app.use("/auth", authRoute);
app.use("/appointment", appointmentRoute);
app.use("/medicine", medicineRoute);
app.use("/medical-record", medicalRecordRoute);
app.use("/order", orderRoute);
app.use("/meeting", meetingRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/view/serverRunning.html"));
});

var port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server is Running on " + port);
});
