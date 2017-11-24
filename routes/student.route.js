"use strict";

const _                                   = require(`lodash`);
const StudentModel                        = require(`../Model/student`);
const UserModel                        = require(`../Model/user`);
const { authMiddleware, tokenMiddleware } = require(`../middleware/middleware`);

module.exports = (express, socket_io) => {
    const studentRoute = express.Router();

    /*
    * Authentication middleware
    */
    studentRoute.use(authMiddleware);
    
    /*
    * CREATE student endpoint
    */
    studentRoute.post("/create", (request, response, next) => {
        let userObj = {
            userName : request.body.matricNumber,
            password: request.body.matricNumber,
            userType: "Student"
        };

        UserModel.find({ userName: userObj.userName, userType: userObj.userType, available: true }).exec((err, documents) => {
            if(err) return next(err);

            if (documents.length) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "User already exists"
                });
                return false;
            }

            let user = new UserModel(userObj);
            
            user.save((err, document) => {
                if (err) return next(err);
    
                request.body._userId = document._id;
                next();
            });
        });
    }, (request, response, next) => {
        const studentObj = {
            _userId: request.body._userId,
            _departmentId: request.body._departmentId,
            _levelId: request.body._levelId,
            matricNumber: request.body.matricNumber,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email
        };
console.log(request.body);
        let searchObj = {
            $or: [
                { email: studentObj.email, available: true },
                { matricNumber: studentObj.matricNumber, available: true }
            ]
        };

        StudentModel.find(searchObj).exec((err, documents) => {
            if (err) return next(err);
            console.log(err);

            if (documents && documents.length) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "The email specified is already taken, please try again"
                });
                return false;
            }

            const student = new StudentModel(studentObj);
            
            student.save((err, document) => {
                if (err) return next(err);
    
                response.status(200).send({
                    status: 200,
                    success: true,
                    message: "Student created successfully",
                    data: document
                });
            });
        });
    });

    /*
    * RETRIEVE student endpoint
    */
    studentRoute.get("/retrieve/:_id", (request, response, next) => {
        StudentModel.findOne({ _id: request.params._id, available: true }).populate({
            path: '_departmentId _levelId',
            match: { available: true }
        }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Student data loaded",
                data: document
            });
        });
    });

    /*
    * RETRIEVE all students endpoint
    */
    studentRoute.get("/retrieve", (request, response, next) => {
        StudentModel.find({ available: true }).populate({
            path: '_departmentId _levelId',
            match: { available: true }
        }).exec((err, documents) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Student data loaded",
                data: documents
            });
        });
    });


    /*
    * UPDATE student endpoint
    */
    studentRoute.put("/update/:_id", (request, response, next) => {
        const _id = request.params._id;

        const studentObj = {
            _departmentId: request.body._departmentId,
            _levelId: request.body._levelId,
            matricNumber: request.body.matricNumber,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            updatedAt: new Date()
        };

        StudentModel.findOneAndUpdate({ _id: _id, available: true }, studentObj, { new: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Student updated successfully",
                data: document
            });
        });
    });

    /*
    * DELETE student endpoint
    */
    studentRoute.delete("/delete/:_id", (request, response, next) => {
        const _id = request.params._id;

        StudentModel.findOneAndUpdate({ _id: _id, available: true }, { available: false, updatedAt: new Date() }, { new: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Student deleted successfully",
                data: document
            });
        });
    });

    return studentRoute;
};