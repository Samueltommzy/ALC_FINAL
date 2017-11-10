"use strict";

angular.module("ALC", ["ALCRoute", "ALCService", "ALCController", "angular-loading-bar"])

    .constant("API_BASE_URI", "http://localhost:3000/api")

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

        /*
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
                        if (_.indexOf(["Secretary", "Designer"], response.data.accountType) > -1)
                            $state.transitionTo("dashboard.job");
                        else
                            $state.transitionTo("dashboard.report.filter");
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

            Profile.me().then(function (response) {
                if (!response.data) {
                    Auth.clear_token();
                    $state.transitionTo("offline");
                } else {
                    $rootScope.me = response.data;
                }
                return false;
            }).catch(function (err) {
                $state.transitionTo("offline");
                return false;
            });
        });
        */

        //Logout function
        $rootScope.destroySession = function () {
            if (Auth.destroy_session()) {
                $state.go("index", null, { reload: true });
            }
        };
    }])
;