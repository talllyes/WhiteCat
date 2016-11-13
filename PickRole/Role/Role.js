app.controller('Role', function ($scope) {
    var Role = this;

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
                    $("#role" + id + "_" + type).attr("src", "../../Img/s" + (type + 1) + ".png");
                } else {
                    $("#role" + id + "_4").attr("src", "../../Img/赤石士兵s.png");
                }
            } else if ($("#role" + id + "_0").data("star") == "3") {
                if (type < 4) {
                    $("#role" + id + "_" + type).attr("src", "../../Img/s" + (type + 1) + ".png");
                } else {
                    $("#role" + id + "_4").attr("src", "../../Img/克里斯多弗.png");
                }
            } else if ($("#role" + id + "_0").data("star") == "4") {
                if (type < 4) {
                    $("#role" + id + "_" + type).attr("src", "../../Img/g" + (type + 1) + ".png");
                } else {
                    $("#role" + id + "_4").attr("src", "../../Img/米菈.png");
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
        }
    }




    Role.pick = function () {
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
            src = "../../Img/s1.png";
            $("#" + id).data("star", "2");
        } else if (n > 45 && n < 91) {
            src = "../../Img/g1.png";
            $("#" + id).data("star", "3");
        } else {
            src = "../../Img/g1.png";
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

