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
                console.log(response);

                alert(response.message);  //Alert the response from the API
                if (response.data.userType === 'Admin') $state.go("dashboard.student.list", null, {reload: true});  //Redirect to the dashboard route
                if (response.data.userType === 'Student') $state.go("dashboard.profile", null, {reload: true});  //Redirect to the dashboard route
            }).catch(function (err) {
                ALCAuth.processing = false;
                alert("Failed to contact Print Control application server, please try again");
            });
        };
    }])

    .controller("DashboardController", ["$rootScope", "$scope", "$state", "data", function ($rootScope, $scope, $state, data) {
        let ALCDashboard = this;
        
        ALCDashboard.resolvedData = data;
    }])

    .controller("StudentController", ["$rootScope", "$scope", "$state", "Student", "data", function ($rootScope, $scope, $state, Student, data) {
        let ALCStudent = this;
        
        ALCStudent.working = false;
        ALCStudent.newStudent = {};
        ALCStudent.editStudent = {};

        ALCStudent.resolvedData = data;

        ALCStudent.createStudent = function () {
            ALCStudent.working = true;

            Student.create(ALCStudent.newStudent).then(function (response) {
                ALCStudent.working = false;

                if (!response.success) {
                    alert(response.message);
                    return false;
                }

                alert(response.message);
                $state.go("dashboard.student.list", null, { reload: true });
            }).catch(function (err) {
                ALCStudent.working = false;
                alert("Error connecting to ALC Student API, please try again");
            });
        };

        ALCStudent.updateStudent = function () {
            ALCStudent.working = true;
            
            Student.update(ALCStudent.editStudent).then(function (response) {
                ALCStudent.working = false;

                if (!response.success) {
                    alert(response.message);
                    return false;
                }

                alert(response.message);
                $state.go("dashboard.student.list", null, { reload: true });
            }).catch(function (err) {
                ALCStudent.working = false;
                alert("Error connecting to ALC Student API, please try again");
            });
        };

        ALCStudent.deleteStudent = function (student, index) {
            if (confirm("Delete Student") === true) {
                ALCStudent.working = true;
                
                Student.delete({ _id: student._id }).then(function (response) {
                    ALCStudent.working = false;
    
                    if (!response.success) {
                        alert(response.message);
                        return false;
                    }
    
                    alert(response.message);
                    ALCStudent.resolvedData.students.splice(index, 1);
                }).catch(function (err) {
                    ALCStudent.working = false;
                    alert("Error connecting to ALC Student API, please try again");
                });
            }
        };
    }])

    .controller("DepartmentController", ["$rootScope", "$scope", "$state", "Department", "data", function ($rootScope, $scope, $state, Department, data) {
        let ALCDepartment = this;
        
        ALCDepartment.working = false;
        ALCDepartment.newDepartment = {};
        ALCDepartment.editDepartment = {};

        ALCDepartment.resolvedData = data;

        ALCDepartment.createDepartment = function () {
            ALCDepartment.working = true;

            Department.create(ALCDepartment.newDepartment).then(function (response) {
                ALCDepartment.working = false;

                if (!response.success) {
                    alert(response.message);
                    return false;
                }

                alert(response.message);
                $state.go("dashboard.department.list", null, { reload: true });
            }).catch(function (err) {
                ALCDepartment.working = false;
                alert("Error connecting to ALC Student API, please try again");
            });
        };

        ALCDepartment.updateDepartment = function () {
            ALCDepartment.working = true;
            
            Department.update(ALCDepartment.editDepartment).then(function (response) {
                ALCDepartment.working = false;

                if (!response.success) {
                    alert(response.message);
                    return false;
                }

                alert(response.message);
                $state.go("dashboard.department.list", null, { reload: true });
            }).catch(function (err) {
                ALCDepartment.working = false;
                alert("Error connecting to ALC Student API, please try again");
            });
        };

        ALCDepartment.deleteDepartment = function (department, index) {
            if (confirm("Delete Department") === true) {
                ALCDepartment.working = true;
                
                Department.delete({ _id: department._id }).then(function (response) {
                    ALCDepartment.working = false;
    
                    if (!response.success) {
                        alert(response.message);
                        return false;
                    }
    
                    alert(response.message);
                    ALCDepartment.resolvedData.departments.splice(index, 1);
                }).catch(function (err) {
                    ALCDepartment.working = false;
                    alert("Error connecting to ALC Student API, please try again");
                });
            }
        };
    }])

    .controller("LevelController", ["$rootScope", "$scope", "$state", "Level", "data", function ($rootScope, $scope, $state, Level, data) {
        let ALCLevel = this;
        
        ALCLevel.working = false;
        ALCLevel.newLevel = {};
        ALCLevel.editLevel = {};

        ALCLevel.resolvedData = data;

        ALCLevel.createLevel = function () {
            ALCLevel.working = true;

            Level.create(ALCLevel.newLevel).then(function (response) {
                ALCLevel.working = false;

                if (!response.success) {
                    alert(response.message);
                    return false;
                }

                alert(response.message);
                $state.go("dashboard.level.list", null, { reload: true });
            }).catch(function (err) {
                ALCLevel.working = false;
                alert("Error connecting to ALC Student API, please try again");
            });
        };

        ALCLevel.updateLevel = function () {
            ALCLevel.working = true;
            
            Level.update(ALCLevel.editLevel).then(function (response) {
                ALCLevel.working = false;

                if (!response.success) {
                    alert(response.message);
                    return false;
                }

                alert(response.message);
                $state.go("dashboard.level.list", null, { reload: true });
            }).catch(function (err) {
                ALCLevel.working = false;
                alert("Error connecting to ALC Student API, please try again");
            });
        };

        ALCLevel.deleteLevel = function (level, index) {
            if (confirm("Delete Level") === true) {
                ALCLevel.working = true;
                
                Level.delete({ _id: level._id }).then(function (response) {
                    ALCLevel.working = false;
    
                    if (!response.success) {
                        alert(response.message);
                        return false;
                    }
    
                    alert(response.message);
                    ALCLevel.resolvedData.levels.splice(index, 1);
                }).catch(function (err) {
                    ALCLevel.working = false;
                    alert("Error connecting to ALC Student API, please try again");
                });
            }
        };
    }])
;