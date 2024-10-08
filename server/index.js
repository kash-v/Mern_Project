const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./Routes/auth");
const noteRoutes = require("./Routes/notes");

const app = express();

const PORT = 6969;

dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


try {
    mongoose.connect('mongodb+srv://kashvisuvagiya:kashMongodb@cluster0.njmry.mongodb.net/notesApp')
    .then(() => console.log('Connection Successful'))
    .catch((err) => console.error('MongoDB connection error:', err));
} catch (error) {
    console.error('Error occurred:', error);
}

app.get("/", (req, res) => {
    res.send("Server Is Running");
});
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/files", express.static("files"));

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
