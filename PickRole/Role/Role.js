app.controller('Role', function ($scope, $http) {
    var Role = this;
    Role.subFalg = true;

    Role.sceneRole = [
        { RoleID: "1" }, { RoleID: "2" },
        { RoleID: "3" }, { RoleID: "4" },
        { RoleID: "5" }, { RoleID: "6" },
        { RoleID: "7" }, { RoleID: "8" },
        { RoleID: "9" }, { RoleID: "10" },
        { RoleID: "11" }, { RoleID: "12" },
        { RoleID: "13" }, { RoleID: "14" },
        { RoleID: "15" }, { RoleID: "16" },
        { RoleID: "17" }, { RoleID: "18" },
        { RoleID: "19" }, { RoleID: "20" }
    ];
    Role.Info = {
        Name: "Kai",
        GUID: "REASD-ASDV-ASDER-AS-VC-ASD",
        SceneID: 1
    };
    Role.role = [];

    


    Role.showRole = function (id) {
        roleGo(1);
    }

    function roleGo(id) {
        if (id < 12) {
            setTimeout(function () { roleGo(id + 1); }, 100);
            showRoleGo(id, 1);
        }
    }


    function showRoleGo(id, type) {
        if (type < 5) {
            if ($("#role" + id + "_0").data("star") == "2") {
                if (type < 4) {
                    $("#role" + id + "_" + type).attr("src", "../../Img/roleW/" + (type + 1) + ".png");
                } else {
                    $("#role" + id + "_4").attr("src", "../../Img/role2/1.png");
                    Role.role.push("s2");
                }
            } else if ($("#role" + id + "_0").data("star") == "3") {
                if (type < 4) {
                    $("#role" + id + "_" + type).attr("src", "../../Img/roleG/" + (type + 1) + ".png");
                } else {
                    $("#role" + id + "_4").attr("src", "../../Img/role3/1.png");
                    Role.role.push("s3");
                }
            } else if ($("#role" + id + "_0").data("star") == "4") {
                if (type < 4) {
                    $("#role" + id + "_" + type).attr("src", "../../Img/roleG/" + (type + 1) + ".png");
                } else {
                    var s4 = rankStar4();
                    Role.role.push(s4 + "");
                    $("#role" + id + "_4").attr("src", "../../Img/role4/" + s4 + ".png");
                }
            }
            $("#role" + id + "_" + type).css({
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
                $("#role" + id + "_" + (type - 1)).css({
                    display: "none"
                });
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
            setTimeout(function () { showRoleGo(id, type + 1); }, 500);
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
        Role.role = [];
        console.log(temp);
        $http({
            method: 'POST',
            url: '../WebAPI/Role.ashx?type=updateRoleNum',
            data: temp
        }).then(function successCallback(response) {
            $scope.PickRole.getSceneNum();
        }, function errorCallback(response) {
        });
    }






    function rankStar4() {
        var maxNum = 20
        var minNum = 1;
        var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        return n;
    }


    Role.pick = function () {
        Role.subFalg = false;
        for (var i = 1; i < 12; i++) {
            for (var j = 1; j < 5; j++) {
                $("#role" + i + "_" + j).css({
                    display: "none"
                })
            }
        }
        for (var i = 1; i < 12; i++) {
            $("#role" + i + "_0").css({
                display: "",
                opacity: 0
            })
        }
        pickGo(1);
    }

    function pickGo(id) {

        if (id < 12) {
            roleRandom("role" + id + "_0");
        }
        setTimeout(function () { pickGo(id + 1); }, 50);
    }

    function roleRandom(id) {
        var maxNum = 100
        var minNum = 1;
        var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        var src = "";
        if (n > 0 && n < 46) {
            src = "../../Img/roleW/1.png";
            $("#" + id).data("star", "2");
        } else if (n > 45 && n < 91) {
            src = "../../Img/roleG/1.png";
            $("#" + id).data("star", "3");
        } else {
            src = "../../Img/roleG/1.png";
            $("#" + id).data("star", "4");
        }
        $("#" + id).attr("src", src);
        $("#" + id).css({
            top: "-50px",
            opacity: 0
        }).animate({
            opacity: 1,
            top: "0"
        }, 300, function () {
            if (id == "role11_0") {
                setTimeout(function () { roleGo(1); }, 300);
            }
        });
    }

});

