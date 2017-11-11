"use strict";

const _                                   = require(`lodash`);
const StudentModel                        = require(`../Model/student`);
const { authMiddleware, tokenMiddleware } = require(`../middleware/middleware`);
const userModel                           = require(`../Model/user`); 

module.exports = (express, socket_io) => {
    const userRoute = express.Router();

    /*
    * Authentication middleware
    */
    userRoute.use(authMiddleware);

    /*
    * CREATE user endpoint*
    */
    userRoute.post('/create' , function(request,response,next){
        const userObj = {
            userName : request.body.userName,
            password: request.body.password,
            userType: request.body.userType
        };

        userModel.find({ userName: userObj.userName,userType: userObj.userType, available: true }).exec((err, documents) =>{
            if(err) return next(err);
            const user = new userModel(userObj);
            user.save((err, document) => {
                if (err) return next(err);
    
                response.status(200).send({
                    status: 200,
                    success: true,
                    message: "user created successfully",
                    data: document
                });
            });
        });
    });

    /* login  */
     userRoute.post("/login", (request, response, next) => {
        const userObj = {
            userName: request.body.userName,
            password: request.body.password
        };
        
        userModel.findOne({ userName: userObj.userName, available: true }).exec((err, document) => {
            if (err) return next(err);

            if (!document) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "Invalid credentials, please try again"
                })
                return false;
            }
            
            document.passwordCheck(userObj.password, (err, isMatch) => {
                if (err) return next(err);

                if (!isMatch) {
                    response.status(200).send({
                        status: 200,
                        success: false,
                        message: "Invalid credentials, please try again"
                    })
                    return false;
                }

                const tokenObj = {
                    _id: document._id,
                    userName: document.userName,
                    userType: document.userType
                };
    
                const token = tokenMiddleware(tokenObj);
    
                response.status(200).send({
                    status: 200,
                    success: true,
                    message: `logged in as ${userType} `,
                    data: _.omit(document.toObject(), 'password'),
                    authenticationToken: token
                });
            });
        });
    });

    
    return userModel;
}