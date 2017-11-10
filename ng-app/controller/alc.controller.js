"use strict";

angular.module("ALCController", ["ALCService"])

    .controller("AuthController", ["$rootScope", "$scope", "$state", "Auth", "data", function ($rootScope, $scope, $state, Auth, data) {
        let ALCAuth = this;
        ALCAuth.processing = false;
        ALCAuth.credentials = {};

        ALCAuth.resolvedData = data;

        //This function is fired when the log in form is submitted
        ALCAuth.authorizeUser = function () {
            ALCAuth.processing = true;  //Indicate that we are processing your request

            //Send the request to the Auth service to handle the request
            Auth.authorize_user(ALCAuth.credentials).then(function (response) {
                ALCAuth.processing = false;  //Remove the loading indicator
                if (!response.success) {
                    alert(response.message);  //Alert the response from the API
                    return false;
                }

                alert(response.message);  //Alert the response from the API
                $state.go("dashboard.student", null, {reload: true});  //Redirect to the dashboard route
            }).catch(function (err) {
                ALCAuth.processing = false;
                alert("Failed to contact Print Control application server, please try again");
            });
        };
    }])
;