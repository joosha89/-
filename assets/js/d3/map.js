function d3_korea_map(_mapContainerId, _spots) {
    var WIDTH, HEIGHT,
        CENTERED,
        MAP_CONTAINER_ID = _mapContainerId, CLICK_SIGUN_KOR,
        MAP_SVG_ID = "map",
        SIGUN, SIGUN_CD, SIGUNGU,
        CIT_KOR_NM, SIG_KOR_NM,
        KOREA_PROVINCE_OBJECT = 'skorea_provinces_2018_geo';

    var SPECIAL_CITIES = ['서울특별시', '인천광역시', '대전광역시', '대구광역시', '부산광역시', '울산광역시', '광주광역시', '세종특별자치시', '제주특별자치도'];
    var projection, path, svg,
        geoJson, features, bounds, center,
        map, places;

    var cities_rect_y = { "Jeju-do": "-2em", "Jeollanam-do": "0.25em", "Daegu": "-1.65em", "Gyeongsangbuk-do": "-1.65em", "Sejongsi": "-2.3em", "Daejeon": "0.5em", "Seoul": "-1.95em", "Gyeonggi-do": "1em"};
    var cities_rect_x = { "Gwangju": "0.6em", "Busan": "0.6em", "Ulsan": "0.6em", "Daegu": "0.6em", "Chungcheongnam-do": "-3.4em", "Incheon": "-2.4em"};

    var cities_text_y = { "Jeju-do": "-0.85em", "Jeollanam-do": "1.35em", "Daegu": "-0.65em", "Gyeongsangbuk-do": "-0.65em", "Sejongsi": "-1.3em", "Daejeon": "1.5em", "Seoul": "-0.95em", "Gyeonggi-do": "2.05em" };
    var cities_text_x = { "Gwangju": "1.65em", "Busan": "1.65em", "Ulsan": "1.65em", "Daegu": "1.65em", "Chungcheongnam-do": "-0.35em", "Incheon": "-1.35em" };



    var sigun_txt_x = {
        "Busan": {
            "Saha-gu": "-1.35em", "Jung-gu": "1.35em", "Sasang-gu": "-0.35em", "Suyeong-gu": "0.65em"
        },
        "Chungcheongbuk-do": {
            "Cheongju-si": "-1.35em"
        },
        "Incheon": {
            "Ongjin-gun": "5.65em", "Gyeyang-gu": "1.65em", "Bupyeong-gu": "1.65em", "Namdong-gu": "1.65em"
        },
        "Gyeonggi-do": {
            "Gimpo-si": "-2.35em", "Siheung-si": "-2.15em", "Ansan-si": "-2.35em", "Anyang-si": "0.65em", "Suwon-si": "0.35em", "Uiwang-si": "0.65em"
        }

    };
    var sigun_txt_y = {
        "Busan": {
            "Seo-gu": "2.35em", "Dong-gu": "-0.35em", "Sasang-gu": "-0.65em", "Suyeong-gu": "1.35em"
        },
        "Chungcheongbuk-do": {
            "Cheongju-si": "-0.65em"
        },
        "Incheon": {
            "Yeonsu-gu": "1.35em", "Michuhol-gu": "1em", "Dong-gu": "-0.35em"
        },
        "Gyeonggi-do": {
            "Gimpo-si": "-0.65em", "Goyang-si": "-0.65em", "Gwacheon-si": "-1em", "Ansan-si": "1em", "Anyang-si": "0.25em", "Suwon-si": "1.45em"

        }
    };


    function create(callback) {
        /* HEIGHT = window.innerHeight-800;
        WIDTH = window.innerWidth-300; */
        WIDTH = 460;
        HEIGHT = 660;

        //console.log('Map scale', { 'height': HEIGHT, 'width': WIDTH });

        projection = d3.geoMercator().translate([WIDTH / 2, HEIGHT / 2]);
        path = d3.geoPath().projection(projection);

        svg = d3.select(MAP_CONTAINER_ID).append("svg")
            .attr("width", WIDTH)
            .attr("height", HEIGHT);

        map = svg.append("g").attr("id", MAP_SVG_ID),
            places = svg.append("g").attr("id", "places");


        d3.json(KOREA_JSON_DATA_URL).then(function (_data) {
            geoJson = topojson.feature(_data, _data.objects[KOREA_PROVINCE_OBJECT]);
            features = geoJson.features;

            bounds = d3.geoBounds(geoJson);
            center = d3.geoCentroid(geoJson);

            var distance = d3.geoDistance(bounds[0], bounds[1]);
            var scale = HEIGHT / distance / Math.sqrt(2) * 1.2;

            projection.scale(scale).center(center);

            /* console.log("center", center);
            console.log("scale", scale); */

            map.selectAll("path")
                .data(features)
                .enter().append("path")
                .attr("class", function (d) {
                    return "municipality c " + d.properties.code;
                })
                .attr("d", path)
                .attr("sigun", function (d) { return d.properties.name_eng; })
                .on("click", province_clicked_event);


            map.selectAll("text")
                .data(features)
                .enter().append("text")
                .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
                //.attr("dy", ".35em")

                .attr("dy", function(d) {
                    var attr = ".35em";
                    var eng = d.properties.name_eng;

                    if (typeof cities_text_y[eng] != "undefined") {
                        attr = cities_text_y[eng];
                    }
                    return attr;
                })
                .attr("dx", function (d) {
                    var attr = "-0.35em";
                    var eng = d.properties.name_eng;

                    if (typeof cities_text_x[eng] != "undefined") {
                        attr = cities_text_x[eng];
                    }
                    return attr;
                })
                .attr("class", "municipality-label")
                .text(function (d) { return d.properties.name; })
                //.css({"position": "relative"})
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .attr("sigun", function (d) { return d.properties.name_eng; })
                .on("click", province_clicked_event);
            ;

            $("#mapArea path, #mapArea text").on("click", function() {
                $("#mapArea path").css("fill", "#9193ae");

                var city = $(this).attr("sigun");
                $("#mapArea path[sigun=" + city + "]").css("fill", "#af358c");
            });

            $('#mapArea path, #mapArea text').hover(function () {
                var nm = $(this).attr("sigun");

                $("#mapArea path[sigun*=" + nm + "]").css("fill", "#af358c");

            }, function () {
                $("#mapArea path").css("fill", "#9193ae");
                $("#mapArea path[sigun^=" + SIGUN + "]").css("fill", "#af358c");
            });

            callback();
        });
    }

    function spotting_on_map() {
        var circles = map.selectAll("circle")
            .data(_spots).enter()
            .append("circle")
            .attr("class", "spot")
            .attr("cx", function (d) { return projection([d.lon, d.lat])[0]; })
            .attr("cy", function (d) { return projection([d.lon, d.lat])[1]; })
            .attr("r", "2px")
            .attr("fill", "red")
            .on('click', spot_clicked_event)
            .transition()
            .ease(d3.easeElastic);
    }

    function spot_clicked_event(d) {
        alert(d['tag']);
    }

    function province_clicked_event(d) {
        var x, y, zoomLevel;

        SIGUN = d.properties.name_eng;
        CIT_KOR_NM = d.properties.name;

        if (d && CENTERED != d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            if (d.properties.name == '제주특별자치도' || d.properties.name == '인천광역시')
                zoomLevel = 10;
            else if (SPECIAL_CITIES.indexOf(d.properties.name) != -1)
                zoomLevel = 15;
            else
                zoomLevel = 3;
            CENTERED = d;
        } else {
            x = WIDTH / 2;
            y = HEIGHT / 2;
            zoomLevel = 1;
            CENTERED = null;
        }

        getSigun();

        /* map.selectAll("path")
            .classed("active", CENTERED && function (d) { return d === CENTERED; });

        map.transition()
            .duration(750)
            .attr("transform", "translate(" + WIDTH / 2 + "," + HEIGHT / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / zoomLevel + "px"); */
    }

    create(function () {
        //spotting_on_map();

        // 디폴트 서울로 지정
        $("#mapArea path[sigun=Seoul]").css("fill", "#af358c");

        SIGUN = "Seoul";
        CIT_KOR_NM = $("#mapArea text[sigun^=" + SIGUN+"]").text();
        getSigun();
    })

    function getSigun() {
        MAP_CONTAINER_ID = "#mapArea2";

        $(MAP_CONTAINER_ID).empty();

        var width = 720, height = 740;
        var tran_wid = 2, tran_hei = 2, scale_per = 1.2;

        if (SIGUN == "Jeju-do" || SIGUN == "Gwangju") {
            height = 700;
        }
        if (SIGUN == "Incheon") {
            tran_wid = 1.6, tran_hei = 2.7, scale_per = 1.6;
        }
        if (SIGUN == "Gyeongsangbuk-do" || SIGUN == "Chungcheongnam-do") {
            tran_hei = 2.3;
        }
        if (SIGUN == "Sejongsi") {
            width = 400, height = 450, tran_hei = 2;
        }
        if (SIGUN == "Daejeon") {
            height = 570, tran_hei = 1.68;
        }
        if (SIGUN == "Chungcheongbuk-do") {
            height = 630;
        }
        if (SIGUN == "Jeollabuk-do") {
            height = 690;
        }
        if (SIGUN == "Gyeongsangnam-do") {
            height = 720, tran_hei = 2.2;
        }
        if (SIGUN == "Jeollanam-do") {
            tran_hei = 2.4, scale_per = 1.5;
        }
        if (SIGUN == "Gwangju") {
            scale_per = 1;
        }
        if (SIGUN == "Daegu") {
            tran_hei = 2.4, scale_per = 1;
        }
        if (SIGUN == "Ulsan") {
            tran_hei = 2.4, scale_per = 1;
        }
        if (SIGUN == "Busan") {
            tran_hei = 2.3, scale_per = 1.1;
        }
        if (SIGUN == "Jeju-do") {
            tran_hei = 2.3, scale_per = 0.8;
        }



        /* var width = 1400,
            height = 1450; */
        // 제주일때만 height: 750px 로 조정할것

        var svg = d3.select(MAP_CONTAINER_ID).append("svg")
            .attr("width", width)
            .attr("height", height);

        var map = svg.append("g").attr("id", "map2"),
            places = svg.append("g").attr("id", "places2");

        var projection = d3.geoMercator().translate([width / tran_wid, height / tran_hei]);
        var path = d3.geoPath().projection(projection);

        if (SIGUN == "Sejongsi") {
            $("#mapArea2 svg").css({"margin-top": "105px", "margin-left": "110px"})
        }

        MAP2_JSON_DATA_URL = "/assets/json/topo/"+SIGUN+".json?v=1";


        //d3.json(KOREA_JSON_DATA_URL, function(data) {
        d3.json(MAP2_JSON_DATA_URL).then(function (data) {
            //var geoJson = topojson.feature(data, data.objects[sigun]).features;
            var geoJson = topojson.feature(data, data.objects[SIGUN]);
            var features = geoJson.features;
            //geoJson = topojson.feature(_data, _data.objects[KOREA_PROVINCE_OBJECT]);

            bounds = d3.geoBounds(geoJson);
            center = d3.geoCentroid(geoJson);

            var distance = d3.geoDistance(bounds[0], bounds[1]);

            var scale = height / distance / Math.sqrt(2) * scale_per;

            projection.scale(scale).center(center);

            map.selectAll("path")
                .data(features)
                .enter().append("path")
                .attr("d", path)
                .attr("sigun", function (d) { return d.properties.SIG_ENG_NM; })
                .attr("sigun_cd", function (d) { return d.properties.SIG_CD; })
            .on("click", getTown);

            map.selectAll("text")
            .data(features)
            .enter().append("text")
            .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("dy", function (d) {
                var attr = ".35em";
                var eng = d.properties.SIG_ENG_NM;
                var obj_sigun_y = sigun_txt_y[SIGUN];

                if (typeof obj_sigun_y != "undefined" && typeof obj_sigun_y[eng] != "undefined") {
                    attr = obj_sigun_y[eng];
                }
                return attr;
            })
            .attr("dx", function (d) {
                var attr = "-0.35em";
                var eng = d.properties.SIG_ENG_NM;
                var obj_sigun_x = sigun_txt_x[SIGUN];

                if (typeof obj_sigun_x != "undefined" && typeof obj_sigun_x[eng] != "undefined") {
                    attr = obj_sigun_x[eng];
                }
                return attr;
            })
            .attr("class", "municipality-label sigun")
            .text(function (d) {
                var sig_cd = d.properties.SIG_CD.substr(0, 4);
                var nm = d.properties.SIG_ENG_NM.split(", ");

                if (typeof nm[1] == "undefined") {
                    return d.properties.SIG_KOR_NM;
                }
                if (sig_cd+"0" == d.properties.SIG_CD || nm[1] == "Changwon-si") {
                    return d.properties.SIG_KOR_NM;
                }
            })
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("sigun", function (d) { return d.properties.SIG_ENG_NM; })
            .attr("sigun_cd", function (d) { return d.properties.SIG_CD; })
            .on("click", getTown);

            var si_nm = click_si_nm = "";

            $("#mapArea2 path, #mapArea2 text").on("click", function () {
                currenSigun($(this), "click");
            });

            $('#mapArea2 path, #mapArea2 text').hover(function () {
                currenSigun($(this), "hover");

            }, function () {
                $("#mapArea2 path").css("fill", "#9193ae");

                if (click_si_nm != "") {
                    $("#mapArea2 path[sigun*=" + click_si_nm + "]").css("fill", "#af358c");
                }
            });
        });
    }

    function currenSigun(obj, evt) {
        nm = $(obj).attr("sigun").split(", ");

        if (typeof nm[1] != "undefined") {
            si_nm = nm[1];

        } else {
            si_nm = nm[0];
        }

        if (SIGUN == "Gyeongsangnam-do" && si_nm == "Changwon-si") {
            si_nm = nm[0];
        }

        if (evt == "click") {
            click_si_nm = si_nm;
            CLICK_SIGUN_KOR = $("text[sigun*='" + si_nm + "']").text();

            getSalesPost(CIT_KOR_NM, CLICK_SIGUN_KOR);
        }

        $("#mapArea2 path[sigun*=" + si_nm + "]").css("fill", "#af358c");
    }

    function getTown(d) {
        //getSalesPost(CIT_KOR_NM, d.properties.SIG_KOR_NM);

        //getSalesPost(CIT_KOR_NM, CLICK_SIGUN_KOR);
    }
}


