const express = require("express");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

dotenv.config();

mongoose
        .connect(process.env.MONGO_URL)
        .then(() => console.log('connected'))
        .catch(() => console.log("error"));

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 7000;

app.use(authRoutes);
app.use(userRoutes);
app.use(taskRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));