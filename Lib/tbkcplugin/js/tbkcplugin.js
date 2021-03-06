﻿var 捲軸寬度 = 0;

//彈跳視窗
(function ($) {
    var msgboxNum = 0;
    $.fn.msgbox = function (action) {
        return this.each(function () {
            var 網頁高度 = $("body").height();
            var 視窗高度 = $(window).height();
            if (視窗高度 > 網頁高度) {
                捲軸寬度 = 0;
            } else {
                取得捲軸寬度();
            }
            var flag = 0;
            var model = $(this);
            var panel = $(this).children("div");
            model.off();
            model.stop();
            panel.off();
            panel.stop();

            if (action == "show") {
                msgboxNum = msgboxNum + 1;
                $("body").css({
                    overflow: "hidden",
                    paddingRight: 捲軸寬度 + "px"
                });
                panel.css({
                    top: "-100px",
                    opacity: "0"
                })
                model.css({
                    display: "inline",
                    opacity: "0"
                }).scrollTop(0).animate({ opacity: "1" }, 100, function () {
                    panel.animate({ opacity: "1", top: "0" }, 300);
                    panel.on("mouseover", function () { flag = 1; });
                    panel.on("mouseout", function () { flag = 0; });
                    model.on("click", function () {
                        if (flag == 0) {
                            flag = 1;
                            hide();
                        }
                    });
                });
            } else {
                hide();
            }
            function hide() {
                msgboxNum = msgboxNum - 1;
                model.children(".panel").animate({ opacity: "0", top: "-100px" }, 300, function () {
                    model.animate({ opacity: "0" }, 100, function () {
                        if (msgboxNum < 1) {
                            $("body").css({
                                overflow: "",
                                paddingRight: ""
                            });
                        }
                        model.css("display", "none");
                    });
                });
            }
        });
    };


    $(document).on('click', '[data-msgbox]', function (event) {
        $($(this).data('msgbox')).msgbox('show');
    })
    $(document).on('click', '[data-dismsg]', function (event) {
        $($(this).data('dismsg')).msgbox('hide');
    })
})(jQuery);

//讀取切換
(function ($) {
    $.fn.loadchange = function (action, time) {
        return this.each(function () {
            var inTime = 0;
            var div = $(this);
            var divID = div.attr("id");
            var loadDivNum = $("[data-loaddivid=" + divID + "]").length;
            div.loadEnd = function () {
                $(div).trigger('loading.end');
            }
            if (action == "on" || action == "off") {
                if (!isNaN(time)) {
                    inTime = time;
                }
            } else if (!isNaN(action)) {
                inTime = action;
            }
            if (action == "on") {
                if (loadDivNum == 0) {
                    on();
                }
            } else if (action == "off") {
                if (loadDivNum > 0) {
                    off();
                }
            } else {
                if (loadDivNum == 0) {
                    on();
                } else {
                    off();
                }
            }
            function on() {
                div.data('time', inTime);
                setTimeout(timeTo, 100);
                var style = div.data("loadstyle");
                div.css({ position: "absolute", top: "-2000px" });
                var loadDiv = "<div data-loaddivid='" + divID + "'>" + eval(style) + "</div>";
                div.after(loadDiv);
            }
            function timeTo() {
                var tt = div.data('time');
                if (tt > 0) {
                    div.data('time', tt - 100);
                    setTimeout(timeTo, 100);
                }
            }
            function off() {
                var tt = div.data('time');
                if (tt > 0) {
                    setTimeout(off, 100);
                } else if (tt <= 0) {
                    div.loadEnd();
                    $("[data-loaddivid=" + divID + "]").remove();
                    div.css({ position: "", top: "", opacity: 0 });
                    div.animate({ opacity: "1" }, 500);
                }
            }
        });
    };

    function getLoadStyle() {

    }


    var loading1 = `<div class ="loading1 k-loading">
                        <div class ="loader-inner">
                            <div class ="loader-line-wrap">
                                <div class ="loader-line"></div>
                            </div>
                            <div class ="loader-line-wrap">
                                <div class ="loader-line"></div>
                            </div>
                            <div class ="loader-line-wrap">
                                <div class ="loader-line"></div>
                            </div>
                            <div class ="loader-line-wrap">
                                <div class ="loader-line"></div>
                            </div>
                            <div class ="loader-line-wrap">
                                <div class ="loader-line"></div>
                            </div>
                        </div>
                    </div>`;
    var loading2 = `<div class="loading2 k-loading">
                        <div class="loader-inner">
                            <div class="loader"></div>
                        </div>
                    </div>`;

    var loading3 = `<div class="loading3 k-loading">
    <div class="loader-inner">
        <div class="preloader" style="opacity: 1; ">
            <svg version="1.1" id="sun" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="10px" viewBox="0 0 10 10" enable-background="new 0 0 10 10" xml:space="preserve" style="opacity: 1; margin-left: 0px; margin-top: 0px;">
            <g>
            <path fill="none" d="M6.942,3.876c-0.4-0.692-1.146-1.123-1.946-1.123c-0.392,0-0.779,0.104-1.121,0.301c-1.072,0.619-1.44,1.994-0.821,3.067C3.454,6.815,4.2,7.245,5,7.245c0.392,0,0.779-0.104,1.121-0.301C6.64,6.644,7.013,6.159,7.167,5.581C7.321,5,7.243,4.396,6.942,3.876z M6.88,5.505C6.745,6.007,6.423,6.427,5.973,6.688C5.676,6.858,5.34,6.948,5,6.948c-0.695,0-1.343-0.373-1.69-0.975C2.774,5.043,3.093,3.849,4.024,3.312C4.32,3.14,4.656,3.05,4.996,3.05c0.695,0,1.342,0.374,1.69,0.975C6.946,4.476,7.015,5,6.88,5.505z"></path>
            <path fill="none" d="M8.759,2.828C8.718,2.757,8.626,2.732,8.556,2.774L7.345,3.473c-0.07,0.041-0.094,0.132-0.053,0.202C7.319,3.723,7.368,3.75,7.419,3.75c0.025,0,0.053-0.007,0.074-0.02l1.211-0.699C8.774,2.989,8.8,2.899,8.759,2.828z"></path>
            <path fill="none" d="M1.238,7.171c0.027,0.047,0.077,0.074,0.128,0.074c0.025,0,0.051-0.008,0.074-0.02l1.211-0.699c0.071-0.041,0.095-0.133,0.054-0.203S2.574,6.228,2.503,6.269l-1.21,0.699C1.221,7.009,1.197,7.101,1.238,7.171z"></path>
            <path fill="none" d="M6.396,2.726c0.052,0,0.102-0.026,0.13-0.075l0.349-0.605C6.915,1.976,6.89,1.885,6.819,1.844c-0.07-0.042-0.162-0.017-0.202,0.054L6.269,2.503C6.228,2.574,6.251,2.666,6.322,2.706C6.346,2.719,6.371,2.726,6.396,2.726z"></path>
            <path fill="none" d="M3.472,7.347L3.123,7.952c-0.041,0.07-0.017,0.162,0.054,0.203C3.2,8.169,3.226,8.175,3.25,8.175c0.052,0,0.102-0.027,0.129-0.074l0.349-0.605c0.041-0.07,0.017-0.16-0.054-0.203C3.603,7.251,3.513,7.276,3.472,7.347z"></path>
            <path fill="none" d="M3.601,2.726c0.025,0,0.051-0.007,0.074-0.02C3.746,2.666,3.77,2.574,3.729,2.503l-0.35-0.604C3.338,1.828,3.248,1.804,3.177,1.844C3.106,1.886,3.082,1.976,3.123,2.047l0.35,0.604C3.5,2.7,3.549,2.726,3.601,2.726z"></path>
            <path fill="none" d="M6.321,7.292c-0.07,0.043-0.094,0.133-0.054,0.203l0.351,0.605c0.026,0.047,0.076,0.074,0.127,0.074c0.025,0,0.051-0.006,0.074-0.02c0.072-0.041,0.096-0.133,0.055-0.203l-0.35-0.605C6.483,7.276,6.393,7.253,6.321,7.292z"></path>
            <path fill="none" d="M2.202,5.146c0.082,0,0.149-0.065,0.149-0.147S2.284,4.851,2.202,4.851H1.503c-0.082,0-0.148,0.066-0.148,0.148s0.066,0.147,0.148,0.147H2.202z"></path>
            <path fill="none" d="M8.493,4.851H7.794c-0.082,0-0.148,0.066-0.148,0.148s0.066,0.147,0.148,0.147l0,0h0.699c0.082,0,0.148-0.065,0.148-0.147S8.575,4.851,8.493,4.851L8.493,4.851z"></path>
            <path fill="none" d="M5.146,2.203V0.805c0-0.082-0.066-0.148-0.148-0.148c-0.082,0-0.148,0.066-0.148,0.148v1.398c0,0.082,0.066,0.149,0.148,0.149C5.08,2.352,5.146,2.285,5.146,2.203z"></path>
            <path fill="none" d="M4.85,7.796v1.396c0,0.082,0.066,0.15,0.148,0.15c0.082,0,0.148-0.068,0.148-0.15V7.796c0-0.082-0.066-0.148-0.148-0.148C4.917,7.647,4.85,7.714,4.85,7.796z"></path>
            <path fill="none" d="M2.651,3.473L1.44,2.774C1.369,2.732,1.279,2.757,1.238,2.828C1.197,2.899,1.221,2.989,1.292,3.031l1.21,0.699c0.023,0.013,0.049,0.02,0.074,0.02c0.051,0,0.101-0.026,0.129-0.075C2.747,3.604,2.722,3.514,2.651,3.473z"></path>
            <path fill="none" d="M8.704,6.968L7.493,6.269c-0.07-0.041-0.162-0.016-0.201,0.055c-0.041,0.07-0.018,0.162,0.053,0.203l1.211,0.699c0.023,0.012,0.049,0.02,0.074,0.02c0.051,0,0.102-0.027,0.129-0.074C8.8,7.101,8.776,7.009,8.704,6.968z"></path>
	  </g>
  </svg>

            <svg version="1.1" id="cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="10px" viewBox="0 0 10 10" enable-background="new 0 0 10 10" xml:space="preserve">
            <path fill="none" d="M8.528,5.624H8.247c-0.085,0-0.156-0.068-0.156-0.154c0-0.694-0.563-1.257-1.257-1.257c-0.098,0-0.197,0.013-0.3,0.038C6.493,4.259,6.45,4.252,6.415,4.229C6.38,4.208,6.356,4.172,6.348,4.131C6.117,3.032,5.135,2.235,4.01,2.235c-1.252,0-2.297,0.979-2.379,2.23c-0.004,0.056-0.039,0.108-0.093,0.13C1.076,4.793,0.776,5.249,0.776,5.752c0,0.693,0.564,1.257,1.257,1.257h6.495c0.383,0,0.695-0.31,0.695-0.692S8.911,5.624,8.528,5.624z"></path>
  </svg>

            <div class="rain">
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
            </div>

            <div class="text">
                讀取中
            </div>
        </div>
    </div>
</div>`;
    var loading4 = `<div class="loading4 k-loading">
    <div class="loader-inner">
        <div class='loader3'>
            <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    var loading5 = `<div class="loading4 k-loading">
    <div class="loader-inner">
        <div class='loader4'>
            <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <div>
                                            <div>
                                                <div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;

    var loading6 = `<div class="loading6 k-loading">
    <div class="loader-inner">
        <div class="loader">
            <span>正</span>
            <span>在</span>
            <span>讀</span>
            <span>取</span>
            <span>中</span>

            <div class="covers">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
</div>`;

    var loading7 = `<div class="loading7 k-loading">
    <div class="loader-inner">
        <div id="loader-container">
            <p id="loadingText">讀取中...</p>
        </div>
    </div>
</div>
`;
    var loading8 = `<div class="loading8 k-loading">
          <div class ="loader-inner">
        <div class="loader">
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
</div></div></div>
`;

})(jQuery);




//換頁效果
(function ($) {
    $.fn.pageChange = function (action, speed) {
        return this.each(function () {
            var div = $(this);
            div.stop();
            var inSpeed = 400;
            var type = "left";
            if (typeof action == "string") {
                if (!isNaN(speed)) {
                    inSpeed = speed;
                }
                if (action == "top") {
                    type = "top";
                } else if (action == "bottom") {
                    type = "bottom";
                } else if (action == "right") {
                    type = "right";
                }
            } else if (!isNaN(action)) {
                inSpeed = action;
            }
            if (!div.parent().hasClass("pageChange") && !div.next().hasClass("pageChange")) {
                div.after("<div class='pageChange' style='position:relative;overflow:hidden;'></div>");
                run();
            } else {
                div.parent().css({ position: "relative", overflow: "hidden" });
                run();
            }

            function run() {
                div.prependTo(div.next());
                var startCss = {};
                var endCss = {};
                eval("startCss={ position: 'relative', opacity: 0, " + type + ": '-50px' }");
                eval("endCss={ opacity: 1, " + type + ": 0 }");
                div.css({ top: "", left: "", right: "", bottom: "" });
                div.css(startCss);
                div.animate(endCss, inSpeed, "easeOutSine", function () {
                    div.parent().css({ position: "static", overflow: "" });
                });
            }
        });
    };
})(jQuery);



//標籤tabs事件
(function ($) {
    $(document).on('click', '[data-tabs] td', function (event) {
        if (!$(this).hasClass("div-no-last") && !$(this).hasClass("div-no-first")) {
            var tabs = $(this).parent().parent().parent().data("tabs");
            $("[data-tabs=" + tabs + "] td").removeClass("active");
            $(this).addClass("active");
        }
    })
})(jQuery);




function 取得捲軸寬度() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";
    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);
    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;
    document.body.removeChild(outer);
    捲軸寬度 = w1 - w2;
}