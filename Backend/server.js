const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Important for cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGODB_URI);


const user = require('./routes/userRoute')
app.use("/api/v1", user)

const appointment = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointment);

app.use("/", (req, res, next) => {
    res.status(404).json({
        status: "fail",
        ok: false,
        message: "No such route founded in server...💣💣💣",
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));