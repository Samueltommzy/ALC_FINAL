"use strict";

angular.module("ALCRoute", ["ui.router"])

    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.hashPrefix("");
        $locationProvider.html5Mode(true);

        $stateProvider

            .state("index", {
                url: "/index",
                templateUrl: "app/views/partials/alc.partial.index.html",
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

            .state("dashboard", {
                url: "/dashboard",
                templateUrl: "app/views/partials/alc.partial.dashboard.html",
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

            .state("dashboard.student", {
                url: "/student",
                templateUrl: "app/views/partials/alc.partial.dashboard.student.html",
                data: {
                    authorization: true,
                    redirect     : true,
                    allow        : ["Admin"]
                }
            })

            .state("dashboard.student.list", {
                url: "/student/list",
                views: {
                    "list": {
                        templateUrl: "app/views/partials/alc.partial.dashboard.student.list.html",
                        controller: "StudentController",
                        controllerAs: "ALCStudent"
                    }
                },
                data: {
                    authorization: true,
                    redirect     : true,
                    allow        : ["Admin"]
                },
                resolve: {
                    data: ["$rootScope", "$q", "Student", function ($rootScope, $q, Student) {
                        let asyncPromise = [], routeData = {};

                        asyncPromise.push(
                            Student.retrieve().then(function (response) {
                                routeData.students = response.data;
                            }).catch(function (err) {
                                routeData.students = null;
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
                    $rootScope.title = "Manage Students | ALC Student Application";
                }
            })
            .state("dashboard.student.create", {
                url: "/student/list",
                views: {
                    "list": {
                        templateUrl: "app/views/partials/alc.partial.dashboard.student.create.html",
                        controller: "StudentController",
                        controllerAs: "ALCStudent"
                    }
                },
                data: {
                    authorization: true,
                    redirect     : true,
                    allow        : ["Admin"]
                },
                resolve: {
                    data: ["$rootScope", "$q", "Department", "Level", function ($rootScope, $q, Department, Level) {
                        let asyncPromise = [], routeData = {};

                        asyncPromise.push(
                            Department.retrieve().then(function (response) {
                                routeData.departments = response.data;
                            }).catch(function (err) {
                                routeData.departments = null;
                            })
                        );

                        asyncPromise.push(
                            Level.retrieve().then(function (response) {
                                routeData.levels = response.data;
                            }).catch(function (err) {
                                routeData.levels = null;
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
                    $rootScope.title = "Enroll Student | ALC Student Application";
                }
            })
        ;

        $urlRouterProvider.otherwise("/index");
    }]);