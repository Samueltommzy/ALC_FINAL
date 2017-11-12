"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

let studentSchema = new Schema({
    _userId: { type: Schema.ObjectId, required: true, ref: "User" },
    _departmentId: { type: Schema.ObjectId, required: true, ref: "Department" },
    _levelId: { type: Schema.ObjectId, required: true, ref: "Level" },
    matricNumber: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

module.exports = mongoose.model("Student", studentSchema);