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
            .state("createStudent",{
                url :"/createStudent",
                templateUrl: "app/views/partials/alc.partial/create_student.html",
                controller: "",
                controllerAs: "",
                data:{
                    authorization : true,
                    redirect: true,
                    allow:"*"
                },
                resolve:{
                    data:["$rootscope","$q", function($rootscope,$q){

                    }]
                }
            })

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
        ;

        $urlRouterProvider.otherwise("/index");
    }]);