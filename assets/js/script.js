$(document).ready(function() {
    /**
     *  UI 스크립트
     */
    newGeto.init();

$(function() {

    var controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: 0}});
    var scene = new ScrollMagic.Scene({
        triggerElement: ".scrolling",
        offset: -90,
        duration: 2300
    })
        .setPin('.scroll_nav')
        .addTo(controller);


    $(".scroll_nav li a").click(function() {
        var scrollTop = $(window).scrollTop();
        var index = $(this).parent().index();
        $("html,body").stop().animate({scrollTop: $(".forepatchScroll li").eq(index).offset().top - 200}, 500);
    });

    $(window).scroll(function() {
        var wTop = $(window).scrollTop();
        $.each($(".forepatchScroll li"), function(index) {
            if (wTop < $(this).offset().top + 100) {
                $(".scroll_nav li a").removeClass("on");
                $(".scroll_nav li").eq(index).find("a").addClass("on");
                // switch(index) {
                //     case 1: motion_scroll_2.play(); break;
                //     case 2: motion_scroll_3.play(); break;
                // }
                return false;
            }
        });
        // if (wTop > $(".scrolling").offset().top - 300) {
        //     motion_scroll_1.play();
        // }
    });
});

});

var newGeto = {
    init: function () {
        newGeto.header();
        newGeto.popup();
        newGeto.index();
        newGeto.qna();
        newGeto.banner();
        newGeto.sub();
    },

    header: function() {
        var header = $('header, .SHeader');
        var doc = $('html, body');
        var allMenuBtn = $('.allMenu');
        // var allMenuBtn =$('.allMenu');
        // var allMenu = $('.allMenuDrop');
        // var allMenuExit = $('.allExitBtn');
        var leftAllMenu = $('.leftAllMenu');
        var leftNavItem = $('.leftNavItem');
        var drop =$('.drop');
        var leftNavExit = $('.exitBtn, .screen' );
        var SHeader = $('.SHeader');
        var noScroll = $('#wrap_sub, #wrap_sub2');

        $(window).on('scroll',function () {
            var sct = $(window).scrollTop();
            if(sct > 90) {
                header.addClass('is-active');
            } else {
                header.removeClass('is-active');
            }
        });

        $(window).on('scroll',function () {
            var sct = $(window).scrollTop();
            if(noScroll & sct > 90) {
                header.removeClass('is-active');
            }
        });




        // allMenuBtn.on('click', function () {
        //     allMenu.css('top','0')
        // });
        // allMenuExit.on('click', function () {
        //     allMenu.css('top','-300px')
        // });

        allMenuBtn.click(function () {
            $('.header').toggleClass('allMenuOpen');
        });

        leftAllMenu.on('click' , function () {
            SHeader.addClass('is-open');
        });
        leftNavExit.on('click' , function () {
            SHeader.removeClass('is-open');
        });


        leftNavItem.on('click', function () {
            var self = $(this);
            var parent = self.parent();
            if(parent.hasClass('is-open')){
                parent.removeClass('is-open');
                self.next().stop().slideUp(600,'easeInQuart');
            } else {
                parent.addClass('is-open').siblings().removeClass('is-open').find(drop).stop().slideUp(800,'easeInQuart');
                self.next().stop().slideDown(600,'easeInQuart');
            }
        });
    },

    popup: function () {
        var layerPopup = $('.layerPopup2, .layerPopup');
        var exit = $('.screen, .exitBtn');
        var agreeForm = $('.agreeTit');

        exit.on('click',function () {
            layerPopup.fadeOut(500)
        });

        agreeForm.on('click',function () {
            var self = $(this);
            var parent = self.parent();

            parent.toggleClass('is-open')

        });
    },
    index: function () {
        $('.mainVisual').slick({
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            arrows:true,
        });

        $('.secReveiew .review').slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 7000,
            arrows:true,
        });
    },
    qna: function() {
        var qnaTit = $('.qnaTit');
        var qnaCon = $('.qnaCon');

        qnaTit.on('click', function () {
            var self = $(this);
            var parent = self.parent();
            if(parent.hasClass('is-open')){
                parent.removeClass('is-open');
                self.next().stop().slideUp(200,'easeInQuart');
            } else {
                parent.addClass('is-open').siblings().removeClass('is-open').find(qnaCon).stop().slideUp(200,'easeInQuart');
                self.next().stop().slideDown(200,'easeInQuart');
            }
        });

    },

    banner: function () {
        var topBanner = $('.topBanner');
        var exit = $('.exit');

        exit.on('click', function () {
            topBanner.css('display','none')
        });

        $('.top_banner_list').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            arrows:true,
        });

    },

    sub: function () {
        $('.reviewTopList').slick({
            arrows:true,
            slidesToShow: 1,
            autoplay:true,
            autoplaySpeed:3000,
        });

        $('.sectionImg1, .sectionImg2, .sectionImg3, .sectionImg4, .getoSelf1, .getoSelf2').slick({
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            arrows:false,
            dots:true,
        });


        $('.perCounter').counterUp({
            delay: 10,
            time: 1000
        });
    }
};

function rinquiryPopup() {
    /* var sido = $("input[name=sido]").val();
    var gugun = $("input[name=gugun]").val(); */
    var obj = $(".layerPopup.rinquiryPopup");

    $(".layerPopup.managerPopup").fadeOut(300);

    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: "/Sales/getBaseEstimate",
        data: {},
        async: false,
        success: function (res) {
            $(obj).find("select[name=tel1] option").remove();
            $(obj).find("select[name=city] option").remove();

            var city = "<option value=''>시/도</option>";
            $.each(res.sido, function(idx, itm) {
                city += "<option value='"+itm.sido+"'>"+itm.sido+"</option>";
            });
            $(obj).find("select[name=city]").append(city);

            var hp = "";
            $.each(res.hp, function (idx, itm) {
                hp += "<option value='" + itm.cd_value + "'>" + itm.cd_value + "</option>";
            });
            $(obj).find("select[name=tel1]").append(hp);
        },
        error: function (xhr, status, err) {
            //alert(status+", "+xhr.readyState+" "+err);
        }
    });

    var rinquiryPopup = $('.rinquiryPopup');
    rinquiryPopup.fadeIn(300);

    if (typeof $("input[name=sido]").val() != "undefined" && $("input[name=sido]").val() != "") {
        $("select[name=city]").val($("input[name=sido]").val());
        getGugun($(obj).find("select[name=city]"));
    }
}

function closeEstimate() {
    var rinquiryPopup = $('.rinquiryPopup');
    rinquiryPopup.fadeOut(300);
}

function infoPopup() {

    var infogPopup = $('.infoPopup');
    infogPopup.fadeIn(300);
}

function getGugun(that) {
    var sido = $(that).val();

    var obj2 = $(that).siblings("select");

    if (sido == "" || sido == "세종") {
        $(obj2).find("option").not("[value='']").remove();
        $(that).siblings("select").hide();
    } else {
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "/Sales/getGugun",
            data: {"sido": sido},
            async: false,
            success: function (res) {
                if (res.code == "000") {

                    $(obj2).find("option").not("[value='']").remove();

                    var gugun = "";
                    if (typeof $("input[name=gugun]").val() != "undefined" && $("input[name=gugun]").val() != "") {
                        gugun = $("input[name=gugun]").val();
                    }

                    var opt = "";
                    $.each(res.gugun, function (idx, itm) {
                        var selected = "";
                        if (gugun == itm) {
                            selected = "selected";
                        }
                        opt += "<option value='" + itm + "' " + selected +">" + itm + "</option>";
                    });

                    $(obj2).append(opt);
                    $(obj2).show();
                } else {
                    alert(res.msg);
                }
            },
            error: function (xhr, status, err) {
                //alert(status+", "+xhr.readyState+" "+err);
            }
        });
    }
}

function getSalesPost(sido, gugun) {
    if (sido == "") {
        alert("시/도를 선택해주세요");

    } else if (sido != "세종" && gugun == "") {
        alert("구/군을 선택해주세요");

    } else {
        var formData = { "sido": sido, "gugun": gugun };

        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "/Sales/getSalesPost",
            data: formData,
            async: false,
            success: function (res) {
                if (res.code == "000") {
                    $("input[name=sido]").val(sido);
                    $("input[name=gugun]").val(gugun);

                    var asignr_info = "";
                    if (res.asignr_info != null) {
                        asignr_info = res.asignr_info;
                    }

                    var obj = $(".layerPopup.managerPopup");
                    $(obj).find(".popupTop h5").text("").text(sido + " " + gugun);
                    $(obj).find(".popupContent .name").text("").text(res.name);
                    $(obj).find(".popupContent .hp").text("").text(res.hp);
                    $(obj).find(".popupContent .contentBottom p").text("").text(asignr_info);

                    $(".layerPopup.managerPopup").fadeIn(300);

                    inputCheck();
                } else {
                    alert(res.msg);
                }
            },
            error: function (xhr, status, err) {
                //alert(status+", "+xhr.readyState+" "+err);
            }
        });
    }
}

function setEstimate() {
    var obj = $(".layerPopup.rinquiryPopup");
    var city = $(obj).find("select[name=city]").val();
    var country = $(obj).find("select[name=country]").val();
    var tel1 = $(obj).find("select[name=tel1]").val();
    var tel2 = $.trim($(obj).find("input[name=tel2]").val());
    var tel3 = $.trim($(obj).find("input[name=tel3]").val());
    var inqry_cntnt = $.trim($(obj).find("textarea[name=inqry_cntnt]").val());

    $(obj).find("select, input").removeClass("border-required");
    $(obj).find(".alert").removeClass("text-required");

    if (city == "") {
        $(obj).find("select[name=city]").addClass("border-required");
        $(obj).find("select[name=city]").closest("td").find(".alert").addClass("text-required");

    } else if ($(obj).find("select[name=country]").is(":visible") && country == "") {
        $(obj).find("select[name=country]").addClass("border-required");
        $(obj).find("select[name=country]").closest("td").find(".alert").addClass("text-required");

    } else if (tel2 == "") {
        $(obj).find("input[name=tel2]").addClass("border-required");
        $(obj).find("input[name=tel2]").closest("td").find(".alert").addClass("text-required");

    } else if (tel3 == "") {
        $(obj).find("input[name=tel3]").addClass("border-required");
        $(obj).find("input[name=tel3]").closest("td").find(".alert").addClass("text-required");

    } else if ($(obj).find("input[name=agree]").is(":checked") == false) {
        //$(obj).find("input[name=agree]").addClass("border-required");
        alert("개인정보 수집 및 이용에 동의해주세요.");

    } else {
        var formData = $(obj).find("form[name=form_data]").serialize();

        var is_go = false;

        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "/Sales/getInqry",
            data: formData,
            async: false,
            success: function (res) {
                if (res.code == "000") {
                    if (confirm("동일 휴대폰 번호로 문의한 건이 있습니다.\n추가 견적문의를 하시겠습니까?")) {
                        is_go = true;
                    }
                } else {
                    is_go = true;
                }
            },
            error: function (xhr, status, err) {
                //alert(status+", "+xhr.readyState+" "+err);
            }
        });

        if (is_go == true) {
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "/Sales/setInqry",
                data: formData,
                async: false,
                success: function (res) {
                    alert(res.msg);

                    if (res.code == "000") {
                        $(obj).fadeOut(300);
                    } else {
                    }

                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = '//wcs.naver.net/wcslog.js';
                    document.body.appendChild(script);

                    var _nasa={};
                    if (window.wcs) _nasa["cnv"] = wcs.cnv("4","1");
                    wcs_do(_nasa);
                },
                error: function (xhr, status, err) {
                    //alert(status+", "+xhr.readyState+" "+err);
                }
            });
        }
    }
}


function reviewPopup(thmnil_seq) {
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: "/About/getThmnilDetail",
        data: {"thmnil_seq": thmnil_seq},
        async: false,
        success: function (res) {
            if (res.code == "000") {
                var obj = $(".layerPopup.reviewPopup");
                $(obj).find(".popupTitle h3").text(res.data.title_info);
                $(obj).find(".popupTitle h5").text(res.data.belng_nm);
                $(obj).find(".popupTitle .pur").text(res.data.cate_nm);
                $(obj).find(".popupContent p").html(res.data.board_cntnt);

                $(obj).find(".popupArrow .arrow").show();

                if (res.prev == null) {
                    $(obj).find(".popupArrow .rightArrow").hide();
                }
                if (res.next == null) {
                    $(obj).find(".popupArrow .leftArrow").hide();
                }

                if (res.next != null) {
                    $(obj).find(".popupArrow .leftArrow").attr("href", "javascript:reviewPopup('" + res.next.thmnil_seq + "')");
                }

                if (res.prev != null) {
                    $(obj).find(".popupArrow .rightArrow").attr("href", "javascript:reviewPopup('" + res.prev.thmnil_seq + "')");
                }

            } else {
                alert(res.msg);

            }
        },
        error: function (xhr, status, err) {
            //alert(status+", "+xhr.readyState+" "+err);
        }
    });

    var reviewPopup = $('.reviewPopup');
    reviewPopup.fadeIn(300)
}

function reviewMore(cate_cd) {
    var end_row = $("input[name=end_row]").val();

    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: "/About/getThmnilList",
        data: { "cate_cd": cate_cd, "end_row": end_row},
        async: false,
        success: function (res) {
            if (res.code == "000") {
                var obj = $(".reviewMain");
                $(obj).find("input[name=end_row]").val(res.end_limit_row);
                $(obj).find(".contentList").append(res.html);

                if (res.total < res.end_limit_row) {
                    $(".btnArea").hide();
                }


            } else {
                alert(res.msg);
            }
        },
        error: function (xhr, status, err) {
            //alert(status+", "+xhr.readyState+" "+err);
        }
    });
}


