"use strict";

angular.module("ALCService", [])

    //Authentication Service for making request to the API for authenticating and/or creating a user
    .factory("Auth", ["$http", "$q", "AuthToken", "API_BASE_URI", function ($http, $q, AuthToken, API_BASE_URI) {
        let authFactory = {};

        //Authenticate user
        authFactory.authorize_user = function (userObj) {
            return $http.post(API_BASE_URI + "/users/login", userObj).then(function (response) {
                if (response.data.authenticationToken) {
                    AuthToken.set_token(response.data.authenticationToken, (userObj.remember ? "Long" : "Short"));
                }
                return response.data;
            }).catch(function (err) {
                return err.data;
            });
        };

        //Remove the token from localstorage or sessionstorage
        authFactory.destroy_session = function () {
            AuthToken.set_token();
            return true;
        };

        //Check if a token exists in localstorage or sessionstorage
        authFactory.is_logged_in = function () {
            return !!AuthToken.get_token();
        };

        //Remove the token from localstorage or sessionstorage
        authFactory.clear_token = function () {
            AuthToken.set_token();
        };

        return authFactory;
    }])

    .factory("Profile", ["$http", "$q", "API_BASE_URI", function ($http, $q, API_BASE_URI) {
        let profileFactory = {};

        profileFactory.me = function (userObj) {
            return $http.get(API_BASE_URI + "/users/me").then(function (response) {
                return response.data;
            }).catch(function (err) {
                return err.data;
            });
        };

        return profileFactory;
    }])

    .factory("Student", ["$http", "$q", "API_BASE_URI", function ($http, $q, API_BASE_URI) {
        let studentFactory = {};

        studentFactory.retrieve = function (userObj) {
            return $http.get(API_BASE_URI + "/students/retrieve").then(function (response) {
                return response.data;
            }).catch(function (err) {
                return err.data;
            });
        };

        return studentFactory;
    }])
    
    //Handles token storing and retrieving
    .factory("AuthToken", ["$window", function ($window) {
        let authTokenFactory = {};

        //Sets the token to localstorage or sessionstorage
        authTokenFactory.set_token = function (token, period) {
            if (token) {
                if (period === "Long") $window.localStorage.setItem("ALCAuthToken", token);
                else $window.sessionStorage.setItem("ALCAuthToken", token);
            } else {
                $window.localStorage.removeItem("ALCAuthToken");
                $window.sessionStorage.removeItem("ALCAuthToken");
            }
        };

        //Gets the token from localstorage or sessionstorage
        authTokenFactory.get_token = function () {
            return ($window.localStorage.getItem("ALCAuthToken") || $window.sessionStorage.getItem("ALCAuthToken"));
        };

        return authTokenFactory;
    }])

    .factory("AuthInterceptor", ["$state", "$q", "AuthToken", function ($state, $q, AuthToken) {
        let authInterceptorFactory = {};

        //Injects token data into API requests
        authInterceptorFactory.request = function (config) {

            let ALCToken = AuthToken.get_token();

            if (ALCToken) config.headers["x-access-token"] = ALCToken;

            return config;
        };

        //handles bad response from the API
        authInterceptorFactory.responseError = function (response) {
            console.log(response);

            if (response.status === 403) $state.go("login", null, { reload: true });

            if (response.status === -1) $state.go("offline", null, { reload: true });

            return $q.reject(response);
        };

        return authInterceptorFactory;
    }])

    //Injects underscore/lodash into the app, check out lodash
    .factory("_", ["$window", function ($window) {
        if (!$window._) {}
        return $window._;
    }])

    /* Activate if you want to use socket io
    .factory("SocketIO", ["$rootScope", "WEBSOCKET", function ($rootScope, WEBSOCKET) {
        let socketFactory = {};

        let socket = io.connect(WEBSOCKET);
        let disconnecting = false;

        socketFactory.on = function (eventName, callback) {
            socket.on(eventName, function () {
                let args = arguments;
                if (!disconnecting) {
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                } else {
                    callback.apply(socket, args);
                }
            });
        };

        socketFactory.emit = function () {
            socket.emit(eventName, data, function () {
                let args = arguments;
                $rootScope.$apply(function () {
                    if (callback) callback.apply(socket, args);
                });
            });
        };

        socketFactory.disconnect = function () {
            disconnecting = true;
            socket.disconnect();
        };

        socketFactory.socket = socket;

        return socketFactory;
    }])
    */
;