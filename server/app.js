// Setup
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const DBConnection = require("./dbConnection");
const db = DBConnection.getInstance();

const mainRoutes = require("./routes/mainRoutes.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(mainRoutes.router);

// Start the server and connect the database

async function start() {
    try {
        await db.connectDB();
        app.listen(process.env.PORT, () => {
            console.log(
                "Server is currently listening on port: " + process.env.PORT
            );
        });
    } catch (error) {
        console.log(error);
    }
}

start();

// Create an Error Handler
