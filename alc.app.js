"use strict";

const express = require("express");

let alcApp = express();

let http = require("http").Server(alcApp);
let io = require("socket.io")(http);

alcApp.use(express.static(__dirname + "/public"));
alcApp.use("/npm", express.static(__dirname + "/node_modules"));
alcApp.use("/bower", express.static(__dirname + "/bower_components"));

alcApp.get("*", function (request, response) {
    response.sendFile(__dirname + "/public/app/views/index.html");
});

http.listen((process.env.PORT || 3001), function (err) {
    if (err) return false;

    console.log("ALC App running on port " + (process.env.APP_PORT || 3001 ));
});