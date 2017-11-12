"use strict";

const jsonwebtoken  = require('jsonwebtoken');
const { secretKey } = require('../config/database');
const UserModel  = require('../Model/user');

const __token_middleware = (userObj, duration = 86400) => {
    return jsonwebtoken.sign(userObj, secretKey, { expiresIn: duration });
};

const __auth_middleware = (request, response, next) => {
    let token = request.body.token || request.query.token || request.headers['x-access-token']
    
    if (!token) {
        response.status(200).send({
            status: 403,
            success: false,
            message: "No valid student token found"
        });
        return false;
    }

    jsonwebtoken.verify(token, secretKey, (err, decoded) => {
        if (err) return next(err);

        UserModel.findOne({ _id: decoded._id, available: true }).exec((err, document) => {
            if (err) return next(err);

            if (!document) {
                response.status(200).send({
                    status: 403,
                    success: false,
                    message: "Invalid user token found"
                });
                return false;
            }

            request.user = document;
            next();
        });
    });
};

module.exports = {
    authMiddleware  : __auth_middleware,
    tokenMiddleware : __token_middleware
};