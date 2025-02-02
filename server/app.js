const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser")
const redis = require("redis");

const app = express();
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();


const routes = require("./routes/faqRoutes");

const dbURI = process.env.MONGO_URL;

// MongoDB connection
//{ useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(dbURI)
.then(() => {
    app.listen(3001, () => console.log("Server running on port 3001"));
})
.catch(err => console.log("MongoDB Connection Error:", err));

// Redis connection
const redisClient = require("./config/redisClient");


//routes
app.use("/api",routes);


app.use((req, res) => {  //fires for every single request|| functions invocs only if express dont find any url matches above
    res.status(404).render('404', { title: '404' });
});

module.exports = app;