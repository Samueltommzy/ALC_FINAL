"use strict";

angular.module("ALCRoute", ["ui.router"])

    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.hashPrefix("");
        $locationProvider.html5Mode(true);

        $stateProvider

            //Login route and landing page
            .state("index", {
                url: "/",
                templateUrl: "../../view/partials/alc.partial.index.html",
                controller: "AuthController",
                controllerAs: "ALCAuth",
                data: {
                    authorization: false,
                    redirect     : true,
                    allow        : "*"
                },
                resolve: {
                    data: ["$rootScope", "$q", function ($rootScope, $q) {
                        let asyncPromise = [], routeData = {};
                        return routeData;
                    }]
                },
                onEnter: function ($rootScope) {
                    $rootScope.title = "Welcome | ALC Student Application";
                }
            })

            //Abstract route for the dashboard for either students or admin
            .state("dashboard", {
                url: "/dashboard",
                templateUrl: "../../view/partials/alc.partial.dashboard.html",
                controller: "DashboardController",
                controllerAs: "ALCDashboard",
                abstract: true,
                data: {
                    authorization: true,
                    redirect     : true,
                    allow        : "*"
                },
                resolve: {
                    data: ["$rootScope", "$q", "Profile", function ($rootScope, $q, Profile) {
                        let asyncPromise = [], routeData = {};

                        asyncPromise.push(
                            Profile.me().then(function (response) {
                                routeData.profile = response.data;
                            }).catch(function (err) {
                                routeData.profile = null;
                            })
                        );

                        return $q.all(asyncPromise).then(function (response) {
                            return routeData;
                        }).catch(function (err) {
                            return routeData;
                        });
                    }]
                }
            })

            //Route for viewing all the students registered NOTE: YOU NEED TO CREATE THE STUDENT SERVICE BEFORE INJECTING IT HERE
            .state("dashboard.student", {
                url: "/student",
                templateUrl: "../../view/createStudent/index.html",
                controller: "StudentController",
                controllerAs: "ALCStudent",
                data: {
                    authorization: true,
                    redirect     : true,
                    allow        : "*"
                },
                resolve: {
                    data: ["$rootScope", "$q", "$stateParams", "Student", function ($rootScope, $q, $stateParams, Student) {
                        let asyncPromise = [], routeData = {};

                        asyncPromise.push(
                            Student.all().then(function (response) {
                                routeData.student = response.data;
                            }).catch(function (err) {
                                routeData.student = null;
                            })
                        );

                        return $q.all(asyncPromise).then(function (response) {
                            return routeData;
                        }).catch(function (err) {
                            return routeData;
                        });
                    }]
                },
                onEnter: function ($rootScope) {
                    $rootScope.title = "Manage Students | ALC Application";
                }
            })
        ;

        $urlRouterProvider.otherwise("/");
    }]);