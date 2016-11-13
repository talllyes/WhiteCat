$(function () {
    $(".demoBodyLeft ul li a").on("click", function () {
        $(".demoBodyLeft a").removeClass("active");
        $(this).addClass("active");
    });
    var URL = window.location;
    $(".demoBodyLeft").find('a[href="' + URL.hash + '"]').addClass("active");

});