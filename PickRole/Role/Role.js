﻿app.controller('Role', function ($scope, $http) {
    var Role = this;
    Role.subFalg = false;            //按鈕顯示
    Role.nowShow = 'input';
    Role.choose = "pick";
    Role.pickTime = 0;
    Role.rank = [];
    Role.star = {
        star2: 0,
        star3: 0,
        star4: 0,
    };
    Role.Info = {
        Name: "",
        SceneID: 0,
        flag: false
    };
    Role.sceneRole = [];            //該場景角色物件
    Role.role = [];

    Role.Info.SceneID = 1;
    //取得該場景角色
    function getSceneRole() {
        var temp = Role.Info;
        $http({
            method: 'POST',
            url: '../WebAPI/Role.ashx?type=SceneRole',
            data: temp
        }).then(function successCallback(response) {
            Role.sceneRole = response.data;
            angular.forEach(Role.sceneRole, function (value, key) {
                value.Num = 0;
            });
            Role.subFalg = true;
        }, function errorCallback(response) {
        });
    }
    getSceneRole();

    //抽角按紐
    Role.pick = function (type) {
        Role.subFalg = false;
        if (Role.Info.Name == "") {
            Role.Info.Name = "無名氏";
        }
        if (type == 1) {
            Role.pickTime = Role.pickTime + 1;
        }
        else if (type == 10) {
            Role.pickTime = Role.pickTime + 11;
            if (Role.nowShow == 'input') {
                Role.nowShow = "10";
            }
            for (var i = 1; i < 12; i++) {
                $("#role" + i).empty();
            }
            randStar(1);
        }
    }
    function randStar(id) {
        if (id < 12) {
            randStarGo(id);
            setTimeout(function () { randStar(id + 1); }, 50);
        }
    }
    function randStarGo(id) {
        var maxNum = 100
        var minNum = 1;
        var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        var newImg;
        if (n > 0 && n < 46) {
            var src = "../../Img/roleW/1.png";
            newImg = $("<img src='" + src + "' data-star='2' />");
            $("#role" + id).append(newImg);
        } else if (n > 45 && n < 91) {
            var src = "../../Img/roleG/1.png";
            newImg = $("<img src='" + src + "' data-star='3' />");
            $("#role" + id).append(newImg);
        } else {
            var src = "../../Img/roleG/1.png";
            newImg = $("<img src='" + src + "' data-star='4' />");
            $("#role" + id).append(newImg);
        }
        newImg.css({
            top: "-50px",
            opacity: 0
        }).animate({
            opacity: 1,
            top: "0"
        }, 300, function () {
            if (id == 11) {
                randRole(1);
            }
        });
    }

    function randRole(id) {
        if (id < 12) {
            randRoleGo(id, 1);
            setTimeout(function () { randRole(id + 1); }, 100);
        }
    }

    function randRoleGo(id, index) {
        if (index < 5) {
            var lastDiv = $("#role" + id + " img:last-child");
            var star = lastDiv.data("star");
            var src = "";
            if (star == "2") {
                if (index < 4) {
                    src = "../../Img/roleW/" + (index + 1) + ".png"
                } else {
                    src = "../../Img/roleW/5.png"
                    Role.role.push("s2");
                    Role.star.star2 = Role.star.star2 + 1;
                }
            }
            else if (star == "3") {
                if (index < 4) {
                    src = "../../Img/roleG/" + (index + 1) + ".png"
                } else {
                    src = "../../Img/roleG/5.png"
                    Role.role.push("s3");
                    Role.star.star3 = Role.star.star3 + 1;
                }
            }
            else if (star == "4") {
                if (index < 4) {
                    src = "../../Img/roleG/" + (index + 1) + ".png"
                } else {
                    var roleInfo = randStar4();
                    Role.role.push(roleInfo.roleID + "");
                    Role.star.star4 = Role.star.star4 + 1;
                    src = "../../Img/role4/" + roleInfo.src + ".png";
                }
            }
            var newImg = $("<img src='" + src + "' data-star='" + star + "' />");
            lastDiv.after(newImg);
            newImg.css({
                opacity: 0,
                display: "",
                top: "-200px",
                left: "-200px",
                width: "400px",
                height: "400px"
            }).animate({
                opacity: 1,
                width: "100px",
                height: "100px",
                top: 0,
                left: 0
            }, 300, function () {
                lastDiv.remove();
            }).animate({
                top: "5px",
                left: "-5px"
            }, 100).animate({
                top: "-3px",
                left: "3px"
            }, 100).animate({
                top: "1px",
                left: "-1px"
            }, 100).animate({
                top: 0,
                left: 0
            }, 100);
            setTimeout(function () { randRoleGo(id, index + 1); }, 500);
        } else {
            if (id == 11) {
                Role.subFalg = true;
                updateRoleNum();
            }
        }
    }

    function updateRoleNum() {
        var temp = {};
        temp.Info = Role.Info;
        temp.role = Role.role;
        if (Role.pickTime == 110) {
            temp.Info.flag = true;
            temp.star = Role.star;
        } else {
            temp.Info.flag = false;
        }
        Role.role = [];
        $http({
            method: 'POST',
            url: '../WebAPI/Role.ashx?type=updateRoleNum',
            data: temp
        }).then(function successCallback(response) {
            $scope.PickRole.getSceneNum();
        }, function errorCallback(response) {
        });
        var num = true;
        angular.forEach(Role.sceneRole, function (value, key) {
            if (value.Num == 0) {
                num = false;
            }
        });
        if (num) {
            alert('恭喜你抽到所有角色!!');
            Role.subFalg = false;
            clear();
        }
    }

    function clear() {
        var temp = {};
        temp.Info = Role.Info;
        temp.star = Role.star;
        $http({
            method: 'POST',
            url: '../WebAPI/Role.ashx?type=Clear',
            data: temp
        }).then(function successCallback(response) {
            console.log(response.data);
        }, function errorCallback(response) {
        });
    }

    function randStar4() {
        var maxNum = Role.sceneRole.length - 1;
        var minNum = 0;
        var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        var roleInfo = {};
        roleInfo.src = Role.sceneRole[n].Src;
        roleInfo.roleID = Role.sceneRole[n].RoleID;
        Role.sceneRole[n].Num = Role.sceneRole[n].Num + 1;
        return roleInfo;
    }


    Role.getRank = function () {
        var temp = Role.Info;
        Role.choose = "rank";
        $http({
            method: 'POST',
            url: '../WebAPI/Role.ashx?type=GetRank',
            data: temp
        }).then(function successCallback(response) {
            Role.rank = response.data;
            console.log(Role.rank);
        }, function errorCallback(response) {
        });
    }

    Role.resetPick = function () {
        location.href = "../PickRole/PickRole.html";
    }
});

