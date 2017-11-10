"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const { database, databaseName } = require('./config/database');
//const MongoClient = require('mongodb').MongoClient
const cors = require('cors');

let app = express();

let http = require("http").Server(app);
let socket_io = require('socket.io')(http);

app.use(cors());

mongoose.connect(database, function(err) {
    if (err) {
        console.log("connection to database failed");
    } else {
        console.log(" Connected to database " + databaseName);
    }
});

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
//app.use('/scripts', express.static(`${__dirname }/node_modules`))

let api = require("./app/api")(app, express, socket_io);

app.use("/api", api);
app.get('/' , function(req,res){
    res.send("/views/partials/alc.partial.index.html");
})

http.listen(port, function(err) {
    if (err) {
        console.log(err)
    } else {
        console.log("app listening on port " + port);
    }
// <<<<<<< HEAD
// =======
});

app.use((err, request, response, next) => {
    response.status(500).send({
        status: 500,
        success: false,
        message: `Something went wrong`,
        errorMessage: err.message,
        errorCode: err.errorCode
    });
    return false;
// >>>>>>> 216abc35ea3b50a8adb270c33b38511524f0edc3
});