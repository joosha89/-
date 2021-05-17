{extends file="`$APPPATH`/views/layouts/sub.tpl"}

{block name='content'}
<style>
    path {
        /* fill: gainsboro; */
        fill: #9193ae;
        stroke: #353648;
        stroke-width: 1.5px;
    }

    path:hover {
        fill: orange;
    }

    #map .active {
        fill: #2fa4e7;
    }
    .map_area {
        display: inline-block;
        vertical-align: middle;
    }
    #mapArea {
        vertical-align: top;
    }
    text {
        font-family: 'NanumSquare', 'Noto Sans KR' , 'Malgun Gothic', sans-serif;
        font-size: 15px;
        font-weight: bold;
    }
    text.sigun {
        font-size: 13px;
        font-weight: bold;
    }
    .content {
        background: #353648;
    }
    path, text {
        cursor: pointer;
    }
    main.managerMain section.section1 .content {
        height: 685px;
    }
</style>

<script src="//d3js.org/d3.v5.min.js"></script>
<script src="//d3js.org/topojson.v3.min.js"></script>
<script src="/assets/js/d3/map.js?v={$smarty.now}"></script>

{* <script src="https://cdn.jsdelivr.net/npm/promise-polyfill@7/dist/polyfill.min.js"></script> *}

<script src="//cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.1/es6-promise.min.js" integrity="sha256-45YA33UQCDcJsntBst2bhka2t/LBNHP7RNvpllHPkQ0=" crossorigin="anonymous"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.1/es6-promise.auto.min.js" integrity="sha256-OI3N9zCKabDov2rZFzl8lJUXCcP7EmsGcGoP6DMXQCo=" crossorigin="anonymous"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/fetch/2.0.4/fetch.min.js" integrity="sha256-eOUokb/RjDw7kS+vDwbatNrLN8BIvvEhlLM5yogcDIo=" crossorigin="anonymous"></script>

<script>
    var KOREA_JSON_DATA_URL = "/assets/json/topo/korea.json";

    //var result = fetch('https://api.github.com')

    function initialize(){
        d3.json(KOREA_JSON_DATA_URL).then(function(_data) {
        //d3.json(KOREA_JSON_DATA_URL, function(err, _data){
            d3_korea_map('#mapArea', _data);
            //d3_korea_map2('#mapArea2', _data);
        })
    }

    $(document).ready(function() {
        initialize();
    });
</script>
<main class="main managerMain">
    <input type="hidden" name="sido" />
    <input type="hidden" name="gugun" />

    <section class="mainTitle">
        <div class="container">
            <h1>영업담당자</h1>
            <p></p>
        </div>
    </section>
    <section class="section1">
        <div class="container">
            <div class="title">
                <h2>
                    지도검색
                </h2>
                <p>
                    PC방 지역명을 선택하시면 지역 총판 및 담당 영업사원의 연락처를 확인하실 수 있습니다.
                </p>
                <p class="time">통화가능시간 10:00 ~ 19:00</p>
            </div>
            <div class="content">

                <div id="mapArea" class="map_area" style="margin-left: 20px;"></div>
                <div id="mapArea2" class="map_area"></div>

            </div>

            <div class="mdContent clearfix">
                <div class="formGroup formGroupB clearfix">
                    <select name="find1" class="city1" onchange="getGugun(this);">
                        <option value="">지역 선택 (시/도)</option>
                        {foreach $sido as $key => $val}
                            <option value="{$val["sido"]}">{$val["sido"]}</option>
                        {/foreach}
                    </select>
                    <select name="find2" class="city1" style="display: none;">
                        <option value="">지역 선택 (구/군)</option>
                    </select>
                </div>
                <div class="btnArea">
                    <button type="button" class="popupBtn purB" onclick="getSalesPost($('select[name=find1]').val(), $('select[name=find2]').val())">검색</button>
                </div>
            </div>
        </div>
    </section>
    {* {include file="`$APPPATH`/views/includes/sec_reveiew.tpl"} *}

    <div class="layerPopup managerPopup" style="display: none;">
        <div class="screen"></div>
        <div class="popup">
            <div class="popupTop">
                <h5>경기 성남시</h5>
                <div class="exitBtn"></div>
            </div>
            <div class="popupContent">
                <div class="contentTop clearfix">
                    <div class="left">
                        <h3><span class="name">정준수</span> <span class="hp">010-1234-5678</span></h3>
                        <p>통화가능시간 10:00~19:00</p>
                    </div>
                    <div class="btnArea">
                        <button type="button" class="popupBtn purB" onclick="rinquiryPopup();">제품 및 견적문의 ></button>
                    </div>
                </div>
                <div class="contentBottom">
                    <p>
                        경기 성남시 입니다.<br>
                        메모 남겨주시면 신속하게 답변해드리겠습니다.
                    </p>
                </div>
            </div>
        </div>
    </div>
</main>
{/block}
