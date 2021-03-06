"use strict";

angular.module("ALC", ["ALCRoute", "ALCService", "ALCController", "ui.bootstrap", "angular-loading-bar"])

    .constant("API_BASE_URI", "https://studentresource.herokuapp.com/api")
     
    //.constant("WEBSOCKET", env.WEBSOCKET) //For Socket.IO

    //.constant("DT_OPTS", { scrollY: "45vh", autoWidth: true, scrollCollapse: true, paging: false, searching: false, info: true }) //For Datatables

    .config(["$httpProvider", function($httpProvider){
        $httpProvider.interceptors.push("AuthInterceptor");
    }])

    .run(["$rootScope", "$filter", "$state", "$transitions", "$window", function ($rootScope, $filter, $state, $transitions, $window){
        $rootScope.currentDate = new Date();

        console.log($rootScope.currentDate);

        //Scrolls page to top after successful transition to the called route
        $transitions.onSuccess({ to: "*" }, function (trans) {
            if (trans.success) {
                $window.scrollTo(0, 0);
            }
        });

        //Verifies if a logged in user is on the login page or signup page
        $transitions.onBefore({ to: function (state) {
            return state.data !== null && state.data.authorization === false && state.data.redirect === true;
        } }, function (trans) {
            let $state = trans.router.stateService;
            let Profile = trans.injector().get("Profile");
            let Auth = trans.injector().get("Auth");

            if (Auth.is_logged_in()) {
                Profile.me().then(function (response) {
                    if (!response.data) {
                        Auth.clear_token();
                        $state.transitionTo("offline");
                    } else {
                        if (response.data.userType === "Admin")
                            $state.transitionTo("dashboard.student.list");
                        else
                            $state.transitionTo("dashboard.profile");
                    }
                    return false;
                }).catch(function (err) {
                    $state.transitionTo("offline");
                    return false;
                });
            }
        });

        //Verifies if a user not looged in is trying to access a restricted page
        $transitions.onBefore({ to: function (state) {
            return state.data !== null && state.data.authorization === true && state.data.redirect === true;
        } }, function (trans) {
            let $state = trans.router.stateService;
            let Profile = trans.injector().get("Profile");
            let Auth = trans.injector().get("Auth");

            if (!Auth.is_logged_in()) {
                $state.transitionTo("index");
                return false;
            }
        });

        //Logout function
        $rootScope.destroySession = function () {
            if (Auth.destroy_session()) {
                $state.go("index", null, { reload: true });
            }
        };
    }])
;